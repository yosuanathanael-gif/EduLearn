/* Akun, kata sandi (hash), dan sesi login. */
const EduAuth = {
  SESSION_KEY: "edulearn_session",

  toHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  },

  newSalt() {
    return this.toHex(crypto.getRandomValues(new Uint8Array(16)));
  },

  async hash(password, salt) {
    const bytes = new TextEncoder().encode(salt + password);
    return this.toHex(await crypto.subtle.digest("SHA-256", bytes));
  },

  // Mengembalikan teks error, atau null jika data akun valid.
  checkNewAccount({ name, username, password, confirm }) {
    if (!name.trim()) return "Nama lengkap wajib diisi.";
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return "Nama pengguna 3-20 karakter: huruf kecil, angka, atau garis bawah.";
    if (password.length < 6) return "Kata sandi minimal 6 karakter.";
    if (confirm !== undefined && password !== confirm) return "Konfirmasi kata sandi tidak sama.";
    if (EduStore.user(username)) return "Nama pengguna sudah dipakai.";
    return null;
  },

  // Peran ditentukan oleh pemanggil (sistem), bukan dipilih pengguna saat login.
  async createUser({ name, username, password, confirm, role }) {
    username = username.trim().toLowerCase();
    const error = this.checkNewAccount({ name, username, password, confirm });
    if (error) return { ok: false, error };
    const salt = this.newSalt();
    const user = { username, name: name.trim(), role, salt, hash: await this.hash(password, salt) };
    EduStore.data.users.push(user);
    EduStore.save();
    return { ok: true, user };
  },

  async login(username, password) {
    const failed = { ok: false, error: "Nama pengguna atau kata sandi salah." };
    const user = EduStore.user(username.trim().toLowerCase());
    if (!user) return failed;
    return (await this.hash(password, user.salt)) === user.hash ? { ok: true, user } : failed;
  },

  adminCount() {
    return EduStore.data.users.filter((u) => u.role === "admin").length;
  },

  // Hapus akun: tidak boleh akun sendiri dan tidak boleh admin terakhir.
  removeUser(username, actor) {
    const user = EduStore.user(username);
    if (!user) return { ok: false, error: "Akun tidak ditemukan." };
    if (username === actor) return { ok: false, error: "Akun yang sedang dipakai tidak bisa dihapus." };
    if (user.role === "admin" && this.adminCount() <= 1) return { ok: false, error: "Admin terakhir tidak boleh dihapus." };
    EduStore.data.users = EduStore.data.users.filter((u) => u.username !== username);
    delete EduStore.data.progress[username];
    EduStore.save();
    return { ok: true };
  },

  async setPassword(username, password) {
    const user = EduStore.user(username);
    if (!user) return { ok: false, error: "Akun tidak ditemukan." };
    if (password.length < 6) return { ok: false, error: "Kata sandi minimal 6 karakter." };
    user.salt = this.newSalt();
    user.hash = await this.hash(password, user.salt);
    EduStore.save();
    return { ok: true };
  },

  // Ganti kata sandi sendiri: kata sandi lama wajib benar.
  async changePassword(username, oldPassword, newPassword, confirm) {
    const user = EduStore.user(username);
    if (!user) return { ok: false, error: "Akun tidak ditemukan." };
    if ((await this.hash(oldPassword, user.salt)) !== user.hash) return { ok: false, error: "Kata sandi lama salah." };
    if (newPassword !== confirm) return { ok: false, error: "Konfirmasi kata sandi baru tidak sama." };
    if (newPassword === oldPassword) return { ok: false, error: "Kata sandi baru harus berbeda dari yang lama." };
    return this.setPassword(username, newPassword);
  },

  renameUser(username, name) {
    const user = EduStore.user(username);
    if (!user) return { ok: false, error: "Akun tidak ditemukan." };
    if (name.trim().length < 3) return { ok: false, error: "Nama lengkap minimal 3 karakter." };
    user.name = name.trim();
    EduStore.save();
    return { ok: true, user };
  },

  saveSession(username) {
    try { sessionStorage.setItem(this.SESSION_KEY, username); } catch (e) { /* abaikan */ }
  },

  savedSession() {
    try { return sessionStorage.getItem(this.SESSION_KEY); } catch (e) { return null; }
  },

  clearSession() {
    try { sessionStorage.removeItem(this.SESSION_KEY); } catch (e) { /* abaikan */ }
  },
};
