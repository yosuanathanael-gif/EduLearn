/* Cadangan data (ekspor/impor JSON) dan pengembalian ke data awal. Hanya untuk Admin. */
const EduBackup = {
  VERSION: 1,

  // Isi berkas cadangan. Catatan: memuat hash kata sandi, jadi berkas harus disimpan dengan aman.
  toJson() {
    return JSON.stringify({ app: "EduLearn", version: this.VERSION, exportedAt: new Date().toISOString(), data: EduStore.data }, null, 2);
  },

  download() {
    const blob = new Blob([this.toJson()], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `edulearn-cadangan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  },

  // Mengembalikan teks error, atau null jika struktur data cadangan benar.
  validate(data) {
    if (!data || typeof data !== "object") return "Isi berkas bukan data EduLearn.";
    for (const key of ["courses", "materials", "quizzes", "results", "users"]) {
      if (!Array.isArray(data[key])) return `Data "${key}" tidak ditemukan atau rusak.`;
    }
    const roles = ["admin", "dosen", "mahasiswa"];
    const names = new Set();
    for (const u of data.users) {
      if (!u || typeof u.username !== "string" || typeof u.name !== "string" || !roles.includes(u.role)
        || typeof u.salt !== "string" || typeof u.hash !== "string") return "Ada akun dengan format yang salah.";
      if (names.has(u.username)) return "Ada nama pengguna yang ganda.";
      names.add(u.username);
    }
    if (!data.users.some((u) => u.role === "admin")) return "Data harus memiliki minimal satu akun Admin.";
    const courseIds = new Set(data.courses.map((c) => c.id));
    for (const c of data.courses) {
      if (typeof c.id !== "number" || typeof c.name !== "string") return "Ada mata kuliah dengan format yang salah.";
    }
    for (const m of data.materials) {
      if (typeof m.id !== "number" || !courseIds.has(m.courseId) || typeof m.title !== "string"
        || !Array.isArray(m.sections) || !Array.isArray(m.points)) return "Ada materi dengan format yang salah.";
      if (m.videoIds !== undefined && (!Array.isArray(m.videoIds)
        || !m.videoIds.every((id) => typeof id === "string" && /^[A-Za-z0-9_-]{11}$/.test(id)))) return "Ada materi dengan tautan video yang salah.";
    }
    for (const q of data.quizzes) {
      if (typeof q.id !== "number" || !courseIds.has(q.courseId) || !Array.isArray(q.questions)) return "Ada kuis dengan format yang salah.";
      for (const item of q.questions) {
        if (typeof item.question !== "string" || !Array.isArray(item.options) || item.options.length !== 4
          || !Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3) return "Ada soal dengan format yang salah.";
      }
    }
    return null;
  },

  // Membaca teks berkas cadangan. Data lama tidak diubah kecuali semua pemeriksaan lolos.
  restore(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return { ok: false, error: "Berkas bukan JSON yang valid." };
    }
    const data = parsed && parsed.app === "EduLearn" ? parsed.data : null;
    const error = data ? this.validate(data) : "Berkas ini bukan cadangan EduLearn.";
    if (error) return { ok: false, error };
    EduStore.replace(data);
    return { ok: true };
  },
};
