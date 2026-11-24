/* Pengerjaan kuis dan penilaian otomatis. */
const EduQuiz = {
  start(quizId, user, area, onViewResults) {
    const quiz = EduStore.quiz(quizId);
    if (!quiz || !quiz.questions.length) return;
    const esc = EduUtils.esc;

    area.innerHTML = `
      <form id="answerForm" class="panel">
        <h3>${esc(quiz.title)}</h3>
        <p class="muted">Jawab semua ${quiz.questions.length} pertanyaan berikut.</p>
        ${quiz.questions.map((item, i) => `
          <div class="quiz-question">
            <p>${i + 1}. ${esc(item.question)}</p>
            ${item.options.map((opt, j) => `
              <label class="quiz-option">
                <input type="radio" name="q${i}" value="${j}" required>${String.fromCharCode(65 + j)}. ${esc(opt)}
              </label>`).join("")}
          </div>`).join("")}
        <button class="primary" type="submit">Kumpulkan jawaban</button>
      </form>`;
    area.scrollIntoView({ behavior: "smooth", block: "start" });

    EduUtils.$("answerForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      const correct = quiz.questions.filter((item, i) => Number(form.get("q" + i)) === item.answer).length;
      const score = Math.round((correct / quiz.questions.length) * 100);

      EduStore.data.results.push({
        quizId: quiz.id,
        courseId: quiz.courseId,
        quiz: quiz.title,
        studentId: user.username,
        student: user.name,
        correct,
        total: quiz.questions.length,
        score,
        date: EduUtils.today(),
      });
      EduStore.save();

      area.innerHTML = `
        <div class="panel">
          <h3>Kuis selesai!</h3>
          <p>Jawaban benar: <b>${correct} dari ${quiz.questions.length}</b></p>
          <p>Nilai kamu: <strong>${score}/100</strong></p>
          <p class="muted">Hasil tersimpan di menu Nilai.</p>
          <button class="secondary" id="goResults">Lihat nilai</button>
        </div>`;
      EduUtils.$("goResults").addEventListener("click", onViewResults);
    });
  },
};
