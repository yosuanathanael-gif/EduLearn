/* Titik awal aplikasi: login, pendaftaran, navigasi, dan pembatasan akses per peran. */
const App = {
  user: null, // { username, name, role }
  page: "dashboard",
  courseFilter: null,
  materialId: null,

  titles: {
    dashboard: "Dashboard",
    courses: "Mata Kuliah",
    materials: "Materi Pembelajaran",
    quizzes: "Kuis",
    results: "Hasil Nilai",
    users: "Pengelolaan Pengguna",
  },

  // Halaman yang hanya boleh dibuka oleh peran tertentu.
  restricted: { users: ["admin"] },

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
    this.render();
  },

  render() {
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === this.page);
    });
    EduUtils.$("pageTitle").textContent = this.titles[this.page];

    const views = {
      dashboard: () => EduViews.dashboard(this.user),
      courses: () => EduViews.courses(),
      materials: () => (this.materialId
        ? EduViews.materialDetail(this.materialId)
        : EduViews.materials(this.courseFilter)),
      quizzes: () => EduViews.quizzes(this.user),
      results: () => EduViews.results(this.user),
      users: () => EduViews.users(),
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
      case "start-quiz":
        EduQuiz.start(id, this.user, EduUtils.$("quizArea"), () => this.go("results"));
        break;
    }
  },

  // Formulir di dalam halaman (saat ini: tambah akun oleh Admin).
  async handleForm(event) {
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
