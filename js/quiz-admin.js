/* Pengelolaan kuis: tambah/hapus kuis dan tambah/ubah/hapus soal. */
const EduQuizAdmin = {
  nextQuizId() {
    return Math.max(0, ...EduStore.data.quizzes.map((q) => q.id)) + 1;
  },

  addQuiz(courseId, title) {
    if (!EduStore.course(courseId)) return { ok: false, error: "Pilih mata kuliah terlebih dahulu." };
    if (title.trim().length < 3) return { ok: false, error: "Judul kuis minimal 3 karakter." };
    EduStore.data.quizzes.push({ id: this.nextQuizId(), courseId, title: title.trim(), questions: [] });
    EduStore.save();
    return { ok: true };
  },

  removeQuiz(id) {
    EduStore.data.quizzes = EduStore.data.quizzes.filter((q) => q.id !== id);
    EduStore.save();
  },

  // Mengubah isian formulir menjadi soal, atau mengembalikan teks error.
  parseQuestion({ question, options, answer }) {
    const text = question.trim();
    const list = options.map((o) => o.trim());
    if (text.length < 5) return { error: "Pertanyaan minimal 5 karakter." };
    if (list.length !== 4 || list.some((o) => !o)) return { error: "Semua pilihan jawaban (A sampai D) harus diisi." };
    if (new Set(list.map((o) => o.toLowerCase())).size !== list.length) return { error: "Pilihan jawaban tidak boleh sama." };
    if (!Number.isInteger(answer) || answer < 0 || answer > 3) return { error: "Pilih satu jawaban yang benar." };
    return { data: { question: text, options: list, answer } };
  },

  // index null = soal baru, selain itu = ubah soal pada urutan tersebut.
  saveQuestion(quizId, index, input) {
    const quiz = EduStore.quiz(quizId);
    if (!quiz) return { ok: false, error: "Kuis tidak ditemukan." };
    const parsed = this.parseQuestion(input);
    if (parsed.error) return { ok: false, error: parsed.error };
    if (index === null) quiz.questions.push(parsed.data);
    else quiz.questions[index] = parsed.data;
    EduStore.save();
    return { ok: true };
  },

  removeQuestion(quizId, index) {
    const quiz = EduStore.quiz(quizId);
    if (!quiz) return;
    quiz.questions.splice(index, 1);
    EduStore.save();
  },
};
