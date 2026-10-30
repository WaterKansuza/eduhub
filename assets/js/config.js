/* ============================================================
   EduHub - Cấu hình & tiện ích dùng chung (config.js)
   Nạp TRƯỚC các script khác:  <script src="config.js"></script>
   Gồm: khóa lưu trữ, phiên đăng nhập, giao diện Sáng/Tối (có ghi nhớ),
        thông báo nổi (toast), sao lưu/khôi phục dữ liệu, cảnh báo khi
        trình duyệt chặn localStorage và trợ năng cho hộp thoại (phím ESC).
   ============================================================ */
(function (global) {
  'use strict';

  var CFG = {
    SESSION_KEY: 'eduhub_session',
    USERS_KEY: 'eduhub_users',
    THEME_KEY: 'eduhub_theme',
    LOGIN_URL: 'login.html',
    DASHBOARD_URL: 'index.html',
    CONTACT_EMAIL: 'phongdaotao@eduhub.edu.vn',
    CONTACT_PHONE: '1900 6789',
    CONTACT_ADDRESS: 'Phòng Đào tạo - Tòa nhà A, Trường Đại học'
  };

  /* Tên gốc của các khóa; giá trị thật = tên gốc + '_' + email */
  var BASE = {
    records: 'eduhub_records',
    subjects: 'eduhub_subjects',
    timetable: 'eduhub_timetable',
    assignments: 'eduhub_assignments',
    submissions: 'eduhub_submissions',
    notifications: 'eduhub_notifications',
    exams: 'eduhub_exams',
    gamify: 'eduhub_gamify',
    boss: 'eduhub_boss',
    goal: 'eduhub_goal'
  };

  /* ---------- Lưu trữ an toàn ---------- */
  var stale = false;   // true khi tài khoản đăng nhập đã bị đổi ở tab khác -> chặn mọi thao tác ghi
  var storageOK = true;
  try {
    localStorage.setItem('__eduhub_probe', '1');
    localStorage.removeItem('__eduhub_probe');
  } catch (e) { storageOK = false; }

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  var quiet = false;   // true khi khôi phục sao lưu: ghi hàng loạt không được tính là hoạt động học tập
  function set(key, value) {
    if (stale && key !== CFG.THEME_KEY) return false;
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { warnStorage(); return false; }
    if (!quiet) {
      try { document.dispatchEvent(new CustomEvent('eduhub:data', { detail: { key: key } })); } catch (e) {}
    }
    return true;
  }
  function del(key) { try { localStorage.removeItem(key); } catch (e) {} }

  function session() {
    try {
      return JSON.parse(localStorage.getItem(CFG.SESSION_KEY) || sessionStorage.getItem(CFG.SESSION_KEY) || 'null');
    } catch (e) { return null; }
  }
  function email() { var u = session(); return (u && u.email) || 'guest'; }
  function userKey(base) { return base + '_' + email(); }

  var warned = false;
  function warnStorage() {
    if (warned) return;
    if (!document.body) { document.addEventListener('DOMContentLoaded', warnStorage); return; }
    warned = true;
    var el = document.createElement('div');
    el.setAttribute('role', 'alert');
    el.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] bg-red-600 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl';
    el.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i>Trình duyệt đang chặn lưu trữ cục bộ nên dữ liệu bạn nhập sẽ KHÔNG được giữ lại. Hãy tắt chế độ ẩn danh hoặc cho phép cookie cho trang này.';
    document.body.appendChild(el);
  }

  /* ---------- Thông báo nổi ---------- */
  function toast(msg, type) {
    var tone = ({ success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-blue-600', warn: 'bg-amber-600' })[type || 'info'] || 'bg-blue-600';
    var icon = ({ success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info', warn: 'fa-triangle-exclamation' })[type || 'info'];
    var wrap = document.getElementById('ehToastWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'ehToastWrap';
      wrap.className = 'fixed bottom-4 right-4 z-[100] space-y-2 w-[92%] max-w-sm';
      document.body.appendChild(wrap);
    }
    var el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.className = tone + ' text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-start gap-2 transition-all duration-300 opacity-0 translate-y-2';
    el.innerHTML = '<i class="fa-solid ' + icon + ' mt-0.5"></i><span></span>';
    el.querySelector('span').textContent = msg;
    wrap.appendChild(el);
    requestAnimationFrame(function () { el.classList.remove('opacity-0', 'translate-y-2'); });
    setTimeout(function () {
      el.classList.add('opacity-0', 'translate-y-2');
      setTimeout(function () { el.remove(); }, 300);
    }, 3400);
  }

  /* ---------- Giao diện Sáng/Tối (ghi nhớ trong localStorage) ---------- */
  function applyTheme() {
    var dark = get(CFG.THEME_KEY, 'light') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'fa-solid text-lg ' + (dark ? 'fa-sun' : 'fa-moon');
    return dark;
  }
  function toggleTheme() {
    var dark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', dark);
    set(CFG.THEME_KEY, dark ? 'dark' : 'light');
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'fa-solid text-lg ' + (dark ? 'fa-sun' : 'fa-moon');
    document.dispatchEvent(new CustomEvent('eduhub:theme', { detail: { dark: dark } }));
  }

  /* ---------- Hộp thoại: ESC để đóng ---------- */
  function initModalA11y() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = [].slice.call(document.querySelectorAll('[role="dialog"]')).filter(function (m) {
        return !m.classList.contains('hidden');
      });
      var top = open[open.length - 1];
      if (!top) return;
      var btn = top.querySelector('[data-eh-close]');
      if (btn) btn.click(); else top.classList.add('hidden');
    });
  }

  /* ---------- Sao lưu / khôi phục toàn bộ dữ liệu ---------- */
  function collect() {
    var out = { app: 'EduHub', version: 2, exportedAt: new Date().toISOString(), email: email(), data: {} };
    Object.keys(BASE).forEach(function (name) { out.data[name] = get(userKey(BASE[name]), null); });
    out.data.totalCredits = get('eduhub_total_' + email(), 130);
    return out;
  }
  function exportAll() {
    var blob = new Blob([JSON.stringify(collect(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'eduhub-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    toast('Đã xuất tệp sao lưu dữ liệu EduHub.', 'success');
  }
  /* ---------- Kiểm tra & làm sạch dữ liệu sao lưu (chống XSS / dữ liệu hỏng) ---------- */
  var ID_RE = /^[A-Za-z0-9_.-]{1,80}$/, COLOR_RE = /^#[0-9a-fA-F]{6}$/;
  var MAX_BACKUP_BYTES = 5 * 1024 * 1024;
  function bad(m) { throw new Error(m || 'invalid'); }
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function vStr(v, max) { return typeof v === 'string' ? v.slice(0, max || 200) : ''; }
  function vNum(v, min, max, def) {
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
  }
  function vNumOrNull(v, min, max) {
    if (v == null || v === '') return null;
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
  }
  function vInt(v, min, max, def) { return Math.round(vNum(v, min, max, def)); }
  function vIntOrNull(v, min, max) { var n = vNumOrNull(v, min, max); return n == null ? null : Math.round(n); }
  function vId(v) { if (typeof v !== 'string' || !ID_RE.test(v)) bad('id'); return v; }
  function vArr(v, max) { if (!Array.isArray(v) || v.length > max) bad('array'); return v; }
  function vReq(v, max) { var t = vStr(v, max).trim(); if (!t) bad('required'); return t; }
  var MAXT = 8.64e15;

  var VALIDATORS = {
    subjects: function (v) {
      return vArr(v, 300).map(function (s) {
        if (!isObj(s)) bad();
        return {
          id: vId(s.id), name: vReq(s.name, 120), code: vStr(s.code, 30),
          credits: vNum(s.credits, 0, 30, 0), teacher: vStr(s.teacher, 120),
          sessions: vInt(s.sessions, 1, 5, 1), periods: vInt(s.periods, 1, 5, 1),
          color: COLOR_RE.test(s.color) ? s.color : '#2563eb',
          fixed: (Array.isArray(s.fixed) ? s.fixed : []).slice(0, 5).map(function (f) {
            f = isObj(f) ? f : {};
            return { day: vInt(f.day, 2, 8, 2), start: vInt(f.start, 1, 10, 1), room: vStr(f.room, 30) };
          })
        };
      });
    },
    records: function (v) {
      if (!isObj(v)) bad();
      return {
        total: vNum(v.total, 1, 1000, 130),
        retake: v.retake === 'latest' || v.retake === 'all' ? v.retake : 'best',
        sems: vArr(v.sems, 100).map(function (x) {
          if (!isObj(x)) bad();
          return {
            id: vId(x.id), name: vReq(x.name, 80), year: vIntOrNull(x.year, 2000, 2100), term: vIntOrNull(x.term, 1, 3),
            conduct: vNumOrNull(x.conduct, 0, 100), attend: vNumOrNull(x.attend, 0, 100), good: vNumOrNull(x.good, 0, 300),
            subs: vArr(x.subs || [], 100).map(function (m) {
              if (!isObj(m)) bad();
              var c = vNum(m.c, 0, 30, 0), g = vNumOrNull(m.g, 0, 10);
              if (!(c > 0) || g == null) bad('grade');
              return { n: vStr(m.n, 120) || 'Môn học', c: c, g: g };
            })
          };
        })
      };
    },
    timetable: function (v) {
      if (!isObj(v) || !isObj(v.settings)) bad();
      var st = v.settings;
      return {
        settings: {
          days: vArr(st.days || [], 7).map(function (d) { return vInt(d, 2, 8, 2); }),
          max: vInt(st.max, 1, 10, 8),
          mode: st.mode === 'compact' ? 'compact' : 'spread',
          pref: st.pref === 'morning' || st.pref === 'afternoon' ? st.pref : 'any'
        },
        placements: vArr(v.placements || [], 200).map(function (p) {
          if (!isObj(p)) bad();
          var start = vInt(p.start, 1, 10, 1), len = vInt(p.len, 1, 10, 1);
          if (start + len - 1 > 10) bad('placement');
          return { sid: vId(p.sid), day: vInt(p.day, 2, 8, 2), start: start, len: len, room: vStr(p.room, 30), fixed: !!p.fixed };
        }),
        warns: (Array.isArray(v.warns) ? v.warns : []).slice(0, 50).map(function (w) { return vStr(w, 300); }),
        sig: vStr(v.sig, 200000),
        rooms: (function (r) { var o = {}; if (isObj(r)) Object.keys(r).slice(0, 300).forEach(function (k) { if (ID_RE.test(k)) o[k] = vStr(r[k], 30); }); return o; })(v.rooms)
      };
    },
    assignments: function (v, keepStored) {
      return vArr(v, 500).map(function (a) {
        if (!isObj(a)) bad();
        var t = new Date(a.due);
        if (typeof a.due !== 'string' || isNaN(t.getTime())) bad('date');
        var o = {
          id: vId(a.id), title: vReq(a.title, 200), subject: vStr(a.subject, 120), due: t.toISOString(),
          status: a.status === 'submitted' ? 'submitted' : 'todo', note: vStr(a.note, 500)
        };
        if (a.submittedAt != null) o.submittedAt = vNum(a.submittedAt, 0, MAXT, 0);
        if (a.grade != null) { var gr = vNumOrNull(a.grade, 0, 10); if (gr != null) o.grade = gr; }
        if (isObj(a.submission)) {
          o.submission = { name: vStr(a.submission.name, 255), size: vNum(a.submission.size, 0, 1e12, 0), type: vStr(a.submission.type, 100),
            at: vNum(a.submission.at, 0, MAXT, 0), note: vStr(a.submission.note, 500), stored: !!(keepStored && a.submission.stored === true) };
        }
        return o;
      });
    },
    submissions: function (v) {
      return vArr(v, 2000).map(function (h) {
        if (!isObj(h)) bad();
        return { assignmentId: vStr(h.assignmentId, 80), title: vStr(h.title, 200), subject: vStr(h.subject, 120),
          fileName: vStr(h.fileName, 255), fileSize: vNum(h.fileSize, 0, 1e12, 0), at: vNum(h.at, 0, MAXT, 0), note: vStr(h.note, 500) };
      });
    },
    notifications: function (v) {
      return vArr(v, 1000).map(function (n) {
        if (!isObj(n)) bad();
        return {
          id: vId(n.id), icon: /^fa-[a-z0-9-]{1,40}$/.test(n.icon) ? n.icon : 'fa-bell',
          tone: n.tone === 'amber' || n.tone === 'red' ? n.tone : 'blue',
          title: vStr(n.title, 200), body: vStr(n.body, 500), at: vNum(n.at, 0, MAXT, 0), read: !!n.read
        };
      });
    },
    gamify: function (v) {
      if (!isObj(v)) bad();
      var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
      var dates = function (arr, max) {
        return vArr(arr || [], max).filter(function (d) { return typeof d === 'string' && DATE_RE.test(d); });
      };
      var badges = {};
      if (isObj(v.badges)) Object.keys(v.badges).slice(0, 100).forEach(function (k) {
        if (ID_RE.test(k)) badges[k] = typeof v.badges[k] === 'string' && DATE_RE.test(v.badges[k]) ? v.badges[k] : '';
      });
      return {
        v: 1, init: true,
        days: dates(v.days, 730), frozen: dates(v.frozen, 100),
        freezes: vInt(v.freezes, 0, 2, 0), fm: vInt(v.fm, 0, 1000, 0), best: vInt(v.best, 0, 100000, 0),
        badges: badges
      };
    },
    boss: function (v) {
      if (!isObj(v)) bad();
      var DATE_RE = /^\d{4}-\d{2}-\d{2}$/, chapters = {}, defeated = {};
      if (isObj(v.chapters)) Object.keys(v.chapters).slice(0, 300).forEach(function (k) {
        if (!Array.isArray(v.chapters[k]) || k.length > 120) return;
        chapters[k] = v.chapters[k].slice(0, 30).filter(function (c) { return isObj(c) && typeof c.id === 'string' && ID_RE.test(c.id); })
          .map(function (c) { return { id: c.id, t: vStr(c.t, 80), d: !!c.d }; });
      });
      if (isObj(v.defeated)) Object.keys(v.defeated).slice(0, 300).forEach(function (k) {
        if (k.length <= 120 && typeof v.defeated[k] === 'string' && (v.defeated[k] === '' || DATE_RE.test(v.defeated[k]))) defeated[k] = v.defeated[k];
      });
      return { v: 1, init: true, chapters: chapters, defeated: defeated };
    },
    goal: function (v) {
      if (!isObj(v)) bad();
      return { v: 1, target: vNum(v.target, 0.5, 4, 3.2) };
    },
    exams: function (e0) {
      var v = e0;
      return vArr(v, 500).map(function (e) {
        if (!isObj(e)) bad();
        if (typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) bad('date');
        var tm = function (x) { return typeof x === 'string' && /^\d{2}:\d{2}$/.test(x) ? x : ''; };
        return { id: vId(e.id), subject: vReq(e.subject, 120), type: vStr(e.type, 40), room: vStr(e.room, 40),
          date: e.date, start: tm(e.start), end: tm(e.end), note: vStr(e.note, 500) };
      });
    }
  };

  /* Trả về dữ liệu đã làm sạch hoặc ném lỗi. Dùng cho khôi phục sao lưu. */
  /* keepStored = true (đồng bộ máy chủ): giữ cờ 'stored' vì tệp có thể tải từ máy chủ; khôi phục sao lưu: luôn false vì tệp không nằm trong sao lưu. */
  function validateBackup(parsed, keepStored) {
    if (!isObj(parsed) || parsed.app !== 'EduHub' || !isObj(parsed.data)) bad('format');
    if (parsed.email && parsed.email !== email()) bad('email-mismatch');
    var clean = {};
    Object.keys(BASE).forEach(function (name) {
      if (parsed.data[name] != null) clean[name] = VALIDATORS[name](parsed.data[name], !!keepStored);
    });
    if (parsed.data.totalCredits != null) clean.totalCredits = vNum(parsed.data.totalCredits, 1, 1000, 130);
    return clean;
  }
  function importAll(file) {
    return new Promise(function (resolve, reject) {
      if (file && file.size > MAX_BACKUP_BYTES) return reject(new Error('too-big'));
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var clean = validateBackup(JSON.parse(fr.result));   // kiểm tra TOÀN BỘ trước khi ghi bất cứ thứ gì
          var n = 0;
          quiet = true;
          try {
            Object.keys(clean).forEach(function (name) {
              if (name === 'totalCredits') return;
              if (!set(userKey(BASE[name]), clean[name])) throw new Error('storage');
              n++;
            });
            if (clean.totalCredits) set('eduhub_total_' + email(), clean.totalCredits);
          } finally { quiet = false; }
          resolve(n);
        } catch (err) { reject(err); }
      };
      fr.onerror = function () { reject(fr.error); };
      fr.readAsText(file);
    });
  }

  /* ---------- Mật khẩu: PBKDF2-SHA256 + salt ngẫu nhiên ---------- */
  var PBKDF2_ITER = 150000;

  function toHex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }
  function randomSalt() {
    var a = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return toHex(a);
  }
  async function pbkdf2(password, saltHex) {
    var enc = new TextEncoder();
    var key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    var salt = new Uint8Array(saltHex.match(/.{2}/g).map(function (h) { return parseInt(h, 16); }));
    var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: PBKDF2_ITER, hash: 'SHA-256' }, key, 256);
    return toHex(bits);
  }
  async function hashPassword(pw, saltHex) {
    var salt = saltHex || randomSalt();
    return 'pbkdf2$' + PBKDF2_ITER + '$' + salt + '$' + await pbkdf2(pw, salt);
  }
  /* Xác thực; vẫn chấp nhận tài khoản cũ chỉ có SHA-256 (không salt) */
  async function verifyPassword(pw, user) {
    var stored = (user && user.passwordHash) || '';
    if (stored.indexOf('pbkdf2$') === 0) {
      var parts = stored.split('$');
      return (await hashPassword(pw, parts[2])) === stored;
    }
    var legacy = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    return toHex(legacy) === stored;
  }
  function isLegacyHash(user) {
    return !!user && !!user.passwordHash && user.passwordHash.indexOf('pbkdf2$') !== 0;
  }

  /* ---------- Mã khôi phục tài khoản (thay cho xác minh bằng MSSV) ---------- */
  var RC_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // 32 ký tự, bỏ I/O/0/1 cho dễ đọc
  function newRecoveryCode() {
    var a = new Uint8Array(16), out = '';
    crypto.getRandomValues(a);
    for (var i = 0; i < a.length; i++) out += RC_ALPHA.charAt(a[i] % 32);
    return out.match(/.{4}/g).join('-');                // 80 bit ngẫu nhiên
  }
  function normCode(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function hashRecovery(code) { return hashPassword(normCode(code)); }
  async function verifyRecovery(code, user) {
    var h = user && user.recoveryHash;
    if (!h || h.indexOf('pbkdf2$') !== 0) return false;
    return verifyPassword(normCode(code), { passwordHash: h });
  }
  function showRecoveryCode(code, onDone, title) {
    var wrap = document.createElement('div');
    wrap.setAttribute('role', 'alertdialog');            // không dùng role=dialog để ESC không tự ẩn hộp thoại này
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'ehRcTitle');
    wrap.className = 'fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4';
    wrap.innerHTML =
      '<div class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">' +
      '<h3 id="ehRcTitle" class="text-lg font-bold"><i class="fa-solid fa-key text-amber-500 mr-2"></i><span data-t></span></h3>' +
      '<p class="text-xs text-gray-500 dark:text-gray-400">Mã này dùng để đặt lại mật khẩu khi bạn quên. Mã chỉ hiển thị MỘT lần: hãy ghi lại hoặc lưu ở nơi an toàn và không chia sẻ cho ai.</p>' +
      '<div class="flex items-center gap-2"><code data-c class="flex-1 text-center text-lg font-bold tracking-widest py-3 rounded-xl bg-gray-100 dark:bg-slate-700 select-all"></code>' +
      '<button type="button" data-copy class="px-3 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-xs font-semibold">Sao chép</button></div>' +
      '<label class="flex items-start gap-2 text-xs cursor-pointer"><input type="checkbox" data-ok class="mt-0.5 rounded"><span>Tôi đã lưu mã khôi phục.</span></label>' +
      '<button type="button" data-go disabled class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50">Tiếp tục</button></div>';
    wrap.querySelector('[data-t]').textContent = title || 'Mã khôi phục của bạn';
    wrap.querySelector('[data-c]').textContent = code;
    var ok = wrap.querySelector('[data-ok]'), go = wrap.querySelector('[data-go]');
    ok.addEventListener('change', function () { go.disabled = !ok.checked; });
    wrap.querySelector('[data-copy]').addEventListener('click', function (e) {
      try { navigator.clipboard.writeText(code); e.target.textContent = 'Đã chép'; } catch (x) { e.target.textContent = 'Hãy chép thủ công'; }
    });
    go.addEventListener('click', function () { wrap.remove(); if (onDone) onDone(); });
    document.body.appendChild(wrap);
    ok.focus();
  }

  /* ---------- Giới hạn số lần thử sai (phía client, chỉ làm chậm người dùng bấm nhầm/đoán mò) ---------- */
  var ATT_KEY = 'eduhub_attempts';
  var attempt = {
    MAX: 5, LOCK_MS: 5 * 60 * 1000,
    all: function () { var a = get(ATT_KEY, {}); return a && typeof a === 'object' ? a : {}; },
    remaining: function (k) { var a = attempt.all()[k]; return a && a.until && a.until > Date.now() ? Math.ceil((a.until - Date.now()) / 1000) : 0; },
    fail: function (k) {
      var all = attempt.all(), a = all[k] || { n: 0 };
      if (a.until && a.until <= Date.now()) a = { n: 0 };
      a.n = (a.n || 0) + 1;
      if (a.n >= attempt.MAX) { a.until = Date.now() + attempt.LOCK_MS; a.n = 0; }
      all[k] = a; set(ATT_KEY, all);
      return attempt.remaining(k);
    },
    ok: function (k) { var all = attempt.all(); if (all[k]) { delete all[k]; set(ATT_KEY, all); } }
  };

  /* ---------- Bảo vệ phiên: phát hiện đăng nhập/đăng xuất ở tab khác ----------
     Trước đây mỗi trang chỉ đọc email một lần lúc nạp, nên đổi tài khoản ở tab khác rồi quay lại tab cũ
     có thể ghi dữ liệu của người này vào khóa của người kia. Nay: đăng xuất ở tab khác -> về trang đăng nhập;
     đổi sang tài khoản khác -> khóa mọi thao tác ghi và yêu cầu tải lại trang. */
  function guardSession() {
    var s0 = session(), loaded = s0 ? s0.email : null;
    function check() {
      var s = session(), cur = s ? s.email : null;
      if (cur === loaded || stale) return;
      if (!cur) { stale = true; location.replace(CFG.LOGIN_URL); return; }
      stale = true;
      var wrap = document.createElement('div');
      wrap.setAttribute('role', 'alertdialog');
      wrap.setAttribute('aria-modal', 'true');
      wrap.className = 'fixed inset-0 z-[130] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4';
      wrap.innerHTML = '<div class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">' +
        '<h3 class="text-lg font-bold"><i class="fa-solid fa-user-lock text-amber-500 mr-2"></i>Tài khoản đã thay đổi</h3>' +
        '<p class="text-xs text-gray-500 dark:text-gray-400" data-m></p>' +
        '<button type="button" data-r class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl">Tải lại trang</button></div>';
      wrap.querySelector('[data-m]').textContent = 'Bạn vừa đăng nhập tài khoản ' + cur + ' ở tab khác. Để tránh ghi nhầm dữ liệu giữa hai tài khoản, tab này đã bị khóa; hãy tải lại trang.';
      wrap.querySelector('[data-r]').addEventListener('click', function () { location.reload(); });
      document.body.appendChild(wrap);
    }
    window.addEventListener('storage', function (e) { if (!e.key || e.key === CFG.SESSION_KEY) check(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
    window.addEventListener('focus', check);
    return check;
  }

  /* ---------- Nạp ---------- */
  function onReady() {
    applyTheme();
    var btn = document.getElementById('themeToggle');
    if (btn && !btn.dataset.ehBound) {
      btn.dataset.ehBound = '1';
      btn.addEventListener('click', toggleTheme);
    }
    initModalA11y();
    if (!storageOK) warnStorage();
  }

  /* Áp dụng giao diện ngay để tránh nhấp nháy */
  applyTheme();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();

  global.EduHub = {
    CFG: CFG,
    storageOK: storageOK,
    get: get,
    set: set,
    del: del,
    session: session,
    email: email,
    userKey: userKey,
    toast: toast,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme,
    exportAll: exportAll,
    importAll: importAll,
    validateBackup: validateBackup,
    newRecoveryCode: newRecoveryCode,
    hashRecovery: hashRecovery,
    verifyRecovery: verifyRecovery,
    showRecoveryCode: showRecoveryCode,
    attempt: attempt,
    guardSession: guardSession,
    isStale: function () { return stale; },
    hashPassword: hashPassword,
    verifyPassword: verifyPassword,
    isLegacyHash: isLegacyHash,
    randomSalt: randomSalt
  };
})(window);
