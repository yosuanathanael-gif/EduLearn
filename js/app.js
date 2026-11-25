/* Titik awal aplikasi: login, pendaftaran, navigasi, dan pembatasan akses per peran. */
const App = {
  user: null, // { username, name, role }
  page: "dashboard",
  courseFilter: null,
  materialQuery: "", // kata kunci pencarian materi
  materialId: null,
  editing: null, // null = daftar, "new" = materi baru, angka = id materi yang diubah

  recapQuizId: null, // filter kuis pada rekap nilai (null = semua)
  quizAdmin: { quizId: null, edit: null }, // edit: null = daftar soal, "new" = soal baru, angka = urutan soal

  titles: {
    dashboard: "Dashboard",
    courses: "Mata Kuliah",
    materials: "Materi Pembelajaran",
    quizzes: "Kuis",
    results: "Hasil Nilai",
    users: "Pengelolaan Pengguna",
    manage: "Kelola Materi",
    manageQuiz: "Kelola Kuis",
    profile: "Profil Saya",
    backup: "Cadangan Data",
  },

  // Halaman yang hanya boleh dibuka oleh peran tertentu.
  restricted: { users: ["admin"], manage: ["dosen", "admin"], manageQuiz: ["dosen", "admin"], backup: ["admin"] },

  init() {
    EduStore.load();
    const $ = EduUtils.$;
    $("loginForm").addEventListener("submit", (e) => this.login(e));
    $("registerForm").addEventListener("submit", (e) => this.register(e));
    $("showRegister").addEventListener("click", () => this.showForm("registerForm"));
    // Tombol akun demo hanya mengisi kolom login, tidak langsung masuk.
    $("loginForm").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-demo]");
      if (!btn) return;
      $("username").value = btn.dataset.demo;
      $("password").value = btn.dataset.pass;
      $("password").focus();
    });
    $("showLogin").addEventListener("click", () => this.showForm("loginForm"));
    $("logoutBtn").addEventListener("click", () => this.logout());
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.addEventListener("click", () => this.go(btn.dataset.page));
    });
    $("pageContent").addEventListener("click", (e) => this.handleAction(e));
    $("pageContent").addEventListener("submit", (e) => this.handleForm(e));
    $("pageContent").addEventListener("change", (e) => this.handleChange(e));
    $("pageContent").addEventListener("input", (e) => this.handleInput(e));

    // Pulihkan sesi jika halaman di-refresh.
    const saved = EduStore.user(EduAuth.savedSession());
    if (saved) this.enter(saved);
  },

  showForm(formId) {
    ["loginForm", "registerForm"].forEach((id) => EduUtils.$(id).classList.toggle("hidden", id !== formId));
  },

  showMessage(id, text, ok = false) {
    const el = EduUtils.$(id);
    el.textContent = text;
    el.classList.toggle("ok", ok);
    el.classList.toggle("hidden", !text);
  },

  async login(event) {
    event.preventDefault();
    try {
      const result = await EduAuth.login(EduUtils.$("username").value, EduUtils.$("password").value);
      if (!result.ok) return this.showMessage("loginError", result.error);
      this.showMessage("loginError", "");
      this.enter(result.user);
    } catch (error) {
      console.error(error);
      this.showMessage("loginError", "Login gagal. Buka aplikasi lewat Live Server atau alamat https.");
    }
  },

  async register(event) {
    event.preventDefault();
    const $ = EduUtils.$;
    try {
      const result = await EduAuth.createUser({
        name: $("regName").value,
        username: $("regUsername").value,
        password: $("regPassword").value,
        confirm: $("regConfirm").value,
        role: "mahasiswa", // peran ditentukan sistem
      });
      if (!result.ok) return this.showMessage("registerError", result.error);
      this.showMessage("registerError", "");
      $("registerForm").reset();
      this.showForm("loginForm");
      $("username").value = result.user.username;
      this.showMessage("loginError", "Akun berhasil dibuat. Silakan masuk.", true);
    } catch (error) {
      console.error(error);
      this.showMessage("registerError", "Pendaftaran gagal. Buka aplikasi lewat Live Server atau alamat https.");
    }
  },

  enter(user) {
    this.user = { username: user.username, name: user.name, role: user.role };
    EduAuth.saveSession(user.username);
    const $ = EduUtils.$;
    this.showUserInfo();
    $("navUsers").classList.toggle("hidden", user.role !== "admin");
    $("navBackup").classList.toggle("hidden", user.role !== "admin");
    $("navManage").classList.toggle("hidden", user.role === "mahasiswa");
    $("navQuiz").classList.toggle("hidden", user.role === "mahasiswa");
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    this.go("dashboard");
  },

  // Menampilkan nama dan peran pengguna di sidebar dan bilah atas.
  showUserInfo() {
    const $ = EduUtils.$;
    const initial = this.user.name.charAt(0).toUpperCase();
    $("sideName").textContent = this.user.name;
    $("topName").textContent = this.user.name;
    $("sideRole").textContent = EduUtils.roleName(this.user.role);
    $("sideAvatar").textContent = initial;
    $("topAvatar").textContent = initial;
  },

  logout() {
    this.user = null;
    EduAuth.clearSession();
    const $ = EduUtils.$;
    $("appView").classList.add("hidden");
    $("loginView").classList.remove("hidden");
    $("loginForm").reset();
    this.showForm("loginForm");
  },

  canOpen(page) {
    const allowed = this.restricted[page];
    return !allowed || allowed.includes(this.user.role);
  },

  go(page) {
    this.page = this.canOpen(page) ? page : "dashboard";
    this.courseFilter = null;
    this.materialQuery = "";
    this.materialId = null;
    this.editing = null;
    this.quizAdmin = { quizId: null, edit: null };
    this.recapQuizId = null;
    this.render();
  },

  render() {
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === this.page);
    });
    const isRecap = this.page === "results" && this.user.role !== "mahasiswa";
    EduUtils.$("pageTitle").textContent = isRecap ? "Rekap Nilai" : this.titles[this.page];

    const views = {
      dashboard: () => EduViews.dashboard(this.user),
      courses: () => EduViews.courses(this.user),
      materials: () => (this.materialId
        ? EduViews.materialDetail(this.materialId, this.user)
        : EduViews.materials(this.courseFilter, this.materialQuery, this.user)),
      profile: () => EduViews.profile(this.user),
      backup: () => EduViews.backup(),
      quizzes: () => EduViews.quizzes(this.user),
      results: () => EduViews.results(this.user, this.recapQuizId),
      users: () => EduViews.users(),
      manageQuiz: () => {
        const { quizId, edit } = this.quizAdmin;
        if (!quizId) return EduViews.manageQuizzes();
        if (edit === null) return EduViews.quizQuestions(quizId);
        return EduViews.questionForm(quizId, edit === "new" ? null : edit);
      },
      manage: () => (this.editing === null
        ? EduViews.manage()
        : EduViews.materialForm(this.editing === "new" ? null : EduStore.material(this.editing))),
    };
    EduUtils.$("pageContent").innerHTML = views[this.page]();
  },

  // Satu penangan klik untuk semua tombol bertanda data-action.
  handleAction(event) {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const id = Number(el.dataset.id);

    switch (el.dataset.action) {
      case "go":
        this.go(el.dataset.id);
        break;
      case "open-course":
        this.page = "materials";
        this.courseFilter = id;
        this.materialId = null;
        this.render();
        break;
      case "all-materials":
        this.courseFilter = null;
        this.render();
        break;
      case "read":
        this.materialId = id;
        this.render();
        break;
      case "back-materials":
        this.materialId = null;
        this.render();
        break;
      case "new-material":
        this.editing = "new";
        this.render();
        break;
      case "edit-material":
        this.editing = id;
        this.render();
        break;
      case "cancel-form":
        this.editing = null;
        this.render();
        break;
      case "delete-material":
        this.deleteMaterial(id);
        break;
      case "add-section":
        EduUtils.$("sectionList").insertAdjacentHTML("beforeend", EduViews.sectionFields({ heading: "", body: "" }));
        break;
      case "remove-section":
        if (document.querySelectorAll(".section-fields").length > 1) el.closest(".section-fields").remove();
        break;
      case "open-quiz-admin":
        this.quizAdmin = { quizId: id, edit: null };
        this.render();
        break;
      case "back-quizzes":
        this.quizAdmin = { quizId: null, edit: null };
        this.render();
        break;
      case "new-question":
        this.quizAdmin.edit = "new";
        this.render();
        break;
      case "edit-question":
        this.quizAdmin.edit = id;
        this.render();
        break;
      case "cancel-question":
        this.quizAdmin.edit = null;
        this.render();
        break;
      case "delete-question":
        this.deleteQuestion(id);
        break;
      case "delete-quiz":
        this.deleteQuiz(id);
        break;
      case "print-material":
        this.printMaterial(id);
        break;
      case "toggle-done":
        if (this.user.role === "mahasiswa") EduProgress.toggle(this.user.username, id);
        this.render();
        break;
      case "delete-user":
        this.deleteUser(el.dataset.id);
        break;
      case "reset-user":
        this.resetUser(el.dataset.id);
        break;
      case "backup-download":
        if (this.canOpen("backup")) EduBackup.download();
        break;
      case "backup-reset":
        this.resetData();
        break;
      case "export-csv":
        if (this.user.role !== "mahasiswa") EduRecap.download(EduRecap.list(this.recapQuizId));
        break;
      case "start-quiz":
        EduQuiz.start(id, this.user, EduUtils.$("quizArea"), () => this.go("results"));
        break;
    }
  },

  // Formulir di dalam halaman (saat ini: tambah akun oleh Admin).
  deleteMaterial(id) {
    const material = EduStore.material(id);
    if (!material || !this.canOpen("manage")) return;
    if (!confirm(`Hapus materi "${material.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    EduMaterials.remove(id);
    this.render();
    this.showMessage("manageMsg", "Materi dihapus.", true);
  },

  saveMaterial(event) {
    event.preventDefault();
    if (!this.canOpen("manage")) return;
    const f = new FormData(event.target);
    const result = EduMaterials.save(this.editing === "new" ? null : this.editing, {
      courseId: Number(f.get("courseId")),
      title: f.get("title"),
      summary: f.get("summary"),
      headings: f.getAll("sectionHeading"),
      bodies: f.getAll("sectionBody"),
      points: f.get("points"),
      videoUrls: f.get("videoUrls") || "",
    });
    if (!result.ok) return this.showMessage("materialFormMsg", result.error);
    this.editing = null;
    this.render();
    this.showMessage("manageMsg", "Materi berhasil disimpan.", true);
  },

  // Perubahan pilihan: filter rekap nilai, filter mata kuliah materi, dan berkas cadangan.
  handleChange(event) {
    const { id, value } = event.target;
    if (id === "recapFilter") {
      this.recapQuizId = value ? Number(value) : null;
      this.render();
    } else if (id === "materialCourse") {
      this.courseFilter = value ? Number(value) : null;
      this.render();
    } else if (id === "backupFile") {
      this.restoreBackup(event.target.files[0]);
    }
  },

  // Mengetik di kolom pencarian hanya memperbarui daftar, supaya kursor tidak hilang.
  handleInput(event) {
    if (event.target.id !== "materialSearch") return;
    this.materialQuery = event.target.value;
    const list = EduSearch.materials(this.materialQuery, this.courseFilter);
    EduUtils.$("materialGrid").innerHTML = EduViews.materialCards(list, this.user);
    EduUtils.$("materialCount").textContent = `${list.length} materi ditemukan`;
  },

  deleteUser(username) {
    if (!this.canOpen("users")) return;
    if (!confirm(`Hapus akun "${username}"? Hasil kuis akun ini tetap tersimpan di rekap.`)) return;
    const result = EduAuth.removeUser(username, this.user.username);
    this.render();
    this.showMessage("userListMsg", result.ok ? `Akun ${username} dihapus.` : result.error, result.ok);
  },

  async resetUser(username) {
    if (!this.canOpen("users")) return;
    const password = prompt(`Kata sandi baru untuk "${username}" (minimal 6 karakter):`);
    if (password === null) return;
    const result = await EduAuth.setPassword(username, password);
    this.showMessage("userListMsg", result.ok ? `Kata sandi ${username} berhasil diatur ulang.` : result.error, result.ok);
  },

  // Setelah seluruh data diganti (pulihkan/reset), pastikan akun yang aktif masih ada.
  afterDataReplaced(message) {
    const current = EduStore.user(this.user.username);
    if (!current) {
      this.logout();
      alert("Data berhasil diganti. Akun Anda tidak ada di data baru, silakan masuk kembali.");
      return;
    }
    this.enter(current);
    this.go("backup");
    this.showMessage("backupMsg", message, true);
  },

  async restoreBackup(file) {
    if (!file || !this.canOpen("backup")) return;
    if (!confirm("Pulihkan dari cadangan? Seluruh data saat ini akan diganti.")) {
      EduUtils.$("backupFile").value = "";
      return;
    }
    const result = EduBackup.restore(await file.text());
    if (!result.ok) {
      EduUtils.$("backupFile").value = "";
      return this.showMessage("backupMsg", result.error);
    }
    this.afterDataReplaced("Data berhasil dipulihkan dari cadangan.");
  },

  resetData() {
    if (!this.canOpen("backup")) return;
    if (!confirm("Kembalikan semua data ke data awal? Perubahan dan hasil kuis akan hilang.")) return;
    EduStore.reset();
    this.afterDataReplaced("Data dikembalikan ke data awal.");
  },

  deleteQuiz(id) {
    const quiz = EduStore.quiz(id);
    if (!quiz || !this.canOpen("manageQuiz")) return;
    if (!confirm(`Hapus kuis "${quiz.title}" beserta seluruh soalnya?`)) return;
    EduQuizAdmin.removeQuiz(id);
    this.render();
    this.showMessage("quizMsg", "Kuis dihapus.", true);
  },

  deleteQuestion(index) {
    const { quizId } = this.quizAdmin;
    if (!EduStore.quiz(quizId) || !this.canOpen("manageQuiz")) return;
    if (!confirm(`Hapus soal nomor ${index + 1}?`)) return;
    EduQuizAdmin.removeQuestion(quizId, index);
    this.render();
    this.showMessage("quizMsg", "Soal dihapus.", true);
  },

  saveQuiz(event) {
    event.preventDefault();
    if (!this.canOpen("manageQuiz")) return;
    const f = new FormData(event.target);
    const result = EduQuizAdmin.addQuiz(Number(f.get("courseId")), f.get("title"));
    this.render();
    this.showMessage("quizMsg", result.ok ? "Kuis berhasil dibuat. Klik Kelola soal untuk menambah soal." : result.error, result.ok);
  },

  saveQuestion(event) {
    event.preventDefault();
    if (!this.canOpen("manageQuiz")) return;
    const f = new FormData(event.target);
    const { quizId, edit } = this.quizAdmin;
    const answer = f.get("answer");
    const result = EduQuizAdmin.saveQuestion(quizId, edit === "new" ? null : edit, {
      question: f.get("question"),
      options: f.getAll("option"),
      answer: answer === null ? NaN : Number(answer),
    });
    if (!result.ok) return this.showMessage("questionFormMsg", result.error);
    this.quizAdmin.edit = null;
    this.render();
    this.showMessage("quizMsg", "Soal berhasil disimpan.", true);
  },

  // "Unduh PDF": membuka dialog cetak browser, lalu pilih "Simpan sebagai PDF".
  // Judul halaman diganti sementara agar nama berkas PDF sesuai judul materi.
  printMaterial(id) {
    const material = EduStore.material(id);
    if (!material) return;
    const oldTitle = document.title;
    document.title = `EduLearn - ${material.title}`;
    window.addEventListener("afterprint", () => { document.title = oldTitle; }, { once: true });
    window.print();
  },

  saveName(event) {
    event.preventDefault();
    const result = EduAuth.renameUser(this.user.username, new FormData(event.target).get("name"));
    if (!result.ok) return this.showMessage("nameFormMsg", result.error);
    this.user.name = result.user.name;
    this.showUserInfo();
    this.render();
    this.showMessage("nameFormMsg", "Nama berhasil diubah.", true);
  },

  async savePassword(event) {
    event.preventDefault();
    const f = new FormData(event.target);
    const result = await EduAuth.changePassword(this.user.username, f.get("old"), f.get("password"), f.get("confirm"));
    if (!result.ok) return this.showMessage("passwordFormMsg", result.error);
    event.target.reset();
    this.showMessage("passwordFormMsg", "Kata sandi berhasil diganti.", true);
  },

  async handleForm(event) {
    if (event.target.id === "quizForm") return this.saveQuiz(event);
    if (event.target.id === "questionForm") return this.saveQuestion(event);
    if (event.target.id === "materialForm") return this.saveMaterial(event);
    if (event.target.id === "nameForm") return this.saveName(event);
    if (event.target.id === "passwordForm") return this.savePassword(event);
    if (event.target.id !== "userForm") return;
    event.preventDefault();
    if (this.user.role !== "admin") return; // pemeriksaan ulang di sisi logika
    const f = new FormData(event.target);
    const result = await EduAuth.createUser({
      name: f.get("name"),
      username: f.get("username"),
      password: f.get("password"),
      role: f.get("role"),
    });
    if (!result.ok) return this.showMessage("userFormMsg", result.error);
    this.render();
    this.showMessage("userFormMsg", `Akun ${result.user.username} berhasil dibuat.`, true);
  },
};

App.init();
