/* Titik awal aplikasi: login, navigasi, dan pengaturan halaman. */
const App = {
  user: null,
  page: "dashboard",
  courseFilter: null,
  materialId: null,

  titles: {
    dashboard: "Dashboard",
    courses: "Mata Kuliah",
    materials: "Materi Pembelajaran",
    quizzes: "Kuis",
    results: "Hasil Nilai",
  },

  init() {
    EduStore.load();
    EduUtils.$("loginForm").addEventListener("submit", (e) => this.login(e));
    EduUtils.$("logoutBtn").addEventListener("click", () => this.logout());
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.addEventListener("click", () => this.go(btn.dataset.page));
    });
    EduUtils.$("pageContent").addEventListener("click", (e) => this.handleAction(e));
  },

  login(event) {
    event.preventDefault();
    const name = EduUtils.$("username").value.trim();
    if (!name) return;
    this.user = { name, role: EduUtils.$("role").value };

    const initial = name.charAt(0).toUpperCase();
    EduUtils.$("sideName").textContent = name;
    EduUtils.$("topName").textContent = name;
    EduUtils.$("sideRole").textContent = EduUtils.roleName(this.user.role);
    EduUtils.$("sideAvatar").textContent = initial;
    EduUtils.$("topAvatar").textContent = initial;

    EduUtils.$("loginView").classList.add("hidden");
    EduUtils.$("appView").classList.remove("hidden");
    this.go("dashboard");
  },

  logout() {
    this.user = null;
    EduUtils.$("appView").classList.add("hidden");
    EduUtils.$("loginView").classList.remove("hidden");
    EduUtils.$("username").value = "";
  },

  go(page) {
    this.page = page;
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
};

App.init();
