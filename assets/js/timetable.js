/* EduHub - Môn học & Thời khóa biểu (gộp từ trang timetable.html cũ vào tab "Môn học & TKB" của index.html).
   - Thêm / sửa / xóa môn học (hộp thoại)
   - Tự động xếp thời khóa biểu: không trùng tiết, không học vắt qua giờ nghỉ trưa
   - Bấm vào ô để nhập phòng học, xuất CSV, in
   Thẻ môn học + lịch hôm nay ở Tổng quan vẫn do schedule.js vẽ (dùng chung dữ liệu). */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const col = c => /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#2563eb';   // chặn chèn mã độc qua trường màu
  const dayName = d => d == 8 ? 'CN' : 'Thứ ' + d;
  const COLORS = ['#2563eb', '#9333ea', '#059669', '#d97706', '#e11d48', '#0891b2', '#4f46e5', '#ea580c'];
  // Tiết 1-5: sáng, tiết 6-10: chiều (mỗi tiết 50 phút, nghỉ 5 phút giữa các tiết)
  const PT = [['07:00', '07:50'], ['07:55', '08:45'], ['08:50', '09:40'], ['09:45', '10:35'], ['10:40', '11:30'], ['13:00', '13:50'], ['13:55', '14:45'], ['14:50', '15:40'], ['15:45', '16:35'], ['16:40', '17:30']];
  const INP = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500';
  const LBL = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

  const KEY = EduHub.userKey('eduhub_subjects'), TKEY = EduHub.userKey('eduhub_timetable');
  let subjects = [], tt = null;
  function load() {
    const s = EduHub.get(KEY, []); subjects = Array.isArray(s) ? s : [];
    subjects.forEach(x => { if (!Array.isArray(x.fixed)) x.fixed = []; });
    tt = EduHub.get(TKEY, null);
  }
  const save = () => EduHub.set(KEY, subjects);
  const sig = () => JSON.stringify(subjects);

  /* ================= HỘP THOẠI MÔN HỌC ================= */
  let editId = null, color = COLORS[0], fixed = [];
  function buildForm() {
    const m = document.createElement('div');
    m.id = 'subjectModal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'sfTitle');
    m.className = 'no-print fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    m.innerHTML = `<form id="sfForm" class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center"><h3 id="sfTitle" class="text-lg font-bold">Thêm môn học</h3>
        <button type="button" data-eh-close aria-label="Đóng hộp thoại" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark text-xl"></i></button></div>
      <div><label class="${LBL}" for="sfName">Tên môn *</label><input id="sfName" class="${INP}" placeholder="VD: Lập trình Web" maxlength="80" required></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="${LBL}" for="sfCode">Mã môn</label><input id="sfCode" class="${INP}" placeholder="IT402" maxlength="20"></div>
        <div><label class="${LBL}" for="sfCredits">Số tín chỉ</label><input id="sfCredits" type="number" min="1" max="10" value="3" class="${INP}"></div>
      </div>
      <div><label class="${LBL}" for="sfTeacher">Giảng viên</label><input id="sfTeacher" class="${INP}" placeholder="TS. Nguyễn Văn B" maxlength="60"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="${LBL}" for="sfSessions">Số buổi / tuần</label><input id="sfSessions" type="number" min="1" max="5" value="1" class="${INP}"></div>
        <div><label class="${LBL}" for="sfPeriods">Số tiết / buổi</label><input id="sfPeriods" type="number" min="1" max="5" value="3" class="${INP}"></div>
      </div>
      <div><span class="${LBL}">Màu hiển thị</span><div id="sfSwatches" class="flex flex-wrap gap-2"></div></div>
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="${LBL} !mb-0">Buổi học cố định (nếu đã có lịch)</span>
          <button type="button" id="sfAddFixed" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"><i class="fa-solid fa-plus mr-1"></i>Thêm</button>
        </div>
        <div id="sfFixed" class="space-y-2"></div>
        <p class="text-[11px] text-gray-400 mt-1">Các buổi còn lại sẽ được tự động xếp khi bấm "Tạo lịch".</p>
      </div>
      <p id="sfErr" class="hidden text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"></p>
      <div class="flex justify-end gap-2">
        <button type="button" data-eh-close class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-xs font-medium rounded-xl">Hủy</button>
        <button type="submit" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl"><i class="fa-solid fa-floppy-disk mr-1"></i><span id="sfSaveTxt">Lưu môn học</span></button>
      </div></form>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-eh-close]')) closeForm(); });
    $('sfAddFixed').onclick = () => { fixed.push({ day: 2, start: 1, room: '' }); renderFixed(); };
    $('sfSwatches').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { color = b.dataset.c; renderSwatches(); } });
    // Sửa / xóa buổi cố định (ủy quyền sự kiện, không dùng biến toàn cục)
    const fx = $('sfFixed');
    fx.addEventListener('change', e => { const i = +e.target.dataset.i, k = e.target.dataset.k; if (fixed[i] && (k === 'day' || k === 'start')) fixed[i][k] = +e.target.value; });
    fx.addEventListener('input', e => { const i = +e.target.dataset.i; if (fixed[i] && e.target.dataset.k === 'room') fixed[i].room = e.target.value.slice(0, 30); });
    fx.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { fixed.splice(+b.dataset.rm, 1); renderFixed(); } });
    $('sfForm').addEventListener('submit', submit);
  }
  function renderSwatches() {
    $('sfSwatches').innerHTML = COLORS.map(c => `<button type="button" data-c="${c}" aria-label="Màu ${c}" class="w-7 h-7 rounded-full ${c === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-slate-800' : ''}" style="background:${c}"></button>`).join('');
  }
  function renderFixed() {
    $('sfFixed').innerHTML = fixed.map((f, i) => `<div class="flex gap-2 items-center">
      <select class="${INP}" data-i="${i}" data-k="day" aria-label="Thứ">${[2, 3, 4, 5, 6, 7, 8].map(d => `<option value="${d}" ${f.day == d ? 'selected' : ''}>${dayName(d)}</option>`).join('')}</select>
      <select class="${INP}" data-i="${i}" data-k="start" aria-label="Tiết bắt đầu">${Array.from({ length: 10 }, (_, k) => `<option value="${k + 1}" ${f.start == k + 1 ? 'selected' : ''}>Tiết ${k + 1}</option>`).join('')}</select>
      <input class="${INP}" data-i="${i}" data-k="room" placeholder="Phòng" maxlength="30" value="${esc(f.room)}" aria-label="Phòng">
      <button type="button" data-rm="${i}" aria-label="Xóa buổi" class="text-red-500 px-1"><i class="fa-solid fa-trash"></i></button></div>`).join('')
      || '<p class="text-xs text-gray-400">Chưa có buổi cố định — hệ thống sẽ tự xếp.</p>';
  }
  function validate(o) {
    if (!o.name) return 'Vui lòng nhập tên môn.';
    if (!(o.sessions >= 1 && o.sessions <= 5) || !(o.periods >= 1 && o.periods <= 5)) return 'Số buổi/tuần và số tiết/buổi phải từ 1 đến 5.';
    if (o.fixed.length > o.sessions) return 'Số buổi cố định không được vượt quá số buổi/tuần.';
    for (const f of o.fixed) {
      const end = f.start + o.periods - 1;
      if (end > 10 || (f.start <= 5) !== (end <= 5)) return `Buổi ${dayName(f.day)} tiết ${f.start} không hợp lệ: một buổi phải nằm trọn trong buổi sáng (tiết 1-5) hoặc buổi chiều (tiết 6-10).`;
    }
    const ks = o.fixed.map(f => f.day + '-' + f.start);
    if (new Set(ks).size < ks.length) return 'Có hai buổi cố định trùng thời gian.';
    return '';
  }
  function openForm(id) {
    if (!$('subjectModal')) buildForm();
    const s = id ? subjects.find(x => x.id === id) : null;
    editId = s ? s.id : null;
    fixed = s ? s.fixed.map(f => ({ ...f })) : [];
    color = s ? col(s.color) : COLORS[subjects.length % COLORS.length];
    $('sfName').value = s ? s.name : ''; $('sfCode').value = s ? (s.code || '') : '';
    $('sfCredits').value = s ? s.credits : 3; $('sfTeacher').value = s ? (s.teacher || '') : '';
    $('sfSessions').value = s ? s.sessions : 1; $('sfPeriods').value = s ? s.periods : 3;
    $('sfTitle').textContent = s ? 'Sửa môn học' : 'Thêm môn học';
    $('sfSaveTxt').textContent = s ? 'Cập nhật' : 'Lưu môn học';
    $('sfErr').classList.add('hidden');
    renderSwatches(); renderFixed();
    $('subjectModal').classList.remove('hidden');
    setTimeout(() => $('sfName').focus(), 30);
  }
  function closeForm() { const m = $('subjectModal'); if (m) m.classList.add('hidden'); editId = null; }
  function submit(e) {
    e.preventDefault();
    const o = {
      id: editId || Date.now().toString(36), name: $('sfName').value.trim(), code: $('sfCode').value.trim(), credits: +$('sfCredits').value || 0,
      teacher: $('sfTeacher').value.trim(), sessions: +$('sfSessions').value, periods: +$('sfPeriods').value, color, fixed: fixed.map(f => ({ ...f }))
    };
    const err = validate(o);
    if (err) { $('sfErr').textContent = err; $('sfErr').classList.remove('hidden'); return; }
    const prev = subjects.slice(), i = subjects.findIndex(s => s.id === o.id), isNew = i < 0;
    isNew ? subjects.push(o) : subjects[i] = o;
    if (!save()) { subjects = prev; $('sfErr').textContent = 'Không lưu được: trình duyệt đang chặn lưu trữ hoặc đã đầy bộ nhớ.'; $('sfErr').classList.remove('hidden'); return; }
    closeForm(); render();
    EduHub.toast(isNew ? 'Đã thêm môn "' + o.name + '". Vào tab Thời khóa biểu để xếp lịch.' : 'Đã cập nhật môn học.', 'success');
  }
  function del(id) {
    const s = subjects.find(x => x.id === id); if (!s) return;
    if (!confirm('Xóa môn "' + s.name + '"?')) return;
    const prev = subjects; subjects = subjects.filter(x => x.id !== id);
    if (!save()) { subjects = prev; EduHub.toast('Không xóa được vì không lưu được dữ liệu.', 'error'); return; }
    render();
  }

  /* ================= XẾP THỜI KHÓA BIỂU ================= */
  function initControls() {
    $('ttMax').innerHTML = [4, 6, 8, 10].map(n => `<option value="${n}" ${n == 8 ? 'selected' : ''}>${n} tiết</option>`).join('');
    $('ttDays').innerHTML = [2, 3, 4, 5, 6, 7, 8].map(d => `<label class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 cursor-pointer"><input type="checkbox" value="${d}" ${d <= 7 ? 'checked' : ''}>${dayName(d)}</label>`).join('');
    [$('ttMax'), $('ttMode'), $('ttPref')].forEach(el => el.className = INP);
    applySettings(tt && tt.settings);
    $('ttGen').onclick = run; $('ttRegen').onclick = run; $('ttCsv').onclick = exportCSV;
  }
  const readSettings = () => ({ days: [...document.querySelectorAll('#ttDays input:checked')].map(i => +i.value), max: +$('ttMax').value, mode: $('ttMode').value, pref: $('ttPref').value });
  function applySettings(s) {
    if (!s) return;
    document.querySelectorAll('#ttDays input').forEach(i => i.checked = (s.days || []).includes(+i.value));
    $('ttMax').value = s.max; $('ttMode').value = s.mode; $('ttPref').value = s.pref;
  }
  // Thuật toán: tham lam + chấm điểm, có yếu tố ngẫu nhiên để tạo phương án khác
  function generate() {
    const st = readSettings(), occ = {}, load = {}, sd = {}, out = [], warns = [], fixedPlaced = {};
    const prevRooms = (tt && tt.rooms) || {};
    if (!st.days.length) { warns.push('Hãy chọn ít nhất một ngày học.'); return { st, out, warns }; }
    const free = (d, a, l) => { for (let p = a; p < a + l; p++) if (occ[d + '-' + p]) return false; return true; };
    const put = (s, d, a, fx, room) => { for (let p = a; p < a + s.periods; p++) occ[d + '-' + p] = s.id; load[d] = (load[d] || 0) + s.periods; (sd[s.id] = sd[s.id] || new Set()).add(d); out.push({ sid: s.id, day: d, start: a, len: s.periods, room, fixed: fx }); };
    // 1) Buổi cố định (giữ nguyên, chỉ cảnh báo nếu vi phạm cài đặt)
    subjects.forEach(s => s.fixed.forEach(f => {
      if (!free(f.day, f.start, s.periods)) { warns.push(`${s.name}: buổi cố định ${dayName(f.day)} tiết ${f.start} bị trùng với môn khác nên được chuyển sang xếp tự động.`); return; }
      if ((load[f.day] || 0) + s.periods > st.max) warns.push(`${s.name}: buổi cố định ${dayName(f.day)} làm ngày này vượt quá ${st.max} tiết/ngày (vẫn giữ nguyên vì bạn đã cố định).`);
      if (!st.days.includes(f.day)) warns.push(`${s.name}: buổi cố định ${dayName(f.day)} nằm ngoài các ngày học đã chọn (vẫn giữ nguyên).`);
      put(s, f.day, f.start, true, f.room); fixedPlaced[s.id] = (fixedPlaced[s.id] || 0) + 1;
    }));
    // 2) Các buổi còn lại: môn dài / nhiều tín chỉ xếp trước
    const tasks = []; subjects.forEach(s => { for (let i = fixedPlaced[s.id] || 0; i < s.sessions; i++) tasks.push({ s, r: Math.random() }); });
    tasks.sort((a, b) => b.s.periods - a.s.periods || b.s.credits - a.s.credits || a.r - b.r);
    tasks.forEach(({ s }) => {
      let best = null, bs = -1e9;
      st.days.forEach(d => {
        if (sd[s.id] && sd[s.id].has(d)) return;            // mỗi môn tối đa 1 buổi / ngày
        const L = load[d] || 0; if (L + s.periods > st.max) return;
        for (let a = 1; a + s.periods - 1 <= 10; a++) {
          const e = a + s.periods - 1;
          if ((a <= 5) !== (e <= 5) || !free(d, a, s.periods)) continue;   // không vắt qua giờ nghỉ trưa
          let sc = Math.random() * 1.5;
          sc += st.mode === 'spread' ? -L * 3 : (L ? 5 : 0) + (occ[d + '-' + (a - 1)] || occ[d + '-' + (e + 1)] ? 2 : 0);
          if (st.pref === 'morning' && a <= 5) sc += 2;
          if (st.pref === 'afternoon' && a > 5) sc += 2;
          if (sc > bs) { bs = sc; best = { d, a }; }
        }
      });
      best ? put(s, best.d, best.a, false, prevRooms[s.id] || '') : warns.push(`Không đủ chỗ để xếp đủ số buổi của môn "${s.name}". Hãy thêm ngày học hoặc tăng số tiết tối đa/ngày.`);
    });
    return { st, out, warns };
  }
  function run() {
    if (!subjects.length) return;
    const r = generate();
    const rooms = Object.fromEntries(Object.entries((tt && tt.rooms) || {}).filter(([k]) => subjects.some(s => s.id === k)));
    tt = { settings: r.st, placements: r.out, warns: r.warns, sig: sig(), rooms };
    if (!EduHub.set(TKEY, tt)) EduHub.toast('Không lưu được thời khóa biểu: trình duyệt đang chặn lưu trữ hoặc đã đầy bộ nhớ.', 'error');
    renderTT();
  }

  /* ================= HIỂN THỊ ================= */
  function renderSummary() {
    const el = $('ttSummary'); if (!el) return;
    const tc = subjects.reduce((a, s) => a + (s.credits || 0), 0);
    el.textContent = subjects.length ? `${subjects.length} môn · ${tc} tín chỉ` : 'Thêm môn học rồi bấm "Tạo lịch" để hệ thống tự xếp thời khóa biểu.';
  }
  function renderTT() {
    const has = subjects.length;
    $('ttEmpty').classList.toggle('hidden', !!has); $('ttApp').classList.toggle('hidden', !has);
    if (!has) return;
    const warnsEl = $('ttWarns'), notice = $('ttNotice');
    notice.classList.add('hidden');
    if (!tt) { $('ttResult').classList.add('hidden'); warnsEl.innerHTML = ''; return; }
    if (tt.sig !== sig()) {
      notice.className = 'text-xs rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300';
      notice.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i>Danh sách môn học đã thay đổi từ lần xếp trước. Bấm <b>Tạo lịch</b> để cập nhật.';
    }
    const byId = Object.fromEntries(subjects.map(s => [s.id, s]));
    const pl = (tt.placements || []).filter(p => byId[p.sid]);
    warnsEl.innerHTML = (tt.warns || []).map(w => `<div class="text-xs rounded-xl px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"><i class="fa-solid fa-circle-exclamation mr-1"></i>${esc(w)}</div>`).join('');
    $('ttResult').classList.toggle('hidden', !pl.length); if (!pl.length) return;
    const days = [...new Set([...((tt.settings && tt.settings.days) || [2, 3, 4, 5, 6, 7]), ...pl.map(p => p.day)])].sort((a, b) => a - b);
    const jsDay = new Date().getDay(), today = jsDay === 0 ? 8 : jsDay + 1;
    const starts = {}, cover = {};
    pl.forEach(p => { starts[p.day + '-' + p.start] = p; for (let i = 1; i < p.len; i++) cover[p.day + '-' + (p.start + i)] = 1; });
    let h = `<thead><tr class="bg-gray-50 dark:bg-slate-700/40 text-gray-500"><th class="p-3 w-24 text-left">Tiết</th>${days.map(d => `<th class="p-3 ${d === today ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}">${dayName(d)}${d === today ? ' (Hôm nay)' : ''}</th>`).join('')}</tr></thead><tbody>`;
    for (let p = 1; p <= 10; p++) {
      if (p === 6) h += `<tr><td colspan="${days.length + 1}" class="py-1 text-center text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-slate-700/20">Nghỉ trưa</td></tr>`;
      h += `<tr class="border-t border-gray-100 dark:border-slate-700"><td class="p-2 text-gray-400 whitespace-nowrap"><b class="text-gray-600 dark:text-gray-300">Tiết ${p}</b><br><span class="text-[10px]">${PT[p - 1][0]}–${PT[p - 1][1]}</span></td>`;
      days.forEach(d => {
        const k = d + '-' + p; if (cover[k]) return;
        const x = starts[k];
        if (!x) { h += `<td class="p-1 ${d === today ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}"></td>`; return; }
        const s = byId[x.sid], ix = tt.placements.indexOf(x);
        h += `<td rowspan="${x.len}" class="p-1 align-top"><div role="button" tabindex="0" data-room="${ix}" title="Bấm để nhập phòng học" class="h-full rounded-lg p-2 text-white cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70" style="background:${col(s.color)};min-height:${x.len * 2.6}rem">
          <p class="font-bold leading-tight">${x.fixed ? '<i class="fa-solid fa-lock text-[9px] mr-1 opacity-80"></i>' : ''}${esc(s.name)}</p>
          <p class="text-[10px] opacity-90 mt-0.5">${esc(s.code)}${s.code ? ' · ' : ''}Tiết ${x.start}–${x.start + x.len - 1}</p>
          ${x.room ? `<p class="text-[10px] opacity-90"><i class="fa-solid fa-location-dot mr-0.5"></i>${esc(x.room)}</p>` : '<p class="no-print text-[10px] opacity-70 italic">+ Thêm phòng</p>'}
          ${s.teacher ? `<p class="text-[10px] opacity-90">${esc(s.teacher)}</p>` : ''}</div></td>`;
      });
      h += '</tr>';
    }
    $('ttGrid').innerHTML = h + '</tbody>';
    $('ttStats').textContent = `${pl.length} buổi · ${pl.reduce((a, p) => a + p.len, 0)} tiết/tuần · ${new Set(pl.map(p => p.day)).size} ngày học`;
  }
  function exportCSV() {
    if (!tt) return;
    const byId = Object.fromEntries(subjects.map(s => [s.id, s]));
    const rows = [['Môn', 'Mã môn', 'Giảng viên', 'Thứ', 'Tiết', 'Giờ', 'Phòng']];
    tt.placements.filter(p => byId[p.sid]).sort((a, b) => a.day - b.day || a.start - b.start).forEach(p => {
      const s = byId[p.sid], e = p.start + p.len - 1;
      rows.push([s.name, s.code, s.teacher, dayName(p.day), `${p.start}-${e}`, `${PT[p.start - 1][0]}-${PT[e - 1][1]}`, p.room]);
    });
    const csv = '﻿' + rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'thoi-khoa-bieu.csv'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---- Nhập / sửa phòng học cho từng buổi ---- */
  let roomIdx = null;
  function buildRoom() {
    const m = document.createElement('div');
    m.id = 'roomModal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'roomTitle');
    m.className = 'no-print fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4';
    m.innerHTML = `<div class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
      <div class="flex justify-between items-center"><h3 id="roomTitle" class="text-lg font-bold">Phòng học</h3><button type="button" data-eh-close aria-label="Đóng hộp thoại" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark text-xl"></i></button></div>
      <p id="roomSub" class="text-xs text-gray-500 dark:text-gray-400"></p>
      <div><label class="${LBL}" for="roomInput">Phòng</label><input id="roomInput" maxlength="30" class="${INP}" placeholder="VD: A101"></div>
      <p class="text-[11px] text-gray-400">Phòng này được dùng lại cho các buổi tự xếp của môn.</p>
      <div class="flex justify-end gap-2"><button type="button" data-eh-close class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-xs font-medium rounded-xl">Hủy</button><button type="button" id="roomSave" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl">Lưu</button></div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-eh-close]')) closeRoom(); });
    $('roomSave').onclick = saveRoom;
    $('roomInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveRoom(); } });
  }
  function editRoom(i) {
    const p = tt && tt.placements[i]; if (!p) return;
    const s = subjects.find(x => x.id === p.sid); if (!s) return;
    if (!$('roomModal')) buildRoom();
    roomIdx = i;
    $('roomSub').textContent = `${s.name} · ${dayName(p.day)} · tiết ${p.start}–${p.start + p.len - 1}`;
    $('roomInput').value = p.room || '';
    $('roomModal').classList.remove('hidden');
    $('roomInput').focus();
  }
  function closeRoom() { const m = $('roomModal'); if (m) m.classList.add('hidden'); roomIdx = null; }
  function saveRoom() {
    const p = tt && tt.placements[roomIdx]; if (!p) { closeRoom(); return; }
    const room = $('roomInput').value.trim().slice(0, 30), prev = JSON.stringify(tt);
    p.room = room; tt.rooms = tt.rooms || {};
    if (room) tt.rooms[p.sid] = room; else delete tt.rooms[p.sid];
    if (!EduHub.set(TKEY, tt)) { tt = JSON.parse(prev); EduHub.toast('Không lưu được phòng học.', 'error'); return; }
    closeRoom(); renderTT();
  }

  /* ---- Khởi động ---- */
  function render() { renderSummary(); renderTT(); }
  load();
  if (!$('ttGrid')) return;   // trang không có tab Môn học & TKB
  initControls();
  $('ttGrid').addEventListener('click', e => { const c = e.target.closest('[data-room]'); if (c) editRoom(+c.dataset.room); });
  $('ttGrid').addEventListener('keydown', e => {
    const c = e.target.closest('[data-room]');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); editRoom(+c.dataset.room); }
  });
  render();
  // Dữ liệu đổi ở tab khác hoặc kéo về từ máy chủ
  window.addEventListener('storage', e => { if (!e.key || e.key === KEY || e.key === TKEY) { load(); applySettings(tt && tt.settings); render(); } });
  // Mở sẵn hộp thoại thêm môn khi vào bằng liên kết ...?tab=courses&add=1
  if (new URLSearchParams(location.search).get('add') === '1') {
    try { history.replaceState(null, '', '?tab=courses'); } catch (e) {}
    setTimeout(() => openForm(), 50);
  }

  window.EduTT = { openForm, edit: openForm, del, run };
})();
