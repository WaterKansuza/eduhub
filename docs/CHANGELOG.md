# EduHub v5 – Changelog gọn

Dữ liệu lưu trong trình duyệt (localStorage); Tailwind / Chart.js tải từ CDN nên cần mạng.

## Gộp Môn học + Thời khóa biểu + Tạo TKB
- Menu chỉ còn một mục **Môn học & TKB** (`index.html`) với 2 tab con: *Môn học* (thẻ môn, tiến độ bài tập, nút sửa/xóa) và *Thời khóa biểu* (cài đặt + Tạo lịch, Phương án khác, bấm ô để nhập phòng, Xuất CSV, In).
- Mới: `timetable.js` (chuyển toàn bộ logic từ `timetable.html` vào, bọc trong IIFE, xuất `window.EduTT`). Thêm/sửa môn dùng hộp thoại.
- `schedule.js` bỏ bảng TKB chỉ-xem (trùng lặp), vẽ lại khi dữ liệu môn/TKB đổi. Liên kết ?tab=schedule vẫn chạy (mở tab con Thời khóa biểu); `?tab=courses&add=1` mở sẵn hộp thoại thêm môn.
- `timetable.html` giờ chỉ chuyển hướng về `index.html` để link cũ không hỏng. Dữ liệu (khóa localStorage, đồng bộ) không đổi.

## Giai đoạn 2b: tệp bài nộp, Realtime, thống kê
- **Tệp bài nộp** đồng bộ qua Supabase Storage (bucket riêng tư `submissions`, RLS theo thư mục người dùng, 25 MB/tệp): hàng đợi tải lên/xóa có thử lại (`sync.js`), tự tải lên tệp nộp từ trước, thiết bị khác tải về qua nút "Tải bài đã nộp" (`assignments.js`). `config.js`: `validateBackup(parsed, keepStored)` giữ cờ `stored` khi đồng bộ.
- **Realtime**: `cloud.js` thêm `syncSubscribe`; `schema.sql` bật publication cho `user_data`. Thiết bị khác đổi dữ liệu thì nhận trong ~1 giây (vẫn kéo định kỳ làm dự phòng).
- **Quản trị**: hàm `admin_learning_stats` (số liệu tổng hợp, ẩn khi < 3 người) + khung thống kê trong `admin.html`; `admin_delete_user` trả đường dẫn tệp để xóa khỏi Storage. Quản trị không đọc được dữ liệu hay tệp của sinh viên.
- `clearMyData()` xóa luôn tệp trên máy chủ. Thêm `supabase/keepalive.yml` (tùy chọn) để gói miễn phí không bị tạm dừng.

## Chế độ máy chủ – Giai đoạn 2: đồng bộ dữ liệu học tập
- Mới: `sync.js`; `schema.sql` thêm bảng `user_data` (RLS chỉ chủ sở hữu) và hàm `sync_put` (ghi có kiểm tra xung đột bằng mốc thời gian máy chủ); `cloud.js` thêm `syncPull` / `syncPut`; `index.html`, `timetable.html` nạp thư viện + `sync.js`.
- Đồng bộ 11 mục: điểm, môn, TKB, bài tập, nộp bài, thông báo, lịch thi, chuỗi học, boss, mục tiêu GPA, tổng tín chỉ. Hoạt động nền, dùng được offline, xung đột: bản sau cùng thắng + dự phòng bản thua; lần đầu gộp danh sách theo id.
- Dữ liệu kéo về được làm sạch bằng `EduHub.validateBackup`. Quản trị viên không đọc được dữ liệu này. Đăng xuất sẽ đẩy nốt thay đổi (tối đa 4 giây).
- `schema.sql` cấp quyền tường minh cho `profiles`/`reviews` (phòng khi Supabase không còn tự cấp quyền cho bảng mới). `privacy.html` cập nhật.
- Chế độ cục bộ (chưa điền `supabase-config.js`): `sync.js` không làm gì.

## Chế độ máy chủ – Supabase (giai đoạn 1)
- Mới: `supabase-config.js` (URL + anon key), `cloud.js` (lớp kết nối), `supabase/schema.sql` (bảng `profiles`, `reviews`, RLS, hàm admin), `SETUP-SUPABASE.md` (hướng dẫn).
- Chưa điền cấu hình thì mọi thứ chạy cục bộ như cũ. Điền rồi thì: đăng ký/đăng nhập/Google/quên mật khẩu (link email) qua Supabase Auth; đánh giá lưu trên máy chủ; `admin.html` đăng nhập bằng tài khoản `role = admin` và xem dữ liệu mọi thiết bị.
- Sinh viên không tự sửa được `role`, `reply`, `hidden` (cấp quyền theo cột + RLS); xóa người dùng / kiểm duyệt đi qua hàm SECURITY DEFINER kiểm tra admin.
- Điểm số, TKB, bài tập, lịch thi vẫn lưu cục bộ (giai đoạn 2).

## Trang đánh giá web (`feedback.html`)
- Chấm sao tổng thể + 4 tiêu chí, chọn tính năng yêu thích, nhận xét ≤ 500 ký tự; xem thống kê, sửa/xóa, gửi qua email tới Phòng Đào tạo. Lưu theo từng tài khoản trong localStorage (`eduhub_feedback_<email>`).
- Liên kết từ menu “Đánh giá web” (`index.html`) và chân trang `terms.html`, `privacy.html`.

## Trang quản trị (`admin.html`)
- Mật khẩu quản trị tự đặt lần đầu (băm PBKDF2, khóa 5 phút sau 5 lần sai, phiên 30 phút). Chỉ là chốt giao diện phía trình duyệt, chưa phải bảo mật server.
- Tổng quan (thống kê sao, tiêu chí, tính năng), Người dùng (tìm, xuất CSV, xóa tài khoản + dữ liệu), Đánh giá (lọc, phản hồi, ẩn/hiện, xóa, xuất CSV). Đọc dữ liệu `eduhub_users` và `eduhub_feedback_<email>` của trình duyệt hiện tại.
- `feedback.html`: hiện “Phản hồi từ quản trị”, giữ trạng thái ẩn/phản hồi khi người dùng sửa đánh giá.

## Giao diện tối giản (theo hướng StudyHub)
- Chỉ sửa giao diện `index.html`, không xóa tính năng/tệp nào.
- Menu: nhãn ngắn, có tiêu đề “MENU CHÍNH”, bỏ dòng phụ “Student Portal”.
- Header: ẩn chuông thông báo (đã có “Thông báo” ở menu); bỏ dòng MSSV.
- Tổng quan chỉ hiện: banner, 4 thẻ số, môn đang học, lịch hôm nay, bài tập cần nộp. Chuỗi học, Boss, Wrapped, so sánh kỳ và biểu đồ điểm gom vào mục “Xem thêm” (bấm huy hiệu 🔥 sẽ tự mở).

- Phong cách trực quan kiểu eduhub-gon: thêm `simple.css` (nền phẳng, bo góc, nút màu đặc, nạp trong `index.html` và `timetable.html`; xóa thẻ `<link>` để quay về giao diện cũ). Thẻ môn học có banner màu + tiến độ bài tập (`schedule.js`), thẻ số liệu để icon phía trên (`records.js`), dòng deadline gọn hơn (`assignments.js`). Nội dung và tính năng không đổi.

- Lịch thi: thẻ có ô đếm ngược bên trái (`exams.js`). Điểm số: khung “Bảng điểm & GPA” với 3 ô tổng quan, bảng có thanh điểm (`records.js`), khung Mục tiêu GPA gọn hơn (`goal.js`). Chức năng giữ nguyên.

## v5 – Boss, Mục tiêu GPA, Wrapped
- **Boss môn học** (`boss.js`): mỗi môn là một boss, thanh máu = bài tập chưa nộp + phần ôn tập tự thêm. Trạng thái: Đang ngủ · Sẵn sàng · Sắp đại chiến (thi ≤7 ngày) · Nổi giận (có bài quá hạn) · Đã bị hạ. Khớp môn với bài tập / lịch thi theo tên.
- **Mục tiêu GPA** (`goal.js`, tab Điểm số): chọn GPA mục tiêu hệ 4, tính ngược điểm tối thiểu cần ở các môn còn lại (hết kỳ này / khi tốt nghiệp), có thanh trượt giả định điểm. Cùng thang quy đổi và quy tắc học lại với `records.js`.
- **Kỳ học Wrapped** (`wrapped.js`): chuỗi thẻ tổng kết (chuỗi học, nộp bài, “phong cách”, GPA, môn tỏa sáng, boss, huy hiệu) + thẻ ảnh PNG 1080×1350 để chia sẻ. Chỉ đọc dữ liệu có sẵn.
- `config.js`: thêm `boss`, `goal` vào sao lưu / khôi phục. `gamify.js`: tính `eduhub_boss` là hoạt động học.

## v4 – Chuỗi ngày học & huy hiệu (`gamify.js`)
- Chuỗi ngày học (giờ địa phương), điểm danh, lượt đóng băng 🧊 (mỗi 7 ngày +1, tối đa 2; chỉ dùng khi lấp đủ khoảng trống), lưu chuỗi dài nhất.
- 17 huy hiệu / 4 nhóm, có tiến độ và thông báo mở khóa; người dùng cũ được mở khóa im lặng lần đầu.
- Chuỗi và huy hiệu **không** bị xóa bởi “Xóa dữ liệu học tập” (thêm `'eduhub_gamify'` vào `clearMyData()` nếu muốn).

## v3 – 6 lỗi (records / timetable)
- Kỳ học có năm học + học kỳ, sắp theo thời gian; chặn trùng kỳ.
- Môn học lại chỉ tính một lần (cao nhất / gần nhất / tính cả); nhận diện theo tên môn.
- Lưu thất bại (localStorage đầy/bị chặn) thì hoàn tác và giữ form.
- `guardSession()`: đăng xuất / đổi tài khoản ở tab khác không còn ghi nhầm.
- Biểu đồ hợp chế độ tối, nhãn là tên hai kỳ so sánh.
- TKB: xếp bù buổi trùng, cảnh báo vượt giới hạn, bấm ô để nhập phòng.

## v2 – 7 lỗi ưu tiên
- Hết vòng lặp ghi localStorage giữa các tab; bỏ dữ liệu mẫu; thẻ Deadline cập nhật đúng.
- Lịch thi theo ngày địa phương, `.ics` đúng múi giờ.
- Khôi phục sao lưu có kiểm tra / làm sạch (từ chối backup email khác, > 5 MB).
- Đặt lại mật khẩu bằng **mã khôi phục** (băm PBKDF2), giới hạn 5 lần sai / 5 phút.
- Nộp bài lưu tệp trong IndexedDB (≤ 25 MB, không gửi tới giảng viên, không nằm trong sao lưu).
- Lưu ý: đăng nhập vẫn chạy phía trình duyệt, cần backend nếu muốn bảo mật thật.

## Gọn lại (bản này)
- Bỏ phần lặp: nút đăng xuất ở header, khung “Cần hỗ trợ” ở sidebar (đã có trong Cài đặt), nút “Nhập môn học / Xếp TKB” lặp ở đầu tab.
- Rút ngắn banner chào, tiêu đề phụ và chú thích dài; gộp 4 file CHANGELOG thành một.
- Gộp `subjects.html` và `timetable.html` thành một trang `timetable.html` (Môn học ở trên, Thời khóa biểu ở dưới); mọi liên kết đã trỏ về trang này.
