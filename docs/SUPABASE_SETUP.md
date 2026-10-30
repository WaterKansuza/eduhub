# Kết nối EduHub với máy chủ (Supabase) – 15 phút

Khi chưa cấu hình, EduHub vẫn chạy **chế độ cục bộ** như cũ. Làm các bước dưới để bật **chế độ máy chủ**
(tài khoản và đánh giá dùng chung cho mọi thiết bị).

## 1. Tạo dự án
1. Vào https://supabase.com → đăng nhập → **New project**. Đặt tên, mật khẩu database, chọn vùng gần Việt Nam (Singapore).
2. Chờ ~2 phút để dự án khởi tạo.

## 2. Tạo bảng và phân quyền
1. Menu trái → **SQL Editor** → **New query**.
2. Mở `database/schema.sql`, dán toàn bộ nội dung → **Run**. Thấy "Success" là xong.

## 3. Lấy khóa kết nối
1. **Project Settings → API** (hoặc **Connect**).
2. Copy **Project URL** và khóa **anon public** (hoặc *publishable*).
3. Mở `assets/js/supabase-config.js`, dán vào `url` và `anonKey`.
> Chỉ dùng khóa *anon/publishable*. **Không** dán `service_role` / `secret` vào web.

## 4. Cài đặt đăng nhập
**Authentication → Sign In / Providers → Email**
- *Confirm email*: **tắt** nếu muốn đăng ký xong vào luôn (dễ thử nghiệm). Nếu **bật**, người dùng phải bấm link trong email xác nhận (web đã xử lý và báo rõ).

**Authentication → URL Configuration**
- *Site URL*: địa chỉ web của bạn (vd `https://eduhub.netlify.app`; khi thử local: `http://localhost:5500`).
- *Redirect URLs*: thêm cả địa chỉ trên (dùng cho link xác nhận email và đặt lại mật khẩu).

**Đăng nhập Google (tùy chọn)**: Authentication → Providers → Google → bật, dán **cùng Client ID** đang dùng trong `pages/login.html`
(và Client Secret từ Google Cloud). Nếu báo lỗi nonce, bật *Skip nonce checks* trong mục Google của Supabase.

## 5. Tạo tài khoản quản trị
1. Mở web → **Đăng ký** một tài khoản bình thường (email của quản trị viên).
2. Quay lại **SQL Editor**, chạy:
   ```sql
   update public.profiles set role = 'admin' where email = 'email-cua-ban@truong.edu.vn';
   ```
3. Mở `pages/admin.html` → đăng nhập bằng email + mật khẩu của tài khoản đó.

## 6. Đưa web lên mạng
Vì web là file tĩnh, dùng bất kỳ hosting tĩnh miễn phí: **Netlify** (kéo-thả thư mục), **Vercel**, **GitHub Pages**, **Cloudflare Pages**.
Sau khi có địa chỉ, thêm nó vào *Site URL / Redirect URLs* (bước 4) và *Authorized JavaScript origins* của Google.

## Đồng bộ dữ liệu học tập (giai đoạn 2)
- Đã **nâng cấp từ giai đoạn 1**: mở **SQL Editor**, dán lại toàn bộ `database/schema.sql` → **Run** (chạy lại an toàn, không mất dữ liệu cũ). Bước này tạo bảng `user_data`, hàm `sync_put`, bucket Storage `submissions`, bật Realtime cho `user_data` và hàm thống kê cho quản trị.
- Không cần cấu hình thêm: `sync.js` tự chạy khi đã điền `assets/js/supabase-config.js` và đăng nhập.
- Điểm số, môn học, TKB, bài tập, thông tin nộp bài, thông báo, lịch thi, chuỗi học, boss, mục tiêu GPA và tổng tín chỉ được đẩy lên khi thay đổi.
- **Tức thời (Realtime)**: thiết bị khác đổi dữ liệu thì thiết bị này nhận trong chưa đầy vài giây và hiện nút "tải lại trang" ở góc trái dưới. Nếu Realtime không hoạt động, vẫn có kéo định kỳ mỗi 60 giây / khi quay lại tab. Kiểm tra: **Database → Replication** (hoặc **Realtime**) → bảng `user_data` phải được bật.
- **Tệp bài nộp**: sau khi nộp, tệp (tối đa 25 MB) được tải lên bucket riêng tư `submissions/<id-người-dùng>/<id-bài-tập>`. Thiết bị khác bấm "Tải bài đã nộp" sẽ tải từ máy chủ. Có hàng đợi thử lại khi mất mạng. Gói miễn phí có 1 GB Storage. Quản trị viên **không** đọc được tệp; chỉ có quyền xóa để dọn khi xóa tài khoản.
- Dùng được khi mất mạng (dữ liệu vẫn lưu cục bộ, tự đẩy lại khi có mạng). Góc trái dưới hiện chữ trạng thái khi đồng bộ hoặc lỗi.
- **Xung đột** (hai thiết bị cùng sửa một mục khi chưa kịp đồng bộ): bản sửa sau cùng thắng; bản bị thay được giữ ở khóa `eduhub_syncbak_<email>_<mục>` trong trình duyệt.
- **Lần đồng bộ đầu tiên** trên thiết bị đã có dữ liệu cục bộ: danh sách (môn, bài tập, lịch thi, thông báo, nộp bài) được gộp theo id; các mục còn lại lấy bản trên máy chủ. Tệp nộp từ trước được tự tải lên.
- **Không đồng bộ**: giao diện sáng/tối, phiên đăng nhập.
- **Quản trị**: `pages/admin.html` (chế độ máy chủ) hiện thêm khung "Dữ liệu học tập (tổng hợp ẩn danh)" — chỉ số tổng như số người dùng, bài tập, lịch thi; khi dưới 3 người có dữ liệu thì chỉ hiện số người. Không xem được nội dung của từng sinh viên. Xóa tài khoản sẽ xóa luôn dữ liệu và tệp của người đó.
- Mỗi mục dữ liệu tối đa 1 MB. Dữ liệu từ máy chủ luôn được kiểm tra/làm sạch trước khi ghi vào trình duyệt.
- **Chống bị tạm dừng (gói miễn phí)**: dự án Supabase miễn phí có thể bị tạm dừng nếu lâu không có hoạt động. Tùy chọn: dùng `.github/workflows/supabase-keepalive.yml` (GitHub Actions, đọc hướng dẫn trong tệp) hoặc một dịch vụ giám sát miễn phí gọi định kỳ `https://<dự-án>.supabase.co/auth/v1/settings`.

## Lưu ý
- **Chuyển từ chế độ cục bộ**: tài khoản cũ lưu trong trình duyệt **không** tự chuyển lên máy chủ; mọi người cần đăng ký lại.
  Dữ liệu học tập cũ trong trình duyệt sẽ được đồng bộ lên máy chủ ở lần đăng nhập đầu tiên (xem mục Giai đoạn 2).
- **Quên mật khẩu** ở chế độ máy chủ dùng liên kết gửi qua email (thay cho mã khôi phục).
- **Quyền riêng tư**: khi bật máy chủ, họ tên, MSSV, email, đánh giá và dữ liệu học tập được lưu trên Supabase. Hãy rà lại trang Điều khoản/Bảo mật.
- Gói miễn phí của Supabase có giới hạn (dự án có thể bị tạm dừng nếu lâu không hoạt động). Kiểm tra bảng giá hiện hành trên supabase.com.
