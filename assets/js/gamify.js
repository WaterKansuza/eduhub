/* ============================================================
   EduHub - Chuỗi ngày học & huy hiệu (gamify.js)
   Nạp SAU config.js, ở cuối <body> của index.html, timetable.html.

   Dữ liệu: eduhub_gamify_<email>  (được đưa vào sao lưu / khôi phục)
     days     các ngày có hoạt động (YYYY-MM-DD theo GIỜ ĐỊA PHƯƠNG)
     frozen   các ngày được "đóng băng" để giữ chuỗi
     freezes  số lượt đóng băng đang có (tối đa 2)
     fm       mốc 7 ngày đã nhận thưởng trong chuỗi hiện tại
     best     chuỗi dài nhất
     badges   { id huy hiệu: ngày mở khóa ('' nếu mở khóa từ dữ liệu có sẵn) }

   Một ngày được tính là "có hoạt động" khi:
     - bấm "Điểm danh hôm nay", hoặc
     - lưu thay đổi ở môn học, thời khóa biểu, bài tập (thêm/sửa/nộp/xóa), điểm, lịch thi
       (config.js phát sự kiện eduhub:data mỗi khi EduHub.set ghi thành công).
   Khôi phục sao lưu ghi im lặng nên KHÔNG tính là hoạt động.
   Huy hiệu được suy ra từ dữ liệu thật; đã mở khóa thì giữ lại kể cả khi sau đó xóa dữ liệu.
   ============================================================ */
(function () {
  'use strict';
  if (!window.EduHub) return;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  };
  var KEY = function () { return EduHub.userKey('eduhub_gamify'); };
  var DATA_BASES = ['eduhub_assignments', 'eduhub_records', 'eduhub_subjects', 'eduhub_timetable', 'eduhub_exams', 'eduhub_boss'];
  var MAX_FREEZE = 2, DAY = 864e5, DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var KEEP_DAYS = 730, KEEP_FROZEN = 100;
  var WD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  /* ---------- Ngày theo giờ địa phương (không dùng toISOString: lệch UTC) ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return fmt(new Date()); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }   // 12h trưa: an toàn khi đổi giờ
  function shift(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return fmt(d); }
  function vn(s) { return s ? s.split('-').reverse().join('/') : ''; }

  /* ---------- Trạng thái ---------- */
  function cleanDates(a, max) {
    var seen = {}, out = [];
    (Array.isArray(a) ? a : []).forEach(function (d) {
      if (typeof d === 'string' && DATE_RE.test(d) && !seen[d]) { seen[d] = 1; out.push(d); }
    });
    out.sort();
    return out.slice(-max);
  }
  function int(v, min, max) { v = Math.round(+v); return isFinite(v) ? Math.min(max, Math.max(min, v)) : min; }
  function blank() { return { v: 1, init: false, days: [], frozen: [], freezes: 0, fm: 0, best: 0, badges: {} }; }
  function load() {
    var s = EduHub.get(KEY(), null), b = blank();
    if (!s || typeof s !== 'object' || Array.isArray(s)) return b;
    b.init = !!s.init;
    b.days = cleanDates(s.days, KEEP_DAYS);
    b.frozen = cleanDates(s.frozen, KEEP_FROZEN);
    b.freezes = int(s.freezes, 0, MAX_FREEZE);
    b.fm = int(s.fm, 0, 1000);
    b.best = int(s.best, 0, 100000);
    if (s.badges && typeof s.badges === 'object') {
      Object.keys(s.badges).slice(0, 100).forEach(function (k) {
        var v = s.badges[k];
        if (typeof v === 'string' && (v === '' || DATE_RE.test(v))) b.badges[k] = v;
      });
    }
    return b;
  }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* ---------- Chuỗi ngày ---------- */
  function covered(s) {
    var c = {};
    s.days.forEach(function (d) { c[d] = 1; });
    s.frozen.forEach(function (d) { c[d] = 1; });
    return c;
  }
  /* Chuỗi hiện tại = số ngày CÓ hoạt động liên tiếp (ngày đóng băng giữ chuỗi nhưng không cộng thêm).
     Hôm nay chưa làm gì thì chuỗi vẫn còn nếu hôm qua đã được tính. */
  function streak(s) {
    var c = covered(s), act = {}, t = today(), n = 0, d, guard = 0;
    s.days.forEach(function (x) { act[x] = 1; });
    d = c[t] ? t : shift(t, -1);
    while (c[d] && guard++ < 5000) { if (act[d]) n++; d = shift(d, -1); }
    return { cur: n, done: !!act[t] };
  }
  /* Bù các ngày đã lỡ bằng lượt đóng băng: chỉ khi ĐỦ lượt để lấp toàn bộ khoảng trống,
     nếu không thì chuỗi đứt và không tốn lượt nào. Trả về số lượt đã dùng. */
  function settle(s) {
    if (s.freezes < 1) return 0;
    var c = covered(s), d = shift(today(), -1), miss = [];
    while (!c[d] && miss.length <= s.freezes) { miss.push(d); d = shift(d, -1); }
    if (!miss.length || !c[d] || miss.length > s.freezes) return 0;
    miss.forEach(function (x) { s.frozen.push(x); });
    s.freezes -= miss.length;
    s.frozen = cleanDates(s.frozen, KEEP_FROZEN);
    return miss.length;
  }

  /* ---------- Số liệu để xét huy hiệu (đọc trực tiếp từ dữ liệu của các trang khác) ---------- */
  function arr(k) { var v = EduHub.get(EduHub.userKey(k), []); return Array.isArray(v) ? v : []; }
  function semStat(x) {
    var c = 0, w = 0, mx = 0;
    ((x && Array.isArray(x.subs)) ? x.subs : []).forEach(function (m) {
      var cc = +m.c, g = +m.g;
      if (cc > 0 && isFinite(g)) { c += cc; w += cc * g; if (g > mx) mx = g; }
    });
    return { c: c, avg: c ? w / c : 0, max: mx };
  }
  function stats(s) {
    var A = arr('eduhub_assignments'), S = arr('eduhub_subjects'), E = arr('eduhub_exams');
    var R = EduHub.get(EduHub.userKey('eduhub_records'), null), T = EduHub.get(EduHub.userKey('eduhub_timetable'), null);
    var x = { best: s.best };

    var sub = A.filter(function (a) { return a && a.status === 'submitted'; });
    var timed = sub.filter(function (a) { return typeof a.submittedAt === 'number' && a.due && isFinite(new Date(a.due).getTime()); });
    x.submitted = sub.length;
    x.early = timed.filter(function (a) { return new Date(a.due).getTime() - a.submittedAt >= DAY; }).length;
    x.late = timed.filter(function (a) { return a.submittedAt > new Date(a.due).getTime(); }).length;
    x.onTime = x.late === 0 ? timed.length : 0;

    var sems = (R && Array.isArray(R.sems) ? R.sems : []).map(function (m, i) {
      var st = semStat(m);
      st.key = (m && m.year != null ? +m.year : -1) * 10 + (m && m.term != null ? +m.term : 0);   // kỳ chưa rõ năm xếp trước
      st.i = i;
      return st;
    }).filter(function (m) { return m.c > 0; });
    sems.sort(function (a, b) { return a.key - b.key || a.i - b.i; });
    x.hasGrades = sems.length > 0;
    x.maxG = sems.reduce(function (m, y) { return Math.max(m, y.max); }, 0);
    x.goodSem = sems.reduce(function (m, y) { return y.c >= 10 ? Math.max(m, y.avg) : m; }, 0);
    x.improve = sems.length >= 2 && sems[sems.length - 1].avg > sems[sems.length - 2].avg;

    x.subjects = S.length;
    x.hasTT = !!(T && Array.isArray(T.placements) && T.placements.length);
    x.exams = E.length;
    x.areas = [S.length > 0, x.hasTT, A.length > 0, x.hasGrades, E.length > 0].filter(Boolean).length;
    return x;
  }

  /* ---------- Danh sách huy hiệu: p(x) -> [hiện có, cần đạt] ---------- */
  var DEFS = [
    { id: 'streak3', g: 'Chuỗi ngày', icon: 'fa-fire', c: 'orange', name: 'Khởi động', desc: 'Hoạt động 3 ngày liên tiếp', p: function (x) { return [x.best, 3]; } },
    { id: 'streak7', g: 'Chuỗi ngày', icon: 'fa-fire', c: 'rose', name: 'Tuần rực lửa', desc: 'Hoạt động 7 ngày liên tiếp', p: function (x) { return [x.best, 7]; } },
    { id: 'streak30', g: 'Chuỗi ngày', icon: 'fa-medal', c: 'amber', name: 'Kiên trì', desc: 'Hoạt động 30 ngày liên tiếp', p: function (x) { return [x.best, 30]; } },
    { id: 'streak100', g: 'Chuỗi ngày', icon: 'fa-crown', c: 'purple', name: 'Huyền thoại', desc: 'Hoạt động 100 ngày liên tiếp', p: function (x) { return [x.best, 100]; } },

    { id: 'first_submit', g: 'Bài tập', icon: 'fa-paper-plane', c: 'blue', name: 'Bài nộp đầu tiên', desc: 'Nộp bài tập đầu tiên', p: function (x) { return [x.submitted, 1]; } },
    { id: 'submit5', g: 'Bài tập', icon: 'fa-list-check', c: 'sky', name: 'Chăm chỉ', desc: 'Nộp 5 bài tập', p: function (x) { return [x.submitted, 5]; } },
    { id: 'submit20', g: 'Bài tập', icon: 'fa-rocket', c: 'indigo', name: 'Cỗ máy nộp bài', desc: 'Nộp 20 bài tập', p: function (x) { return [x.submitted, 20]; } },
    { id: 'early5', g: 'Bài tập', icon: 'fa-bolt', c: 'amber', name: 'Về đích sớm', desc: 'Nộp sớm hơn hạn ít nhất 24 giờ, 5 bài', p: function (x) { return [x.early, 5]; } },
    { id: 'ontime', g: 'Bài tập', icon: 'fa-clock', c: 'emerald', name: 'Đúng hẹn', desc: 'Nộp 5 bài mà không bài nào trễ hạn', p: function (x) { return [x.onTime, 5]; } },

    { id: 'grades_first', g: 'Điểm số', icon: 'fa-book-open', c: 'teal', name: 'Mở sổ điểm', desc: 'Nhập điểm của một học kỳ', p: function (x) { return [x.hasGrades ? 1 : 0, 1]; } },
    { id: 'excellent', g: 'Điểm số', icon: 'fa-star', c: 'amber', name: 'Điểm xuất sắc', desc: 'Có môn đạt từ 9.0 trở lên', p: function (x) { return [x.maxG, 9]; } },
    { id: 'good_sem', g: 'Điểm số', icon: 'fa-graduation-cap', c: 'purple', name: 'Kỳ học giỏi', desc: 'Một kỳ từ 10 tín chỉ có điểm TB (hệ 10) từ 8.0', p: function (x) { return [x.goodSem, 8]; } },
    { id: 'improve', g: 'Điểm số', icon: 'fa-chart-line', c: 'emerald', name: 'Tiến bộ', desc: 'Điểm TB kỳ gần nhất cao hơn kỳ trước', p: function (x) { return [x.improve ? 1 : 0, 1]; } },

    { id: 'subjects3', g: 'Kế hoạch', icon: 'fa-layer-group', c: 'sky', name: 'Gọn gàng', desc: 'Thêm 3 môn học', p: function (x) { return [x.subjects, 3]; } },
    { id: 'planner', g: 'Kế hoạch', icon: 'fa-calendar-check', c: 'indigo', name: 'Nhà quy hoạch', desc: 'Xếp thời khóa biểu tự động', p: function (x) { return [x.hasTT ? 1 : 0, 1]; } },
    { id: 'exam_ready', g: 'Kế hoạch', icon: 'fa-calendar-days', c: 'rose', name: 'Sẵn sàng thi', desc: 'Thêm một lịch thi', p: function (x) { return [x.exams, 1]; } },
    { id: 'allround', g: 'Kế hoạch', icon: 'fa-trophy', c: 'pink', name: 'Toàn diện', desc: 'Dùng đủ 5 mảng: môn học, thời khóa biểu, bài tập, điểm, lịch thi', p: function (x) { return [x.areas, 5]; } }
  ];
  var COL = {
    orange: ['bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', 'bg-orange-500'],
    amber: ['bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', 'bg-amber-500'],
    blue: ['bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', 'bg-blue-500'],
    sky: ['bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400', 'bg-sky-500'],
    emerald: ['bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', 'bg-emerald-500'],
    purple: ['bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', 'bg-purple-500'],
    rose: ['bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', 'bg-rose-500'],
    indigo: ['bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', 'bg-indigo-500'],
    teal: ['bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400', 'bg-teal-500'],
    pink: ['bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400', 'bg-pink-500']
  };
  var LOCKED = 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500';
  var fresh = {};   // huy hiệu vừa mở khóa trong phiên này (để chạy hiệu ứng)

  function num(v) { v = Math.round(v * 10) / 10; return String(v); }
  function prog(d, X) {
    var p = d.p(X), cur = Math.max(0, p[0]), max = p[1];
    return { cur: Math.min(cur, max), max: max, ratio: Math.min(1, cur / max) };
  }

  /* ---------- Xử lý chính ---------- */
  var busy = false, lastHTML = '', lastModal = '';
  function run(log) {
    if (busy) return;
    busy = true;
    try {
      var s = load(), before = JSON.stringify(s), t = today(), notes = [];
      var silent = !s.init;

      var froze = settle(s);
      if (froze) notes.push(['info', 'Đã dùng ' + froze + ' lượt đóng băng 🧊 để giữ chuỗi ngày của bạn.']);
      if (log && s.days.indexOf(t) < 0) s.days.push(t);
      s.days = cleanDates(s.days, KEEP_DAYS);

      var info = streak(s);
      if (info.cur > s.best) s.best = info.cur;
      var k = Math.floor(info.cur / 7);
      if (k > s.fm) {
        s.fm = k;
        if (s.freezes < MAX_FREEZE) { s.freezes++; notes.push(['success', '🔥 Chuỗi ' + info.cur + ' ngày! Bạn nhận thêm 1 lượt đóng băng 🧊']); }
      } else if (k < s.fm) s.fm = k;   // chuỗi đã đứt: cho phép nhận thưởng lại từ đầu

      var X = stats(s), got = [];
      DEFS.forEach(function (d) {
        if (has(s.badges, d.id)) return;
        var p = d.p(X);
        if (p[0] >= p[1]) { s.badges[d.id] = silent ? '' : t; got.push(d); }
      });
      s.init = true;

      var changed = JSON.stringify(s) !== before;
      if (changed && EduHub.set(KEY(), s)) {
        if (silent) {
          if (got.length) notes = [['success', 'Đã mở khóa ' + got.length + ' huy hiệu từ dữ liệu có sẵn của bạn 🏅']];
        } else if (got.length > 3) {
          got.forEach(function (d) { fresh[d.id] = 1; });
          notes.push(['success', '🏅 Bạn vừa mở khóa ' + got.length + ' huy hiệu mới!']);
        } else {
          got.forEach(function (d) { fresh[d.id] = 1; notes.push(['success', '🏅 Huy hiệu mới: ' + d.name + ' — ' + d.desc]); });
        }
        notes.forEach(function (n) { EduHub.toast(n[1], n[0]); });
      }
      render(s, info, X);
    } finally { busy = false; }
  }

  /* ---------- Giao diện ---------- */
  function injectStyle() {
    if ($('ehGamifyCss')) return;
    var st = document.createElement('style');
    st.id = 'ehGamifyCss';
    st.textContent =
      '@keyframes ehFlame{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.14) rotate(3deg)}}' +
      '@keyframes ehPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.18)}100%{transform:scale(1);opacity:1}}' +
      '.eh-flame{display:inline-block;animation:ehFlame 1.6s ease-in-out infinite}' +
      '.eh-flame-off{animation:none;filter:grayscale(1);opacity:.55}' +
      '.eh-pop{animation:ehPop .55s ease-out}' +
      '@media (prefers-reduced-motion:reduce){.eh-flame,.eh-pop{animation:none}}';
    document.head.appendChild(st);
  }

  function tile(d, X, s) {
    var earned = has(s.badges, d.id), p = prog(d, X), col = COL[d.c];
    var label = d.name + (earned ? ', đã mở khóa' : ', chưa mở khóa, ' + num(p.cur) + ' trên ' + num(p.max));
    return '<button type="button" data-eh-badges aria-label="' + esc(label) + '" title="' + esc(d.desc) + '" class="group flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition focus:outline-none focus-visible:ring-2 ring-blue-500">' +
      '<span class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl ' + (earned ? col[0] : LOCKED) + (earned && fresh[d.id] ? ' eh-pop' : '') + '"><i class="fa-solid ' + (earned ? d.icon : 'fa-lock') + (earned ? '' : ' text-base') + '"></i></span>' +
      '<span class="text-[11px] font-semibold text-center leading-tight ' + (earned ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400 dark:text-slate-500') + '">' + esc(d.name) + '</span>' +
      (earned ? '' : '<span class="text-[10px] text-gray-400 dark:text-slate-500">' + num(p.cur) + '/' + num(p.max) + '</span>') +
      '</button>';
  }

  function dots(s) {
    var t = today(), days = {}, fz = {}, out = '';
    s.days.forEach(function (d) { days[d] = 1; });
    s.frozen.forEach(function (d) { fz[d] = 1; });
    for (var i = 6; i >= 0; i--) {
      var d = shift(t, -i), isToday = d === t, cls, inner, tip;
      if (days[d]) { cls = 'bg-white text-orange-600 font-bold'; inner = '✓'; tip = 'Có hoạt động'; }
      else if (fz[d]) { cls = 'bg-sky-200 text-sky-700'; inner = '🧊'; tip = 'Được đóng băng'; }
      else if (isToday) { cls = 'border-2 border-white/80 text-white/90'; inner = ''; tip = 'Hôm nay, chưa có hoạt động'; }
      else { cls = 'bg-white/20 text-white/60'; inner = ''; tip = 'Không có hoạt động'; }
      out += '<div class="flex-1 text-center" title="' + esc(vn(d) + ': ' + tip) + '">' +
        '<div class="text-[10px] mb-1 ' + (isToday ? 'text-white font-bold' : 'text-white/70') + '">' + WD[parse(d).getDay()] + '</div>' +
        '<div role="img" aria-label="' + esc(WD[parse(d).getDay()] + ': ' + tip) + '" class="h-8 rounded-lg flex items-center justify-center text-xs ' + cls + '">' + inner + '</div></div>';
    }
    return out;
  }

  function streakCard(s, info) {
    var msg;
    if (info.done) {
      msg = s.freezes >= MAX_FREEZE ? 'Hôm nay đã xong.' : 'Còn ' + (7 - (info.cur % 7)) + ' ngày nữa được thêm 1 lượt đóng băng 🧊';
    } else if (info.cur > 0) msg = 'Hôm nay chưa có hoạt động, hãy giữ chuỗi nhé!';
    else msg = 'Điểm danh để bắt đầu chuỗi.';
    return '<div class="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 shadow-sm flex flex-col">' +
      '<div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>' +
      '<div class="relative flex items-start justify-between">' +
        '<div><p class="text-xs font-semibold text-white/80">Chuỗi ngày học</p>' +
        '<div class="flex items-end gap-2 mt-1"><span class="text-5xl font-extrabold leading-none">' + info.cur + '</span><span class="text-sm font-semibold mb-1">ngày</span></div></div>' +
        '<span class="text-4xl select-none ' + (info.cur > 0 ? 'eh-flame' : 'eh-flame eh-flame-off') + '" aria-hidden="true">🔥</span>' +
      '</div>' +
      '<p class="relative text-xs text-white/90 mt-2 min-h-[2rem]">' + esc(msg) + '</p>' +
      '<div class="relative flex gap-1.5 mt-3">' + dots(s) + '</div>' +
      '<div class="relative flex items-center justify-between mt-4 text-[11px] text-white/90">' +
        '<span>Dài nhất: <b>' + s.best + '</b> ngày</span>' +
        '<span title="Mỗi chuỗi 7 ngày nhận 1 lượt đóng băng (tối đa ' + MAX_FREEZE + '). Lượt này tự dùng để giữ chuỗi khi bạn lỡ một ngày.">🧊 ' + s.freezes + '/' + MAX_FREEZE + ' lượt đóng băng</span>' +
      '</div>' +
      '<button type="button" data-eh-checkin ' + (info.done ? 'disabled' : '') + ' class="relative mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition ' +
        (info.done ? 'bg-white/20 text-white/80 cursor-default' : 'bg-white text-rose-600 hover:bg-white/90 shadow') + '">' +
        (info.done ? '<i class="fa-solid fa-circle-check mr-1.5"></i>Hôm nay đã hoàn thành' : '<i class="fa-solid fa-hand-point-up mr-1.5"></i>Điểm danh hôm nay') + '</button>' +
      '</div>';
  }

  function ordered(s, X) {
    var earned = [], locked = [];
    DEFS.forEach(function (d, i) {
      if (has(s.badges, d.id)) earned.push({ d: d, i: i, at: s.badges[d.id] });
      else locked.push({ d: d, i: i, r: prog(d, X).ratio });
    });
    earned.sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : a.i - b.i; });   // mới mở khóa trước
    locked.sort(function (a, b) { return b.r - a.r || a.i - b.i; });                        // gần đạt nhất trước
    return { earned: earned, locked: locked };
  }

  function badgeCard(s, X) {
    var o = ordered(s, X), show = o.earned.concat(o.locked).slice(0, 6), next = o.locked[0], nextHTML;
    if (next) {
      var p = prog(next.d, X);
      nextHTML = '<div class="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/40">' +
        '<div class="flex justify-between items-center gap-2 text-xs"><span class="font-semibold text-gray-800 dark:text-gray-100">Sắp mở khóa: ' + esc(next.d.name) + '</span><span class="text-gray-500 dark:text-gray-400 shrink-0">' + num(p.cur) + '/' + num(p.max) + '</span></div>' +
        '<p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">' + esc(next.d.desc) + '</p>' +
        '<div class="h-1.5 mt-2 rounded-full bg-gray-200 dark:bg-slate-600 overflow-hidden"><div class="h-full rounded-full ' + COL[next.d.c][1] + '" style="width:' + Math.round(p.ratio * 100) + '%"></div></div></div>';
    } else nextHTML = '<p class="mt-4 text-xs text-center text-emerald-600 dark:text-emerald-400 font-semibold">Bạn đã mở khóa tất cả huy hiệu 🎉</p>';
    return '<div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">' +
      '<div class="flex justify-between items-center mb-3">' +
        '<div><h2 class="font-bold text-base text-gray-900 dark:text-white">Huy hiệu của bạn</h2>' +
        '<p class="text-xs text-gray-500 dark:text-gray-400">Đã mở khóa ' + o.earned.length + '/' + DEFS.length + '</p></div>' +
        '<button type="button" data-eh-badges class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Xem tất cả</button>' +
      '</div>' +
      '<div class="grid grid-cols-3 sm:grid-cols-6 gap-1">' + show.map(function (e) { return tile(e.d, X, s); }).join('') + '</div>' +
      nextHTML + '</div>';
  }

  function modalBody(s, X) {
    var groups = [];
    DEFS.forEach(function (d) { if (groups.indexOf(d.g) < 0) groups.push(d.g); });
    return groups.map(function (g) {
      return '<section><h4 class="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">' + esc(g) + '</h4>' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
        DEFS.filter(function (d) { return d.g === g; }).map(function (d) {
          var earned = has(s.badges, d.id), p = prog(d, X), col = COL[d.c];
          return '<div class="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 ' + (earned ? '' : 'opacity-90') + '">' +
            '<span class="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg ' + (earned ? col[0] : LOCKED) + '"><i class="fa-solid ' + (earned ? d.icon : 'fa-lock') + (earned ? '' : ' text-sm') + '"></i></span>' +
            '<div class="min-w-0 flex-1"><p class="text-sm font-bold ' + (earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400') + '">' + esc(d.name) + '</p>' +
            '<p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">' + esc(d.desc) + '</p>' +
            (earned
              ? '<p class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1"><i class="fa-solid fa-check mr-1"></i>Đã mở khóa' + (s.badges[d.id] ? ' ngày ' + vn(s.badges[d.id]) : '') + '</p>'
              : '<div class="flex items-center gap-2 mt-1.5"><div class="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-slate-600 overflow-hidden"><div class="h-full rounded-full ' + col[1] + '" style="width:' + Math.round(p.ratio * 100) + '%"></div></div><span class="text-[10px] text-gray-400 dark:text-slate-500">' + num(p.cur) + '/' + num(p.max) + '</span></div>') +
            '</div></div>';
        }).join('') + '</div></section>';
    }).join('');
  }

  function ensureModal() {
    if ($('badgeModal')) return $('badgeModal');
    var m = document.createElement('div');
    m.id = 'badgeModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'badgeModalTitle');
    m.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    m.innerHTML =
      '<div class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 dark:border-slate-700">' +
        '<div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-700">' +
          '<h3 id="badgeModalTitle" class="text-lg font-bold"><i class="fa-solid fa-award text-amber-500 mr-2"></i>Tất cả huy hiệu</h3>' +
          '<button type="button" data-eh-close aria-label="Đóng hộp thoại" class="text-gray-400 hover:text-gray-600 dark:hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button>' +
        '</div>' +
        '<div id="badgeModalBody" class="overflow-y-auto p-6 space-y-6"></div>' +
      '</div>';
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-eh-close]')) m.classList.add('hidden'); });
    document.body.appendChild(m);
    return m;
  }
  function openModal() {
    var m = ensureModal();
    lastModal = '';
    run(false);                       // vẽ nội dung mới nhất vào hộp thoại
    m.classList.remove('hidden');
  }

  function render(s, info, X) {
    var chip = $('streakChip');
    if (chip) {
      chip.innerHTML = '<span class="' + (info.cur > 0 ? 'eh-flame' : 'eh-flame eh-flame-off') + '" aria-hidden="true">🔥</span><span>' + info.cur + '</span>';
      chip.setAttribute('aria-label', 'Chuỗi ' + info.cur + ' ngày' + (info.done ? ', hôm nay đã hoàn thành' : ', hôm nay chưa có hoạt động'));
      chip.title = 'Chuỗi ' + info.cur + ' ngày' + (info.done ? '' : ' (hôm nay chưa điểm danh)');
      chip.classList.remove('hidden');
    }
    var sec = $('gamifySection');
    if (sec) {
      var html = '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' + streakCard(s, info) + badgeCard(s, X) + '</div>';
      if (html !== lastHTML) { sec.innerHTML = html; lastHTML = html; }
    }
    var mb = $('badgeModalBody');
    if (mb) {
      var mh = modalBody(s, X);
      if (mh !== lastModal) { mb.innerHTML = mh; lastModal = mh; }
    }
  }

  /* ---------- Sự kiện ---------- */
  var timer = null, pendLog = false;
  /* Gộp nhiều lần ghi liên tiếp, tránh chạy giữa chừng khi trang khác đang lưu.
     Nếu trong số đó có một lần cần ghi nhận hoạt động thì lần chạy gộp vẫn ghi nhận. */
  function later(log) {
    pendLog = pendLog || !!log;
    clearTimeout(timer);
    timer = setTimeout(function () { var l = pendLog; pendLog = false; run(l); }, 60);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-eh-checkin],[data-eh-badges],#streakChip');
    if (!t) return;
    if (t.hasAttribute('data-eh-checkin')) {
      if (t.disabled) return;
      run(true);
      var i = streak(load());
      EduHub.toast('Đã điểm danh! Chuỗi hiện tại: ' + i.cur + ' ngày 🔥', 'success');
    } else if (t.id === 'streakChip') {
      if (typeof window.switchTab === 'function') window.switchTab('dashboard');
      var more = $('moreSection'); if (more) more.open = true;
      var sec = $('gamifySection');
      if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else openModal();
  });

  /* Lưu thay đổi ở môn học / TKB / bài tập / điểm / lịch thi = một hoạt động học tập */
  document.addEventListener('eduhub:data', function (e) {
    var k = e.detail && e.detail.key;
    if (!k || !DATA_BASES.some(function (b) { return EduHub.userKey(b) === k; })) return;
    later(true);
  });
  /* Tab khác đã ghi: chỉ cập nhật hiển thị, không tự tính thêm hoạt động (tab kia đã tính) */
  window.addEventListener('storage', function (e) {
    if (e.key && e.key !== KEY() && !DATA_BASES.some(function (b) { return EduHub.userKey(b) === e.key; })) return;
    later(false);
  });
  document.addEventListener('eduhub:theme', function () { lastHTML = ''; lastModal = ''; run(false); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) run(false); });
  window.addEventListener('focus', function () { run(false); });
  setInterval(function () { run(false); }, 60000);   // qua nửa đêm: cập nhật ngày và chuỗi

  window.EduHubGamify = {
    log: function () { run(true); },
    refresh: function () { run(false); },
    openBadges: openModal,
    badges: DEFS
  };

  injectStyle();
  run(false);
})();
