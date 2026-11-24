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
              ? (q.questions.length
                ? `<button class="primary" data-action="start-quiz" data-id="${q.id}">Mulai kuis</button>`
                : '<span class="muted">Belum ada soal</span>')
              : '<span class="muted">Kelola soal lewat menu Kelola Kuis</span>'}
          </article>`).join("")}
      </div>
      <div id="quizArea"></div>`;
  },

  results(user) {
    const mine = EduStore.data.results.filter((r) => user.role !== "mahasiswa" || r.studentId === user.username);
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

  users() {
    const rows = EduStore.data.users.map((u) => `
      <tr><td>${esc(u.name)}</td><td>${esc(u.username)}</td><td>${esc(EduUtils.roleName(u.role))}</td></tr>`).join("");
    return `
      <div class="panel">
        <h3>Tambah akun</h3>
        <form id="userForm" class="inline-form">
          <input name="name" placeholder="Nama lengkap" required>
          <input name="username" placeholder="Nama pengguna" required autocomplete="off">
          <input name="password" type="password" placeholder="Kata sandi (min. 6 karakter)" required autocomplete="new-password">
          <select name="role">
            <option value="dosen">Dosen</option>
            <option value="admin">Admin</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
          <button class="primary" type="submit">Simpan akun</button>
        </form>
        <p id="userFormMsg" class="form-error hidden" role="alert"></p>
      </div>
      <div class="panel">
        <h3>Daftar pengguna (${EduStore.data.users.length})</h3>
        <table class="user-table">
          <thead><tr><th>Nama</th><th>Nama pengguna</th><th>Peran</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  manage() {
    const rows = EduStore.data.materials.map((m) => `
      <div class="list-item">
        <div><b>${esc(m.title)}</b><br><small>${esc(EduStore.courseName(m.courseId))}</small></div>
        <div class="row-actions">
          <button class="secondary" data-action="edit-material" data-id="${m.id}">Ubah</button>
          <button class="danger" data-action="delete-material" data-id="${m.id}">Hapus</button>
        </div>
      </div>`).join("");
    return `
      <div class="section-head">
        <h3>Daftar materi (${EduStore.data.materials.length})</h3>
        <button class="primary" data-action="new-material">Tambah materi</button>
      </div>
      <p id="manageMsg" class="form-error hidden" role="alert"></p>
      <div class="panel">${rows || '<p class="empty">Belum ada materi. Klik Tambah materi untuk membuat yang pertama.</p>'}</div>`;
  },

  sectionFields(section) {
    return `
      <div class="section-fields">
        <input name="sectionHeading" placeholder="Judul bagian" value="${esc(section.heading)}">
        <textarea name="sectionBody" rows="3" placeholder="Isi bagian">${esc(section.body)}</textarea>
        <button type="button" class="link-button" data-action="remove-section">Hapus bagian ini</button>
      </div>`;
  },

  materialForm(material) {
    const sections = material ? material.sections : [{ heading: "", body: "" }];
    const options = EduStore.data.courses.map((c) =>
      `<option value="${c.id}" ${material && material.courseId === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
    return `
      <button class="back-button" data-action="cancel-form">← Kembali ke daftar materi</button>
      <form id="materialForm" class="panel form-stack">
        <h3>${material ? "Ubah materi" : "Tambah materi"}</h3>
        <label for="mfCourse">Mata kuliah</label>
        <select id="mfCourse" name="courseId">${options}</select>
        <label for="mfTitle">Judul materi</label>
        <input id="mfTitle" name="title" required value="${esc(material ? material.title : "")}">
        <label for="mfSummary">Ringkasan singkat</label>
        <textarea id="mfSummary" name="summary" rows="2" required>${esc(material ? material.summary : "")}</textarea>
        <label>Bagian materi</label>
        <div id="sectionList">${sections.map((s) => this.sectionFields(s)).join("")}</div>
        <button type="button" class="secondary" data-action="add-section">+ Tambah bagian</button>
        <label for="mfPoints">Poin ringkasan (satu poin per baris)</label>
        <textarea id="mfPoints" name="points" rows="4">${esc(material ? material.points.join("\n") : "")}</textarea>
        <p id="materialFormMsg" class="form-error hidden" role="alert"></p>
        <div class="row-actions">
          <button class="primary" type="submit">Simpan materi</button>
          <button class="secondary" type="button" data-action="cancel-form">Batal</button>
        </div>
      </form>`;
  },

  manageQuizzes() {
    const options = EduStore.data.courses.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
    const rows = EduStore.data.quizzes.map((q) => `
      <div class="list-item">
        <div><b>${esc(q.title)}</b><br><small>${esc(EduStore.courseName(q.courseId))} · ${q.questions.length} soal</small></div>
        <div class="row-actions">
          <button class="secondary" data-action="open-quiz-admin" data-id="${q.id}">Kelola soal</button>
          <button class="danger" data-action="delete-quiz" data-id="${q.id}">Hapus</button>
        </div>
      </div>`).join("");
    return `
      <p id="quizMsg" class="form-error hidden" role="alert"></p>
      <div class="panel">
        <h3>Tambah kuis</h3>
        <form id="quizForm" class="inline-form">
          <select name="courseId">${options}</select>
          <input name="title" placeholder="Judul kuis" required>
          <button class="primary" type="submit">Simpan kuis</button>
        </form>
      </div>
      <div class="panel">
        <h3>Daftar kuis (${EduStore.data.quizzes.length})</h3>
        ${rows || '<p class="empty">Belum ada kuis. Tambahkan kuis pertama di atas.</p>'}
      </div>`;
  },

  quizQuestions(quizId) {
    const quiz = EduStore.quiz(quizId);
    if (!quiz) return '<p class="empty">Kuis tidak ditemukan.</p>';
    const rows = quiz.questions.map((item, i) => `
      <div class="list-item">
        <div>
          <b>${i + 1}. ${esc(item.question)}</b><br>
          <small>Jawaban benar: ${String.fromCharCode(65 + item.answer)}. ${esc(item.options[item.answer])}</small>
        </div>
        <div class="row-actions">
          <button class="secondary" data-action="edit-question" data-id="${i}">Ubah</button>
          <button class="danger" data-action="delete-question" data-id="${i}">Hapus</button>
        </div>
      </div>`).join("");
    return `
      <button class="back-button" data-action="back-quizzes">← Kembali ke daftar kuis</button>
      <div class="section-head">
        <h3>${esc(quiz.title)} (${quiz.questions.length} soal)</h3>
        <button class="primary" data-action="new-question">Tambah soal</button>
      </div>
      <p id="quizMsg" class="form-error hidden" role="alert"></p>
      <div class="panel">${rows || '<p class="empty">Kuis ini belum punya soal. Klik Tambah soal.</p>'}</div>`;
  },

  questionForm(quizId, index) {
    const quiz = EduStore.quiz(quizId);
    const item = index === null ? { question: "", options: ["", "", "", ""], answer: -1 } : quiz.questions[index];
    const options = [0, 1, 2, 3].map((j) => `
      <div class="option-row">
        <input type="radio" name="answer" value="${j}" ${item.answer === j ? "checked" : ""} required aria-label="Jawaban benar ${String.fromCharCode(65 + j)}">
        <b>${String.fromCharCode(65 + j)}.</b>
        <input name="option" placeholder="Pilihan ${String.fromCharCode(65 + j)}" required value="${esc(item.options[j] || "")}">
      </div>`).join("");
    return `
      <button class="back-button" data-action="cancel-question">← Kembali ke daftar soal</button>
      <form id="questionForm" class="panel form-stack">
        <h3>${index === null ? "Tambah soal" : "Ubah soal"} · ${esc(quiz.title)}</h3>
        <label for="qfText">Pertanyaan</label>
        <textarea id="qfText" name="question" rows="3" required>${esc(item.question)}</textarea>
        <label>Pilihan jawaban (pilih tombol bulat di samping jawaban yang benar)</label>
        ${options}
        <p id="questionFormMsg" class="form-error hidden" role="alert"></p>
        <div class="row-actions">
          <button class="primary" type="submit">Simpan soal</button>
          <button class="secondary" type="button" data-action="cancel-question">Batal</button>
        </div>
      </form>`;
  },
};
