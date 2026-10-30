/* ============================================================
   EduHub - Bài tập, deadline, nộp bài & thông báo (assignments.js)
   Được nhúng vào index.html.
   Dữ liệu lưu trong localStorage:
     eduhub_assignments_<email>    danh sách bài tập
     eduhub_submissions_<email>    lịch sử nộp bài
     eduhub_notifications_<email>  thông báo (đã đọc / chưa đọc)
   ============================================================ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  };
  var K = function () { return EduHub.userKey('eduhub_assignments'); };
  var HK = function () { return EduHub.userKey('eduhub_submissions'); };
  var NK = function () { return EduHub.userKey('eduhub_notifications'); };
  var H = 3600e3, DAY = 24 * H;

  /* ---------- Dữ liệu ----------
     Không còn nhồi bài tập mẫu: tài khoản mới bắt đầu rỗng và danh sách rỗng
     (sau khi người dùng xóa hết) cũng KHÔNG bị sinh lại. */
  var items = EduHub.get(K(), null);
  if (!Array.isArray(items)) items = [];
  var save = function () { EduHub.set(K(), items); };

  /* ---------- Lưu tệp bài nộp trong IndexedDB; ở chế độ máy chủ còn được sao lên Supabase Storage (sync.js) ---------- */
  var FILE_LIMIT = 25 * 1024 * 1024;
  var Files = (function () {
    var dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error('no-idb'));
        var r = indexedDB.open('eduhub_files', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('files'); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      });
      dbp.catch(function () { dbp = null; });
      return dbp;
    }
    function run(mode, fn) {
      return open().then(function (db) {
        return new Promise(function (res, rej) {
          var t = db.transaction('files', mode), req = fn(t.objectStore('files'));
          t.oncomplete = function () { res(req ? req.result : undefined); };
          t.onerror = t.onabort = function () { rej(t.error); };
        });
      });
    }
    var key = function (id) { return EduHub.email() + '::' + id; };
    return {
      put: function (id, blob) { return run('readwrite', function (st) { return st.put(blob, key(id)); }); },
      get: function (id) { return run('readonly', function (st) { return st.get(key(id)); }); },
      del: function (id) { return run('readwrite', function (st) { return st.delete(key(id)); }); },
      clearUser: function () {
        var p = EduHub.email() + '::';
        return run('readwrite', function (st) { return st.delete(IDBKeyRange.bound(p, p + '\uffff')); });
      }
    };
  })();
  window.EduHubFiles = Files;
  var dropFile = function (id) { Files.del(id).catch(function () {}); if (window.EduSync) EduSync.fileDel(id); };

  /* ---------- Thời gian ---------- */
  function fmtDue(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function left(iso) { return new Date(iso).getTime() - Date.now(); }
  function leftLabel(ms) {
    if (ms < 0) {
      var a = -ms;
      return { text: a < H ? 'Quá hạn ' + Math.max(1, Math.round(a / 60000)) + ' phút'
        : a < DAY ? 'Quá hạn ' + Math.round(a / H) + ' giờ' : 'Quá hạn ' + Math.round(a / DAY) + ' ngày',
        cls: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' };
    }
    if (ms < H) return { text: 'Còn ' + Math.max(1, Math.round(ms / 60000)) + ' phút', cls: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' };
    if (ms < DAY) return { text: 'Còn ' + Math.round(ms / H) + ' giờ', cls: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' };
    if (ms < 3 * DAY) return { text: 'Còn ' + Math.round(ms / DAY) + ' ngày', cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' };
    return { text: 'Còn ' + Math.round(ms / DAY) + ' ngày', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' };
  }
  function timeAgo(t) {
    var d = Date.now() - t;
    if (d < 60000) return 'Vừa xong';
    if (d < H) return Math.round(d / 60000) + ' phút trước';
    if (d < DAY) return Math.round(d / H) + ' giờ trước';
    return Math.round(d / DAY) + ' ngày trước';
  }
  function toLocalInput(iso) {
    var d = new Date(iso), p = function (n) { return String(n).length < 2 ? '0' + n : String(n); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  var pending = function () { return items.filter(function (a) { return a.status !== 'submitted'; }); };
  var dueSoon = function () {
    return items.filter(function (a) { return a.status !== 'submitted' && left(a.due) > 0 && left(a.due) <= DAY; });
  };

  /* ---------- Thông báo (sinh tự động từ deadline, giữ trạng thái đã đọc) ---------- */
  var notifs = EduHub.get(NK(), []);
  if (!Array.isArray(notifs)) notifs = [];

  function syncNotifs() {
    var now = Date.now(), gen = [], before = JSON.stringify(notifs);
    items.forEach(function (a) {
      if (a.status === 'submitted') {
        if (a.grade != null) gen.push({ id: 'graded-' + a.id, icon: 'fa-file-signature', tone: 'blue', title: 'Bài tập đã được chấm điểm', body: a.title + ' — Điểm: ' + a.grade + '/10', at: a.submittedAt || now });
        return;
      }
      var ms = left(a.due), day = new Date(a.due).toISOString().slice(0, 10);
      if (ms <= 0) gen.push({ id: 'late-' + a.id + '-' + day, icon: 'fa-circle-exclamation', tone: 'red', title: 'Bài tập đã quá hạn', body: a.title + ' (' + (a.subject || 'chưa chọn môn') + ') đã quá hạn nộp.', at: new Date(a.due).getTime() });
      else if (ms <= DAY) gen.push({ id: 'due-' + a.id + '-' + day, icon: 'fa-clock', tone: 'amber', title: 'Nhắc nhở deadline sắp đến hạn', body: a.title + ' hạn nộp ' + fmtDue(a.due) + '.', at: now });
    });
    var old = {};
    notifs.forEach(function (n) { old[n.id] = n; });
    /* `at` được giữ nguyên từ lần trước (không đổi mỗi phút) và chỉ ghi khi có thay đổi thật,
       nếu không hai tab đang mở sẽ liên tục kích hoạt sự kiện 'storage' của nhau. */
    notifs = gen.map(function (g) {
      var o = old[g.id];
      return { id: g.id, icon: g.icon, tone: g.tone, title: g.title, body: g.body, at: o && o.at != null ? o.at : g.at, read: o ? !!o.read : false };
    });
    notifs.sort(function (a, b) { return (a.read - b.read) || (b.at - a.at) || (a.id < b.id ? -1 : 1); });
    if (JSON.stringify(notifs) !== before) EduHub.set(NK(), notifs);
  }
  var unread = function () { return notifs.filter(function (n) { return !n.read; }).length; };

  window.markAllNotificationsRead = function () {
    notifs = notifs.map(function (n) { return { id: n.id, icon: n.icon, tone: n.tone, title: n.title, body: n.body, at: n.at, read: true }; });
    EduHub.set(NK(), notifs);
    render();
    EduHub.toast('Đã đánh dấu tất cả thông báo là đã đọc.', 'info');
  };
  window.markNotificationRead = function (id) {
    notifs = notifs.map(function (n) {
      return n.id === id ? { id: n.id, icon: n.icon, tone: n.tone, title: n.title, body: n.body, at: n.at, read: true } : n;
    });
    EduHub.set(NK(), notifs);
    render();
  };

  var TONE = {
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    red: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
  };
  function notifHTML(n) {
    return '<div class="flex p-3 ' + (n.read ? 'opacity-60' : '') + ' hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer" onclick="markNotificationRead(\'' + n.id + '\')">' +
      '<div class="w-8 h-8 rounded-full ' + (TONE[n.tone] || TONE.blue) + ' flex items-center justify-center shrink-0 mr-3"><i class="fa-solid ' + n.icon + ' text-xs"></i></div>' +
      '<div class="min-w-0"><p class="text-xs font-semibold">' + esc(n.title) + '</p>' +
      '<p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">' + esc(n.body) + '</p>' +
      '<span class="text-[10px] text-gray-400 mt-1 block">' + timeAgo(n.at) + '</span></div>' +
      (n.read ? '' : '<span class="ml-auto mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-label="Chưa đọc"></span>') +
      '</div>';
  }

  /* ---------- Thẻ deadline ---------- */
  function deadlineRow(a) {
    var l = leftLabel(left(a.due));
    return '<div class="py-3 border-b border-gray-100 dark:border-slate-700 last:border-0 flex items-center justify-between gap-3">' +
      '<div class="space-y-1 min-w-0">' +
      '<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded ' + l.cls + '">' + l.text + '</span>' +
      '<h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">' + esc(a.title) + '</h4>' +
      '<p class="text-[11px] text-gray-400 truncate">' + esc(a.subject || 'Chưa chọn môn') + ' · Hạn ' + fmtDue(a.due) + '</p></div>' +
      '<button type="button" onclick="openSubmitModal(\'' + a.id + '\')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition shrink-0">Nộp</button>' +
      '</div>';
  }

  /* ---------- Hiển thị ---------- */
  function render() {
    syncNotifs();

    var dl = $('dashDeadlines');
    if (dl) {
      var list = pending().sort(function (a, b) { return new Date(a.due) - new Date(b.due); }).slice(0, 3);
      dl.innerHTML = list.length ? list.map(deadlineRow).join('')
        : '<p class="text-xs text-gray-400 text-center py-4">Không có bài tập nào cần nộp 🎉</p>';
    }

    var al = $('assignmentList');
    if (al) {
      al.innerHTML = items.length ? items.slice().sort(function (a, b) { return new Date(a.due) - new Date(b.due); }).map(function (a) {
        var l = leftLabel(left(a.due)), sub = a.status === 'submitted';
        return '<div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">' +
          '<div class="min-w-0 space-y-1">' +
          '<div class="flex flex-wrap items-center gap-2">' +
          '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">' + esc(a.subject || 'Chưa chọn môn') + '</span>' +
          '<span class="text-[10px] font-bold px-2 py-0.5 rounded ' + (sub ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : l.cls) + '">' + (sub ? 'Đã nộp' : l.text) + '</span>' +
          '</div>' +
          '<h3 class="font-bold text-sm">' + esc(a.title) + '</h3>' +
          '<p class="text-xs text-gray-500 dark:text-gray-400">Hạn nộp: ' + fmtDue(a.due) +
          (a.submission ? ' · Đã nộp lúc ' + fmtDue(a.submission.at) + ' (' + esc(a.submission.name) + ', ' + Math.max(1, Math.round((a.submission.size || 0) / 1024)) + ' KB)' : '') + '</p>' +
          (a.note ? '<p class="text-[11px] text-gray-400">' + esc(a.note) + '</p>' : '') +
          '</div>' +
          '<div class="flex items-center gap-2 shrink-0">' +
          (sub && a.submission && a.submission.stored ? '<button type="button" onclick="EduHubAssignments.download(\'' + a.id + '\')" class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-lg"><i class="fa-solid fa-download mr-1"></i>Tải bài đã nộp</button>' : '') +
          '<button type="button" onclick="EduHubAssignments.openForm(\'' + a.id + '\')" class="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg">Sửa</button>' +
          '<button type="button" onclick="EduHubAssignments.remove(\'' + a.id + '\')" class="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg">Xóa</button>' +
          (sub ? '' : '<button type="button" onclick="openSubmitModal(\'' + a.id + '\')" class="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-xl">Nộp bài</button>') +
          '</div></div>';
      }).join('')
        : '<div class="text-center text-sm text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl"><i class="fa-solid fa-list-check text-3xl mb-2 block"></i>Chưa có bài tập nào. Hãy thêm bài tập đầu tiên.</div>';
    }

    var ndl = $('notifDropdownList');
    if (ndl) ndl.innerHTML = notifs.length ? notifs.slice(0, 5).map(notifHTML).join('')
      : '<p class="px-4 py-6 text-xs text-gray-400 text-center">Không có thông báo nào.</p>';
    var ndt = $('notifDropdownTitle');
    if (ndt) ndt.textContent = 'Thông báo' + (unread() ? ' (' + unread() + ')' : '');

    var nl = $('notificationList');
    if (nl) nl.innerHTML = notifs.length ? notifs.map(notifHTML).join('')
      : '<p class="p-5 text-sm text-gray-400">Không có thông báo mới nào.</p>';

    var ab = $('navAssignmentsBadge');
    if (ab) { ab.textContent = pending().length; ab.classList.toggle('hidden', !pending().length); }
    var nb = $('navNotifBadge');
    if (nb) { nb.textContent = unread(); nb.classList.toggle('hidden', !unread()); }
    var dot = $('notifDot');
    if (dot) dot.classList.toggle('hidden', !unread());
    var dsc = $('dueSoonCount');
    if (dsc) dsc.textContent = pending().length + ' bài tập';

    document.dispatchEvent(new CustomEvent('eduhub:assignments'));
  }

  /* ---------- Hộp thoại nộp bài ---------- */
  var curId = null;
  function buildSubmit() {
    var m = document.createElement('div');
    m.id = 'submitModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'submitModalHeading');
    m.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    m.innerHTML =
      '<div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-700 space-y-5">' +
        '<div class="flex justify-between items-center">' +
          '<h3 id="submitModalHeading" class="text-lg font-bold">Nộp bài tập</h3>' +
          '<button type="button" data-eh-close onclick="closeSubmitModal()" aria-label="Đóng hộp thoại" class="text-gray-400 hover:text-gray-600 dark:hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button>' +
        '</div>' +
        '<div><p class="text-xs text-gray-500">Tên bài tập:</p><h4 id="modalAssignmentTitle" class="font-bold text-sm text-blue-600 mt-0.5">—</h4>' +
        '<p id="modalAssignmentDue" class="text-[11px] text-gray-400 mt-1"></p></div>' +
        '<button type="button" onclick="document.getElementById(\'fileInput\').click()" class="w-full border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 text-center hover:border-blue-500 transition">' +
          '<i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>' +
          '<p class="text-xs font-semibold">Chọn tệp bài làm để tải lên</p>' +
          '<p class="text-[11px] text-gray-400 mt-1">Bắt buộc chọn tệp trước khi nộp (tối đa 25 MB)</p>' +
        '</button>' +
        '<p class="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2"><i class="fa-solid fa-circle-info mr-1"></i>Bản demo: tệp chỉ được lưu trên thiết bị này, KHÔNG được gửi tới giảng viên hay máy chủ. Hãy nộp bài trên hệ thống chính thức của trường.</p>' +
        '<input type="file" id="fileInput" class="hidden" onchange="handleFileSelect(event)">' +
        '<p id="selectedFileName" class="text-xs font-medium text-emerald-600 hidden"><i class="fa-solid fa-paperclip mr-1"></i> <span></span></p>' +
        '<div><label for="submitNote" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ghi chú cho giảng viên (không bắt buộc)</label>' +
        '<textarea id="submitNote" rows="2" class="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"></textarea></div>' +
        '<p id="submitErr" class="hidden text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"></p>' +
        '<div class="flex justify-end gap-3">' +
          '<button type="button" onclick="closeSubmitModal()" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-xs font-medium rounded-xl">Hủy</button>' +
          '<button type="button" onclick="confirmSubmit()" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl">Xác nhận nộp</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
  }

  window.openSubmitModal = function (idOrTitle) {
    if (!$('submitModal')) buildSubmit();
    var a = items.find(function (x) { return x.id === idOrTitle; }) ||
            items.find(function (x) { return x.title === idOrTitle; });
    if (!a) { EduHub.toast('Không tìm thấy bài tập này.', 'error'); return; }
    curId = a.id;
    $('modalAssignmentTitle').textContent = a.title;
    $('modalAssignmentDue').textContent = 'Hạn nộp: ' + fmtDue(a.due);
    $('submitNote').value = a.submission && a.submission.note ? a.submission.note : '';
    $('fileInput').value = '';
    $('selectedFileName').classList.add('hidden');
    $('submitErr').classList.add('hidden');
    $('submitModal').classList.remove('hidden');
  };
  window.closeSubmitModal = function () {
    var m = $('submitModal');
    if (m) m.classList.add('hidden');
  };
  window.handleFileSelect = function (event) {
    var file = event.target.files && event.target.files[0];
    var box = $('selectedFileName');
    if (!file) { box.classList.add('hidden'); return; }
    box.querySelector('span').textContent = file.name + ' (' + Math.max(1, Math.round(file.size / 1024)) + ' KB)';
    box.classList.remove('hidden');
    $('submitErr').classList.add('hidden');
  };
  var submitting = false;
  window.confirmSubmit = function () {
    if (submitting) return;
    var a = items.find(function (x) { return x.id === curId; });
    if (!a) return;
    var input = $('fileInput'), err = $('submitErr');
    if (!input.files || !input.files.length) {
      err.textContent = 'Bạn chưa chọn tệp bài làm. Hãy chọn tệp trước khi xác nhận nộp.';
      err.classList.remove('hidden');
      return;
    }
    var f = input.files[0];
    if (f.size > FILE_LIMIT) {
      err.textContent = 'Tệp quá lớn (' + Math.round(f.size / 1048576) + ' MB). Giới hạn là 25 MB.';
      err.classList.remove('hidden');
      return;
    }
    var note = $('submitNote').value.trim(), id = a.id;
    submitting = true;
    Files.put(id, f).then(function () { return true; }, function () { return false; }).then(function (stored) {
      submitting = false;
      var cur = items.find(function (x) { return x.id === id; });
      if (!cur) { if (stored) dropFile(id); return; }          // bài tập đã bị xóa trong lúc chờ
      var at = Date.now();
      cur.status = 'submitted';
      cur.submittedAt = at;
      cur.submission = { name: f.name, size: f.size, type: f.type || '', at: at, note: note, stored: stored };
      save();
      var hist = EduHub.get(HK(), []);
      if (!Array.isArray(hist)) hist = [];
      hist.push({ assignmentId: cur.id, title: cur.title, subject: cur.subject, fileName: f.name, fileSize: f.size, at: at, note: note });
      EduHub.set(HK(), hist);
      closeSubmitModal();
      render();
      if (stored && window.EduSync) EduSync.fileUp(id);          // chế độ máy chủ: sao lên Storage để mở được trên thiết bị khác
      if (stored) EduHub.toast('Đã lưu bài "' + f.name + '"' + (window.EduCloud && EduCloud.enabled ? ' và đang đồng bộ lên tài khoản của bạn' : ' trên thiết bị này') + '. Lưu ý: bản demo chưa gửi tới giảng viên.', 'success');
      else EduHub.toast('Chỉ ghi nhận tên tệp "' + f.name + '": trình duyệt không cho lưu nội dung tệp (chế độ ẩn danh?). Bài chưa được gửi đi đâu.', 'warn');
    });
  };

  /* ---------- Hộp thoại thêm / sửa bài tập ---------- */
  function buildForm() {
    var m = document.createElement('div');
    m.id = 'assignmentModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'assignmentModalHeading');
    m.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    var I = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500';
    var LB = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';
    m.innerHTML =
      '<div class="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">' +
        '<div class="flex justify-between items-center"><h3 id="assignmentModalHeading" class="text-lg font-bold">Thêm bài tập</h3>' +
        '<button type="button" data-eh-close onclick="closeAssignmentForm()" aria-label="Đóng hộp thoại" class="text-gray-400 hover:text-gray-600 dark:hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button></div>' +
        '<div><label class="' + LB + '" for="asTitle">Tên bài tập *</label><input id="asTitle" class="' + I + '" placeholder="VD: Báo cáo Bài tập 3"></div>' +
        '<div class="grid grid-cols-2 gap-3">' +
          '<div><label class="' + LB + '" for="asSubject">Môn học</label><input id="asSubject" list="asSubjectList" class="' + I + '" placeholder="Chọn hoặc nhập môn"><datalist id="asSubjectList"></datalist></div>' +
          '<div><label class="' + LB + '" for="asDue">Hạn nộp *</label><input id="asDue" type="datetime-local" class="' + I + '"></div>' +
        '</div>' +
        '<div><label class="' + LB + '" for="asNote">Ghi chú</label><textarea id="asNote" rows="2" class="' + I + '"></textarea></div>' +
        '<p id="asErr" class="hidden text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"></p>' +
        '<div class="flex justify-between items-center pt-2">' +
          '<button type="button" id="asDelete" onclick="EduHubAssignments.removeFromForm()" class="hidden px-4 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl">Xóa bài tập</button>' +
          '<div class="flex gap-2 ml-auto"><button type="button" onclick="closeAssignmentForm()" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-xs font-medium rounded-xl">Hủy</button>' +
          '<button type="button" onclick="EduHubAssignments.saveForm()" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl"><i class="fa-solid fa-floppy-disk mr-1"></i>Lưu</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
  }

  var editId = null;
  function fillSubjects() {
    var dl = $('asSubjectList');
    if (!dl) return;
    var subs = EduHub.get(EduHub.userKey('eduhub_subjects'), []);
    dl.innerHTML = (Array.isArray(subs) ? subs : []).map(function (s) { return '<option value="' + esc(s.name) + '"></option>'; }).join('');
  }
  window.closeAssignmentForm = function () {
    var m = $('assignmentModal');
    if (m) m.classList.add('hidden');
  };

  window.EduHubAssignments = {
    openForm: function (id) {
      if (!$('assignmentModal')) buildForm();
      editId = id || null;
      var a = id ? items.find(function (x) { return x.id === id; }) : null;
      fillSubjects();
      $('assignmentModalHeading').textContent = a ? 'Sửa bài tập' : 'Thêm bài tập';
      $('asTitle').value = a ? a.title : '';
      $('asSubject').value = a ? (a.subject || '') : '';
      $('asDue').value = a ? toLocalInput(a.due) : toLocalInput(new Date(Date.now() + 7 * DAY).toISOString());
      $('asNote').value = a ? (a.note || '') : '';
      $('asDelete').classList.toggle('hidden', !a);
      $('asErr').classList.add('hidden');
      $('assignmentModal').classList.remove('hidden');
    },
    saveForm: function () {
      var title = $('asTitle').value.trim();
      var due = $('asDue').value;
      var err = $('asErr');
      if (!title) { err.textContent = 'Vui lòng nhập tên bài tập.'; err.classList.remove('hidden'); return; }
      if (!due) { err.textContent = 'Vui lòng chọn hạn nộp.'; err.classList.remove('hidden'); return; }
      var iso = new Date(due).toISOString();
      var data = { title: title, subject: $('asSubject').value.trim(), due: iso, note: $('asNote').value.trim() };
      if (editId) {
        var i = items.findIndex(function (x) { return x.id === editId; });
        if (i >= 0) items[i] = Object.assign({}, items[i], data);
      } else {
        items.push(Object.assign({ id: Date.now().toString(36), status: 'todo' }, data));
      }
      save();
      window.closeAssignmentForm();
      render();
      EduHub.toast(editId ? 'Đã cập nhật bài tập.' : 'Đã thêm bài tập mới.', 'success');
      editId = null;
    },
    removeFromForm: function () {
      if (!editId) return;
      if (!confirm('Xóa bài tập này?')) return;
      dropFile(editId);
      items = items.filter(function (x) { return x.id !== editId; });
      save();
      window.closeAssignmentForm();
      render();
      EduHub.toast('Đã xóa bài tập.', 'info');
      editId = null;
    },
    remove: function (id) {
      if (!confirm('Xóa bài tập này?')) return;
      dropFile(id);
      items = items.filter(function (x) { return x.id !== id; });
      save();
      render();
      EduHub.toast('Đã xóa bài tập.', 'info');
    },
    download: function (id) {
      var a = items.find(function (x) { return x.id === id; });
      if (!a || !a.submission) return;
      var save = function (blob) {
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = a.submission.name || 'bai-nop';
        link.click();
        setTimeout(function () { URL.revokeObjectURL(link.href); }, 1500);
      };
      Files.get(id).catch(function () { return null; }).then(function (blob) {
        if (blob) return save(blob);
        /* Không có trên thiết bị này: thử tải từ máy chủ (tệp nộp ở thiết bị khác) */
        if (!window.EduSync) { EduHub.toast('Không tìm thấy tệp đã lưu trên thiết bị này.', 'error'); return; }
        EduHub.toast('Đang tải tệp từ máy chủ…', 'info');
        return EduSync.fileFetch(id).then(function (cb) {
          if (!cb) { EduHub.toast('Tệp chưa có trên máy chủ. Hãy mở EduHub trên thiết bị đã nộp bài (cần có mạng) để tệp được đồng bộ.', 'warn'); return; }
          Files.put(id, cb).catch(function () {});               // giữ bản trên thiết bị này cho lần sau
          save(cb);
        }).catch(function (e) { EduHub.toast((e && e.message) || 'Không tải được tệp từ máy chủ.', 'error'); });
      }).catch(function () { EduHub.toast('Không đọc được tệp đã lưu.', 'error'); });
    },
    refresh: render
  };

  /* ---------- Nạp ---------- */
  render();
  setInterval(render, 60000);                 // cập nhật đếm ngược deadline mỗi phút
  window.addEventListener('storage', function (e) {
    if (e.key && e.key !== K() && e.key !== NK() && e.key !== HK()) return;   // bỏ qua khóa không liên quan
    var d = EduHub.get(K(), null);
    if (Array.isArray(d)) items = d;
    notifs = EduHub.get(NK(), []) || [];
    render();
  });
  window.addEventListener('pageshow', function () {
    items = EduHub.get(K(), items);
    render();
  });
})();
