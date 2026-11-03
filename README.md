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

## ⚠️ Disclaimer

### 1. Purpose
This website/project is provided for **learning, portfolio, and demonstration purposes**. It is not a commercial service and is not guaranteed to be suitable for production use.

### 2. No Warranty
The project is provided **"AS IS"**, without warranty of any kind, express or implied, including accuracy, reliability, availability, security, fitness for a particular purpose, and non-infringement. Features may be incomplete, change, or be removed at any time.

### 3. Limitation of Liability
**TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE AUTHOR(S) SHALL NOT BE LIABLE FOR ANY DAMAGES OR LOSSES, DIRECT OR INDIRECT, ARISING FROM THE USE OF, OR INABILITY TO USE, THIS PROJECT, INCLUDING DATA LOSS, SERVICE INTERRUPTION, OR SECURITY INCIDENTS.**

### 4. Demo Data and Privacy
Do **not** enter real personal, financial, or sensitive information into any demo instance of this project. [The demo does not intentionally collect personal data beyond what is needed to function.] If you deploy this project yourself, **you** are the data controller and are responsible for privacy, data protection, and security compliance.

### 5. Self-Hosting and Secrets
If you clone and deploy this project, you are responsible for configuring your own backend, database, and API keys. Never commit secrets (API keys, tokens, passwords, `.env` files) to a public repository. Review the code and the security settings (for example database access rules) before going live. The author is not responsible for any leak, abuse, or cost resulting from your deployment.

### 6. Third-Party Content and Services
This project may use third-party libraries, fonts, images, icons, APIs, or services, each governed by its own license and terms. The MIT License of this project applies **only to the original code** written by the author, not to third-party assets or to any content owned by others. External links are provided for convenience; the author is not responsible for their content.

### 7. No Professional Advice
Any information shown in this project is for general reference only and is not professional (legal, medical, financial, or academic) advice.

### 8. Trademarks and Affiliation
Any product names, brands, or logos mentioned belong to their owners and are used for identification only. This project is not affiliated with or endorsed by them.

### 9. No Support Obligation
The author has no obligation to provide support, maintenance, or updates, and may modify or discontinue the project at any time.

### 10. Takedown Requests
If you believe any content in this project infringes your rights, please contact **[your email]** or open an issue, and I will review and respond promptly.
