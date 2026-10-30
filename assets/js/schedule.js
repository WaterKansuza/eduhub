/* EduHub - Lịch học hôm nay + thẻ môn học (Tổng quan và tab "Môn học & TKB"),
   đọc dữ liệu do timetable.js ghi. Nhúng vào index.html, nạp SAU timetable.js. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const col = c => /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#2563eb';   // chặn chèn mã độc qua trường màu
  const dayName = d => d == 8 ? 'CN' : 'Thứ ' + d;
  const PT = [['07:00', '07:50'], ['07:55', '08:45'], ['08:50', '09:40'], ['09:45', '10:35'], ['10:40', '11:30'], ['13:00', '13:50'], ['13:55', '14:45'], ['14:50', '15:40'], ['15:45', '16:35'], ['16:40', '17:30']];
  let u = null; try { u = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session')); } catch {}
  const email = (u && u.email) || 'guest', SKEY = 'eduhub_subjects_' + email, TKEY = 'eduhub_timetable_' + email;
  let subjects = [], tt = null;
  const load = () => {
    try { subjects = JSON.parse(localStorage.getItem(SKEY)) || []; } catch { subjects = []; }
    try { tt = JSON.parse(localStorage.getItem(TKEY)); } catch { tt = null; }
  };
  const todayNo = () => { const d = new Date().getDay(); return d === 0 ? 8 : d + 1; };
  const t1 = p => PT[p.start - 1][0], t2 = p => PT[p.start + p.len - 2][1];
  const toMin = t => { const [h, m] = t.split(':'); return +h * 60 + +m; };
  const state = () => { const by = Object.fromEntries(subjects.map(s => [s.id, s])); return { by, pl: tt ? (tt.placements || []).filter(p => by[p.sid]) : [] }; };
  // [thông điệp, tab con cần mở, nhãn nút, có mở hộp thoại thêm môn không]
  const NO_SUB = ['Bạn chưa nhập môn học nào.', 'courses', 'Thêm môn học', 1];
  const missing = () => !subjects.length ? NO_SUB : !tt ? ['Bạn chưa xếp thời khóa biểu.', 'schedule', 'Xếp TKB tự động', 0] : null;
  const emptyBox = (m, cls = '') => `<div class="${cls} text-center text-xs text-gray-400 py-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">${m[0]} <a href="index.html?tab=${m[1]}${m[3] ? '&add=1' : ''}" onclick="switchTab('${m[1]}');${m[3] ? 'EduTT.openForm();' : ''}return false" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">${m[2]}</a></div>`;
  const tint = c => `background:${c}22;color:${c}`;

  function today() {
    const el = $('todayList'); if (!el) return;
    const t = todayNo(), { by, pl } = state(), mi = missing();
    if ($('todayLabel')) $('todayLabel').textContent = dayName(t);
    const list = mi ? [] : pl.filter(p => p.day === t).sort((a, b) => a.start - b.start);
    if ($('todayCount')) $('todayCount').textContent = list.length + ' buổi học';
    if (mi) { el.innerHTML = emptyBox(mi); return; }
    if (!list.length) { el.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">Hôm nay bạn không có buổi học nào 🎉</p>'; return; }
    const n = new Date(), nm = n.getHours() * 60 + n.getMinutes();
    el.innerHTML = list.map(p => {
      const s = by[p.sid], a = toMin(t1(p)), b = toMin(t2(p));
      const [lbl, cls] = nm >= a && nm <= b ? ['Đang diễn ra', 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'] : nm < a ? ['Sắp tới', 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300'] : ['Đã xong', 'bg-gray-100 text-gray-400 dark:bg-slate-700/50 dark:text-gray-500'];
      return `<div class="flex items-start p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border-l-4" style="border-color:${col(s.color)}">
        <div class="mr-3 text-center shrink-0"><span class="block text-xs font-bold">${t1(p)}</span><span class="block text-[10px] text-gray-400">${t2(p)}</span></div>
        <div><h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">${esc(s.name)}</h4>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Tiết ${p.start}–${p.start + p.len - 1}${p.room ? ' · <i class="fa-solid fa-location-dot mr-0.5"></i>' + esc(p.room) : ''}</p>
        <span class="inline-block mt-1 text-[10px] ${cls} font-medium px-2 py-0.5 rounded">${lbl}</span></div></div>`;
    }).join('');
  }

  const slots = (s, pl) => pl.filter(p => p.sid === s.id).sort((a, b) => a.day - b.day || a.start - b.start);
  function courses() {
    const { pl } = state(), mi = subjects.length ? null : NO_SUB;
    if ($('dashCourseSub')) $('dashCourseSub').textContent = subjects.length ? `${subjects.length} môn học · ${subjects.reduce((a, s) => a + s.credits, 0)} tín chỉ` : 'Chưa có môn học';
    const lines = s => { const L = slots(s, pl); return L.length ? L.map(p => `${dayName(p.day)} · tiết ${p.start}–${p.start + p.len - 1} (${t1(p)}–${t2(p)})${p.room ? ' · ' + esc(p.room) : ''}`) : ['Chưa xếp lịch']; };
    const ICONS = ['💻', '🗄️', '🌐', '📐', '📖', '🔬', '🎨', '📊'];
    const asg = (() => { try { return JSON.parse(localStorage.getItem('eduhub_assignments_' + email)) || []; } catch { return []; } })();
    const prog = s => {
      const mine = asg.filter(a => String(a.subject || '').trim().toLowerCase() === s.name.trim().toLowerCase());
      const done = mine.filter(a => a.status === 'submitted').length, pct = mine.length ? Math.round(done / mine.length * 100) : 0;
      return `<div class="flex justify-between text-xs mt-4 mb-1.5"><span class="text-gray-500 dark:text-gray-400">Tiến độ bài tập</span><b>${mine.length ? pct + '%' : '—'}</b></div>
        <div class="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden"><div class="h-full rounded-full" style="width:${pct}%;background:${col(s.color)}"></div></div>
        <p class="text-[11px] text-gray-400 mt-2">${mine.length ? (mine.length - done ? 'Còn ' + (mine.length - done) + ' bài chưa nộp' : '🎉 Đã nộp hết bài tập') : 'Chưa có bài tập'}</p>`;
    };
    const banner = (s, i, h) => `<div class="${h} grid place-items-center text-4xl" style="background:${col(s.color)}22">${ICONS[i % ICONS.length]}</div>`;
    const dash = $('dashCourses');
    if (dash) dash.innerHTML = mi ? emptyBox(mi, 'sm:col-span-2') : subjects.slice(0, 4).map((s, i) => `<div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 overflow-hidden flex flex-col">
      ${banner(s, i, 'h-20')}
      <div class="p-4 flex-1 flex flex-col"><div><span class="text-[11px] font-medium px-2.5 py-1 rounded-full" style="${tint(col(s.color))}">${s.credits} tín chỉ</span>
      <h3 class="font-bold text-sm mt-3">${esc(s.name)}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Giảng viên: ${esc(s.teacher || 'Chưa nhập')}</p>${prog(s)}</div>
      <button onclick="openCourseDetail(this.dataset.n)" data-n="${esc(s.name)}" class="mt-4 w-full py-2 text-white text-xs font-semibold rounded-lg transition hover:opacity-90" style="background:${col(s.color)}">Vào lớp học →</button></div></div>`).join('');
    const tab = $('courseCards');
    const tools = s => `<div class="no-print absolute top-2 right-2 flex gap-1">
        <button type="button" onclick="EduTT.edit(this.dataset.id)" data-id="${esc(s.id)}" aria-label="Sửa môn" title="Sửa môn" class="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 text-gray-500 hover:text-blue-600"><i class="fa-solid fa-pen text-xs"></i></button>
        <button type="button" onclick="EduTT.del(this.dataset.id)" data-id="${esc(s.id)}" aria-label="Xóa môn" title="Xóa môn" class="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 text-gray-500 hover:text-red-600"><i class="fa-solid fa-trash text-xs"></i></button></div>`;
    if (tab) tab.innerHTML = mi ? emptyBox(mi, 'md:col-span-2 lg:col-span-3') : subjects.map((s, i) => `<div class="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 overflow-hidden flex flex-col">
      ${tools(s)}${banner(s, i, 'h-24')}
      <div class="p-5 flex-1 flex flex-col"><span class="text-[11px] font-medium px-2.5 py-1 rounded-full w-fit" style="${tint(col(s.color))}">${esc(s.code || 'Môn học')} · ${s.credits} tín chỉ</span>
      <h3 class="font-bold text-base mt-3">${esc(s.name)}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Giảng viên: ${esc(s.teacher || 'Chưa nhập')}</p>
      <div class="text-xs space-y-1.5 text-gray-600 dark:text-gray-300 mt-3">${lines(s).map(l => `<p><i class="fa-solid fa-clock w-5 text-gray-400"></i>${l}</p>`).join('')}
        <p><i class="fa-solid fa-repeat w-5 text-gray-400"></i>${s.sessions} buổi/tuần × ${s.periods} tiết</p>
        ${(s.fixed || []).length ? `<p class="text-blue-600 dark:text-blue-400"><i class="fa-solid fa-lock w-5"></i>Cố định: ${s.fixed.map(f => `${dayName(f.day)} tiết ${f.start}`).join(', ')}</p>` : ''}</div>${prog(s)}
      <button onclick="openCourseDetail(this.dataset.n)" data-n="${esc(s.name)}" class="mt-4 w-full py-2 text-white text-xs font-semibold rounded-lg transition hover:opacity-90" style="background:${col(s.color)}">Chi tiết khóa học & Tài liệu →</button></div></div>`).join('');
  }

  const all = () => { load(); today(); courses(); };
  all();
  setInterval(today, 60000);                       // cập nhật trạng thái "Đang diễn ra"
  window.addEventListener('storage', all);          // đồng bộ khi sửa ở tab khác
  // Sửa môn / xếp lại lịch (timetable.js) -> vẽ lại tất cả; nộp bài -> cập nhật tiến độ
  document.addEventListener('eduhub:data', e => { const k = (e.detail && e.detail.key) || ''; (k === SKEY || k === TKEY) ? all() : courses(); });
})();
