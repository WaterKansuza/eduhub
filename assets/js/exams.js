/* ============================================================
   EduHub - Lịch thi (exams.js)
   Dữ liệu: eduhub_exams_<email>. Hỗ trợ xuất tệp .ics để nhập vào
   Google Calendar / Apple Calendar / Outlook.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  };
  var K = function () { return EduHub.userKey('eduhub_exams'); };
  var DAY = 86400e3;

  var exams = EduHub.get(K(), null);
  if (!Array.isArray(exams)) exams = [];
  var save = function () { EduHub.set(K(), exams); };

  function fmtDate(d) {
    if (!d) return '—';
    var p = d.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
  }
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  /* Ngày theo giờ ĐỊA PHƯƠNG (toISOString() trả về giờ UTC nên lệch 1 ngày từ 0h–7h sáng ở Việt Nam) */
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayStart(str) {
    var p = String(str || '').split('-');
    return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]).getTime() : NaN;
  }
  /* Số NGÀY LỊCH còn lại (không phải số giờ chia 24): thi sáng mai lúc tối nay = 1 ngày.
     Trả về -1 nếu hôm nay nhưng đã quá giờ kết thúc. */
  function daysLeft(e) {
    var t = dayStart(e.date);
    if (isNaN(t)) return null;
    var n = new Date(), today = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
    var d = Math.round((t - today) / DAY);
    if (d === 0) {
      var end = e.end || e.start;
      if (end && /^\d{2}:\d{2}$/.test(end)) {
        var hm = end.split(':');
        if (Date.now() > t + (+hm[0] * 60 + +hm[1]) * 60000) return -1;
      }
    }
    return d;
  }

  function render() {
    var el = $('examList');
    if (!el) return;
    if (!exams.length) {
      el.innerHTML = '<div class="text-center text-sm text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">' +
        '<i class="fa-solid fa-file-pen text-3xl mb-2 block"></i>Chưa có lịch thi nào. Hãy thêm buổi thi đầu tiên để EduHub nhắc bạn.</div>';
      return;
    }
    el.className = 'space-y-3'; el.innerHTML = exams.slice().sort(function (a, b) { return (a.date + ' ' + (a.start || '')).localeCompare(b.date + ' ' + (b.start || '')); }).map(function (e) {
      var d = daysLeft(e);
      var tone = d == null || d < 0 ? 'text-gray-400 bg-gray-100 dark:bg-slate-700'
        : d <= 7 ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
        : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
      var big = d == null ? '?' : d < 0 ? '✓' : d;
      var small = d == null ? 'không rõ' : d < 0 ? 'đã thi' : d === 0 ? 'hôm nay' : 'ngày nữa';
      return '<div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-4 flex items-center gap-4">' +
        '<div class="w-[74px] shrink-0 text-center rounded-xl py-2.5 ' + tone + '"><b class="block text-2xl leading-tight">' + big + '</b><span class="text-[11px]">' + small + '</span></div>' +
        '<div class="min-w-0 flex-1">' +
        '<h3 class="font-bold text-[15px] flex flex-wrap items-center gap-2">' + esc(e.subject || 'Môn thi') +
        (e.type ? '<span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">' + esc(e.type) + '</span>' : '') + '</h3>' +
        '<p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5"><i class="fa-regular fa-calendar w-4"></i>' + fmtDate(e.date) +
        ' · <i class="fa-regular fa-clock mx-0.5"></i>' + esc(e.start || '') + (e.end ? '–' + esc(e.end) : '') +
        (e.room ? ' · <i class="fa-solid fa-location-dot mx-0.5"></i>' + esc(e.room) : '') + '</p>' +
        (e.note ? '<p class="text-[11px] text-gray-400 mt-1">' + esc(e.note) + '</p>' : '') +
        '</div>' +
        '<div class="flex items-center gap-1 shrink-0">' +
        '<button type="button" title="Sửa" onclick="EduHubExams.openForm(\'' + e.id + '\')" class="w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700"><i class="fa-solid fa-pen text-xs"></i></button>' +
        '<button type="button" title="Xóa" onclick="EduHubExams.remove(\'' + e.id + '\')" class="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"><i class="fa-solid fa-xmark"></i></button>' +
        '</div></div>';
    }).join('');
  }

  /* ---------- Hộp thoại ---------- */
  function buildForm() {
    var m = document.createElement('div');
    m.id = 'examModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'examModalHeading');
    m.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    var I = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500';
    var LB = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';
    m.innerHTML =
      '<div class="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">' +
        '<div class="flex justify-between items-center"><h3 id="examModalHeading" class="text-lg font-bold">Thêm lịch thi</h3>' +
        '<button type="button" data-eh-close onclick="closeExamForm()" aria-label="Đóng hộp thoại" class="text-gray-400 hover:text-gray-600 dark:hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button></div>' +
        '<div><label class="' + LB + '" for="exSubject">Môn thi *</label><input id="exSubject" list="exSubjectList" class="' + I + '" placeholder="VD: Trí Tuệ Nhân Tạo"><datalist id="exSubjectList"></datalist></div>' +
        '<div class="grid grid-cols-2 gap-3">' +
          '<div><label class="' + LB + '" for="exType">Loại</label><select id="exType" class="' + I + '"><option>Thi cuối kỳ</option><option>Thi giữa kỳ</option><option>Kiểm tra</option><option>Thi lại</option></select></div>' +
          '<div><label class="' + LB + '" for="exRoom">Phòng thi</label><input id="exRoom" class="' + I + '" placeholder="A101"></div>' +
        '</div>' +
        '<div class="grid grid-cols-3 gap-3">' +
          '<div><label class="' + LB + '" for="exDate">Ngày *</label><input id="exDate" type="date" class="' + I + '"></div>' +
          '<div><label class="' + LB + '" for="exStart">Bắt đầu</label><input id="exStart" type="time" value="07:30" class="' + I + '"></div>' +
          '<div><label class="' + LB + '" for="exEnd">Kết thúc</label><input id="exEnd" type="time" value="09:30" class="' + I + '"></div>' +
        '</div>' +
        '<div><label class="' + LB + '" for="exNote">Ghi chú</label><textarea id="exNote" rows="2" class="' + I + '" placeholder="VD: Được dùng tài liệu, mang máy tính bỏ túi"></textarea></div>' +
        '<p id="exErr" class="hidden text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"></p>' +
        '<div class="flex justify-end gap-2 pt-2">' +
          '<button type="button" onclick="closeExamForm()" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-xs font-medium rounded-xl">Hủy</button>' +
          '<button type="button" onclick="EduHubExams.saveForm()" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl"><i class="fa-solid fa-floppy-disk mr-1"></i>Lưu</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
  }

  var editId = null;
  window.closeExamForm = function () { var m = $('examModal'); if (m) m.classList.add('hidden'); };

  function icsEsc(s) {
    return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }
  function icsTime(date, time) {
    var t = (time || '00:00').split(':');
    return String(date).replace(/-/g, '') + 'T' + (t[0] || '00') + (t[1] || '00') + '00';
  }

  window.EduHubExams = {
    openForm: function (id) {
      if (!$('examModal')) buildForm();
      editId = id || null;
      var e = id ? exams.find(function (x) { return x.id === id; }) : null;
      var subs = EduHub.get(EduHub.userKey('eduhub_subjects'), []);
      $('exSubjectList').innerHTML = (Array.isArray(subs) ? subs : []).map(function (s) { return '<option value="' + esc(s.name) + '"></option>'; }).join('');
      $('examModalHeading').textContent = e ? 'Sửa lịch thi' : 'Thêm lịch thi';
      $('exSubject').value = e ? (e.subject || '') : '';
      $('exType').value = e && e.type ? e.type : 'Thi cuối kỳ';
      $('exRoom').value = e ? (e.room || '') : '';
      $('exDate').value = e ? e.date : todayStr();
      $('exStart').value = e ? (e.start || '07:30') : '07:30';
      $('exEnd').value = e ? (e.end || '09:30') : '09:30';
      $('exNote').value = e ? (e.note || '') : '';
      $('exErr').classList.add('hidden');
      $('examModal').classList.remove('hidden');
    },
    saveForm: function () {
      var subject = $('exSubject').value.trim(), date = $('exDate').value, err = $('exErr');
      if (!subject) { err.textContent = 'Vui lòng nhập môn thi.'; err.classList.remove('hidden'); return; }
      if (!date) { err.textContent = 'Vui lòng chọn ngày thi.'; err.classList.remove('hidden'); return; }
      var st = $('exStart').value, en = $('exEnd').value;
      if (st && en && en <= st) { err.textContent = 'Giờ kết thúc phải sau giờ bắt đầu.'; err.classList.remove('hidden'); return; }
      var data = {
        subject: subject, type: $('exType').value, room: $('exRoom').value.trim(),
        date: date, start: $('exStart').value, end: $('exEnd').value, note: $('exNote').value.trim()
      };
      if (editId) {
        var i = exams.findIndex(function (x) { return x.id === editId; });
        if (i >= 0) exams[i] = Object.assign({}, exams[i], data);
      } else {
        exams.push(Object.assign({ id: Date.now().toString(36) }, data));
      }
      save(); window.closeExamForm(); render();
      EduHub.toast(editId ? 'Đã cập nhật lịch thi.' : 'Đã thêm lịch thi mới.', 'success');
      editId = null;
    },
    remove: function (id) {
      if (!confirm('Xóa lịch thi này?')) return;
      exams = exams.filter(function (x) { return x.id !== id; });
      save(); render();
      EduHub.toast('Đã xóa lịch thi.', 'info');
    },
    exportICS: function () {
      if (!exams.length) { EduHub.toast('Chưa có lịch thi nào để xuất.', 'warn'); return; }
      var now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      var TZ = 'Asia/Ho_Chi_Minh';
      var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EduHub//Lich thi//VI', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Lich thi EduHub',
        'BEGIN:VTIMEZONE', 'TZID:' + TZ, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0700', 'TZOFFSETTO:+0700', 'TZNAME:ICT', 'END:STANDARD', 'END:VTIMEZONE'];
      exams.forEach(function (e) {
        L.push('BEGIN:VEVENT');
        L.push('UID:' + e.id + '@eduhub');
        L.push('DTSTAMP:' + now);
        var endT = e.end && e.start && e.end > e.start ? e.end : (e.start || '00:00');
        L.push('DTSTART;TZID=' + TZ + ':' + icsTime(e.date, e.start));
        L.push('DTEND;TZID=' + TZ + ':' + icsTime(e.date, endT));
        L.push('SUMMARY:' + icsEsc((e.type ? e.type + ': ' : '') + e.subject));
        if (e.room) L.push('LOCATION:' + icsEsc(e.room));
        if (e.note) L.push('DESCRIPTION:' + icsEsc(e.note));
        L.push('BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Nhac lich thi ngay mai', 'END:VALARM');
        L.push('END:VEVENT');
      });
      L.push('END:VCALENDAR');
      var enc = new TextEncoder();
      var fold = function (line) {                       // RFC 5545: tối đa 75 octet / dòng, dòng nối bắt đầu bằng 1 dấu cách
        var out = '', cur = '', bytes = 0;
        Array.from(line).forEach(function (ch) {
          var b = enc.encode(ch).length;
          if (bytes + b > 75) { out += cur + '\r\n '; cur = ''; bytes = 1; }
          cur += ch; bytes += b;
        });
        return out + cur;
      };
      var blob = new Blob([L.map(fold).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lich-thi-eduhub.ics';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      EduHub.toast('Đã xuất tệp lịch thi (.ics). Mở tệp để thêm vào Google Calendar.', 'success');
    }
  };

  render();
  window.addEventListener('storage', function () { exams = EduHub.get(K(), []) || []; render(); });
  window.addEventListener('pageshow', function () { exams = EduHub.get(K(), exams) || []; render(); });
})();
