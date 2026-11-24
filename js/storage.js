/* Penyimpanan data di localStorage. Data awal berasal dari folder data/. */
const EduStore = {
  KEY: "edulearn_v3",
  data: { courses: [], materials: [], quizzes: [], results: [], users: [] },

  load() {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (saved) {
        this.data = JSON.parse(saved);
        if (!this.data.users) {
          this.data.users = structuredClone(window.EDULEARN_SEED.users);
          this.save();
        }
        return;
      }
    } catch (error) {
      console.warn("Data tersimpan tidak terbaca, memakai data awal.", error);
    }
    const seed = window.EDULEARN_SEED;
    this.data = {
      courses: structuredClone(seed.courses),
      materials: structuredClone(seed.materials),
      quizzes: structuredClone(seed.quizzes),
      results: [],
      users: structuredClone(seed.users),
    };
    this.save();
  },

  save() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error("Gagal menyimpan data.", error);
    }
  },

  user(username) {
    return this.data.users.find((u) => u.username === username);
  },

  course(id) {
    return this.data.courses.find((c) => c.id === id);
  },

  material(id) {
    return this.data.materials.find((m) => m.id === id);
  },

  quiz(id) {
    return this.data.quizzes.find((q) => q.id === id);
  },

  courseName(id) {
    const course = this.course(id);
    return course ? course.name : "";
  },
};
