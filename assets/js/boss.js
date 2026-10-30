/* ============================================================
   EduHub - Boss môn học (boss.js)
   Nạp SAU gamify.js, ở cuối <body> của index.html.

   Mỗi môn học là một "boss". Thanh máu = phần việc CHƯA xong của môn đó:
     - mỗi bài tập của môn (đã nộp = xong)
     - mỗi "phần ôn tập" người dùng tự thêm (đã tích = xong)
   Bài tập quá hạn chưa nộp  -> boss nổi giận.
   Có lịch thi của môn       -> hiện đếm ngược "trận cuối".
   Hết máu                   -> boss bị hạ gục (được ghi nhớ).

   Dữ liệu: eduhub_boss_<email>
     chapters  { khóa-môn: [ {id, t, d} ] }   (t = tên phần ôn, d = đã xong)
     defeated  { khóa-môn: 'YYYY-MM-DD' | '' } ('' = đã hạ từ trước khi có tính năng)
     init      false cho tới lần chạy đầu tiên (hạ gục lần đầu ghi im lặng)
   Môn khớp bài tập / lịch thi theo TÊN (không phân biệt hoa thường, bỏ khoảng trắng thừa).
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
  var KEY = function () { return EduHub.userKey('eduhub_boss'); };
  var DAY = 864e5, MAX_CH = 30, DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var FACES = ['🐉', '👹', '🦑', '🧌', '🐙', '🦖', '👾', '🧟', '🦂', '🐺'];
  var norm = function (s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); };
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var todayStr = function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var vn = function (s) { return s ? s.split('-').reverse().join('/') : ''; };
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  /* ---------- Dữ liệu ---------- */
  function load() {
    var s = EduHub.get(KEY(), null), b = { init: false, chapters: {}, defeated: {} };
    if (!s || typeof s !== 'object' || Array.isArray(s)) return b;
    b.init = !!s.init;
    if (s.chapters && typeof s.chapters === 'object') {
      Object.keys(s.chapters).slice(0, 300).forEach(function (k) {
        var a = s.chapters[k];
        if (!Array.isArray(a)) return;
        b.chapters[k] = a.slice(0, MAX_CH).filter(function (c) { return c && typeof c.id === 'string' && typeof c.t === 'string'; })
          .map(function (c) { return { id: c.id, t: c.t.slice(0, 80), d: !!c.d }; });
      });
    }
    if (s.defeated && typeof s.defeated === 'object') {
      Object.keys(s.defeated).slice(0, 300).forEach(function (k) {
        var v = s.defeated[k];
        if (typeof v === 'string' && (v === '' || DATE_RE.test(v))) b.defeated[k] = v;
      });
    }
    return b;
  }
  function arr(key) { var v = EduHub.get(EduHub.userKey(key), []); return Array.isArray(v) ? v : []; }
  var state = null;
  function save() { state.v = 1; state.init = true; return EduHub.set(KEY(), state); }
  /* Ghi "hệ thống" (khởi tạo, ghi nhận boss gục): KHÔNG phát sự kiện eduhub:data,
     vì chỉ mở trang mà bị tính là hoạt động học thì chuỗi ngày sẽ sai. */
  function silentSave() {
    if (EduHub.isStale()) return false;
    state.v = 1; state.init = true;
    try { localStorage.setItem(KEY(), JSON.stringify(state)); return true; } catch (e) { return false; }
  }

  /* ---------- Tính trạng thái từng boss ---------- */
  function build() {
    var subjects = arr('eduhub_subjects'), asg = arr('eduhub_assignments'), exams = arr('eduhub_exams');
    var now = Date.now(), today = todayStr(), seen = {};
    return subjects.filter(function (s) { return s && s.name; }).map(function (s) {
      var k = norm(s.name);
      if (seen[k]) return null;       // hai môn trùng tên chỉ tính một boss
      seen[k] = 1;
      var mine = asg.filter(function (a) { return norm(a.subject) === k; });
      var chs = state.chapters[k] || [];
      var aDone = mine.filter(function (a) { return a.status === 'submitted'; }).length;
      var cDone = chs.filter(function (c) { return c.d; }).length;
      var total = mine.length + chs.length, done = aDone + cDone;
      var late = mine.filter(function (a) { return a.status !== 'submitted' && new Date(a.due).getTime() < now; }).length;
      var nextExam = exams.filter(function (e) { return norm(e.subject) === k && e.date >= today; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0] || null;
      var days = null;
      if (nextExam) {
        var p = nextExam.date.split('-');
        days = Math.round((new Date(+p[0], +p[1] - 1, +p[2], 12) - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12)) / DAY);
      }
      var hp = total ? Math.round((1 - done / total) * 100) : 100;
      var mode = !total ? 'sleep' : done === total ? 'dead' : late ? 'rage' : (days != null && days <= 7) ? 'danger' : 'alive';
      return { key: k, name: s.name, color: /^#[0-9a-fA-F]{6}$/.test(s.color) ? s.color : '#2563eb',
        face: FACES[hash(k) % FACES.length], chs: chs, aTotal: mine.length, aDone: aDone, late: late, total: total, done: done,
        hp: hp, mode: mode, exam: nextExam, days: days };
    }).filter(Boolean);
  }

  /* Ghi nhận boss bị hạ gục (và thông báo). Lần chạy đầu: ghi im lặng. */
  function recordKills(list) {
    var changed = false, fresh = [], first = !state.init;
    list.forEach(function (b) {
      if (b.mode === 'dead' && !Object.prototype.hasOwnProperty.call(state.defeated, b.key)) {
        state.defeated[b.key] = first ? '' : todayStr();
        changed = true;
        if (!first) fresh.push(b);
      }
    });
    if (changed || first) {
      if (silentSave() !== false) fresh.forEach(function (b) { EduHub.toast('🏆 Bạn đã hạ gục boss "' + b.name + '"!', 'success'); });
    }
  }

  /* ---------- Giao diện ---------- */
  var openSet = {};   // các boss đang mở danh sách phần ôn (giữ nguyên khi vẽ lại)
  var MODE = {
    sleep:  { t: 'Đang ngủ',     c: 'text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-slate-300', hint: 'Chưa có nhiệm vụ. Thêm bài tập hoặc phần ôn tập để đánh thức boss.' },
    alive:  { t: 'Sẵn sàng',     c: 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300' },
    danger: { t: 'Sắp đại chiến', c: 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300' },
    rage:   { t: 'Nổi giận',     c: 'text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300' },
    dead:   { t: 'Đã bị hạ',     c: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300' }
  };
  function barColor(b) { return b.mode === 'rage' ? 'bg-red-500' : b.mode === 'danger' ? 'bg-amber-500' : b.mode === 'dead' ? 'bg-emerald-500' : 'bg-rose-500'; }

  function card(b) {
    var m = MODE[b.mode], wasDefeated = Object.prototype.hasOwnProperty.call(state.defeated, b.key);
    var face = b.mode === 'dead' ? '🏆' : b.mode === 'sleep' ? '😴' : b.face;
    var line = b.total
      ? 'Còn <b>' + (b.total - b.done) + '</b>/' + b.total + ' nhiệm vụ' + (b.late ? ' · <span class="text-red-600 dark:text-red-400 font-semibold">' + b.late + ' bài quá hạn</span>' : '')
      : esc(m.hint);
    var exam = b.exam
      ? '<p class="text-[11px] mt-1 ' + (b.days <= 7 && b.mode !== 'dead' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-gray-500 dark:text-gray-400') + '"><i class="fa-solid fa-flag-checkered mr-1"></i>Trận cuối ' + (b.days === 0 ? '<b>hôm nay</b>' : 'sau <b>' + b.days + '</b> ngày') + ' (' + vn(b.exam.date) + ')</p>'
      : '';
    var chs = b.chs.map(function (c) {
      return '<li class="flex items-center gap-2 py-1">' +
        '<input type="checkbox" data-bs-chk="' + esc(b.key) + '" data-id="' + esc(c.id) + '"' + (c.d ? ' checked' : '') + ' class="w-4 h-4 accent-rose-500 shrink-0" aria-label="Hoàn thành: ' + esc(c.t) + '">' +
        '<span class="flex-1 text-xs ' + (c.d ? 'line-through text-gray-400' : '') + '">' + esc(c.t) + '</span>' +
        '<button type="button" data-bs-del="' + esc(b.key) + '" data-id="' + esc(c.id) + '" class="text-gray-300 hover:text-red-500" aria-label="Xóa phần ôn ' + esc(c.t) + '"><i class="fa-solid fa-xmark text-xs"></i></button></li>';
    }).join('');
    return '<div class="rounded-2xl border border-gray-100 dark:border-slate-700 p-4' + (b.mode === 'rage' ? ' eh-boss-rage' : '') + '">' +
      '<div class="flex items-center gap-3">' +
        '<span class="eh-boss-face w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl" style="background:' + b.color + '22" aria-hidden="true">' + face + '</span>' +
        '<div class="min-w-0 flex-1"><div class="flex items-center gap-2 flex-wrap"><h4 class="text-sm font-bold truncate">' + esc(b.name) + '</h4>' +
        '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full ' + m.c + '">' + m.t + '</span>' +
        (wasDefeated && b.mode !== 'dead' ? '<span class="text-[10px] text-gray-400" title="Đã từng bị hạ, có nhiệm vụ mới nên hồi sinh">♻ hồi sinh</span>' : '') + '</div>' +
        '<p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">' + line + '</p>' + exam + '</div></div>' +
      '<div class="mt-3 flex items-center gap-2"><div class="flex-1 h-3 rounded-full bg-gray-200 dark:bg-slate-600 overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + b.hp + '" aria-label="Máu boss ' + esc(b.name) + '"><div class="h-full rounded-full transition-all duration-500 ' + barColor(b) + '" style="width:' + b.hp + '%"></div></div>' +
        '<span class="text-[11px] font-bold w-14 text-right tabular-nums">' + (b.total ? b.hp + '% HP' : '—') + '</span></div>' +
      '<details class="mt-3" data-bs-det="' + esc(b.key) + '"' + (openSet[b.key] ? ' open' : '') + '>' +
        '<summary class="text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer select-none">Phần ôn tập (' + b.chs.filter(function (c) { return c.d; }).length + '/' + b.chs.length + ')</summary>' +
        '<ul class="mt-2">' + chs + '</ul>' +
        (b.chs.length < MAX_CH
          ? '<form data-bs-add="' + esc(b.key) + '" class="flex gap-2 mt-2"><input type="text" maxlength="80" placeholder="VD: Chương 3 - Cây nhị phân" aria-label="Thêm phần ôn tập cho ' + esc(b.name) + '" class="flex-1 min-w-0 px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-rose-400"><button type="submit" class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white">Thêm</button></form>'
          : '<p class="text-[11px] text-gray-400 mt-2">Đã đạt tối đa ' + MAX_CH + ' phần ôn.</p>') +
      '</details></div>';
  }

  var lastHTML = '';
  function render() {
    var sec = $('bossSection');
    if (!sec) return;
    state = load();
    var list = build();
    recordKills(list);
    list.sort(function (a, b) {
      var w = { rage: 0, danger: 1, alive: 2, sleep: 3, dead: 4 };
      return w[a.mode] - w[b.mode] || (a.days == null ? 1e9 : a.days) - (b.days == null ? 1e9 : b.days);
    });
    var kills = Object.keys(state.defeated).length;
    var html;
    if (!list.length) {
      html = '<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">' +
        '<h3 class="font-bold text-lg mb-1"><i class="fa-solid fa-dragon text-rose-500 mr-2"></i>Boss môn học</h3>' +
        '<p class="text-xs text-gray-500 dark:text-gray-400"><a href="index.html?tab=courses&add=1" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Thêm môn học</a> để có boss đầu tiên.</p></div>';
    } else {
      html = '<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">' +
        '<div class="flex items-start justify-between gap-3 mb-4 flex-wrap"><h3 class="font-bold text-lg"><i class="fa-solid fa-dragon text-rose-500 mr-2"></i>Boss môn học</h3>' +
        '<span class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"><i class="fa-solid fa-trophy mr-1"></i>Đã hạ ' + kills + '/' + list.length + ' boss</span></div>' +
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">' + list.map(card).join('') + '</div></div>';
    }
    if (html !== lastHTML) { sec.innerHTML = html; lastHTML = html; }
  }

  function injectStyle() {
    if ($('ehBossStyle')) return;
    var st = document.createElement('style');
    st.id = 'ehBossStyle';
    st.textContent = '@keyframes ehBossShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px) rotate(-3deg)}75%{transform:translateX(2px) rotate(3deg)}}' +
      '.eh-boss-rage{border-color:#fca5a5!important}.eh-boss-rage .eh-boss-face{animation:ehBossShake .5s infinite}' +
      '@media (prefers-reduced-motion:reduce){.eh-boss-rage .eh-boss-face{animation:none}}';
    document.head.appendChild(st);
  }

  /* ---------- Sự kiện ---------- */
  function mutate(fn) {
    state = load();
    fn();
    lastHTML = '';
    save();
    render();
  }
  document.addEventListener('submit', function (e) {
    var f = e.target.closest && e.target.closest('[data-bs-add]');
    if (!f) return;
    e.preventDefault();
    var k = f.getAttribute('data-bs-add'), inp = f.querySelector('input'), t = inp.value.trim();
    if (!t) return;
    openSet[k] = true;
    mutate(function () {
      var a = state.chapters[k] = state.chapters[k] || [];
      if (a.length < MAX_CH) a.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t: t.slice(0, 80), d: false });
    });
  });
  document.addEventListener('change', function (e) {
    var c = e.target.closest && e.target.closest('[data-bs-chk]');
    if (!c) return;
    var k = c.getAttribute('data-bs-chk'), id = c.getAttribute('data-id'), on = c.checked;
    openSet[k] = true;
    mutate(function () { (state.chapters[k] || []).forEach(function (x) { if (x.id === id) x.d = on; }); });
  });
  document.addEventListener('click', function (e) {
    var d = e.target.closest && e.target.closest('[data-bs-del]');
    if (!d) return;
    var k = d.getAttribute('data-bs-del'), id = d.getAttribute('data-id');
    openSet[k] = true;
    mutate(function () { state.chapters[k] = (state.chapters[k] || []).filter(function (x) { return x.id !== id; }); });
  });
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d && d.getAttribute && d.getAttribute('data-bs-det')) openSet[d.getAttribute('data-bs-det')] = d.open;
  }, true);

  var timer = null;
  function later() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var ae = document.activeElement, sec = $('bossSection');
      if (ae && sec && sec.contains(ae) && ae.tagName === 'INPUT' && ae.type === 'text' && ae.value) return;   // đang gõ dở
      render();
    }, 80);
  }
  var BASES = ['eduhub_assignments', 'eduhub_subjects', 'eduhub_exams', 'eduhub_boss'];
  document.addEventListener('eduhub:data', function (e) {
    var k = e.detail && e.detail.key;
    if (k && BASES.some(function (b) { return EduHub.userKey(b) === k; })) later();
  });
  window.addEventListener('storage', function (e) {
    if (!e.key || BASES.some(function (b) { return e.key === EduHub.userKey(b); })) later();
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) later(); });
  window.addEventListener('focus', later);
  setInterval(later, 60000);   // qua nửa đêm: cập nhật đếm ngược thi

  window.EduHubBoss = { refresh: render };
  injectStyle();
  render();
})();
