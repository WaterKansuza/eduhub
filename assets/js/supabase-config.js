/* ============================================================
   EduHub – Cấu hình kết nối máy chủ (Supabase)
   1) Tạo dự án tại https://supabase.com
   2) Vào Project Settings → API, copy "Project URL" và khóa "anon public"
      (hoặc "publishable") dán vào bên dưới.
   Để trống / giữ nguyên "YOUR_..." = EduHub chạy CHẾ ĐỘ CỤC BỘ như cũ
   (dữ liệu lưu trong trình duyệt, không cần máy chủ).
   TUYỆT ĐỐI KHÔNG dán khóa "service_role" vào đây.
   ============================================================ */
window.EDUHUB_CLOUD = {
  url: 'https://mcchtdtsqhugavdhvdyf.supabase.co',          // ví dụ: https://abcdxyz.supabase.co
  anonKey: 'sb_publishable_QRO4-xQgqU5aKotZQS5Fqw_8toxfw0p'  // khóa công khai (anon / publishable)
};
