/* ============================================================
   EduHub - Máy tính ngược mục tiêu điểm (goal.js)
   Nạp SAU records.js, ở cuối <body> của index.html. Hiển thị trong tab "Điểm số".

   Người dùng đặt mục tiêu GPA (hệ 4). App tính NGƯỢC: các môn còn lại cần đạt bao nhiêu,
   và có thanh trượt để xem GPA thay đổi ngay khi "giả định" điểm từng môn.

   Nguồn dữ liệu (chỉ đọc): eduhub_records (điểm các kỳ, tổng tín chỉ, cách tính học lại),
   eduhub_subjects (môn đang học). Môn đã có điểm trong records thì KHÔNG tính là môn còn lại.
   Dữ liệu ghi: eduhub_goal_<email> = { target }
   Công thức: cần trung bình hệ 4 trên R tín chỉ còn lại = (mục tiêu x (C + R) - tổng điểm hiện có) / R
   Thang quy đổi giống records.js (g4 / chữ).
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
  var KEY = function () { return EduHub.userKey('eduhub_goal'); };
  var norm = function (s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); };
  var PRESETS = [[2.5, 'Khá'], [3.2, 'Giỏi'], [3.6, 'Xuất sắc']];

  /* ---------- Thang điểm (giống records.js) ---------- */
  var g4 = function (g) { return g >= 9 ? 4 : g >= 8.5 ? 3.7 : g >= 8 ? 3.5 : g >= 7 ? 3 : g >= 6.5 ? 2.5 : g >= 5.5 ? 2 : g >= 5 ? 1.5 : g >= 4 ? 1 : 0; };
  var letter = function (g) { return g >= 9 ? 'A+' : g >= 8.5 ? 'A' : g >= 8 ? 'B+' : g >= 7 ? 'B' : g >= 6.5 ? 'C+' : g >= 5.5 ? 'C' : g >= 5 ? 'D+' : g >= 4 ? 'D' : 'F'; };
  var rank = function (g) { return g >= 3.6 ? 'Xuất sắc' : g >= 3.2 ? 'Giỏi' : g >= 2.5 ? 'Khá' : g >= 2 ? 'Trung bình' : 'Yếu'; };
  var STEPS = [[0, 0], [1, 4], [1.5, 5], [2, 5.5], [2.5, 6.5], [3, 7], [3.5, 8], [3.7, 8.5], [4, 9]];
  /* điểm hệ 10 thấp nhất mà quy ra hệ 4 >= req */
  function minGrade(req) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i][0] >= req - 1e-9) return STEPS[i][1];
    return 10;
  }
  var f2 = function (n) { return n.toFixed(2); };

  /* ---------- Đọc dữ liệu ---------- */
  function readTarget() {
    var g = EduHub.get(KEY(), null), t = g && typeof g === 'object' ? +g.target : NaN;
    return isFinite(t) && t >= 0.5 && t <= 4 ? t : 3.2;
  }
  function semKey(s, i) { return (s.year != null && s.term != null) ? s.year * 10 + s.term : -1e9 + i; }
  function model() {
    var rec = EduHub.get(EduHub.userKey('eduhub_records'), null);
    var sems = rec && Array.isArray(rec.sems) ? rec.sems : [], retake = rec && rec.retake || 'best';
    var total = rec && +rec.total > 0 ? +rec.total : 130;
    var all = [];
    sems.map(function (s, i) { return { s: s, k: semKey(s, i) }; }).sort(function (a, b) { return a.k - b.k; })
      .forEach(function (x) { (x.s.subs || []).forEach(function (m) { all.push(m); }); });
    var keep = all;
    if (retake !== 'all') {
      var pick = {};
      all.forEach(function (m) {
        var k = norm(m.n), cur = pick[k];
        if (!cur || retake === 'latest' || m.g >= cur.g) pick[k] = m;
      });
      keep = Object.keys(pick).map(function (k) { return pick[k]; });
    }
    var C = 0, S4 = 0;
    keep.forEach(function (m) { C += m.c; S4 += m.c * g4(m.g); });
    var scored = {};
    all.forEach(function (m) { scored[norm(m.n)] = 1; });
    var subj = EduHub.get(EduHub.userKey('eduhub_subjects'), []);
    var seen = {}, cur = [];
    (Array.isArray(subj) ? subj : []).forEach(function (s) {
      var k = norm(s && s.name);
      if (!k || scored[k] || seen[k] || !(+s.credits > 0)) return;
      seen[k] = 1;
      cur.push({ key: k, name: s.name, c: +s.credits });
    });
    var R1 = cur.reduce(function (a, s) { return a + s.c; }, 0);
    var R2 = Math.max(0, total - C - R1);
    return { C: C, S4: S4, total: total, cur: cur, R1: R1, R2: R2 };
  }

  /* ---------- Lời giải ngược ---------- */
  function need(M, T, R) {
    if (!(R > 0)) return null;
    return (T * (M.C + R) - M.S4) / R;
  }
  function needHtml(req, label) {
    if (req == null) return '';
    var body;
    if (req <= 0) body = '<span class="text-emerald-600 dark:text-emerald-400 font-semibold">Đã chắc chắn đạt mục tiêu</span>, kể cả khi các môn còn lại chỉ ở mức thấp nhất.';
    else if (req > 4 + 1e-9) {
      body = '<span class="text-red-600 dark:text-red-400 font-semibold">Không thể đạt mục tiêu này</span> trong ' + label + ' (cần trung bình hệ 4 là ' + f2(req) + ' &gt; 4,00). Hãy hạ mục tiêu hoặc tính cả các kỳ sau.';
    } else {
      var g = minGrade(req);
      body = 'Cần trung bình hệ 4 ≥ <b>' + f2(req) + '</b>. Nếu mọi môn đạt như nhau: ít nhất <b>' + (g % 1 ? g.toFixed(1) : g) + '</b>/10 (điểm chữ <b>' + letter(g) + '</b>).';
    }
    return '<div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/40"><p class="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1">' + esc(label) + '</p><p class="text-xs leading-relaxed">' + body + '</p></div>';
  }

  /* ---------- Giao diện ---------- */
  var vals = {}, touched = {}, restVal = null, restTouched = false, ctx = null;

  function defaultFor(req) { return req == null || req <= 0 ? 7 : req > 4 ? 10 : Math.max(4, minGrade(req)); }

  function render() {
    var sec = $('goalSection');
    if (!sec) return;
    var M = model(), T = readTarget();
    ctx = { M: M, T: T };
    var BOX = 'bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm';
    var head = '<div class="flex items-start justify-between gap-3 flex-wrap mb-4"><div><h3 class="font-bold text-lg">🎯 Mục tiêu GPA</h3><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chọn GPA mong muốn (hệ 4) – EduHub tính ngược điểm cần đạt ở các tín chỉ còn lại.</p></div></div>';
    if (!(M.C + M.R1 + M.R2 > 0) || (M.C === 0 && M.R1 === 0)) {
      sec.innerHTML = '<div class="' + BOX + '">' + head + '<p class="text-xs text-gray-500 dark:text-gray-400">Chưa có dữ liệu. Hãy nhập điểm các kỳ đã học hoặc <a href="index.html?tab=courses&add=1" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">thêm môn đang học</a>.</p></div>';
      return;
    }
    var presets = PRESETS.map(function (p) {
      var on = Math.abs(p[0] - T) < 1e-9;
      return '<button type="button" data-gl-t="' + p[0] + '" aria-pressed="' + on + '" class="px-4 py-1.5 text-xs font-medium rounded-full border ' + (on ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700') + '">' + p[1] + ' ' + p[0].toFixed(1) + '</button>';
    }).join('');
    var custom = '<label class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">Tự đặt<input id="glCustom" type="number" min="0.5" max="4" step="0.05" value="' + T + '" class="w-20 px-2 py-1.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-xs outline-none focus:ring-2 focus:ring-blue-400"></label>';

    var r1 = need(M, T, M.R1), rAll = need(M, T, M.R1 + M.R2);
    var base = '<p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Hiện có <b>' + M.C + '</b> tín chỉ, GPA hệ 4 hiện tại <b>' + (M.C ? f2(M.S4 / M.C) : '—') + '</b>' +
      (M.R1 ? ' · đang học <b>' + M.R1 + '</b> tín chỉ chưa có điểm' : '') + (M.R2 ? ' · còn <b>' + M.R2 + '</b> tín chỉ sau đó (tổng ' + M.total + ' tín chỉ)' : '') + '.</p>';
    var needs = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">' +
      (M.R1 ? needHtml(r1, 'Hết kỳ này (' + M.R1 + ' TC)') : '') +
      (M.R2 ? needHtml(rAll, 'Khi tốt nghiệp (' + (M.R1 + M.R2) + ' TC còn lại)') : '') + '</div>';

    var sliders = '';
    if (M.R1 || M.R2) {
      sliders = '<h4 class="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Thử giả định điểm</h4><div class="space-y-3">';
      M.cur.forEach(function (s, i) {
        if (!touched[s.key]) vals[s.key] = defaultFor(r1);
        sliders += slider('glS' + i, s.name + ' (' + s.c + ' TC)', vals[s.key], 'data-gl-sub="' + esc(s.key) + '"');
      });
      if (M.R2) {
        if (!restTouched) restVal = defaultFor(rAll);
        sliders += slider('glRest', 'Các môn sau đó (' + M.R2 + ' TC)', restVal, 'data-gl-rest="1"');
      }
      sliders += '</div>' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">' +
        (M.R1 ? '<div id="glOut1" class="p-4 rounded-2xl border border-gray-100 dark:border-slate-700"></div>' : '') +
        (M.R2 ? '<div id="glOut2" class="p-4 rounded-2xl border border-gray-100 dark:border-slate-700"></div>' : '') + '</div>';
    }
    sec.innerHTML = '<div class="' + BOX + '">' + head +
      '<div class="flex items-center gap-2 flex-wrap mb-4"><span class="text-xs font-semibold mr-1">Mục tiêu:</span>' + presets + custom + '</div>' + base + needs + sliders + '</div>';
    update();
  }

  function slider(id, label, v, attr) {
    return '<div><div class="flex justify-between text-xs mb-1"><label for="' + id + '" class="font-medium truncate pr-2">' + esc(label) + '</label><span id="' + id + 'v" class="font-bold tabular-nums shrink-0"></span></div>' +
      '<input id="' + id + '" type="range" min="0" max="10" step="0.1" value="' + v + '" ' + attr + ' class="w-full accent-blue-600"></div>';
  }

  function outCard(title, gpa, T) {
    var ok = gpa + 0.005 >= T, diff = Math.abs(gpa - T);
    return '<p class="text-[11px] font-bold uppercase tracking-wide text-gray-400">' + esc(title) + '</p>' +
      '<p class="text-2xl font-extrabold tabular-nums mt-1 ' + (ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400') + '">' + f2(gpa) + ' <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">' + rank(gpa) + '</span></p>' +
      '<p class="text-[11px] mt-0.5 ' + (ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400') + '">' + (ok ? '✓ Đạt mục tiêu' + (diff > 0.005 ? ' (+' + f2(diff) + ')' : '') : 'Còn thiếu ' + f2(diff) + ' so với mục tiêu ' + T.toFixed(2)) + '</p>';
  }

  /* Cập nhật số liệu khi kéo thanh trượt (KHÔNG vẽ lại để không làm đứt thao tác kéo) */
  function update() {
    if (!ctx) return;
    var M = ctx.M, T = ctx.T, add = 0;
    M.cur.forEach(function (s, i) {
      var v = vals[s.key]; add += s.c * g4(v);
      var o = $('glS' + i + 'v'); if (o) o.textContent = v.toFixed(1) + ' (' + letter(v) + ')';
    });
    var o = $('glRestv'); if (o && restVal != null) o.textContent = restVal.toFixed(1) + ' (' + letter(restVal) + ')';
    var a = $('glOut1'); if (a && M.R1) a.innerHTML = outCard('GPA hệ 4 sau kỳ này', (M.S4 + add) / (M.C + M.R1), T);
    var b = $('glOut2'); if (b && M.R2) b.innerHTML = outCard('GPA hệ 4 khi tốt nghiệp', (M.S4 + add + M.R2 * g4(restVal)) / (M.C + M.R1 + M.R2), T);
  }

  function setTarget(t) {
    t = Math.min(4, Math.max(0.5, Math.round(t * 100) / 100));
    if (!isFinite(t)) return;
    touched = {}; restTouched = false;       // đổi mục tiêu thì thanh trượt về mức gợi ý mới
    EduHub.set(KEY(), { v: 1, target: t });
    render();                                 // vẽ ngay (sự kiện dữ liệu bị bỏ qua khi ô nhập còn đang chọn)
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-gl-t]');
    if (b) setTarget(+b.getAttribute('data-gl-t'));
  });
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'glCustom') { var n = parseFloat(e.target.value); if (isFinite(n)) setTarget(n); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    if (t.hasAttribute('data-gl-sub')) { var k = t.getAttribute('data-gl-sub'); vals[k] = +t.value; touched[k] = true; update(); }
    else if (t.hasAttribute('data-gl-rest')) { restVal = +t.value; restTouched = true; update(); }
  });

  var timer = null;
  function later() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var ae = document.activeElement, sec = $('goalSection');
      if (ae && sec && sec.contains(ae) && (ae.type === 'range' || ae.type === 'number')) return;   // đang thao tác
      render();
    }, 80);
  }
  var BASES = ['eduhub_records', 'eduhub_subjects', 'eduhub_goal'];
  document.addEventListener('eduhub:data', function (e) {
    var k = e.detail && e.detail.key;
    if (k && BASES.some(function (b) { return EduHub.userKey(b) === k; })) later();
  });
  window.addEventListener('storage', function (e) {
    if (!e.key || BASES.some(function (b) { return e.key === EduHub.userKey(b); })) later();
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) later(); });

  window.EduHubGoal = { refresh: render };
  render();
})();
