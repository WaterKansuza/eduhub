# Triển khai và kiểm tra

## Trước khi phát hành

- [ ] Chạy local qua HTTP từ thư mục gốc dự án.
- [ ] Mở trang chính, đăng nhập, đăng xuất và kiểm tra điều hướng giữa các trang.
- [ ] Kiểm tra các tab, dữ liệu local và các thao tác lưu/đồng bộ.
- [ ] Kiểm tra cấu hình Supabase và URL redirect được phép trong dashboard Supabase.
- [ ] Nếu dùng Google OAuth, kiểm tra Authorized JavaScript origins và redirect URI theo cấu hình nhà cung cấp.
- [ ] Kiểm tra trên đường dẫn triển khai thật, đặc biệt nếu website được host dưới một đường dẫn con của domain.
- [ ] Không commit thông tin bí mật hoặc khóa `service_role`.

## GitHub Actions keepalive (tùy chọn)

Workflow nằm ở `.github/workflows/supabase-keepalive.yml`. Nếu bật, thêm repository secrets `SUPABASE_URL` và `SUPABASE_ANON_KEY` theo hướng dẫn trong workflow. Chỉ dùng khóa public/anon; không dùng `service_role`. Workflow này chỉ ping endpoint cấu hình, không thay thế việc giám sát sức khỏe dịch vụ.

## Lưu ý đường dẫn

Các trang thực tế ở `pages/` và dùng đường dẫn tương đối `../assets/...` cho tài nguyên. URL trang như `login.html` được giữ tương đối trong cùng thư mục `pages/`. Khi thay đổi cấu trúc lần nữa, hãy kiểm tra các URL hard-code trong `assets/js/config.js`, `assets/js/cloud.js` và các đoạn JavaScript inline.
