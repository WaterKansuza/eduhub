/* EduHub dashboard behavior. Loaded after shared dependencies in index.html. */

/* Dashboard behavior */

/* ---------- Nền sao Chrono-Cosmos ---------- */
(function () {
    'use strict';

    const canvas = document.getElementById('spaceCanvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const stars = [];
    const starCount = 90;
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let shootingStar = null;
    let nextShootingStar = Date.now() + 14000;

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        while (stars.length < starCount) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.4 + 0.35,
                alpha: Math.random() * 0.55 + 0.2,
                drift: Math.random() * 0.12 + 0.025,
                phase: Math.random() * Math.PI * 2,
                colorIndex: Math.random() > 0.72 ? 0 : 1
            });
        }
    }

    function draw(time) {
        const isDark = document.documentElement.classList.contains('dark');
        const starColors = isDark ? ['#5CE1E6', '#B9B2FF'] : ['#2563EB', '#7C3AED'];
        const constellationColor = isDark ? '#8B7CFF' : '#64748B';
        context.clearRect(0, 0, width, height);
        const visibleStars = stars.filter(star => star.y < height + 12);

        visibleStars.forEach(star => {
            star.y += star.drift;
            if (star.y > height + 12) {
                star.y = -12;
                star.x = Math.random() * width;
            }

            const pulse = star.alpha + Math.sin(time * 0.001 + star.phase) * 0.12;
            context.beginPath();
            context.fillStyle = starColors[star.colorIndex];
            context.globalAlpha = Math.max(0.08, pulse);
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            context.fill();
        });

        context.globalAlpha = 0.16;
        for (let i = 0; i < visibleStars.length; i += 1) {
            const first = visibleStars[i];
            for (let j = i + 1; j < visibleStars.length; j += 1) {
                const second = visibleStars[j];
                const dx = first.x - second.x;
                const dy = first.y - second.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 120) continue;

                context.beginPath();
                context.strokeStyle = constellationColor;
                context.lineWidth = 0.5;
                context.moveTo(first.x, first.y);
                context.lineTo(second.x, second.y);
                context.stroke();
            }
        }

        if (!shootingStar && Date.now() >= nextShootingStar) {
            shootingStar = {
                x: Math.random() * width * 0.7,
                y: Math.random() * height * 0.4,
                progress: 0,
                length: Math.random() * 36 + 48,
                speed: Math.random() * 3 + 5
            };
        }

        if (shootingStar) {
            const star = shootingStar;
            star.progress += star.speed;
            const distance = star.progress;
            const gradient = context.createLinearGradient(
                star.x + distance,
                star.y + distance * 0.45,
                star.x + distance - star.length,
                star.y + (distance - star.length) * 0.45
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.35, 'rgba(92, 225, 230, 0.52)');
            gradient.addColorStop(1, 'rgba(139, 124, 255, 0)');
            context.beginPath();
            context.strokeStyle = gradient;
            context.lineWidth = 1.5;
            context.moveTo(star.x + distance, star.y + distance * 0.45);
            context.lineTo(star.x + distance - star.length, star.y + (distance - star.length) * 0.45);
            context.stroke();

            if (distance > width * 0.55) {
                shootingStar = null;
                nextShootingStar = Date.now() + 18000 + Math.random() * 18000;
            }
        }

        context.globalAlpha = 1;
        animationFrame = window.requestAnimationFrame(draw);
    }

    function stop() {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else animationFrame = window.requestAnimationFrame(draw);
    });
    animationFrame = window.requestAnimationFrame(draw);
})();

/* ---------- Chuyển tab (hỗ trợ deep-link ?tab=... và F5 giữ nguyên tab) ---------- */
const TABS = ['dashboard', 'courses', 'schedule', 'assignments', 'grades', 'exams', 'notifications', 'settings'];
function switchTab(tabName, skipHash) {
    if (TABS.indexOf(tabName) < 0) tabName = 'dashboard';
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-400');
        nav.classList.add('text-gray-600', 'dark:text-gray-300');
    });

    // "Môn học" và "Thời khóa biểu" là 2 tab con của cùng mục "Môn học & TKB"
    const merged = tabName === 'courses' || tabName === 'schedule';
    const targetTab = document.getElementById('tab-' + (merged ? 'courses' : tabName));
    if (targetTab) targetTab.classList.remove('hidden');
    if (merged) {
        ['courses', 'schedule'].forEach(s => {
            const on = s === tabName, b = document.getElementById('sub-' + s);
            document.getElementById('pane-' + s).classList.toggle('hidden', !on);
            b.setAttribute('aria-selected', on ? 'true' : 'false');
            b.classList.toggle('bg-blue-600', on); b.classList.toggle('text-white', on);
            b.classList.toggle('text-gray-500', !on); b.classList.toggle('dark:text-gray-400', !on);
        });
    }

    const activeNav = document.getElementById('nav-' + (merged ? 'courses' : tabName));
    if (activeNav) {
        activeNav.classList.add('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-400');
        activeNav.classList.remove('text-gray-600', 'dark:text-gray-300');
    }
    if (!skipHash) { try { history.replaceState(null, '', '?tab=' + tabName); } catch (e) { } }
    closeSidebarMobile();
    document.dispatchEvent(new CustomEvent('eduhub:tab', { detail: { tab: tabName } }));
}

/* ---------- Sidebar trên mobile + lớp phủ ---------- */
function openSidebarMobile() {
    document.getElementById('sidebar').classList.remove('-translate-x-full');
    document.getElementById('sidebarOverlay').classList.remove('hidden');
    document.getElementById('openSidebarMobile').setAttribute('aria-expanded', 'true');
}
function closeSidebarMobile() {
    document.getElementById('sidebar').classList.add('-translate-x-full');
    document.getElementById('sidebarOverlay').classList.add('hidden');
    const b = document.getElementById('openSidebarMobile');
    if (b) b.setAttribute('aria-expanded', 'false');
}
document.getElementById('openSidebarMobile').addEventListener('click', openSidebarMobile);
document.getElementById('closeSidebarMobile').addEventListener('click', closeSidebarMobile);
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebarMobile);

/* ---------- Dropdown thông báo ---------- */
function toggleNotifDropdown() {
    document.getElementById('notifDropdown').classList.toggle('hidden');
}
document.addEventListener('click', e => {
    const dd = document.getElementById('notifDropdown'), btn = document.getElementById('notifDropdownBtn');
    if (dd && btn && !dd.classList.contains('hidden') && !dd.contains(e.target) && !btn.contains(e.target)) dd.classList.add('hidden');
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { const dd = document.getElementById('notifDropdown'); if (dd) dd.classList.add('hidden'); }
});

/* ---------- Hộp thoại chi tiết môn học ---------- */
function openCourseDetail(courseName) {
    document.getElementById('courseModalTitle').innerText = courseName;
    document.getElementById('courseModal').classList.remove('hidden');
}
function closeCourseModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

/* ---------- Tìm kiếm toàn cục (trước đây không có xử lý nào) ---------- */
(function () {
    const input = document.getElementById('globalSearch'), box = document.getElementById('searchResults');
    if (!input || !box) return;
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const vnd = d => { const x = new Date(d); return isNaN(x) ? '' : x.toLocaleDateString('vi-VN'); };
    function find(q) {
        q = q.trim().toLowerCase();
        if (!q) return [];
        const out = [];
        const subs = EduHub.get(EduHub.userKey('eduhub_subjects'), []);
        (Array.isArray(subs) ? subs : []).forEach(s => {
            if ((s.name + ' ' + (s.code || '') + ' ' + (s.teacher || '')).toLowerCase().indexOf(q) >= 0)
                out.push({ icon: 'fa-book', label: s.name, sub: (s.code || 'Môn học') + ' · ' + (s.teacher || 'chưa có giảng viên'), tab: 'courses' });
        });
        const as = EduHub.get(EduHub.userKey('eduhub_assignments'), []);
        (Array.isArray(as) ? as : []).forEach(a => {
            if ((a.title + ' ' + (a.subject || '')).toLowerCase().indexOf(q) >= 0)
                out.push({ icon: 'fa-list-check', label: a.title, sub: (a.subject || 'Bài tập') + ' · hạn ' + vnd(a.due), tab: 'assignments' });
        });
        const ex = EduHub.get(EduHub.userKey('eduhub_exams'), []);
        (Array.isArray(ex) ? ex : []).forEach(x => {
            if ((x.subject + ' ' + (x.room || '')).toLowerCase().indexOf(q) >= 0)
                out.push({ icon: 'fa-file-pen', label: x.subject, sub: 'Thi ' + vnd(x.date) + (x.room ? ' · ' + x.room : ''), tab: 'exams' });
        });
        return out.slice(0, 8);
    }
    function draw() {
        if (!input.value.trim()) { box.classList.add('hidden'); return; }
        const list = find(input.value);
        box.innerHTML = list.length
            ? list.map(r => '<button type="button" data-tab="' + r.tab + '" class="w-full text-left flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700/50"><i class="fa-solid ' + r.icon + ' text-gray-400 mt-0.5"></i><span class="min-w-0"><span class="block text-xs font-semibold truncate">' + esc(r.label) + '</span><span class="block text-[11px] text-gray-400 truncate">' + esc(r.sub) + '</span></span></button>').join('')
            : '<p class="px-4 py-3 text-xs text-gray-400">Không tìm thấy kết quả nào.</p>';
        box.classList.remove('hidden');
        box.querySelectorAll('button[data-tab]').forEach(b => b.addEventListener('click', () => {
            switchTab(b.dataset.tab); box.classList.add('hidden'); input.value = '';
        }));
    }
    input.addEventListener('input', draw);
    input.addEventListener('focus', draw);
    document.addEventListener('click', e => { const w = document.getElementById('searchWrap'); if (w && !w.contains(e.target)) box.classList.add('hidden'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') box.classList.add('hidden'); });
})();

/* Chrono-cosmos dashboard indicators */
(function () {
    'use strict';

    const DAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const getUserEmail = () => {
        try {
            const user = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session') || 'null');
            return (user && user.email) || 'guest';
        } catch {
            return 'guest';
        }
    };

    function updateClock() {
        const now = new Date();
        const time = document.getElementById('chronoTime');
        const date = document.getElementById('todayDateLabel');
        if (time) time.textContent = now.toLocaleTimeString('vi-VN', { hour12: false });
        if (date) date.textContent = DAYS[now.getDay()] + ', ' + now.toLocaleDateString('vi-VN');
    }

    function updateWarpProgress() {
        const email = getUserEmail();
        let db;
        try { db = JSON.parse(localStorage.getItem('eduhub_records_' + email) || 'null'); } catch { db = null; }
        const text = document.getElementById('heroWarpText');
        const bar = document.getElementById('heroWarpBar');
        const rank = document.getElementById('heroGpaRank');
        const gpa = document.getElementById('heroGPA');
        const subjects = document.getElementById('heroSubjectNum');
        let credits = 0, totalPoints = 0, totalCourses = 0;
        const grade4 = value => value >= 9 ? 4 : value >= 8.5 ? 3.7 : value >= 8 ? 3.5 : value >= 7 ? 3 : value >= 6.5 ? 2.5 : value >= 5.5 ? 2 : value >= 5 ? 1.5 : value >= 4 ? 1 : 0;

        if (db && Array.isArray(db.sems)) {
            db.sems.forEach(semester => (semester.subs || []).forEach(subject => {
                const credit = Number(subject.c), grade = Number(subject.g);
                if (credit > 0 && Number.isFinite(grade)) {
                    totalCourses++;
                    totalPoints += credit * grade4(grade);
                    if (grade >= 4) credits += credit;
                }
            }));
        }

        let subjectsData;
        try { subjectsData = JSON.parse(localStorage.getItem('eduhub_subjects_' + email) || '[]'); } catch { subjectsData = []; }
        if (subjects && Array.isArray(subjectsData)) subjects.textContent = subjectsData.length + ' môn';

        const totalCredits = Number(db && db.total) || 130;
        const percent = Math.min(100, Math.round((credits / totalCredits) * 100));
        if (text) text.textContent = credits + ' / ' + totalCredits + ' Tín chỉ (' + percent + '%)';
        if (bar) bar.style.width = percent + '%';
        if (!totalCourses) {
            if (rank) rank.textContent = '★ KHÁM PHÁ ★';
            return;
        }

        const average = totalPoints / totalCourses;
        if (gpa) gpa.textContent = average.toFixed(2);
        if (rank) rank.textContent = average >= 3.6 ? '★ TINH TÚ TỐI CAO ★'
            : average >= 3.2 ? '★ CHỈ HUY HẠM ĐỘI ★'
                : average >= 2.5 ? '★ NHÀ DU HÀNH ★' : '★ TÂN THỦ VŨ TRỤ ★';
    }

    updateClock();
    updateWarpProgress();
    window.setInterval(updateClock, 1000);
    document.addEventListener('eduhub:data', updateWarpProgress);
})();

/* ---------- Cài đặt: đổi mật khẩu, khôi phục, xóa dữ liệu ---------- */
async function changePassword() {
    const msg = document.getElementById('pwMsg');
    const show = (t, ok) => {
        msg.textContent = t;
        msg.className = 'text-xs rounded-lg px-3 py-2 ' + (ok ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20');
        msg.classList.remove('hidden');
    };
    const session = EduHub.session();
    if (!session) return show('Bạn cần đăng nhập lại.', false);
    if (session.provider === 'google') return show('Tài khoản Google không có mật khẩu để đổi.', false);
    const n1 = document.getElementById('pwNew').value, n2 = document.getElementById('pwNew2').value;
    if (n1.length < 8) return show('Mật khẩu mới phải có ít nhất 8 ký tự.', false);
    if (n1 !== n2) return show('Mật khẩu nhập lại không khớp.', false);
    const users = EduHub.get(EduHub.CFG.USERS_KEY, []) || [];
    const u = users.find(x => x.email === session.email);
    if (!u) return show('Không tìm thấy tài khoản.', false);
    if (!await EduHub.verifyPassword(document.getElementById('pwOld').value, u)) return show('Mật khẩu hiện tại không đúng.', false);
    u.passwordHash = await EduHub.hashPassword(n1);
    u.passwordUpdatedAt = Date.now();
    EduHub.set(EduHub.CFG.USERS_KEY, users);
    document.getElementById('pwOld').value = document.getElementById('pwNew').value = document.getElementById('pwNew2').value = '';
    show('Đã cập nhật mật khẩu thành công.', true);
    EduHub.toast('Đã đổi mật khẩu.', 'success');
}
async function regenRecovery() {
    const msg = document.getElementById('rcMsg');
    const show = (t, ok) => {
        msg.textContent = t;
        msg.className = 'text-xs rounded-lg px-3 py-2 ' + (ok ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20');
        msg.classList.remove('hidden');
    };
    const session = EduHub.session();
    if (!session) return show('Bạn cần đăng nhập lại.', false);
    const users = EduHub.get(EduHub.CFG.USERS_KEY, []) || [];
    const u = users.find(x => x.email === session.email);
    if (!u || !u.passwordHash) return show('Tài khoản này không dùng mật khẩu (đăng nhập bằng Google).', false);
    const key = 'pw:' + session.email, lock = EduHub.attempt.remaining(key);
    if (lock) return show('Bạn đã nhập sai quá nhiều lần. Hãy thử lại sau ' + Math.ceil(lock / 60) + ' phút.', false);
    if (!await EduHub.verifyPassword(document.getElementById('rcPw').value, u)) {
        EduHub.attempt.fail(key);
        return show('Mật khẩu hiện tại không đúng.', false);
    }
    EduHub.attempt.ok(key);
    const code = EduHub.newRecoveryCode();
    u.recoveryHash = await EduHub.hashRecovery(code);
    if (!EduHub.set(EduHub.CFG.USERS_KEY, users)) return show('Không lưu được: trình duyệt đang chặn lưu trữ.', false);
    document.getElementById('rcPw').value = '';
    msg.classList.add('hidden');
    EduHub.showRecoveryCode(code, () => EduHub.toast('Đã tạo mã khôi phục mới. Mã cũ không còn hiệu lực.', 'success'));
}
function importBackup(e) {
    const inputEl = e.target;
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const m = document.getElementById('importMsg');
    EduHub.importAll(f).then(n => {
        m.className = 'text-xs text-emerald-600';
        m.textContent = 'Đã khôi phục ' + n + ' nhóm dữ liệu. Đang tải lại...';
        m.classList.remove('hidden');
        EduHub.toast('Khôi phục dữ liệu thành công.', 'success');
        setTimeout(() => location.reload(), 900);
    }).catch(err => {
        m.className = 'text-xs text-red-600';
        m.textContent = err && err.message === 'email-mismatch' ? 'Tệp sao lưu thuộc về tài khoản khác. Hãy đăng nhập đúng tài khoản đó để khôi phục.'
            : err && err.message === 'too-big' ? 'Tệp quá lớn (tối đa 5 MB).'
                : 'Tệp không hợp lệ hoặc chứa dữ liệu sai định dạng. Hãy chọn đúng tệp sao lưu do EduHub xuất ra.';
        m.classList.remove('hidden');
    }).finally(() => { inputEl.value = ''; });
}
function clearMyData() {
    if (!confirm('Xóa toàn bộ dữ liệu học tập của tài khoản này? Hành động không thể hoàn tác.')) return;
    ['eduhub_records', 'eduhub_subjects', 'eduhub_timetable', 'eduhub_assignments', 'eduhub_submissions', 'eduhub_notifications', 'eduhub_exams', 'eduhub_boss', 'eduhub_goal']
        .forEach(b => EduHub.del(EduHub.userKey(b)));
    EduHub.del('eduhub_total_' + EduHub.email());
    if (window.EduHubFiles) EduHubFiles.clearUser().catch(() => { });
    if (window.EduSync) EduSync.fileDelAll();   // xóa cả tệp bài nộp trên máy chủ
    EduHub.toast('Đã xóa dữ liệu học tập.', 'info');
    setTimeout(() => location.reload(), 800);
}

/* ---------- Khôi phục tab đang mở + cảnh báo lưu trữ bị chặn ---------- */
(function () {
    let p = new URLSearchParams(location.search).get('tab') || '';
    if (!p && location.hash) p = location.hash.slice(1);
    switchTab(p || 'dashboard', true);
    if (!EduHub.storageOK) {
        const w = document.getElementById('storageWarn');
        w.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i>Trình duyệt đang chặn lưu trữ cục bộ (localStorage), nên dữ liệu bạn nhập sẽ KHÔNG được giữ lại. Hãy tắt chế độ ẩn danh hoặc cho phép cookie cho trang này.';
        w.classList.remove('hidden');
    }
})();

/* User identity and semester context */
/* ---------- Hiển thị người dùng đang đăng nhập ---------- */
(function () {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session'));
    } catch { }
    if (!user) return;

    const name = (user.name || '').trim() || user.email || 'Sinh viên';
    document.getElementById('userName').textContent = name;
    document.getElementById('welcomeName').textContent = name;
    document.getElementById('userSub').textContent = user.mssv ? 'MSSV: ' + user.mssv : (user.email || '');

    const avatar = document.getElementById('userAvatar');
    avatar.alt = 'Avatar ' + name;
    if (user.picture) {
        avatar.referrerPolicy = 'no-referrer';   // ảnh Google cần dòng này để tải được
        avatar.src = user.picture;
    } else {
        // Không có ảnh -> tạo avatar chữ cái đầu của tên
        const words = name.split(/\s+/).filter(Boolean);
        const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0].slice(0, 2)).toUpperCase();
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#4f46e5"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">' + initials.replace(/[<>&]/g, '') + '</text></svg>';
        avatar.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
})();

/* ---------- Nhãn học kỳ / tháng động (thay cho giá trị viết cứng) ---------- */
(function () {
    const now = new Date(), m = now.getMonth() + 1, year = now.getFullYear();
    let sem, y1;
    if (m >= 9) { sem = 'Học kỳ 1'; y1 = year; }
    else if (m <= 1) { sem = 'Học kỳ 1'; y1 = year - 1; }
    else if (m <= 6) { sem = 'Học kỳ 2'; y1 = year - 1; }
    else { sem = 'Học kỳ hè'; y1 = year - 1; }
    const badge = document.getElementById('semesterBadge');
    if (badge) badge.textContent = sem + ' ' + y1 + '–' + (y1 + 1);
})();

/* Hero and streak enhancements */
/* ═══════════════════════════════════════════════════════════════
           DASHBOARD HERO ENHANCEMENTS
           - Greeting theo giờ (sáng / chiều / tối)
           - Hiển thị ngày tiếng Việt
           - Animated counter cho số hero
           - Streak mini heatmap (7 ngày gần nhất)
           - GPA bridge: đọc từ localStorage và cập nhật #heroGPA
           ═══════════════════════════════════════════════════════════════ */
(function () {
    /* Greeting */
    function getGreeting() {
        const h = new Date().getHours();
        const iconAttrs = 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
        if (h < 5 || h >= 18) {
            return `<svg xmlns="http://www.w3.org/2000/svg" ${iconAttrs}><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg> Chào buổi tối`;
        }
        if (h < 12) {
            return `<svg xmlns="http://www.w3.org/2000/svg" ${iconAttrs}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Chào buổi sáng`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" ${iconAttrs}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg> Chào buổi chiều`;
    }
    const grEl = document.getElementById('greetingTime');
    if (grEl) {
        grEl.innerHTML = getGreeting();
        grEl.classList.add('inline-flex', 'items-center', 'gap-2');
    }

    /* Ngày tháng tiếng Việt */
    const DAYS_VI = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const now = new Date();
    const dateEl = document.getElementById('todayDateLabel');
    if (dateEl) {
        dateEl.textContent = DAYS_VI[now.getDay()] + ', ngày ' +
            String(now.getDate()).padStart(2, '0') + '/' +
            String(now.getMonth() + 1).padStart(2, '0') + '/' + now.getFullYear();
    }

    /* Animated counter helper */
    function animateCount(el, target, decimals, suffix) {
        if (!el || target == null || isNaN(target)) return;
        const dur = 900, fps = 60, steps = Math.round(dur / (1000 / fps));
        let step = 0;
        const timer = setInterval(function () {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3);
            const val = target * ease;
            el.textContent = val.toFixed(decimals) + (suffix || '');
            if (step >= steps) { clearInterval(timer); el.textContent = target.toFixed(decimals) + (suffix || ''); }
        }, 1000 / fps);
    }

    /* GPA bridge: đọc từ localStorage sau khi records.js chạy xong */
    function updateHeroGPA() {
        try {
            let u = null;
            try { u = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session')); } catch { }
            const email = (u && u.email) || 'guest';
            const db = JSON.parse(localStorage.getItem('eduhub_records_' + email));
            if (!db || !Array.isArray(db.sems) || !db.sems.length) return;

            // Tính GPA tích lũy
            function g4(g) { return g >= 9 ? 4 : g >= 8.5 ? 3.7 : g >= 8 ? 3.5 : g >= 7 ? 3 : g >= 6.5 ? 2.5 : g >= 5.5 ? 2 : g >= 5 ? 1.5 : g >= 4 ? 1 : 0; }
            let c = 0, s4 = 0;
            db.sems.forEach(function (sem) {
                (sem.subs || []).forEach(function (x) {
                    const cc = +x.c, gg = +x.g;
                    if (cc > 0 && isFinite(gg)) { c += cc; s4 += cc * g4(gg); }
                });
            });
            if (!c) return;
            const gpa = s4 / c;
            const el = document.getElementById('heroGPA');
            if (el) animateCount(el, gpa, 2, '');
        } catch { }
    }

    /* Số môn học hiện tại */
    function updateHeroSubjects() {
        try {
            let u = null;
            try { u = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session')); } catch { }
            const email = (u && u.email) || 'guest';
            const subs = JSON.parse(localStorage.getItem('eduhub_subjects_' + email)) || [];
            const el = document.getElementById('heroSubjectNum');
            if (el && Array.isArray(subs)) el.textContent = subs.length + ' môn';
        } catch { }
    }

    /* Streak mini heatmap (7 ngày gần nhất) */
    function buildStreakMini() {
        const container = document.getElementById('streakMiniMap');
        const numEl = document.getElementById('streakMiniNum');
        const msgEl = document.getElementById('streakMiniMsg');
        if (!container) return;

        let u = null;
        try { u = JSON.parse(localStorage.getItem('eduhub_session') || sessionStorage.getItem('eduhub_session')); } catch { }
        const email = (u && u.email) || 'guest';

        let gamify = null;
        try { gamify = JSON.parse(localStorage.getItem('eduhub_gamify_' + email)); } catch { }

        const days = (gamify && Array.isArray(gamify.days)) ? gamify.days : [];
        const frozen = (gamify && Array.isArray(gamify.frozen)) ? gamify.frozen : [];
        const daySet = new Set(days);
        const frozenSet = new Set(frozen);

        /* Tính streak */
        function pad(n) { return n < 10 ? '0' + n : '' + n; }
        function fmtDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
        function shift(s, n) { const p = s.split('-'); const d = new Date(+p[0], +p[1] - 1, +p[2], 12); d.setDate(d.getDate() + n); return fmtDate(d); }

        const today = fmtDate(new Date());
        let streak = 0, d = today;
        for (let i = 0; i < 5000; i++) {
            if (daySet.has(d) || frozenSet.has(d)) { if (daySet.has(d)) streak++; d = shift(d, -1); }
            else break;
        }

        if (numEl) numEl.textContent = streak;
        if (msgEl) {
            if (streak === 0) msgEl.textContent = '👋 Bắt đầu chuỗi học ngay hôm nay nhé!';
            else if (streak < 7) msgEl.textContent = '💪 Tiếp tục! Còn ' + (7 - streak) + ' ngày nữa là đạt huy hiệu tuần.';
            else if (streak < 30) msgEl.textContent = '🔥 Tuyệt vời! Đang trên đà ' + streak + ' ngày liên tiếp!';
            else msgEl.textContent = '🏆 Xuất sắc! ' + streak + ' ngày liên tiếp — Huyền thoại!';
        }

        /* Vẽ 7 ô ngày */
        const WD_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        container.innerHTML = '';
        for (let i = 6; i >= 0; i--) {
            const dateStr = shift(today, -i);
            const isToday = i === 0;
            const hasActivity = daySet.has(dateStr);
            const isFrozen = frozenSet.has(dateStr);
            const d2 = new Date(dateStr.split('-').map(Number));
            d2.setFullYear(+dateStr.split('-')[0]);

            const dot = document.createElement('div');
            dot.className = 'streak-day-dot';
            dot.title = dateStr + (hasActivity ? ' ✓' : isFrozen ? ' ❄' : '');

            if (hasActivity) {
                dot.style.cssText = 'background: linear-gradient(135deg, #f97316, #ef4444); color: #fff;';
            } else if (isFrozen) {
                dot.style.cssText = 'background: linear-gradient(135deg, #38bdf8, #818cf8); color: #fff;';
            } else {
                dot.style.cssText = 'background: ' + (isToday ? '#eff6ff' : '#f3f4f6') + '; color: ' + (isToday ? '#2563eb' : '#9ca3af') + '; border: ' + (isToday ? '2px solid #2563eb' : '1px solid #e5e7eb') + ';';
            }

            // Dark mode
            document.addEventListener('eduhub:theme', function (e) {
                if (!hasActivity && !isFrozen) {
                    dot.style.cssText = 'background: ' + (e.detail.dark ? (isToday ? '#1e3a5f' : '#1e293b') : (isToday ? '#eff6ff' : '#f3f4f6')) + '; color: ' + (e.detail.dark ? (isToday ? '#60a5fa' : '#475569') : (isToday ? '#2563eb' : '#9ca3af')) + '; border: ' + (isToday ? '2px solid ' + (e.detail.dark ? '#3b82f6' : '#2563eb') : '1px solid ' + (e.detail.dark ? '#334155' : '#e5e7eb')) + ';';
                }
            });

            const dayOfWeek = new Date(dateStr.split('-')[0], dateStr.split('-')[1] - 1, dateStr.split('-')[2]).getDay();
            dot.textContent = WD_SHORT[dayOfWeek];
            container.appendChild(dot);
        }

        /* Apply dark mode nếu đang dark */
        if (document.documentElement.classList.contains('dark')) {
            container.querySelectorAll('.streak-day-dot').forEach(function (dot) {
                if (!dot.style.background.includes('gradient')) {
                    const isT = dot.style.border && dot.style.border.includes('2px');
                    dot.style.cssText = 'background: ' + (isT ? '#1e3a5f' : '#1e293b') + '; color: ' + (isT ? '#60a5fa' : '#475569') + '; border: ' + (isT ? '2px solid #3b82f6' : '1px solid #334155') + ';';
                }
            });
        }
    }

    /* Chạy ngay khi DOM ready, và sau khi scripts khác load xong */
    updateHeroGPA();
    updateHeroSubjects();
    buildStreakMini();

    /* Cập nhật lại khi có thay đổi dữ liệu */
    document.addEventListener('eduhub:data', function () {
        updateHeroGPA();
        updateHeroSubjects();
        buildStreakMini();
    });
})();
