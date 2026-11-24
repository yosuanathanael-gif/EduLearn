/* Rekap nilai untuk Dosen dan Admin: filter, statistik, dan ekspor CSV. */
const EduRecap = {
  // Hasil terbaru di atas. quizId null = semua kuis.
  list(quizId) {
    const all = EduStore.data.results.slice().reverse();
    return quizId ? all.filter((r) => r.quizId === quizId) : all;
  },

  stats(list) {
    if (!list.length) return { count: 0, avg: 0, max: 0, min: 0 };
    const scores = list.map((r) => r.score);
    const sum = scores.reduce((a, b) => a + b, 0);
    return {
      count: list.length,
      avg: Math.round((sum / list.length) * 10) / 10,
      max: Math.max(...scores),
      min: Math.min(...scores),
    };
  },

  // Sel CSV diberi tanda kutip; awalan = + - @ diberi apostrof agar tidak dibaca sebagai rumus Excel.
  csvCell(value) {
    let text = String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  },

  toCsv(list) {
    const header = ["Nama Mahasiswa", "Nama Pengguna", "Mata Kuliah", "Kuis", "Benar", "Total Soal", "Nilai", "Tanggal"];
    const rows = list.map((r) => [
      r.student, r.studentId || "", EduStore.courseName(r.courseId), r.quiz, r.correct, r.total, r.score, r.date,
    ]);
    return [header, ...rows].map((row) => row.map((c) => this.csvCell(c)).join(",")).join("\r\n");
  },

  download(list) {
    const blob = new Blob(["\uFEFF" + this.toCsv(list)], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rekap-nilai-edulearn.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  },
};
