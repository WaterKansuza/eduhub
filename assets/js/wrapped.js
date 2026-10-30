/* ============================================================
   EduHub - Kỳ học Wrapped (wrapped.js)
   Nạp SAU boss.js, ở cuối <body> của index.html.

   Tổng kết học tập dạng chuỗi thẻ (bấm để lật) + một thẻ ảnh PNG để chia sẻ.
   Chỉ ĐỌC dữ liệu có sẵn, không lưu gì thêm, không gửi gì đi đâu:
     eduhub_gamify (ngày học), eduhub_assignments (giờ nộp, hạn nộp), eduhub_records (điểm),
     eduhub_boss (boss đã hạ), eduhub_exams, eduhub_subjects.
   Khoảng thời gian: "Toàn bộ" hoặc "120 ngày qua" (xấp xỉ một học kỳ). Điểm luôn lấy học kỳ gần nhất.
   Thẻ nào thiếu dữ liệu thì tự bỏ qua.
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
  var DAY = 864e5, H = 36e5, PERIOD_DAYS = 120;
  var WD = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var fmtD = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var parseD = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); };
  var arr = function (k) { var v = EduHub.get(EduHub.userKey(k), []); return Array.isArray(v) ? v : []; };
  var period = 'term', cards = [], idx = 0, shareItems = [], persona = null;

  /* ---------- Tính số liệu ---------- */
  function stats() {
    var now = new Date(), since = period === 'term' ? fmtD(new Date(now.getTime() - PERIOD_DAYS * DAY)) : '0000-00-00';
    var sinceMs = period === 'term' ? now.getTime() - PERIOD_DAYS * DAY : 0;
    var g = EduHub.get(EduHub.userKey('eduhub_gamify'), null) || {};
    var days = (Array.isArray(g.days) ? g.days : []).filter(function (d) { return typeof d === 'string' && d >= since; });
    var frozen = (Array.isArray(g.frozen) ? g.frozen : []).filter(function (d) { return typeof d === 'string' && d >= since; });
    // chuỗi dài nhất trong khoảng (ngày đóng băng giữ chuỗi nhưng không cộng thêm)
    var set = {}; days.concat(frozen).forEach(function (d) { set[d] = 1; });
    var fz = {}; frozen.forEach(function (d) { fz[d] = 1; });
    var all = Object.keys(set).sort(), longest = 0, run = 0, prev = null;
    all.forEach(function (d) {
      var gap = prev ? Math.round((parseD(d) - parseD(prev)) / DAY) : 0;
      run = prev && gap === 1 ? run + (fz[d] ? 0 : 1) : (fz[d] ? 0 : 1);
      if (run > longest) longest = run;
      prev = d;
    });
    var wd = [0, 0, 0, 0, 0, 0, 0];
    days.forEach(function (d) { wd[parseD(d).getDay()]++; });
    var topWd = wd.indexOf(Math.max.apply(null, wd));

    var subs = arr('eduhub_assignments').filter(function (a) {
      return a && a.status === 'submitted' && +a.submittedAt >= sinceMs && +a.submittedAt > 0 && !isNaN(new Date(a.due).getTime());
    });
    var early = subs.map(function (a) { return (new Date(a.due).getTime() - a.submittedAt) / H; }).sort(function (a, b) { return a - b; });
    var med = early.length ? (early.length % 2 ? early[(early.length - 1) / 2] : (early[early.length / 2 - 1] + early[early.length / 2]) / 2) : null;
    var onTime = subs.filter(function (a) { return a.submittedAt <= new Date(a.due).getTime(); }).length;
    var night = 0, morning = 0;
    subs.forEach(function (a) { var h = new Date(a.submittedAt).getHours(); if (h >= 22 || h < 4) night++; else if (h >= 5 && h < 10) morning++; });

    var rec = EduHub.get(EduHub.userKey('eduhub_records'), null), sems = rec && Array.isArray(rec.sems) ? rec.sems : [];
    var ord = sems.map(function (s, i) { return { s: s, k: (s.year != null && s.term != null) ? s.year * 10 + s.term : -1e9 + i }; })
      .sort(function (a, b) { return a.k - b.k; }).map(function (x) { return x.s; }).filter(function (s) { return s.subs && s.subs.length; });
    var sem = function (s) {
      if (!s) return null;
      var c = 0, t = 0; s.subs.forEach(function (m) { c += m.c; t += m.c * m.g; });
      var top = s.subs.reduce(function (a, m) { return !a || m.g > a.g ? m : a; }, null);
      return { name: s.name, gpa10: c ? t / c : null, top: top, c: c };
    };
    var last = sem(ord[ord.length - 1]), before = sem(ord[ord.length - 2]);

    var boss = EduHub.get(EduHub.userKey('eduhub_boss'), null), killed = boss && boss.defeated && typeof boss.defeated === 'object' ? Object.keys(boss.defeated).length : 0;
    var badges = g.badges && typeof g.badges === 'object' ? Object.keys(g.badges).length : 0;
    return { days: days.length, longest: longest, best: +g.best || 0, wd: wd, topWd: topWd, subs: subs.length, med: med, onTime: onTime,
      night: night, morning: morning, last: last, before: before, killed: killed, badges: badges,
      exams: arr('eduhub_exams').filter(function (e) { return e && typeof e.date === 'string' && e.date >= since; }).length };
  }

  function personaOf(S) {
    if (S.subs < 3 || S.med == null) return null;
    var m = S.med, main, em;
    if (m >= 48) { main = 'Nhà hoạch định'; em = '🧭'; }
    else if (m >= 12) { main = 'Người về đích sớm'; em = '🚀'; }
    else if (m >= 0) { main = 'Thợ săn phút chót'; em = '⏱️'; }
    else { main = 'Chiến binh phút 89'; em = '🔥'; }
    var tag = S.night / S.subs >= 0.4 ? 'Cú đêm 🦉' : S.morning / S.subs >= 0.4 ? 'Chim sớm 🐤' : '';
    return { main: main, em: em, tag: tag };
  }

  /* ---------- Dựng danh sách thẻ ---------- */
  function build() {
    var S = stats(), out = [], share = [];
    var name = (EduHub.session() || {}).name || '';
    var label = period === 'term' ? '120 ngày qua' : 'toàn bộ thời gian';
    persona = personaOf(S);
    out.push({ bg: ['#4f46e5', '#7c3aed'], em: '🎬', k: 'Kỳ học Wrapped', big: name ? esc(name.split(' ').slice(-1)[0]) + ', xem lại kỳ học của bạn' : 'Xem lại kỳ học của bạn', t: 'Số liệu lấy từ ' + label + ', tính ngay trên thiết bị này.' });
    if (S.days > 0) {
      out.push({ bg: ['#ea580c', '#dc2626'], em: '🔥', k: 'Sự chăm chỉ', big: S.days + ' ngày học', t: S.longest > 1 ? 'Chuỗi dài nhất của bạn là ' + S.longest + ' ngày liên tiếp.' : 'Mỗi ngày bắt đầu lại là một chiến thắng nhỏ.' });
      share.push({ big: S.days, label: 'ngày học' });
      if (S.longest > 1) share.push({ big: S.longest, label: 'ngày chuỗi dài nhất' });
      if (S.days >= 3) out.push({ bg: ['#0891b2', '#2563eb'], em: '📅', k: 'Ngày vàng', big: WD[S.topWd], t: 'Bạn học nhiều nhất vào ' + WD[S.topWd] + ' (' + S.wd[S.topWd] + ' ngày).' });
    }
    if (S.subs > 0) {
      out.push({ bg: ['#059669', '#0d9488'], em: '📬', k: 'Bài tập', big: S.subs + ' bài đã nộp', t: S.onTime + '/' + S.subs + ' bài nộp đúng hạn.' });
      share.push({ big: S.subs, label: 'bài đã nộp' });
    }
    if (persona) {
      var m = Math.abs(S.med), mt = m >= 48 ? Math.round(m / 24) + ' ngày' : m >= 1 ? Math.round(m) + ' giờ' : 'ít hơn 1 giờ';
      out.push({ bg: ['#7c3aed', '#db2777'], em: persona.em, k: 'Phong cách của bạn', big: persona.main + (persona.tag ? ' · ' + persona.tag : ''),
        t: S.med >= 0 ? 'Bạn thường nộp bài trước hạn khoảng ' + mt + '.' : 'Bạn thường nộp bài sau hạn khoảng ' + mt + '. Thử đặt nhắc việc sớm hơn nhé!' });
    }
    if (S.last && S.last.gpa10 != null) {
      var d = S.before && S.before.gpa10 != null ? S.last.gpa10 - S.before.gpa10 : null;
      out.push({ bg: ['#2563eb', '#4f46e5'], em: d != null && d > 0.005 ? '📈' : '🎓', k: S.last.name, big: 'GPA ' + S.last.gpa10.toFixed(2) + ' (hệ 10)',
        t: d == null ? 'Kỳ học gần nhất của bạn, ' + S.last.c + ' tín chỉ.' : d > 0.005 ? 'Tăng ' + d.toFixed(2) + ' điểm so với kỳ trước.' : d < -0.005 ? 'Giảm ' + Math.abs(d).toFixed(2) + ' điểm so với kỳ trước. Kỳ sau lấy lại phong độ!' : 'Giữ vững phong độ so với kỳ trước.' });
      share.push({ big: S.last.gpa10.toFixed(2), label: 'GPA hệ 10 · ' + S.last.name });
      if (S.last.top) out.push({ bg: ['#d97706', '#ca8a04'], em: '⭐', k: 'Môn tỏa sáng', big: esc(S.last.top.n), t: 'Điểm cao nhất kỳ này: ' + S.last.top.g + '/10.' });
    }
    if (S.killed > 0) {
      out.push({ bg: ['#be123c', '#9f1239'], em: '🏆', k: 'Đấu trường', big: S.killed + ' boss bị hạ', t: 'Bạn đã hạ gục ' + S.killed + ' môn học. Những boss còn lại đang chờ.' });
      share.push({ big: S.killed, label: 'boss môn học bị hạ' });
    }
    if (S.badges > 0) out.push({ bg: ['#b45309', '#a16207'], em: '🏅', k: 'Bộ sưu tập', big: S.badges + ' huy hiệu', t: 'Bạn đã mở khóa ' + S.badges + ' huy hiệu.' });
    shareItems = share.slice(0, 4);
    var enough = S.days > 0 || S.subs > 0 || (S.last && S.last.gpa10 != null) || S.killed > 0;
    if (enough) out.push({ bg: ['#1e293b', '#4f46e5'], em: '📸', k: 'Thẻ của bạn', big: '', t: '', final: true });
    return { cards: out, ok: enough };
  }

  /* ---------- Thẻ ảnh chia sẻ ---------- */
  function drawShare(cv) {
    var W = 1080, Hh = 1350, c = cv.getContext('2d');
    cv.width = W; cv.height = Hh;
    var g = c.createLinearGradient(0, 0, W, Hh); g.addColorStop(0, '#4f46e5'); g.addColorStop(1, '#db2777');
    c.fillStyle = g; c.fillRect(0, 0, W, Hh);
    c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.arc(W - 120, 160, 260, 0, 7); c.fill(); c.beginPath(); c.arc(100, Hh - 100, 320, 0, 7); c.fill();
    var F = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    c.fillStyle = '#fff'; c.textAlign = 'left';
    c.font = '700 40px ' + F; c.fillText('KỲ HỌC WRAPPED', 80, 120);
    var name = (EduHub.session() || {}).name || '';
    c.font = '500 36px ' + F; c.globalAlpha = .85; c.fillText(name.slice(0, 28), 80, 175); c.globalAlpha = 1;
    var y = 300;
    if (persona) {
      c.font = '120px ' + F; c.fillText(persona.em, 80, y + 20);
      c.font = '800 72px ' + F; c.fillText(persona.main, 80, y + 130);
      if (persona.tag) { c.font = '600 44px ' + F; c.globalAlpha = .9; c.fillText(persona.tag, 80, y + 195); c.globalAlpha = 1; }
      y += 300;
    } else { c.font = '140px ' + F; c.fillText('🎓', 80, y + 20); y += 170; }
    shareItems.forEach(function (it) {
      c.font = '800 110px ' + F; c.fillText(String(it.big), 80, y + 90);
      var w = c.measureText(String(it.big)).width;
      c.font = '500 38px ' + F; c.globalAlpha = .9;
      var lab = String(it.label); while (c.measureText(lab).width > W - 160 - w - 30 && lab.length > 4) lab = lab.slice(0, -2);
      c.fillText(lab, 80 + w + 30, y + 88); c.globalAlpha = 1;
      y += 150;
    });
    c.font = '700 34px ' + F; c.globalAlpha = .8; c.fillText('EduHub · Nền tảng quản lý học tập', 80, Hh - 70); c.globalAlpha = 1;
  }
  function download() {
    var cv = $('whCanvas'); if (!cv) return;
    cv.toBlob(function (blob) {
      if (!blob) { EduHub.toast('Không tạo được ảnh trên trình duyệt này.', 'error'); return; }
      var file = null;
      try { file = new File([blob], 'eduhub-wrapped.png', { type: 'image/png' }); } catch (e) {}
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({ files: [file], title: 'Kỳ học Wrapped' }).catch(function () {});
        return;
      }
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'eduhub-wrapped.png'; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      EduHub.toast('Đã tải thẻ ảnh Wrapped.', 'success');
    }, 'image/png');
  }

  /* ---------- Giao diện ---------- */
  function ensureModal() {
    if ($('wrapModal')) return $('wrapModal');
    var m = document.createElement('div');
    m.id = 'wrapModal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Kỳ học Wrapped');
    m.className = 'fixed inset-0 z-50 hidden flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3';
    m.innerHTML = '<div id="whBox" class="relative w-full max-w-md h-[min(90vh,720px)] rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col" style="transition:background .3s">' +
      '<div id="whBars" class="flex gap-1 px-4 pt-4"></div>' +
      '<button type="button" data-eh-close aria-label="Đóng" class="absolute top-6 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 z-10"><i class="fa-solid fa-xmark"></i></button>' +
      '<div id="whBody" class="flex-1 flex flex-col items-center justify-center text-center px-8" aria-live="polite"></div>' +
      '<div class="flex justify-between px-4 pb-4"><button type="button" data-wh="prev" class="px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-sm font-semibold">‹ Trước</button>' +
      '<button type="button" data-wh="next" class="px-4 py-2 rounded-xl bg-white/25 hover:bg-white/35 text-sm font-semibold">Tiếp ›</button></div></div>';
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.closest('[data-eh-close]')) { m.classList.add('hidden'); return; }
      var b = e.target.closest('[data-wh]');
      if (b) go(b.getAttribute('data-wh') === 'next' ? 1 : -1);
      else if (e.target.closest('[data-wh-dl]')) download();
    });
    document.body.appendChild(m);
    document.addEventListener('keydown', function (e) {
      if (m.classList.contains('hidden')) return;
      if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
    });
    var x0 = null;
    m.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    m.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); });
    return m;
  }
  function go(n) { var i = Math.min(cards.length - 1, Math.max(0, idx + n)); if (i !== idx) { idx = i; show(); } }
  function show() {
    var c = cards[idx];
    $('whBox').style.background = 'linear-gradient(160deg,' + c.bg[0] + ',' + c.bg[1] + ')';
    $('whBars').innerHTML = cards.map(function (_, i) { return '<span class="flex-1 h-1 rounded-full ' + (i <= idx ? 'bg-white' : 'bg-white/30') + '"></span>'; }).join('');
    if (c.final) {
      $('whBody').innerHTML = '<canvas id="whCanvas" class="rounded-2xl shadow-xl max-h-[52vh] max-w-full" style="aspect-ratio:1080/1350" role="img" aria-label="Thẻ ảnh tổng kết kỳ học để chia sẻ"></canvas>' +
        '<button type="button" data-wh-dl class="mt-4 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold"><i class="fa-solid fa-download mr-2"></i>Tải thẻ ảnh</button>';
      drawShare($('whCanvas'));
    } else {
      $('whBody').innerHTML = '<div class="text-7xl mb-5" aria-hidden="true">' + c.em + '</div><p class="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">' + esc(c.k) + '</p>' +
        '<p class="text-3xl font-extrabold leading-tight mb-3">' + c.big + '</p><p class="text-sm opacity-90 leading-relaxed">' + esc(c.t) + '</p>';
    }
    var nx = document.querySelector('#wrapModal [data-wh="next"]'), pv = document.querySelector('#wrapModal [data-wh="prev"]');
    nx.style.visibility = idx === cards.length - 1 ? 'hidden' : 'visible';
    pv.style.visibility = idx === 0 ? 'hidden' : 'visible';
  }
  function open() {
    var b = build();
    if (!b.ok) { EduHub.toast('Chưa đủ dữ liệu để tạo Wrapped. Hãy học thêm vài ngày nhé!', 'info'); return; }
    cards = b.cards; idx = 0;
    ensureModal().classList.remove('hidden');
    show();
  }

  function render() {
    var sec = $('wrappedSection');
    if (!sec) return;
    var ok = build().ok;
    var chip = function (p, t) {
      var on = period === p;
      return '<button type="button" data-wh-p="' + p + '" aria-pressed="' + on + '" class="px-3 py-1.5 text-xs font-semibold rounded-xl ' + (on ? 'bg-white text-indigo-700' : 'bg-white/20 hover:bg-white/30 text-white') + '">' + t + '</button>';
    };
    var html = '<div class="rounded-2xl px-5 py-4 text-white shadow-sm flex items-center justify-between gap-3 flex-wrap" style="background:linear-gradient(135deg,#4f46e5,#db2777)">' +
      '<div class="min-w-0"><h3 class="font-bold text-lg"><span aria-hidden="true">🎬</span> Kỳ học Wrapped</h3>' +
      '<p class="text-xs opacity-90">' + (ok ? 'Tổng kết hành trình học của bạn.' : 'Cần thêm dữ liệu học tập để tổng kết.') + '</p>' +
      '<div class="flex gap-2 mt-2">' + chip('term', '120 ngày qua') + chip('all', 'Toàn bộ') + '</div></div>' +
      '<button type="button" data-wh-open class="px-5 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow ' + (ok ? '' : 'opacity-60') + '"><i class="fa-solid fa-play mr-2"></i>Xem</button></div>';
    if (sec.getAttribute('data-h') !== html) { sec.innerHTML = html; sec.setAttribute('data-h', html); }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-wh-open],[data-wh-p]');
    if (!t) return;
    if (t.hasAttribute('data-wh-open')) open();
    else { period = t.getAttribute('data-wh-p'); render(); }
  });
  var timer = null;
  function later() { clearTimeout(timer); timer = setTimeout(render, 150); }
  document.addEventListener('eduhub:data', later);
  window.addEventListener('storage', later);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) later(); });

  window.EduHubWrapped = { open: open, refresh: render };
  render();
})();
