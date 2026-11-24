/* Titik awal aplikasi: login, pendaftaran, navigasi, dan pembatasan akses per peran. */
const App = {
  user: null, // { username, name, role }
  page: "dashboard",
  courseFilter: null,
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
  },

  // Halaman yang hanya boleh dibuka oleh peran tertentu.
  restricted: { users: ["admin"], manage: ["dosen", "admin"], manageQuiz: ["dosen", "admin"] },

  init() {
    EduStore.load();
    const $ = EduUtils.$;
    $("loginForm").addEventListener("submit", (e) => this.login(e));
    $("registerForm").addEventListener("submit", (e) => this.register(e));
    $("showRegister").addEventListener("click", () => this.showForm("registerForm"));
    $("showLogin").addEventListener("click", () => this.showForm("loginForm"));
    $("logoutBtn").addEventListener("click", () => this.logout());
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.addEventListener("click", () => this.go(btn.dataset.page));
    });
    $("pageContent").addEventListener("click", (e) => this.handleAction(e));
    $("pageContent").addEventListener("submit", (e) => this.handleForm(e));
    $("pageContent").addEventListener("change", (e) => this.handleChange(e));

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
    const initial = user.name.charAt(0).toUpperCase();
    const $ = EduUtils.$;
    $("sideName").textContent = user.name;
    $("topName").textContent = user.name;
    $("sideRole").textContent = EduUtils.roleName(user.role);
    $("sideAvatar").textContent = initial;
    $("topAvatar").textContent = initial;
    $("navUsers").classList.toggle("hidden", user.role !== "admin");
    $("navManage").classList.toggle("hidden", user.role === "mahasiswa");
    $("navQuiz").classList.toggle("hidden", user.role === "mahasiswa");
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    this.go("dashboard");
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
      courses: () => EduViews.courses(),
      materials: () => (this.materialId
        ? EduViews.materialDetail(this.materialId)
        : EduViews.materials(this.courseFilter)),
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
    });
    if (!result.ok) return this.showMessage("materialFormMsg", result.error);
    this.editing = null;
    this.render();
    this.showMessage("manageMsg", "Materi berhasil disimpan.", true);
  },

  // Perubahan pilihan pada filter rekap nilai.
  handleChange(event) {
    if (event.target.id !== "recapFilter") return;
    this.recapQuizId = event.target.value ? Number(event.target.value) : null;
    this.render();
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

  async handleForm(event) {
    if (event.target.id === "quizForm") return this.saveQuiz(event);
    if (event.target.id === "questionForm") return this.saveQuestion(event);
    if (event.target.id === "materialForm") return this.saveMaterial(event);
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
