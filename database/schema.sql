-- ============================================================
-- EduHub – Lược đồ Supabase (giai đoạn 1: tài khoản + đánh giá; giai đoạn 2: đồng bộ dữ liệu học tập, tệp bài nộp, realtime, thống kê)
-- Cách chạy: Supabase Dashboard → SQL Editor → New query → dán toàn bộ → Run.
-- An toàn khi chạy lại nhiều lần.
-- ============================================================

-- ---------- 1. Bảng ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text not null default '',
  mssv       text not null default '',
  provider   text not null default 'email',
  role       text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  overall    smallint not null check (overall between 1 and 5),
  cats       jsonb not null default '{}'::jsonb
             check (jsonb_typeof(cats) = 'object' and pg_column_size(cats) < 300),
  tags       text[] not null default '{}' check (cardinality(tags) <= 12),
  comment    text not null default '' check (char_length(comment) <= 500),
  reply      text check (reply is null or char_length(reply) <= 300),
  reply_at   timestamptz,
  hidden     boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reviews_user_idx    on public.reviews (user_id, created_at desc);
create index if not exists reviews_created_idx on public.reviews (created_at desc);

-- ---------- 2. Tự tạo hồ sơ khi có người đăng ký ----------
-- Vai trò LUÔN là 'student'; không bao giờ đọc vai trò từ dữ liệu người dùng gửi lên.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, mssv, provider)
  values (
    new.id,
    lower(new.email),
    left(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), 100),
    left(coalesce(new.raw_user_meta_data->>'mssv', ''), 30),
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 3. Giới hạn 50 đánh giá / người ----------
create or replace function public.limit_reviews()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.reviews where user_id = new.user_id) >= 50 then
    raise exception 'Bạn đã đạt giới hạn 50 đánh giá. Hãy xóa bớt trước khi thêm mới.';
  end if;
  return new;
end $$;

drop trigger if exists reviews_limit on public.reviews;
create trigger reviews_limit
  before insert on public.reviews
  for each row execute function public.limit_reviews();

-- ---------- 4. Kiểm tra quyền quản trị ----------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------- 5. Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.reviews  enable row level security;

revoke all on public.profiles, public.reviews from anon;

-- profiles: xem hồ sơ của mình (admin xem tất cả); chỉ được sửa họ tên + MSSV của mình
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

revoke insert, update, delete on public.profiles from authenticated;
grant update (full_name, mssv) on public.profiles to authenticated;   -- KHÔNG cho tự sửa 'role'

-- reviews: sinh viên chỉ đụng tới đánh giá của mình; admin xem + xóa tất cả
drop policy if exists "reviews_select" on public.reviews;
create policy "reviews_select" on public.reviews for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert" on public.reviews for insert to authenticated
  with check (user_id = auth.uid() and reply is null and reply_at is null and hidden = false);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "reviews_delete" on public.reviews;
create policy "reviews_delete" on public.reviews for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

revoke update on public.reviews from authenticated;
grant update (overall, cats, tags, comment, updated_at) on public.reviews to authenticated;  -- KHÔNG cho tự sửa reply / hidden

-- ---------- 6. Hàm dành cho quản trị ----------
create or replace function public.admin_moderate_review(p_id uuid, p_reply text, p_hidden boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_reply text := nullif(btrim(coalesce(p_reply, '')), '');
begin
  if not public.is_admin() then raise exception 'Không có quyền quản trị'; end if;
  if v_reply is not null and char_length(v_reply) > 300 then raise exception 'Phản hồi tối đa 300 ký tự'; end if;
  update public.reviews
     set reply    = v_reply,
         reply_at = case when v_reply is null then null
                         when reply is distinct from v_reply then now()
                         else reply_at end,
         hidden   = coalesce(p_hidden, false)
   where id = p_id;
end $$;

-- Trả về danh sách đường dẫn tệp bài nộp của người bị xóa để quản trị xóa nốt khỏi Storage
-- (Supabase không cho xóa đối tượng Storage bằng SQL trực tiếp).
drop function if exists public.admin_delete_user(uuid);
create function public.admin_delete_user(p_uid uuid)
returns text[] language plpgsql security definer set search_path = public as $$
declare v_paths text[] := '{}';
begin
  if not public.is_admin() then raise exception 'Không có quyền quản trị'; end if;
  if p_uid = auth.uid() then raise exception 'Không thể tự xóa tài khoản quản trị đang đăng nhập'; end if;
  if exists (select 1 from public.profiles where id = p_uid and role = 'admin') then
    raise exception 'Không thể xóa tài khoản quản trị khác';
  end if;
  select coalesce(array_agg(p_uid::text || '/' || (e->>'id')), '{}') into v_paths
    from public.user_data d, jsonb_array_elements(
           case when jsonb_typeof(d.value) = 'array' then d.value else '[]'::jsonb end) e
   where d.user_id = p_uid and d.key = 'assignments' and (e->>'id') ~ '^[A-Za-z0-9_.-]{1,80}$';
  delete from auth.users where id = p_uid;     -- kéo theo xóa profiles, reviews, user_data (on delete cascade)
  return v_paths;
end $$;

revoke all on function public.admin_moderate_review(uuid, text, boolean) from public, anon;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_moderate_review(uuid, text, boolean) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ---------- 7. GIAI ĐOẠN 2: đồng bộ dữ liệu học tập (điểm số, TKB, bài tập, lịch thi...) ----------
-- Mỗi người dùng có tối đa 11 "ngăn" dữ liệu (key), mỗi ngăn là một JSON <= 1 MB.
-- Giá trị NULL = ngăn đã bị xóa (để thiết bị khác cũng xóa theo).
create table if not exists public.user_data (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  key        text not null check (key in ('records','subjects','timetable','assignments','submissions',
                                          'notifications','exams','gamify','boss','goal','total')),
  value      jsonb check (value is null or octet_length(value::text) <= 1000000),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, key)
);

alter table public.user_data enable row level security;
revoke all on public.user_data from anon, authenticated;
grant select on public.user_data to authenticated;          -- ghi chỉ qua hàm sync_put bên dưới

-- Quản trị viên KHÔNG đọc được dữ liệu học tập của sinh viên: chỉ chủ sở hữu.
drop policy if exists "user_data_select_own" on public.user_data;
create policy "user_data_select_own" on public.user_data for select to authenticated
  using (user_id = auth.uid());

-- Ghi có kiểm tra xung đột (optimistic locking):
--   p_base = NULL      -> chỉ thêm mới; nếu đã có dòng thì báo xung đột
--   p_base = <mốc cũ>  -> chỉ cập nhật nếu dòng chưa bị thiết bị khác sửa kể từ mốc đó
-- Trả về mốc thời gian mới của máy chủ; trả về NULL nghĩa là XUNG ĐỘT (client phải kéo dữ liệu mới về rồi gộp).
create or replace function public.sync_put(p_key text, p_value jsonb, p_base timestamptz)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_ts timestamptz;
begin
  if v_uid is null then raise exception 'Chưa đăng nhập'; end if;
  if p_base is null then
    insert into public.user_data (user_id, key, value) values (v_uid, p_key, p_value)
    on conflict (user_id, key) do nothing
    returning updated_at into v_ts;
  else
    update public.user_data set value = p_value, updated_at = clock_timestamp()
     where user_id = v_uid and key = p_key and updated_at = p_base
    returning updated_at into v_ts;
  end if;
  return v_ts;
end $$;

revoke all on function public.sync_put(text, jsonb, timestamptz) from public, anon;
grant execute on function public.sync_put(text, jsonb, timestamptz) to authenticated;

-- ---------- 8. Cấp quyền tường minh cho bảng giai đoạn 1 ----------
-- Supabase có thể không còn tự cấp quyền Data API cho bảng mới; khai báo rõ để chạy được ở mọi dự án.
-- (Quyền theo cột của profiles/reviews ở mục 5 vẫn giữ nguyên: không cấp thêm update/insert nào.)
grant select on public.profiles to authenticated;
grant select, insert, delete on public.reviews to authenticated;

-- ---------- 9. Tệp bài nộp (Supabase Storage) ----------
-- Bucket RIÊNG TƯ, mỗi người một thư mục tên = id người dùng. Chỉ chủ sở hữu đọc/ghi/xóa tệp của mình.
-- Quản trị viên chỉ có quyền XÓA (để dọn tệp khi xóa tài khoản), KHÔNG có quyền đọc hay liệt kê.
insert into storage.buckets (id, name, public, file_size_limit)
values ('submissions', 'submissions', false, 26214400)          -- 25 MB / tệp, khớp giới hạn trong web
on conflict (id) do update set public = false, file_size_limit = 26214400;

drop policy if exists "submissions_select_own" on storage.objects;
create policy "submissions_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "submissions_insert_own" on storage.objects;
create policy "submissions_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "submissions_update_own" on storage.objects;
create policy "submissions_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "submissions_delete_own" on storage.objects;
create policy "submissions_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "submissions_delete_admin" on storage.objects;
create policy "submissions_delete_admin" on storage.objects for delete to authenticated
  using (bucket_id = 'submissions' and public.is_admin());

-- ---------- 10. Đồng bộ tức thời (Realtime) ----------
-- Bật phát sự kiện thay đổi của user_data (RLS vẫn áp dụng: mỗi người chỉ nhận sự kiện của chính mình).
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables
                      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_data') then
    alter publication supabase_realtime add table public.user_data;
  end if;
end $$;

-- ---------- 11. Thống kê TỔNG HỢP cho quản trị (không lộ nội dung hay dữ liệu từng người) ----------
-- Dưới 3 người có dữ liệu thì chỉ trả số người, để không suy ra được dữ liệu của một cá nhân.
create or replace function public.admin_learning_stats()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_users int; v jsonb;
begin
  if not public.is_admin() then raise exception 'Không có quyền quản trị'; end if;
  select count(distinct user_id) into v_users from public.user_data where value is not null;
  if v_users < 3 then
    return jsonb_build_object('users_with_data', v_users, 'hidden', true);
  end if;
  select jsonb_build_object(
    'users_with_data', v_users,
    'active_7d', (select count(distinct user_id) from public.user_data where updated_at > now() - interval '7 days'),
    'subjects', (select coalesce(sum(case when jsonb_typeof(value) = 'array' then jsonb_array_length(value) else 0 end), 0)
                   from public.user_data where key = 'subjects'),
    'assignments', (select coalesce(sum(case when jsonb_typeof(value) = 'array' then jsonb_array_length(value) else 0 end), 0)
                      from public.user_data where key = 'assignments'),
    'submitted', (select count(*) from public.user_data d, jsonb_array_elements(
                    case when jsonb_typeof(d.value) = 'array' then d.value else '[]'::jsonb end) e
                   where d.key = 'assignments' and e->>'status' = 'submitted'),
    'exams', (select coalesce(sum(case when jsonb_typeof(value) = 'array' then jsonb_array_length(value) else 0 end), 0)
                from public.user_data where key = 'exams'),
    'bytes', (select coalesce(sum(octet_length(value::text)), 0) from public.user_data where value is not null)
  ) into v;
  return v;
end $$;
revoke all on function public.admin_learning_stats() from public, anon;
grant execute on function public.admin_learning_stats() to authenticated;

-- ============================================================
-- 12. TẠO TÀI KHOẢN QUẢN TRỊ ĐẦU TIÊN (làm sau khi đã đăng ký tài khoản đó trên web)
--    Bỏ dấu "--" ở dòng dưới, thay email của bạn rồi chạy riêng dòng này:
--
-- update public.profiles set role = 'admin' where email = 'email-cua-ban@truong.edu.vn';
-- ============================================================
