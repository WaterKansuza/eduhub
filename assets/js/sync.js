/* ============================================================
   EduHub – Đồng bộ dữ liệu học tập lên máy chủ (sync.js, giai đoạn 2)
   Nạp SAU: config.js, supabase-config.js, thư viện supabase-js, cloud.js.
   Chỉ hoạt động ở CHẾ ĐỘ MÁY CHỦ (EduCloud.enabled) và khi đã đăng nhập.
   Chế độ cục bộ: không làm gì cả.

   Cách hoạt động
   - Dữ liệu vẫn được các module đọc/ghi trong localStorage như cũ (nên dùng được khi mất mạng).
   - sync.js theo dõi 11 "ngăn" dữ liệu (điểm, môn, TKB, bài tập, nộp bài, thông báo, lịch thi,
     chuỗi học, boss, mục tiêu GPA, tổng tín chỉ). Ngăn nào đổi thì đẩy lên bảng user_data.
   - Mỗi lần mở trang / quay lại tab / mỗi 60 giây: kéo dữ liệu từ máy chủ và gộp.
   - Phát hiện xung đột bằng mốc thời gian của máy chủ (hàm sync_put). Nếu hai thiết bị cùng sửa
     một ngăn: bản sửa SAU CÙNG thắng, bản thua được lưu dự phòng ở khóa eduhub_syncbak_<email>_<ngăn>.
   - Lần đồng bộ đầu tiên trên một thiết bị: danh sách (môn, bài tập, lịch thi, thông báo, nộp bài)
     được GỘP theo id để không mất dữ liệu; các ngăn còn lại lấy bản trên máy chủ (bản cũ được dự phòng).
   - Dữ liệu kéo về luôn được làm sạch bằng EduHub.validateBackup trước khi ghi vào localStorage.
   - Tệp bài nộp đính kèm: tải lên bucket riêng tư 'submissions' (Supabase Storage) sau khi nộp, qua hàng đợi có thử lại;
     thiết bị khác tải về khi bấm "Tải bài đã nộp". Xóa bài tập/dữ liệu thì xóa tệp trên máy chủ.
   - Realtime: nhận sự kiện khi thiết bị khác đổi dữ liệu và kéo về ngay (kéo định kỳ 60 giây vẫn chạy làm dự phòng).
   - Không đồng bộ: giao diện sáng/tối, phiên đăng nhập.

   API: EduSync.syncNow(), flush(), status(), fileUp(id), fileDel(id), fileDelAll(), fileFetch(id)
   ============================================================ */
(function (global) {
  'use strict';

  var NAMES = ['records', 'subjects', 'timetable', 'assignments', 'submissions', 'notifications',
    'exams', 'gamify', 'boss', 'goal', 'total'];
  var BASE = {
    records: 'eduhub_records', subjects: 'eduhub_subjects', timetable: 'eduhub_timetable',
    assignments: 'eduhub_assignments', submissions: 'eduhub_submissions', notifications: 'eduhub_notifications',
    exams: 'eduhub_exams', gamify: 'eduhub_gamify', boss: 'eduhub_boss', goal: 'eduhub_goal', total: 'eduhub_total'
  };
  var SCAN_MS = 2000, PULL_MS = 60000, MAX_RETRY_MS = 60000;

  var em = null, meta = {}, started = false, running = false, again = false, dirtyFlag = false;
  var fails = 0, nextTry = 0, lastOk = 0, state = 'idle', appliedLater = false, reloadAsked = false, rtTimer = null, unsubRT = null;

  /* ---------- Tiện ích ---------- */
  function ls() { try { return global.localStorage; } catch (e) { return null; } }
  function lkey(name) { return BASE[name] + '_' + em; }
  function metaKey() { return 'eduhub_syncmeta_' + em; }
  function readRaw(name) { var s = ls(); try { return s ? s.getItem(lkey(name)) : null; } catch (e) { return null; } }
  function writeRaw(name, raw) {
    var s = ls();
    if (raw == null) s.removeItem(lkey(name)); else s.setItem(lkey(name), raw);
  }
  function hash(str) {                      // cyrb53: đủ tốt để phát hiện thay đổi
    if (str == null) return '';
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36) + ':' + str.length;
  }
  function loadMeta() {
    var s = ls(), m = {};
    try { m = JSON.parse(s.getItem(metaKey()) || '{}') || {}; } catch (e) { m = {}; }
    meta = (m && typeof m === 'object') ? m : {};
  }
  function saveMeta() { try { ls().setItem(metaKey(), JSON.stringify(meta)); } catch (e) {} }
  function parse(raw) { try { return raw == null ? null : JSON.parse(raw); } catch (e) { return undefined; } }
  function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || !deepEqual(a[ka[i]], b[ka[i]])) return false;
    }
    return true;
  }
  function sameTs(a, b) { return !!a && !!b && (a === b || Date.parse(a) === Date.parse(b)); }
  function backup(name, raw) {
    if (raw == null) return;
    try { ls().setItem('eduhub_syncbak_' + em + '_' + name, raw); } catch (e) {}
  }

  /* Danh sách có id: gộp theo id (bản máy chủ ưu tiên khi trùng, giữ thêm mục chỉ có ở máy này). */
  function itemId(name, it) {
    if (!it || typeof it !== 'object') return null;
    if (name === 'submissions') return (it.assignmentId || '') + '|' + (it.at || 0) + '|' + (it.fileName || '');
    return typeof it.id === 'string' ? it.id : null;
  }
  var MERGEABLE = { subjects: 1, assignments: 1, exams: 1, notifications: 1, submissions: 1 };
  function unionMerge(name, local, remote) {
    if (!Array.isArray(local) || !Array.isArray(remote)) return null;
    var seen = {}, out = [], i, id;
    for (i = 0; i < remote.length; i++) { id = itemId(name, remote[i]); if (id == null) return null; seen[id] = 1; out.push(remote[i]); }
    for (i = 0; i < local.length; i++) { id = itemId(name, local[i]); if (id == null) return null; if (!seen[id]) { seen[id] = 1; out.push(local[i]); } }
    return out;
  }

  /* ---------- Giao diện trạng thái nhỏ (góc trái dưới) ---------- */
  var pill = null, pillTimer = null;
  function showPill(text, tone, autoHideMs, onClick) {
    if (!global.document || !global.document.body) return;
    if (!pill) {
      pill = global.document.createElement('div');
      pill.setAttribute('role', 'status');
      pill.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:90;max-width:80vw;padding:6px 12px;border-radius:999px;' +
        'font:600 11px/1.3 system-ui,sans-serif;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.25);transition:opacity .25s;opacity:0;cursor:default';
      global.document.body.appendChild(pill);
    }
    clearTimeout(pillTimer);
    pill.textContent = text;
    pill.style.background = ({ ok: '#059669', info: '#2563eb', warn: '#d97706', error: '#dc2626' })[tone] || '#2563eb';
    pill.style.opacity = '1';
    pill.style.cursor = onClick ? 'pointer' : 'default';
    pill.onclick = onClick || null;
    if (autoHideMs) pillTimer = setTimeout(function () { pill.style.opacity = '0'; }, autoHideMs);
  }
  function setState(s, detail) {
    state = s;
    try { global.document.dispatchEvent(new global.CustomEvent('eduhub:sync', { detail: { state: s, detail: detail || '' } })); } catch (e) {}
  }

  /* ---------- Áp dụng dữ liệu từ máy chủ ---------- */
  function cleanRemote(name, value) {
    try {
      if (name === 'total') {
        var n = typeof value === 'number' ? value : parseFloat(value);
        if (!isFinite(n)) throw new Error('total');
        return Math.min(1000, Math.max(1, n));
      }
      var d = {}; d[name] = value;
      var pack = global.EduHub.validateBackup({ app: 'EduHub', email: em, data: d }, true);
      if (pack[name] === undefined) throw new Error('invalid');
      return pack[name];
    } catch (e) { var err = new Error('Dữ liệu trên máy chủ không hợp lệ: ' + name); err.bad = true; throw err; }
  }
  var applied = [];
  function applyRemote(name, row) {
    if (row.value == null) {
      writeRaw(name, null);
      meta[name] = { h: '', t: row.updated_at, lt: 0, seen: '' };
    } else {
      var raw = JSON.stringify(cleanRemote(name, row.value));   // ném lỗi nếu dữ liệu hỏng -> không ghi gì
      writeRaw(name, raw);
      meta[name] = { h: hash(raw), t: row.updated_at, lt: 0, seen: hash(raw) };
    }
    applied.push(name);
  }

  /* ---------- Đẩy một ngăn lên máy chủ ---------- */
  async function push(name, raw, baseTs) {
    var value = raw == null ? null : parse(raw);
    if (value === undefined) {                                    // JSON cục bộ hỏng: không đẩy, nhưng đánh dấu để khỏi lặp lại mãi
      var pm = meta[name] || {};
      meta[name] = { h: hash(raw), t: pm.t || null, lt: pm.lt || 0, seen: hash(raw) };
      return 'skip';
    }
    var ts = await global.EduCloud.syncPut(name, value, baseTs || null);
    if (!ts) return 'conflict';
    var prev = meta[name] || {};
    meta[name] = { h: hash(raw), t: ts, lt: prev.lt || 0, seen: prev.seen || hash(raw) };
    return 'ok';
  }

  /* ---------- Đối chiếu một ngăn (row = dòng trên máy chủ hoặc undefined) ---------- */
  async function reconcile(name, row) {
    var raw = readRaw(name), m = meta[name], lh = hash(raw);
    var remoteDeleted = !!row && row.value == null;

    if (!row) {                                   // máy chủ chưa có ngăn này
      if (raw == null) return 'ok';
      if (m && !m.t && m.h === lh) return 'ok';                   // đã đánh dấu bỏ qua (JSON hỏng)
      return push(name, raw, null);
    }
    if (!m) {                                     // thiết bị này chưa từng đồng bộ ngăn này
      if (raw == null) {
        if (!remoteDeleted) applyRemote(name, row); else meta[name] = { h: '', t: row.updated_at, lt: 0, seen: '' };
        return 'ok';
      }
      if (remoteDeleted) return push(name, raw, row.updated_at);
      var lv = parse(raw);
      if (lv !== undefined && deepEqual(lv, row.value)) { meta[name] = { h: lh, t: row.updated_at, lt: 0, seen: lh }; return 'ok'; }
      if (MERGEABLE[name] && lv !== undefined) {
        var rv; try { rv = cleanRemote(name, row.value); } catch (e) { rv = null; }
        var merged = rv && unionMerge(name, lv, rv);
        if (merged) {
          backup(name, raw);
          var mraw = JSON.stringify(merged);
          writeRaw(name, mraw); applied.push(name);
          meta[name] = { h: hash(mraw), t: row.updated_at, lt: Date.now(), seen: hash(mraw) };
          return push(name, mraw, row.updated_at);
        }
      }
      backup(name, raw);                          // bản cục bộ cũ được giữ dự phòng, dùng bản máy chủ
      applyRemote(name, row);
      return 'ok';
    }

    var localChanged = lh !== m.h;
    var remoteChanged = !sameTs(row.updated_at, m.t);
    if (!localChanged && !remoteChanged) return 'ok';
    if (!localChanged) { applyRemote(name, row); return 'ok'; }
    if (!remoteChanged) return push(name, raw, row.updated_at);

    /* Cả hai bên cùng đổi */
    var lv2 = parse(raw);
    if (!remoteDeleted && lv2 !== undefined && deepEqual(lv2, row.value)) { meta[name] = { h: lh, t: row.updated_at, lt: m.lt || 0, seen: lh }; return 'ok'; }
    var localTime = m.lt || 0, remoteTime = Date.parse(row.updated_at) || 0;
    if (localTime > remoteTime) return push(name, raw, row.updated_at);   // bản sửa sau cùng thắng
    backup(name, raw);
    applyRemote(name, row);
    return 'ok';
  }

  /* ---------- Tệp bài nộp: hàng đợi tải lên / xóa (lưu để thử lại sau khi mất mạng hoặc đóng trang) ---------- */
  function cloudOn() { return !!(global.EduCloud && global.EduCloud.enabled && global.EduHub && global.EduHub.storageOK); }
  function qKey() { return 'eduhub_filequeue_' + global.EduHub.email(); }
  function qLoad() {
    try { var q = JSON.parse(ls().getItem(qKey()) || '{}'); return q && typeof q === 'object' ? q : {}; } catch (e) { return {}; }
  }
  function qSave(q) { try { ls().setItem(qKey(), JSON.stringify(q)); } catch (e) {} }
  var ID_OK = /^[A-Za-z0-9_.-]{1,80}$/;
  function qAdd(id, op) {
    if (!cloudOn() || !ls()) return;
    if (op !== 'delall' && !ID_OK.test(String(id))) return;
    var q = qLoad();
    if (op === 'delall') { q = { '*': 'delall' }; }          // xóa hết: các thao tác đang chờ không còn ý nghĩa
    else q[id] = op;                                          // thao tác mới sau "xóa hết" vẫn được nhận (xử lý sau)
    qSave(q);
    if (started) { dirtyFlag = true; if (!running && Date.now() >= nextTry) run(false); }
  }
  async function processFiles() {
    if (!cloudOn()) return;
    var q = qLoad(), ids, i, id, op, blob, cur;
    if (q['*'] === 'delall') {                                // luôn xử lý "xóa hết" trước mọi thao tác khác
      var names = await global.EduCloud.fileList();
      for (var j = 0; j < names.length; j += 100) await global.EduCloud.fileRemove(names.slice(j, j + 100));
      cur = qLoad(); delete cur['*']; qSave(cur); q = cur;
    }
    ids = Object.keys(q);
    for (i = 0; i < ids.length; i++) {
      id = ids[i]; op = q[id];
      if (op === 'del') {
        await global.EduCloud.fileRemove([id]);
      } else if (op === 'up') {
        if (!global.EduHubFiles) continue;                    // trang này không có kho tệp (vd. timetable.html): để trang khác xử lý
        blob = await global.EduHubFiles.get(id).catch(function () { return null; });
        if (blob) await global.EduCloud.fileUpload(id, blob);
      }
      cur = qLoad(); delete cur[id]; qSave(cur);              // chỉ xóa mục đã xử lý xong
    }
  }
  /* Tệp đã có trên thiết bị nhưng chưa có trên máy chủ (nộp trước khi bật đồng bộ): xếp hàng tải lên, mỗi lần mở trang một lần. */
  var backfilled = false;
  async function backfillFiles() {
    if (backfilled || !global.EduHubFiles || !cloudOn()) return;
    backfilled = true;
    var list = parse(readRaw('assignments')), cand = [];
    if (!Array.isArray(list)) return;
    list.forEach(function (a) { if (a && a.submission && a.submission.stored === true && ID_OK.test(String(a.id))) cand.push(a.id); });
    if (!cand.length) return;
    var have = {}; (await global.EduCloud.fileList()).forEach(function (n) { have[n] = 1; });
    for (var i = 0; i < cand.length; i++) {
      if (have[cand[i]]) continue;
      var blob = await global.EduHubFiles.get(cand[i]).catch(function () { return null; });
      if (blob) { var q = qLoad(); if (!q[cand[i]]) { q[cand[i]] = 'up'; qSave(q); } }
    }
    await processFiles();
  }
  function fileFetch(id) {
    if (!cloudOn() || !ID_OK.test(String(id))) return Promise.resolve(null);
    return global.EduCloud.fileDownload(id);
  }

  /* ---------- Một vòng đồng bộ ---------- */
  async function cycle() {
    var rows = await global.EduCloud.syncPull();
    var byKey = {};
    rows.forEach(function (r) { byKey[r.key] = r; });
    var conflict = false;
    for (var i = 0; i < NAMES.length; i++) {
      var name = NAMES[i];
      try {
        var res = await reconcile(name, byKey[name]);
        if (res === 'conflict') conflict = true;
      } catch (e) {
        if (e && e.bad) continue;   // dữ liệu máy chủ không hợp lệ: bỏ qua ngăn này, giữ nguyên bản cục bộ
        saveMeta(); throw e;
      }
    }
    saveMeta();
    return conflict;
  }

  async function run(initial) {
    if (!started) return;
    if (running) { again = true; return; }
    running = true;
    try {
      do {
        again = false;
        setState('syncing');
        applied = [];
        var tries = 0, conflict;
        do { conflict = await cycle(); tries++; } while (conflict && tries < 3);
        if (conflict) throw new Error('Xung đột liên tục, sẽ thử lại sau.');
        await processFiles();
        await backfillFiles();
        await processFiles();
        fails = 0; nextTry = 0; lastOk = Date.now(); dirtyFlag = false;
        setState('ok');
        if (applied.length) onApplied(initial, applied.slice());
        else if (!initial) showPill('Đã đồng bộ ✓', 'ok', 1800);
      } while (again);
    } catch (e) {
      fails++; nextTry = Date.now() + Math.min(MAX_RETRY_MS, 4000 * Math.pow(2, fails - 1));
      var offline = global.navigator && global.navigator.onLine === false;
      setState(offline ? 'offline' : 'error', e && e.message);
      showPill(offline ? 'Đang offline – dữ liệu sẽ đồng bộ khi có mạng' : 'Chưa đồng bộ được, sẽ tự thử lại', offline ? 'warn' : 'error');
    } finally { running = false; }
  }

  function onApplied(initial, names) {
    var canReload = true;
    try {
      var last = parseInt(global.sessionStorage.getItem('eduhub_sync_reload') || '0', 10);
      if (Date.now() - last < 15000) canReload = false;     // chống vòng lặp tải lại
    } catch (e) {}
    if (initial && canReload) {
      try { global.sessionStorage.setItem('eduhub_sync_reload', String(Date.now())); } catch (e) {}
      showPill('Đã tải dữ liệu từ máy chủ…', 'info');
      global.location.reload();
      return;
    }
    appliedLater = true;
    if (!reloadAsked) {
      reloadAsked = true;
      showPill('Có dữ liệu mới từ thiết bị khác – bấm để tải lại trang', 'info', 0, function () { global.location.reload(); });
    }
  }

  /* ---------- Theo dõi thay đổi cục bộ ---------- */
  function scan(noRun) {
    if (!started || !em) return;
    var changed = false;
    for (var i = 0; i < NAMES.length; i++) {
      var name = NAMES[i], m = meta[name], h = hash(readRaw(name));
      if (!m) { if (h !== '') changed = true; continue; }       // ngăn mới tạo, chưa từng lên máy chủ
      if (h !== m.h) {
        changed = true;
        if (h !== m.seen) { m.seen = h; m.lt = Date.now(); saveMeta(); }   // ghi lại thời điểm sửa cục bộ
      }
    }
    if (changed) dirtyFlag = true;
    if (!noRun && dirtyFlag && !running && Date.now() >= nextTry) run(false);
  }

  /* ---------- Khởi động ---------- */
  async function start() {
    var C = global.EduCloud, H = global.EduHub;
    if (started || !C || !C.enabled || !H || !ls() || !H.storageOK) return;
    var s = H.session && H.session();
    if (!s || !s.email) return;
    var u = await C.user();
    if (!u || (u.email || '').toLowerCase() !== String(s.email).toLowerCase()) return;   // phiên máy chủ khác phiên cục bộ: không đồng bộ
    em = H.email(); loadMeta(); started = true;

    global.setInterval(scan, SCAN_MS);
    global.setInterval(function () { if (!global.document.hidden && Date.now() >= nextTry) run(false); }, PULL_MS);
    global.document.addEventListener('eduhub:data', function () { dirtyFlag = true; });
    global.document.addEventListener('visibilitychange', function () {
      if (global.document.hidden) { scan(); if (dirtyFlag) run(false); }
      else if (Date.now() >= nextTry) run(false);
    });
    global.addEventListener('pagehide', function () { scan(); if (dirtyFlag) run(false); });
    global.addEventListener('online', function () { nextTry = 0; run(false); });

    /* Bấm "Đăng xuất": đẩy nốt thay đổi trước khi rời trang */
    global.document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href*="logout.html"]');
      if (!a || e.defaultPrevented || e.button) return;
      e.preventDefault();
      var href = a.href;
      flush().then(function () { global.location.href = href; });
    });
    /* Lưu ý: index.html hỏi confirm() trong onclick; nếu người dùng hủy, onclick trả false và đặt defaultPrevented trước khi tới đây. */

    /* Realtime: thiết bị khác đổi dữ liệu -> kéo về gần như ngay. Lỗi/không bật Realtime thì vẫn còn kéo định kỳ. */
    try {
      C.syncSubscribe(function (row) {
        if (!row || !row.key) return;
        var m = meta[row.key];
        if (m && sameTs(m.t, row.updated_at)) return;           // sự kiện do chính thiết bị này vừa đẩy
        clearTimeout(rtTimer);
        rtTimer = setTimeout(function () { if (running) again = true; else run(false); }, 400);
      }).then(function (un) { unsubRT = un; }, function () {});
    } catch (e) {}

    await run(true);
  }

  function flush() {
    return new Promise(function (resolve) {
      var done = false;
      function fin() { if (!done) { done = true; resolve(); } }
      setTimeout(fin, 4000);                      // không chặn đăng xuất quá 4 giây
      if (!started) return fin();
      scan();
      (function wait() { if (!running && !dirtyFlag) return fin(); if (!running) run(false); setTimeout(wait, 150); })();
    });
  }

  global.EduSync = {
    syncNow: function () { nextTry = 0; return run(false); },
    flush: flush,
    fileUp: function (id) { qAdd(id, 'up'); },
    fileDel: function (id) { qAdd(id, 'del'); },
    fileDelAll: function () { qAdd('*', 'delall'); },
    fileFetch: fileFetch,
    status: function () { return { state: state, lastOk: lastOk, fails: fails, started: started }; },
    _test: { processFiles: processFiles, backfillFiles: backfillFiles, qLoad: qLoad, reconcile: reconcile, cycle: cycle, scan: function () { scan(true); }, getMeta: function () { return meta; }, setEmail: function (e) { em = e; loadMeta(); started = true; } }
  };

  if (global.document) {
    if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', function () { start(); });
    else start();
  }
})(typeof window !== 'undefined' ? window : globalThis);
