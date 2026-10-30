/* EduHub - Nhập điểm các kỳ, điểm rèn luyện, tín chỉ giỏi/xuất sắc, chuyên cần.
   Được nhúng vào index.html: <script src="records.js"></script>
   Dữ liệu lưu trong localStorage (khóa eduhub_records_<email>). */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let u = null; try { u = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session')); } catch {}
  const email = (u && u.email) || 'guest', KEY = 'eduhub_records_' + email, SKEY = 'eduhub_subjects_' + email;
  let db = { total: 130, sems: [], retake: 'best' };
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && Array.isArray(d.sems)) db = d; } catch {}
  if (!['best', 'latest', 'all'].includes(db.retake)) db.retake = 'best';
  /* Lưu qua EduHub.set: nếu trình duyệt chặn / đầy bộ nhớ sẽ hiện cảnh báo thay vì mất dữ liệu im lặng */
  const save = () => { const a = EduHub.set(KEY, db), b = EduHub.set('eduhub_total_' + email, db.total); return a && b; };

  /* ---------- Thứ tự kỳ học theo THỜI GIAN (năm học + học kỳ), không theo thứ tự nhập ---------- */
  const parseSem = name => {
    const n = String(name || ''), y = n.match(/(\d{4})\s*[-–\/]\s*(\d{4})/);
    const t = n.match(/(?:hk|học\s*kỳ|hoc\s*ky)\s*([123])/i) || (/hè|summer/i.test(n) ? [0, '3'] : null);
    return { year: y ? +y[1] : null, term: t ? +t[1] : null };
  };
  db.sems.forEach(s => {     // dữ liệu cũ chưa có năm học/học kỳ: cố gắng suy ra từ tên kỳ
    if (s.year == null || s.term == null) { const p = parseSem(s.name); if (p.year != null && p.term != null) { s.year = p.year; s.term = p.term; } }
  });
  const defaultSem = () => {
    const d = new Date(), m = d.getMonth() + 1, y = d.getFullYear();
    return m >= 9 ? { year: y, term: 1 } : m <= 1 ? { year: y - 1, term: 1 } : m <= 6 ? { year: y - 1, term: 2 } : { year: y - 1, term: 3 };
  };
  const autoName = (year, term) => (term === 3 ? 'Học kỳ hè' : 'HK' + term) + ' ' + year + '-' + (year + 1);
  /* kỳ chưa rõ năm/học kỳ xếp trước, giữ nguyên thứ tự nhập giữa chúng */
  const semKey = (s, i) => (s.year != null && s.term != null) ? s.year * 10 + s.term : -1e9 + i;
  const ordered = () => db.sems.map((s, i) => ({ s, k: semKey(s, i) })).sort((a, b) => a.k - b.k).map(x => x.s);

  /* ---------- Môn học lại: mỗi môn chỉ tính MỘT lần vào điểm tích lũy ---------- */
  const normN = n => String(n || '').trim().toLowerCase().replace(/\s+/g, ' ');
  function counted() {
    const all = []; ordered().forEach(s => s.subs.forEach(x => all.push(x)));
    if (db.retake === 'all') return new Set(all);
    const pick = new Map();
    all.forEach(x => {
      const k = normN(x.n), cur = pick.get(k);
      if (!cur || db.retake === 'latest' || x.g >= cur.g) pick.set(k, x);
    });
    return new Set(pick.values());
  }
  const cumStat = () => { const keep = counted(); return stat(ordered().flatMap(s => s.subs).filter(x => keep.has(x))); };

  /* ---------- Tính toán ---------- */
  const g4 = g => g >= 9 ? 4 : g >= 8.5 ? 3.7 : g >= 8 ? 3.5 : g >= 7 ? 3 : g >= 6.5 ? 2.5 : g >= 5.5 ? 2 : g >= 5 ? 1.5 : g >= 4 ? 1 : 0;
  const letter = g => g >= 9 ? 'A+' : g >= 8.5 ? 'A' : g >= 8 ? 'B+' : g >= 7 ? 'B' : g >= 6.5 ? 'C+' : g >= 5.5 ? 'C' : g >= 5 ? 'D+' : g >= 4 ? 'D' : 'F';
  const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; };
  const fmt = (n, d = 2) => n == null ? '—' : n.toFixed(d);
  function stat(subs) {
    let c = 0, s10 = 0, s4 = 0, pass = 0, good = 0;
    subs.forEach(x => { c += x.c; s10 += x.c * x.g; s4 += x.c * g4(x.g); if (x.g >= 4) pass += x.c; if (x.g >= 8) good += x.c; });
    return { c, pass, good, gpa10: c ? s10 / c : null, gpa4: c ? s4 / c : null };
  }
  const semStat = s => { const t = stat(s.subs); if (s.good != null) t.good = s.good; return t; };
  const conductRank = s => s == null ? '' : s >= 90 ? 'Xuất sắc' : s >= 80 ? 'Tốt' : s >= 65 ? 'Khá' : s >= 50 ? 'Trung bình' : s >= 35 ? 'Yếu' : 'Kém';
  const gpaRank = g => g == null ? '' : g >= 3.6 ? 'Xuất sắc' : g >= 3.2 ? 'Giỏi' : g >= 2.5 ? 'Khá' : g >= 2 ? 'Trung bình' : 'Yếu';

  /* ---------- Thống kê deadline thật (đọc từ assignments.js) ---------- */
  const dueStat = () => {
    let list = [];
    try { list = JSON.parse(localStorage.getItem('eduhub_assignments_' + email)) || []; } catch {}
    const pend = (Array.isArray(list) ? list : []).filter(a => a && a.status !== 'submitted');
    const late = pend.filter(a => new Date(a.due).getTime() < Date.now());
    const soon = pend.filter(a => { const t = new Date(a.due).getTime() - Date.now(); return t > 0 && t <= 86400e3; });
    return { pend: pend.length, late: late.length, soon: soon.length };
  };

  /* ---------- Giao diện chung ---------- */
  const BOX = 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 shadow-sm';
  const BTN = 'inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition';
  const openBtn = `<button onclick="openRecords()" class="${BTN}"><i class="fa-solid fa-pen-to-square"></i>Nhập điểm & kết quả</button>`;
  const badge = (d, suf = '') => d == null ? '' :
    `<span class="text-[11px] font-bold px-2 py-0.5 rounded ${d >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'}">${d >= 0 ? '+' : ''}${+d.toFixed(2)}${suf} ${d >= 0 ? '↗' : '↘'}</span>`;
  const note = t => `<p class="mt-3 text-xs text-gray-400">${t}</p>`;
  const card = (label, val, icon, tone, extra) => `<div class="${BOX} p-5 rounded-2xl"><div class="w-10 h-10 rounded-xl ${tone[1]} flex items-center justify-center text-lg mb-3"><i class="fa-solid ${icon}"></i></div><p class="text-xs font-medium text-gray-500 dark:text-gray-400">${label}</p><h3 class="text-2xl font-bold mt-1 ${tone[0]}">${val}</h3>${extra}</div>`;

  function cards() {
    const el = $('statCards'); if (!el) return;
    const S = ordered(), L = S[S.length - 1], P = S[S.length - 2];
    const dl = dueStat();
    const all = cumStat(), ls = L && semStat(L), ps = P && semStat(P);
    const dG = ls && ps && ls.gpa4 != null && ps.gpa4 != null ? ls.gpa4 - ps.gpa4 : null;
    const dA = L && P && L.attend != null && P.attend != null ? L.attend - P.attend : null;
    const pct = Math.min(100, all.pass / db.total * 100);
    const empty = note('Chưa có dữ liệu — bấm “Nhập điểm & kết quả”');
    el.innerHTML =
      card('Điểm GPA tích lũy', `${fmt(all.gpa4)} <span class="text-xs text-gray-400 font-normal">/ 4.0</span>`, 'fa-award', ['text-gray-900 dark:text-white', 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'],
        !S.length ? empty : dG == null ? note('Nhập thêm một kỳ để so sánh') : `<div class="mt-3 text-xs">${badge(dG)} <span class="text-gray-400 ml-1">so với kỳ trước</span></div>`) +
      card('Tín chỉ tích lũy', `${all.pass} <span class="text-xs text-gray-400 font-normal">/ ${db.total}</span>`, 'fa-book-bookmark', ['text-gray-900 dark:text-white', 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'],
        `<div class="mt-3"><div class="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden"><div class="bg-blue-600 h-full rounded-full" style="width:${pct}%"></div></div><span class="text-[11px] text-gray-400 mt-1 block text-right">Đã hoàn thành ${pct.toFixed(0)}%</span></div>`) +
      card('Deadline sắp nộp', `${dl.pend} <span class="text-xs text-gray-400 font-normal">bài tập</span>`, 'fa-hourglass-half', ['text-amber-600 dark:text-amber-400', 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'],
        !dl.pend ? note('Không có bài tập nào cần nộp') : `<div class="mt-3 flex items-center text-xs text-amber-600 dark:text-amber-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i><span>${dl.late ? dl.late + ' bài đã quá hạn' : dl.soon ? dl.soon + ' bài hết hạn trong 24h tới' : 'Hạn gần nhất còn hơn 1 ngày'}</span></div>`) +
      card('Tỷ lệ chuyên cần', L && L.attend != null ? fmt(L.attend, 1) + '%' : '—', 'fa-user-check', ['text-indigo-600 dark:text-indigo-400', 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'],
        !L ? empty : dA == null ? note(L.name) : `<div class="mt-3 text-xs">${badge(dA, '%')} <span class="text-gray-400 ml-1">so với kỳ trước</span></div>`);
  }

  function ind(label, icon, color, prev, cur, max, unit, dec, rank) {
    const d = prev != null && cur != null ? cur - prev : null;
    const w = v => v == null ? 0 : Math.max(0, Math.min(100, v / max * 100));
    return `<div class="p-4 rounded-xl bg-gray-50/70 dark:bg-slate-700/20 border border-gray-100 dark:border-slate-700/40 space-y-2">
      <div class="flex justify-between items-center text-xs"><span class="font-bold flex items-center gap-1.5"><i class="fa-solid ${icon}"></i>${label}</span>${badge(d, unit.trim() === '%' ? '%' : '')}</div>
      <div class="flex justify-between text-[11px] text-gray-500"><span>Kỳ trước: ${prev == null ? '—' : fmt(prev, dec) + unit}</span><span class="font-bold text-blue-600 dark:text-blue-400">Kỳ này: ${cur == null ? '—' : fmt(cur, dec) + unit}${rank ? ' (' + rank + ')' : ''}</span></div>
      <div class="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative"><div class="absolute inset-y-0 left-0 bg-gray-400/50 rounded-full" style="width:${w(prev)}%"></div><div class="absolute inset-y-0 left-0 ${color} rounded-full" style="width:${w(cur)}%;opacity:.9"></div></div></div>`;
  }
  function compare() {
    const el = $('compareSection'); if (!el) return;
    const S = ordered(), L = S[S.length - 1], P = S[S.length - 2];
    const sub = !L ? 'Chưa có dữ liệu. Hãy nhập điểm các kỳ của bạn.' : P ? `Đối chiếu ${esc(P.name)} và ${esc(L.name)}` : `Kỳ hiện tại: ${esc(L.name)} — thêm một kỳ nữa để so sánh`;
    let h = `<div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-700/60 pb-4"><div><h2 class="font-bold text-lg text-gray-900 dark:text-white">So Sánh Học Lực: Kỳ Này vs Kỳ Trước</h2><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${sub}</p></div>${openBtn}</div>`;
    if (L) {
      const ls = semStat(L), ps = P && semStat(P);
      h += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">` +
        ind('Tỷ Lệ Chuyên Cần', 'fa-user-check text-blue-500', 'bg-blue-600', P && P.attend, L.attend, 100, '%', 1, '') +
        ind('Điểm Rèn Luyện', 'fa-heart text-red-500', 'bg-red-500', P && P.conduct, L.conduct, 100, ' điểm', 0, conductRank(L.conduct)) +
        ind('Tín Chỉ Giỏi/Xuất Sắc', 'fa-star text-purple-500', 'bg-purple-600', ps && ps.good, ls.good, Math.max(ls.c, ls.good, 1), ' TC', 0, '') +
        ind('GPA Học Kỳ (hệ 4)', 'fa-award text-emerald-500', 'bg-emerald-500', ps && ps.gpa4, ls.gpa4, 4, '', 2, gpaRank(ls.gpa4)) + `</div>`;
    }
    el.innerHTML = h;
  }

  function gradesTab() {
    const el = $('gradesTab'); if (!el) return;
    const all = cumStat(), keep = counted();
    const mini = (v, l) => `<div class="rounded-xl bg-gray-50 dark:bg-slate-700/40 p-4 text-center"><b class="block text-2xl">${v}</b><span class="text-xs text-gray-500 dark:text-gray-400">${l}</span></div>`;
    const chip = (t, c) => `<span class="px-2 py-0.5 rounded-full font-medium ${c}">${t}</span>`;
    let h = `<div class="${BOX} rounded-2xl p-5"><div class="no-print flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="font-bold text-lg">📊 Bảng điểm &amp; GPA</h2><div class="flex flex-wrap gap-2"><button type="button" onclick="rcExportCSV()" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl"><i class="fa-solid fa-file-csv"></i>Xuất CSV</button>${openBtn}</div></div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">${mini(db.sems.length ? fmt(all.gpa4) : '—', 'GPA hệ 4')}${mini(db.sems.length ? gpaRank(all.gpa4) : '—', 'Xếp loại')}${mini(`${all.pass}<span class="text-sm text-gray-400 font-normal"> / ${db.total}</span>`, 'Tín chỉ tích lũy')}</div>`;
    if (!db.sems.length) h += '<p class="text-xs text-gray-400 text-center py-8">Chưa có dữ liệu điểm. Bấm “Nhập điểm &amp; kết quả” để bắt đầu.</p>';
    h += ordered().reverse().map((s, i) => {
      const t = semStat(s);
      return `<div class="${i ? 'mt-6' : ''}"><div class="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h3 class="font-semibold text-sm">${esc(s.name)}</h3>
        <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
          ${chip('GPA ' + fmt(t.gpa4) + ' / ' + fmt(t.gpa10), 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400')}
          ${chip(t.good + ' TC giỏi/XS', 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300')}
          ${chip('Rèn luyện ' + (s.conduct ?? '—'), 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300')}
          ${chip('Chuyên cần ' + (s.attend == null ? '—' : s.attend + '%'), 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300')}
          <button onclick="openRecords('${esc(s.id)}')" class="text-gray-400 hover:text-blue-600 ml-1" title="Sửa kỳ này"><i class="fa-solid fa-pen"></i></button></div></div>
        ${s.subs.length ? `<div class="overflow-x-auto"><table class="w-full table-fixed min-w-[420px] text-[13px]"><colgroup><col style="width:38%"><col style="width:10%"><col style="width:26%"><col style="width:13%"><col style="width:13%"></colgroup><thead><tr class="text-gray-500 text-xs"><th class="py-2 px-1.5 text-left font-semibold border-b border-gray-100 dark:border-slate-700">Môn học</th><th class="py-2 px-1.5 text-left font-semibold border-b border-gray-100 dark:border-slate-700">TC</th><th class="py-2 px-1.5 text-left font-semibold border-b border-gray-100 dark:border-slate-700">Điểm 10</th><th class="py-2 px-1.5 text-left font-semibold border-b border-gray-100 dark:border-slate-700">Điểm 4</th><th class="py-2 px-1.5 text-left font-semibold border-b border-gray-100 dark:border-slate-700">Chữ</th></tr></thead><tbody>
        ${s.subs.map(x => `<tr><td class="py-3 px-1.5 border-b border-gray-100 dark:border-slate-700">${esc(x.n)}${keep.has(x) ? '' : ' <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-500">không tính (học lại)</span>'}</td><td class="py-3 px-1.5 border-b border-gray-100 dark:border-slate-700">${x.c}</td><td class="py-3 px-1.5 border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">${x.g} <span class="inline-block align-middle w-20 h-1.5 ml-1 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden"><i class="block h-full rounded-full bg-blue-600" style="width:${Math.max(0, Math.min(100, x.g * 10))}%"></i></span></td><td class="py-3 px-1.5 border-b border-gray-100 dark:border-slate-700">${g4(x.g).toFixed(1)}</td><td class="py-3 px-1.5 border-b border-gray-100 dark:border-slate-700 font-bold">${letter(x.g)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="py-3 text-xs text-gray-400">Chưa nhập điểm từng môn.</p>'}</div>`;
    }).join('') + '</div>';
    el.className = 'space-y-6'; el.innerHTML = h;
  }

  let chart = null;
  function drawChart() {
    const cv = $('semesterComparisonChart'); if (!cv) return;
    const S = ordered(), L = S[S.length - 1], P = S[S.length - 2];
    const lab = $('chartMonth'); if (lab) lab.textContent = L ? (P ? P.name + ' → ' + L.name : L.name) : 'Chưa có dữ liệu';
    if (typeof Chart === 'undefined') {
      cv.parentElement.innerHTML = '<p class="text-xs text-gray-400 text-center py-10">Không tải được thư viện biểu đồ (Chart.js). Hãy kiểm tra kết nối mạng rồi tải lại trang.</p>';
      return;
    }
    if (chart) { chart.destroy(); chart = null; }
    if (!L || !L.subs.length) return;
    const dark = document.documentElement.classList.contains('dark');
    const txt = dark ? '#cbd5e1' : '#475569', grid = dark ? 'rgba(148,163,184,0.18)' : 'rgba(156,163,175,0.15)';
    const key = x => x.n.trim().toLowerCase();
    const pm = Object.fromEntries((P ? P.subs : []).map(x => [key(x), x.g]));
    const ds = [];
    if (P && L.subs.some(x => key(x) in pm)) ds.push({ label: 'Kỳ trước (' + P.name + ')', data: L.subs.map(x => pm[key(x)] ?? null), backgroundColor: 'rgba(156,163,175,0.6)', borderColor: 'rgba(156,163,175,1)', borderWidth: 1.5, borderRadius: 6 });
    ds.push({ label: 'Kỳ này (' + L.name + ')', data: L.subs.map(x => x.g), backgroundColor: 'rgba(37,99,235,0.85)', borderColor: '#1d4ed8', borderWidth: 1.5, borderRadius: 6 });
    chart = new Chart(cv.getContext('2d'), { type: 'bar', data: { labels: L.subs.map(x => x.n), datasets: ds },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: txt, font: { family: 'Be Vietnam Pro', size: 11 } } } },
        scales: { y: { min: 0, max: 10, ticks: { color: txt }, grid: { color: grid } }, x: { ticks: { color: txt }, grid: { display: false } } } } });
  }
  const renderAll = () => { cards(); compare(); gradesTab(); drawChart(); };

  /* ---------- Hộp thoại nhập liệu ---------- */
  const I = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500';
  const LB = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';
  let cur = null;
  const rowHtml = (x = {}) => `<div class="rc-row grid grid-cols-12 gap-2 items-center">
    <input class="${I} col-span-6 r-n" placeholder="Tên môn" value="${esc(x.n || '')}">
    <input class="${I} col-span-2 r-c" type="number" min="1" max="10" placeholder="TC" value="${x.c ?? ''}">
    <input class="${I} col-span-3 r-g" inputmode="decimal" placeholder="Điểm /10" value="${x.g ?? ''}">
    <button type="button" onclick="rcDelRow(this)" class="col-span-1 text-red-500"><i class="fa-solid fa-trash"></i></button></div>`;

  function build() {
    const m = document.createElement('div');
    m.id = 'rcModal';
    m.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    m.innerHTML = `<div class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
      <div class="flex justify-between items-center"><h3 class="text-lg font-bold">Nhập điểm & kết quả học tập</h3><button onclick="rcClose()" class="text-gray-400 hover:text-gray-600 dark:hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button></div>
      <div><label class="${LB}">Chọn kỳ</label><select id="rcSel" class="${I}"></select></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="${LB}" for="rcYear">Năm học (năm bắt đầu) *</label><input id="rcYear" type="number" min="2000" max="2100" class="${I}" placeholder="2026"></div>
        <div><label class="${LB}" for="rcTerm">Học kỳ *</label><select id="rcTerm" class="${I}"><option value="1">Học kỳ 1</option><option value="2">Học kỳ 2</option><option value="3">Học kỳ hè</option></select></div>
        <div class="col-span-2"><label class="${LB}" for="rcName">Tên kỳ <span class="font-normal">(để trống = tự đặt, VD: HK1 2026-2027)</span></label><input id="rcName" class="${I}" placeholder="HK1 2026-2027"></div>
        <div><label class="${LB}">Điểm rèn luyện (0–100)</label><input id="rcCon" type="number" min="0" max="100" class="${I}"></div>
        <div><label class="${LB}">Tỷ lệ chuyên cần (%)</label><input id="rcAtt" type="number" min="0" max="100" step="0.1" class="${I}"></div>
        <div class="col-span-2"><label class="${LB}">Số tín chỉ đạt Giỏi/Xuất sắc <span class="font-normal">(để trống = tự tính từ các môn có điểm ≥ 8.0)</span></label><input id="rcGood" type="number" min="0" class="${I}"></div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-1"><label class="${LB} !mb-0">Điểm các môn (thang 10)</label>
          <div class="flex gap-3 text-xs font-semibold text-blue-600 dark:text-blue-400"><button type="button" onclick="rcFill()" class="hover:underline">Lấy từ môn đang học</button><button type="button" onclick="rcAdd()" class="hover:underline"><i class="fa-solid fa-plus mr-1"></i>Thêm môn</button></div></div>
        <div id="rcRows" class="space-y-2"></div>
      </div>
      <div id="rcPrev" class="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl p-3"></div>
      <div class="flex items-center gap-3"><label class="${LB} !mb-0 shrink-0" for="rcRetake">Môn học lại (điểm tích lũy)</label><select id="rcRetake" class="${I}"><option value="best">Lấy điểm cao nhất</option><option value="latest">Lấy điểm lần học gần nhất</option><option value="all">Tính cả các lần học</option></select></div>
      <div class="flex items-center gap-3"><label class="${LB} !mb-0 shrink-0">Tổng tín chỉ toàn khóa</label><input id="rcTotal" type="number" min="1" class="${I} !w-28"></div>
      <p id="rcErr" class="hidden text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"></p>
      <div class="flex justify-between items-center pt-2">
        <button id="rcDel" type="button" onclick="rcDelete()" class="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl">Xóa kỳ này</button>
        <div class="flex gap-2"><button type="button" onclick="rcClose()" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-xs font-medium rounded-xl">Hủy</button>
        <button type="button" onclick="rcSave()" class="${BTN}"><i class="fa-solid fa-floppy-disk"></i>Lưu</button></div>
      </div></div>`;
    document.body.appendChild(m);
    m.addEventListener('input', preview);
    $('rcSel').onchange = e => { cur = e.target.value || null; show(); };
  }
  function show() {
    const s = cur ? db.sems.find(x => x.id === cur) : null;
    $('rcSel').innerHTML = ordered().map(x => `<option value="${esc(x.id)}" ${x.id === cur ? 'selected' : ''}>${esc(x.name)}</option>`).join('') + `<option value="" ${cur ? '' : 'selected'}>＋ Thêm kỳ mới</option>`;
    const g = s ? (s.year != null && s.term != null ? s : { ...defaultSem(), ...Object.fromEntries(Object.entries(parseSem(s.name)).filter(([, v]) => v != null)) }) : defaultSem();
    $('rcYear').value = g.year; $('rcTerm').value = g.term;
    $('rcRetake').value = db.retake;
    $('rcName').value = s ? s.name : '';
    $('rcCon').value = s && s.conduct != null ? s.conduct : '';
    $('rcAtt').value = s && s.attend != null ? s.attend : '';
    $('rcGood').value = s && s.good != null ? s.good : '';
    $('rcTotal').value = db.total;
    $('rcRows').innerHTML = (s && s.subs.length ? s.subs : [{}, {}, {}]).map(rowHtml).join('');
    $('rcDel').classList.toggle('hidden', !s);
    $('rcErr').classList.add('hidden');
    preview();
  }
  function readRows() {
    const subs = []; let bad = false;
    document.querySelectorAll('#rcRows .rc-row').forEach(r => {
      const n = r.querySelector('.r-n').value.trim(), cs = r.querySelector('.r-c').value.trim(), gs = r.querySelector('.r-g').value.trim();
      if (!n && !cs && !gs) return;
      const c = num(cs), g = num(gs);
      if (c == null || c <= 0 || g == null || g < 0 || g > 10) { bad = true; return; }
      subs.push({ n: n || 'Môn học', c, g });
    });
    return { subs, bad };
  }
  function preview() {
    const { subs } = readRows(), t = stat(subs), gd = num($('rcGood').value);
    $('rcPrev').innerHTML = subs.length ? `Tạm tính: GPA hệ 4 <b>${fmt(t.gpa4)}</b> (${gpaRank(t.gpa4)}) · hệ 10 <b>${fmt(t.gpa10)}</b> · ${t.c} tín chỉ · ${gd != null ? gd : t.good} tín chỉ giỏi/xuất sắc` : 'Nhập điểm các môn để tự tính GPA.';
  }
  window.openRecords = id => {
    if (!$('rcModal')) build();
    cur = typeof id === 'string' ? id : (db.sems.length ? ordered().slice(-1)[0].id : null);
    show(); $('rcModal').classList.remove('hidden');
  };
  window.rcClose = () => $('rcModal').classList.add('hidden');
  window.rcAdd = () => { $('rcRows').insertAdjacentHTML('beforeend', rowHtml()); };
  window.rcDelRow = b => { b.closest('.rc-row').remove(); preview(); };
  window.rcFill = () => {
    let list = []; try { list = JSON.parse(localStorage.getItem(SKEY)) || []; } catch {}
    if (!list.length) { alert('Chưa có môn học nào. Hãy thêm ở mục Môn học & TKB trước.'); return; }
    const have = new Set([...document.querySelectorAll('#rcRows .r-n')].map(i => i.value.trim().toLowerCase()));
    document.querySelectorAll('#rcRows .rc-row').forEach(r => { if (![...r.querySelectorAll('input')].some(i => i.value.trim())) r.remove(); });
    list.filter(s => !have.has(s.name.trim().toLowerCase())).forEach(s => $('rcRows').insertAdjacentHTML('beforeend', rowHtml({ n: s.name, c: s.credits })));
    preview();
  };
  window.rcSave = () => {
    const year = num($('rcYear').value), term = +$('rcTerm').value;
    const name = $('rcName').value.trim() || (year != null && year >= 2000 && year <= 2100 ? autoName(Math.round(year), term) : ''), con = num($('rcCon').value), att = num($('rcAtt').value);
    const gd = $('rcGood').value.trim() === '' ? null : num($('rcGood').value);
    const { subs, bad } = readRows();
    let err = '';
    if (year == null || year < 2000 || year > 2100) err = 'Vui lòng nhập năm học hợp lệ (VD: 2026 cho năm học 2026-2027).';
    else if (![1, 2, 3].includes(term)) err = 'Vui lòng chọn học kỳ.';
    else if (db.sems.some(x => x.id !== cur && x.year === Math.round(year) && x.term === term)) err = 'Học kỳ này đã tồn tại. Hãy chọn kỳ đó trong danh sách để sửa.';
    else if (bad) err = 'Mỗi môn cần số tín chỉ lớn hơn 0 và điểm từ 0 đến 10.';
    else if (con != null && (con < 0 || con > 100)) err = 'Điểm rèn luyện phải từ 0 đến 100.';
    else if (att != null && (att < 0 || att > 100)) err = 'Tỷ lệ chuyên cần phải từ 0 đến 100.';
    else if ($('rcGood').value.trim() !== '' && (gd == null || gd < 0)) err = 'Số tín chỉ giỏi/xuất sắc không hợp lệ.';
    else if (!subs.length && con == null && att == null && gd == null) err = 'Hãy nhập ít nhất một thông tin.';
    if (err) { $('rcErr').textContent = err; $('rcErr').classList.remove('hidden'); return; }
    const backup = JSON.stringify(db);
    const tot = num($('rcTotal').value); db.total = tot > 0 ? tot : 130;
    db.retake = $('rcRetake').value;
    const o = { id: cur || Date.now().toString(36), name, year: Math.round(year), term, conduct: con, attend: att, good: gd, subs };
    const i = db.sems.findIndex(x => x.id === o.id);
    i < 0 ? db.sems.push(o) : (db.sems[i] = o);
    if (!save()) {   // không lưu được: hoàn tác trong bộ nhớ và giữ hộp thoại mở để người dùng không mất dữ liệu đã nhập
      db = JSON.parse(backup);
      $('rcErr').textContent = 'Không lưu được dữ liệu: trình duyệt đang chặn lưu trữ hoặc đã đầy bộ nhớ. Hãy xuất tệp sao lưu rồi thử lại.';
      $('rcErr').classList.remove('hidden'); return;
    }
    rcClose(); renderAll();
  };
  window.rcDelete = () => {
    if (!cur || !confirm('Xóa kỳ học này?')) return;
    const backup = JSON.stringify(db);
    db.sems = db.sems.filter(x => x.id !== cur);
    if (!save()) { db = JSON.parse(backup); EduHub.toast('Không xóa được vì không lưu được dữ liệu.', 'error'); return; }
    rcClose(); renderAll();
  };

  /* ---------- Xuất bảng điểm ra CSV (mở được bằng Excel) ---------- */
  window.rcExportCSV = () => {
    if (!db.sems.length) { alert('Chưa có dữ liệu điểm để xuất.'); return; }
    const all = cumStat();
    const rows = [['Kỳ', 'Môn học', 'Tín chỉ', 'Điểm hệ 10', 'Điểm hệ 4', 'Điểm chữ']];
    ordered().forEach(s => s.subs.forEach(x => rows.push([s.name, x.n, x.c, x.g, g4(x.g).toFixed(1), letter(x.g)])));
    rows.push([]);
    ordered().forEach(s => {
      const t = semStat(s);
      rows.push([s.name, 'TỔNG KẾT', t.c, fmt(t.gpa10), fmt(t.gpa4), gpaRank(t.gpa4)]);
    });
    rows.push([]);
    rows.push(['TÍCH LŨY', 'Toàn khóa', all.pass + '/' + db.total, fmt(all.gpa10), fmt(all.gpa4), gpaRank(all.gpa4)]);
    const csv = '\ufeff' + rows.map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'bang-diem-eduhub.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  };

  renderAll();
  /* Thẻ "Deadline sắp nộp" phải cập nhật khi bài tập thay đổi (assignments.js nạp SAU file này) */
  document.addEventListener('eduhub:assignments', cards);
  document.addEventListener('eduhub:theme', drawChart);   // vẽ lại biểu đồ với màu chữ/lưới đúng chế độ Sáng/Tối
})();
