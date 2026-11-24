/* Tampilan halaman. Setiap fungsi mengembalikan teks HTML. */
const esc = EduUtils.esc;

const EduViews = {
  dashboard(user) {
    const d = EduStore.data;
    return `
      <div class="welcome">
        <h2>Selamat datang, ${esc(user.name)}!</h2>
        <p>Selamat belajar bersama EduLearn. Pilih mata kuliah dan pelajari materinya.</p>
      </div>
      <div class="stats">
        <div class="stat"><span>Total Mata Kuliah</span><strong>${d.courses.length}</strong></div>
        <div class="stat"><span>Total Materi</span><strong>${d.materials.length}</strong></div>
        <div class="stat"><span>Total Kuis</span><strong>${d.quizzes.length}</strong></div>
      </div>
      <div class="section-head">
        <h3>Mata Kuliah</h3>
        <button class="secondary" data-action="go" data-id="courses">Lihat semua</button>
      </div>
      <div class="course-grid">${d.courses.map((c) => this.courseCard(c, false)).join("")}</div>`;
  },

  courseCard(course, showTeacher) {
    return `
      <div class="course-card">
        <span class="tag">${esc(course.code)}</span>
        <h3>${esc(course.name)}</h3>
        <p>${esc(course.description)}</p>
        ${showTeacher ? `<p>Pengajar: ${esc(course.teacher)}</p>` : ""}
        <button data-action="open-course" data-id="${course.id}">${showTeacher ? "Buka materi" : "Lihat materi"}</button>
      </div>`;
  },

  courses() {
    return `
      <div class="section-head"><h3>Daftar Mata Kuliah</h3></div>
      <div class="course-grid">${EduStore.data.courses.map((c) => this.courseCard(c, true)).join("")}</div>`;
  },

  materials(courseId) {
    const list = EduStore.data.materials.filter((m) => !courseId || m.courseId === courseId);
    const title = courseId ? esc(EduStore.courseName(courseId)) : "Semua Materi";
    return `
      <div class="section-head">
        <h3>${title}</h3>
        ${courseId ? '<button class="secondary" data-action="all-materials">Tampilkan semua materi</button>' : ""}
      </div>
      <div class="material-grid">
        ${list.map((m) => `
          <article class="material-card">
            <span class="tag">${esc(EduStore.courseName(m.courseId))}</span>
            <h3>${esc(m.title)}</h3>
            <p>${esc(m.summary)}</p>
            <button class="secondary" data-action="read" data-id="${m.id}">Baca materi</button>
          </article>`).join("")}
      </div>
      ${list.length ? "" : '<p class="empty">Belum ada materi untuk mata kuliah ini.</p>'}`;
  },

  materialDetail(id) {
    const m = EduStore.material(id);
    if (!m) return '<p class="empty">Materi tidak ditemukan.</p>';
    return `
      <button class="back-button" data-action="back-materials">← Kembali ke daftar materi</button>
      <article class="material-detail">
        <span class="tag">${esc(EduStore.courseName(m.courseId))}</span>
        <h2>${esc(m.title)}</h2>
        <p>${esc(m.summary)}</p>
        ${m.sections.map((s, i) => `<h3>${i + 1}. ${esc(s.heading)}</h3><p>${esc(s.body)}</p>`).join("")}
        <h3>Ringkasan Materi</h3>
        <ul>${m.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </article>`;
  },

  quizzes(user) {
    const canTake = user.role === "mahasiswa";
    return `
      <div class="section-head"><h3>Kuis per Mata Kuliah</h3></div>
      <div class="quiz-grid">
        ${EduStore.data.quizzes.map((q) => `
          <article class="quiz-card">
            <span class="tag">${esc(EduStore.courseName(q.courseId))}</span>
            <h3>${esc(q.title)}</h3>
            <p>${q.questions.length} soal pilihan ganda · Nilai dihitung otomatis</p>
            ${canTake
              ? `<button class="primary" data-action="start-quiz" data-id="${q.id}">Mulai kuis</button>`
              : '<span class="muted">Mode pengelolaan kuis (demo)</span>'}
          </article>`).join("")}
      </div>
      <div id="quizArea"></div>`;
  },

  results(user) {
    const mine = EduStore.data.results.filter((r) => user.role !== "mahasiswa" || r.student === user.name);
    const items = mine.slice().reverse().map((r) => `
      <div class="list-item">
        <div><b>${esc(r.quiz)}</b><br><small>${esc(r.student)} · ${esc(r.date)} · ${r.correct}/${r.total} benar</small></div>
        <strong>${r.score}/100</strong>
      </div>`).join("");
    return `
      <div class="panel">
        <h3>Riwayat Nilai</h3>
        ${items || '<p class="empty">Belum ada hasil kuis. Silakan kerjakan kuis terlebih dahulu.</p>'}
      </div>`;
  },
};
