# EduHub

EduHub là ứng dụng web tĩnh phía trình duyệt, sử dụng JavaScript và tích hợp Supabase. Thư mục này đã được tái cấu trúc để tách giao diện, mã nguồn dùng chung, cấu hình cơ sở dữ liệu và tài liệu.

## Cấu trúc dự án

```text
EduHub/
├── index.html                 # Điểm vào ở gốc, chuyển đến pages/index.html
├── 404.html                   # Điểm vào 404 cho máy chủ tĩnh/GitHub Pages
├── pages/                     # Tất cả trang HTML thực tế
├── assets/
│   ├── css/                   # CSS dùng chung
│   └── js/                    # JavaScript và cấu hình phía trình duyệt
├── database/                  # SQL schema Supabase
├── .github/workflows/         # GitHub Actions tùy chọn
├── docs/                      # Hướng dẫn triển khai và bảo trì
└── README.md
```

## Chạy local

Không nên mở trực tiếp bằng `file://` vì một số tính năng trình duyệt và tích hợp xác thực cần HTTP. Từ thư mục gốc dự án, chạy:

```bash
python -m http.server 8000
```

Sau đó mở <http://localhost:8000>. Có thể dùng VS Code Live Server, miễn là thư mục gốc được phục vụ là thư mục dự án này.

## Triển khai website tĩnh

- **GitHub Pages:** đẩy toàn bộ thư mục dự án lên repository và bật Pages cho nhánh/thư mục phù hợp. Giữ `index.html`, `404.html` và `.nojekyll` ở gốc.
- **Netlify hoặc máy chủ tĩnh:** xuất bản toàn bộ thư mục dự án; không chỉ xuất bản riêng `pages/`, vì các trang dùng tài nguyên trong `assets/`.
- Dùng HTTPS trên môi trường công khai, đặc biệt khi bật xác thực.

## Supabase

1. Đọc [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).
2. Cấu hình URL dự án và khóa public/anon trong `assets/js/supabase-config.js` theo hướng dẫn. Không đưa `service_role` hoặc bí mật máy chủ vào mã frontend.
3. Kiểm tra và áp dụng [`database/schema.sql`](database/schema.sql) trong Supabase SQL Editor nếu phù hợp với dự án hiện tại.
4. Nếu sử dụng workflow giữ dự án hoạt động, cấu hình GitHub Actions secrets theo [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). Workflow là tùy chọn.

## Các trang

- `pages/index.html` — ứng dụng chính
- `pages/login.html` — đăng nhập/đăng ký
- `pages/feedback.html` — phản hồi
- `pages/admin.html` — giao diện quản trị
- `pages/terms.html`, `pages/privacy.html` — điều khoản và bảo mật
- `pages/logout.html` — đăng xuất
- `pages/timetable.html` — trang tương thích cũ, chuyển đến tab thời khóa biểu

## Quy tắc bảo trì

- Trang HTML đặt trong `pages/`; JavaScript đặt trong `assets/js/`; CSS đặt trong `assets/css/`.
- Tài liệu Markdown đặt trong `docs/`, ngoại trừ `README.md` ở gốc để GitHub hiển thị hướng dẫn đầu tiên.
- Giữ thứ tự nạp các script trong `pages/index.html`; một số module phụ thuộc biến/hàm do module trước khởi tạo.
- Không đổi tên các file JavaScript một cách tùy tiện vì một số trang nạp chúng bằng đường dẫn tường minh.
- Sau khi di chuyển file, kiểm tra đường dẫn tương đối, luồng đăng nhập/đăng xuất, URL chuyển hướng Supabase/Google OAuth, và các tab của ứng dụng.
