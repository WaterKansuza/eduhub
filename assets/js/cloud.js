/* ============================================================
   EduHub – Lớp kết nối Supabase (cloud.js)
   Nạp SAU: supabase-config.js và thư viện @supabase/supabase-js.
   Cung cấp window.EduCloud:
     enabled      true khi đã cấu hình và tải được thư viện
     unavailable  true khi đã cấu hình nhưng không tải được thư viện (mạng chặn CDN)
     Đăng nhập: signUp, signIn, signInGoogle, signOut, user, resetPassword, updatePassword, onRecovery
     Đánh giá (sinh viên): listMine, save, remove
     Đồng bộ dữ liệu học tập (giai đoạn 2, dùng bởi sync.js): syncPull, syncPut, syncSubscribe
     Tệp bài nộp (Storage): fileUpload, fileDownload, fileRemove, fileList
     EduCloud.admin: signIn, check, signOut, listProfiles, listReviews, moderate, removeReview, deleteUser
   Mọi lỗi được ném ra dưới dạng Error có thông điệp tiếng Việt.
   ============================================================ */
(function (global) {
  'use strict';
  var cfg = global.EDUHUB_CLOUD || {};
  var configured = typeof cfg.url === 'string' && /^https:\/\//.test(cfg.url) &&
    typeof cfg.anonKey === 'string' && cfg.anonKey.length > 20 &&
    !/YOUR_/i.test(cfg.url + cfg.anonKey);
  var lib = global.supabase && global.supabase.createClient;
  var enabled = configured && !!lib;
  var main = null, adm = null;

  function client(kind) {
    if (kind === 'admin') {   // phiên quản trị tách riêng để không lẫn với tài khoản sinh viên trên cùng trình duyệt
      return adm || (adm = lib(cfg.url, cfg.anonKey, { auth: { storageKey: 'eduhub-admin-auth', detectSessionInUrl: false } }));
    }
    return main || (main = lib(cfg.url, cfg.anonKey, { auth: { storageKey: 'eduhub-auth' } }));
  }
  function loginUrl() { return new URL('login.html', global.location.href).href; }

  function vi(err) {
    var m = (err && err.message) || String(err);
    if (/invalid login credentials/i.test(m)) return 'Email hoặc mật khẩu không đúng.';
    if (/already registered|already been registered/i.test(m)) return 'Email này đã được đăng ký. Hãy đăng nhập.';
    if (/email not confirmed/i.test(m)) return 'Email chưa được xác nhận. Hãy mở email xác nhận rồi đăng nhập lại.';
    if (/rate limit|too many|over_email_send_rate/i.test(m)) return 'Thao tác quá nhanh, vui lòng thử lại sau ít phút.';
    if (/password/i.test(m) && /(short|least|weak|characters)/i.test(m)) return 'Mật khẩu quá yếu hoặc quá ngắn (tối thiểu 8 ký tự).';
    if (/failed to fetch|network|load failed/i.test(m)) return 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.';
    if (/jwt|not authenticated|permission denied|row-level security|invalid refresh/i.test(m)) return 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền. Hãy đăng nhập lại.';
    return m;
  }
  function wrap(err) { var e = new Error(vi(err)); e.original = err; return e; }

  function toProfile(p, u) {
    if (p) return { id: p.id, name: p.full_name || '', email: p.email, mssv: p.mssv || '', provider: p.provider || 'email', role: p.role || 'student', createdAt: Date.parse(p.created_at) || 0 };
    if (!u) return null;
    var md = u.user_metadata || {};
    return { id: u.id, name: md.full_name || md.name || '', email: (u.email || '').toLowerCase(), mssv: md.mssv || '', provider: (u.app_metadata && u.app_metadata.provider) || 'email', role: 'student', createdAt: Date.parse(u.created_at) || 0 };
  }
  async function sessionUser(kind) {
    var r = await client(kind).auth.getSession();
    return (r.data && r.data.session && r.data.session.user) || null;
  }
  async function getProfile(kind) {
    var u = await sessionUser(kind);
    if (!u) return null;
    var r = await client(kind).from('profiles').select('*').eq('id', u.id).maybeSingle();
    if (r.error) throw wrap(r.error);
    return toProfile(r.data, u);
  }
  async function fetchAll(make) {
    var out = [], from = 0, step = 1000;
    for (;;) {
      var r = await make().range(from, from + step - 1);
      if (r.error) throw wrap(r.error);
      out = out.concat(r.data || []);
      if (!r.data || r.data.length < step || from > 50000) break;
      from += step;
    }
    return out;
  }
  function fromRow(r) {
    return { id: r.id, ts: Date.parse(r.created_at) || Date.now(), overall: r.overall, cats: r.cats || {}, tags: r.tags || [],
      comment: r.comment || '', reply: r.reply || '', replyTs: r.reply_at ? Date.parse(r.reply_at) : 0, hidden: !!r.hidden };
  }

  var EduCloud = {
    enabled: enabled,
    configured: configured,
    unavailable: configured && !lib,

    /* ---------- Tài khoản ---------- */
    async signUp(o) {
      try {
        var r = await client().auth.signUp({ email: o.email, password: o.password,
          options: { data: { full_name: o.name, mssv: o.mssv }, emailRedirectTo: loginUrl() } });
        if (r.error) throw r.error;
        if (r.data.user && r.data.user.identities && r.data.user.identities.length === 0) throw new Error('already registered');
        return { needsConfirm: !r.data.session };
      } catch (e) { throw wrap(e); }
    },
    async signIn(email, password) {
      try {
        var r = await client().auth.signInWithPassword({ email: email, password: password });
        if (r.error) throw r.error;
        return await getProfile();
      } catch (e) { throw wrap(e); }
    },
    async signInGoogle(idToken) {
      try {
        var r = await client().auth.signInWithIdToken({ provider: 'google', token: idToken });
        if (r.error) throw r.error;
        return await getProfile();
      } catch (e) { throw wrap(e); }
    },
    async signOut() { try { await client().auth.signOut({ scope: 'local' }); } catch (e) {} },
    async user() { try { return await sessionUser(); } catch (e) { return null; } },
    async resetPassword(email) {
      var r = await client().auth.resetPasswordForEmail(email, { redirectTo: loginUrl() });
      if (r.error) throw wrap(r.error);
    },
    async updatePassword(pw) {
      var r = await client().auth.updateUser({ password: pw });
      if (r.error) throw wrap(r.error);
    },
    onRecovery: function (cb) { client().auth.onAuthStateChange(function (ev) { if (ev === 'PASSWORD_RECOVERY') cb(); }); },

    /* ---------- Đánh giá của chính người dùng ---------- */
    async listMine() {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var r = await client().from('reviews').select('*').eq('user_id', u.id).order('created_at', { ascending: false }).limit(50);
      if (r.error) throw wrap(r.error);
      return (r.data || []).map(fromRow);
    },
    async save(rec, id) {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var body = { overall: rec.overall, cats: rec.cats || {}, tags: rec.tags || [], comment: rec.comment || '' };
      var r = id
        ? await client().from('reviews').update(Object.assign(body, { updated_at: new Date().toISOString() })).eq('id', id).eq('user_id', u.id)
        : await client().from('reviews').insert(Object.assign(body, { user_id: u.id }));
      if (r.error) throw wrap(r.error);
    },
    async remove(id) {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var r = await client().from('reviews').delete().eq('id', id).eq('user_id', u.id);
      if (r.error) throw wrap(r.error);
    },

    /* ---------- Đồng bộ dữ liệu học tập (giai đoạn 2) ---------- */
    async syncPull() {
      var r = await client().from('user_data').select('key,value,updated_at');
      if (r.error) throw wrap(r.error);
      return r.data || [];
    },
    /* Trả về mốc thời gian mới của máy chủ, hoặc null nếu XUNG ĐỘT (thiết bị khác đã sửa trước). */
    async syncPut(key, value, baseTs) {
      var r = await client().rpc('sync_put', { p_key: key, p_value: value == null ? null : value, p_base: baseTs || null });
      if (r.error) throw wrap(r.error);
      return r.data || null;
    },

    /* Realtime: gọi cb(row) mỗi khi một ngăn dữ liệu của CHÍNH người dùng đổi ở thiết bị khác. Trả về hàm hủy đăng ký. */
    async syncSubscribe(cb) {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var c = client(), ch = c.channel('eduhub-sync-' + u.id)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_data', filter: 'user_id=eq.' + u.id },
          function (p) { try { cb(p && p.new ? p.new : null); } catch (e) {} })
        .subscribe();
      return function () { try { c.removeChannel(ch); } catch (e) {} };
    },

    /* ---------- Tệp bài nộp (Supabase Storage, bucket riêng tư 'submissions', thư mục = id người dùng) ---------- */
    async fileUpload(id, blob) {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var r = await client().storage.from('submissions').upload(u.id + '/' + id, blob,
        { upsert: true, contentType: (blob && blob.type) || 'application/octet-stream' });
      if (r.error) throw wrap(r.error);
    },
    /* Trả về Blob, hoặc null nếu máy chủ chưa có tệp này. */
    async fileDownload(id) {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var r = await client().storage.from('submissions').download(u.id + '/' + id);
      if (r.error) {
        if (/not.?found|404|does not exist/i.test(String(r.error.message || '') + String(r.error.statusCode || '') + String(r.error.status || ''))) return null;
        throw wrap(r.error);
      }
      return r.data || null;
    },
    async fileRemove(ids) {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      if (!ids || !ids.length) return;
      var r = await client().storage.from('submissions').remove(ids.map(function (i) { return u.id + '/' + i; }));
      if (r.error) throw wrap(r.error);
    },
    async fileList() {
      var u = await sessionUser();
      if (!u) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
      var names = [], off = 0;
      for (;;) {
        var r = await client().storage.from('submissions').list(u.id, { limit: 1000, offset: off });
        if (r.error) throw wrap(r.error);
        var d = r.data || [];
        names = names.concat(d.map(function (x) { return x.name; }));
        if (d.length < 1000 || off > 20000) break;
        off += 1000;
      }
      return names;
    },

    /* ---------- Quản trị (phiên riêng, bắt buộc role = admin) ---------- */
    admin: {
      async signIn(email, password) {
        try {
          var r = await client('admin').auth.signInWithPassword({ email: email, password: password });
          if (r.error) throw r.error;
          var p = await getProfile('admin');
          if (!p || p.role !== 'admin') {
            await client('admin').auth.signOut({ scope: 'local' });
            throw new Error('Tài khoản này không có quyền quản trị.');
          }
          return p;
        } catch (e) { throw (e && e.original) ? e : wrap(e); }
      },
      async check() {
        try { var p = await getProfile('admin'); return p && p.role === 'admin' ? p : null; } catch (e) { return null; }
      },
      async signOut() { try { await client('admin').auth.signOut({ scope: 'local' }); } catch (e) {} },
      async listProfiles() {
        var rows = await fetchAll(function () { return client('admin').from('profiles').select('*').order('created_at', { ascending: false }).order('id'); });
        return rows.map(function (p) { return toProfile(p); });
      },
      async listReviews() {
        var rows = await fetchAll(function () { return client('admin').from('reviews').select('*').order('created_at', { ascending: false }).order('id'); });
        return rows.map(function (r) { var x = fromRow(r); x.userId = r.user_id; return x; });
      },
      async moderate(id, reply, hidden) {
        var r = await client('admin').rpc('admin_moderate_review', { p_id: id, p_reply: reply || null, p_hidden: !!hidden });
        if (r.error) throw wrap(r.error);
      },
      async removeReview(id) {
        var r = await client('admin').from('reviews').delete().eq('id', id);
        if (r.error) throw wrap(r.error);
      },
      async deleteUser(uid) {
        var r = await client('admin').rpc('admin_delete_user', { p_uid: uid });
        if (r.error) throw wrap(r.error);
        /* Hàm trả về danh sách đường dẫn tệp bài nộp của người đó; xóa khỏi Storage (quản trị chỉ có quyền XÓA, không có quyền đọc). */
        var paths = Array.isArray(r.data) ? r.data : [];
        for (var i = 0; i < paths.length; i += 100) {
          try { await client('admin').storage.from('submissions').remove(paths.slice(i, i + 100)); } catch (e) {}
        }
      },
      /* Số liệu TỔNG HỢP về dữ liệu học tập, không có nội dung hay thông tin từng người. */
      async learningStats() {
        var r = await client('admin').rpc('admin_learning_stats');
        if (r.error) throw wrap(r.error);
        return r.data || {};
      }
    }
  };
  global.EduCloud = EduCloud;
})(window);
