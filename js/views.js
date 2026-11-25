/* Tampilan halaman. Setiap fungsi mengembalikan teks HTML. */
const esc = EduUtils.esc;

const EduViews = {
  progressBar(summary) {
    return `
      <div class="progress" role="progressbar" aria-valuenow="${summary.percent}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" style="width:${summary.percent}%"></div>
      </div>
      <small class="muted">${summary.done} dari ${summary.total} materi selesai (${summary.percent}%)</small>`;
  },

  dashboard(user) {
    const d = EduStore.data;
    const isStudent = user.role === "mahasiswa";
    const mine = d.results.filter((r) => r.studentId === user.username);
    const avg = (list) => (list.length ? Math.round(list.reduce((sum, r) => sum + r.score, 0) / list.length) : 0);
    let personal;
    if (isStudent) {
      const p = EduProgress.summary(user.username);
      personal = `
        <div class="section-head"><h3>Progres belajarmu</h3></div>
        <div class="stats four">
          <div class="stat"><span>Materi selesai</span><strong>${p.done}/${p.total}</strong></div>
          <div class="stat"><span>Progres</span><strong>${p.percent}%</strong></div>
          <div class="stat"><span>Kuis dikerjakan</span><strong>${mine.length}</strong></div>
          <div class="stat"><span>Rata-rata nilai</span><strong>${mine.length ? avg(mine) : "-"}</strong></div>
        </div>`;
    } else {
      const students = d.users.filter((u) => u.role === "mahasiswa").length;
      personal = `
        <div class="section-head"><h3>Aktivitas pembelajaran</h3></div>
        <div class="stats four">
          <div class="stat"><span>Mahasiswa terdaftar</span><strong>${students}</strong></div>
          <div class="stat"><span>Pengerjaan kuis</span><strong>${d.results.length}</strong></div>
          <div class="stat"><span>Rata-rata nilai</span><strong>${d.results.length ? avg(d.results) : "-"}</strong></div>
        </div>`;
    }
    return `
      <div class="welcome">
        <h2>Selamat datang, ${esc(user.name)}!</h2>
        <p>${isStudent
          ? "Selamat belajar bersama EduLearn. Pilih mata kuliah dan pelajari materinya."
          : "Kelola materi dan kuis, lalu pantau nilai mahasiswa lewat menu Nilai."}</p>
      </div>
      <div class="stats">
        <div class="stat"><span>Total Mata Kuliah</span><strong>${d.courses.length}</strong></div>
        <div class="stat"><span>Total Materi</span><strong>${d.materials.length}</strong></div>
        <div class="stat"><span>Total Kuis</span><strong>${d.quizzes.length}</strong></div>
      </div>
      ${personal}
      <div class="section-head">
        <h3>Mata Kuliah</h3>
        <button class="secondary" data-action="go" data-id="courses">Lihat semua</button>
      </div>
      <div class="course-grid">${d.courses.map((c) => this.courseCard(c, false, isStudent ? user : null)).join("")}</div>`;
  },

  // Jika user diberikan (mahasiswa), kartu menampilkan progres belajar mata kuliah itu.
  courseCard(course, showTeacher, user = null) {
    return `
      <div class="course-card">
        <span class="tag">${esc(course.code)}</span>
        <h3>${esc(course.name)}</h3>
        <p>${esc(course.description)}</p>
        ${showTeacher ? `<p>Pengajar: ${esc(course.teacher)}</p>` : ""}
        ${user ? this.progressBar(EduProgress.summary(user.username, course.id)) : ""}
        <button data-action="open-course" data-id="${course.id}">${showTeacher ? "Buka materi" : "Lihat materi"}</button>
      </div>`;
  },

  courses(user = null) {
    const student = user && user.role === "mahasiswa" ? user : null;
    return `
      <div class="section-head"><h3>Daftar Mata Kuliah</h3></div>
      <div class="course-grid">${EduStore.data.courses.map((c) => this.courseCard(c, true, student)).join("")}</div>`;
  },

  materialCards(list, user) {
    if (!list.length) return '<p class="empty">Tidak ada materi yang cocok.</p>';
    const student = user && user.role === "mahasiswa";
    return list.map((m) => `
      <article class="material-card">
        <span class="tag">${esc(EduStore.courseName(m.courseId))}</span>
        ${student && EduProgress.isDone(user.username, m.id) ? '<span class="badge-done">✓ Selesai</span>' : ""}
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.summary)}</p>
        <button class="secondary" data-action="read" data-id="${m.id}">Baca materi</button>
      </article>`).join("");
  },

  materials(courseId, query = "", user = null) {
    const list = EduSearch.materials(query, courseId);
    const courseOptions = ['<option value="">Semua mata kuliah</option>']
      .concat(EduStore.data.courses.map((c) =>
        `<option value="${c.id}" ${c.id === courseId ? "selected" : ""}>${esc(c.name)}</option>`)).join("");
    return `
      <div class="section-head">
        <h3>${courseId ? esc(EduStore.courseName(courseId)) : "Semua Materi"}</h3>
      </div>
      <div class="panel search-bar">
        <input id="materialSearch" type="search" placeholder="Cari materi (judul, isi, atau kata kunci)" value="${esc(query)}" aria-label="Cari materi">
        <select id="materialCourse" aria-label="Filter mata kuliah">${courseOptions}</select>
      </div>
      <p id="materialCount" class="muted" aria-live="polite">${list.length} materi ditemukan</p>
      <div id="materialGrid" class="material-grid">${this.materialCards(list, user)}</div>`;
  },

  materialDetail(id, user = null) {
    const m = EduStore.material(id);
    if (!m) return '<p class="empty">Materi tidak ditemukan.</p>';
    const student = user && user.role === "mahasiswa";
    const done = student && EduProgress.isDone(user.username, m.id);
    return `
      <button class="back-button" data-action="back-materials">← Kembali ke daftar materi</button>
      <article class="material-detail">
        <span class="tag">${esc(EduStore.courseName(m.courseId))}</span>
        <h2>${esc(m.title)}</h2>
        <p>${esc(m.summary)}</p>
        ${m.sections.map((s, i) => `<h3>${i + 1}. ${esc(s.heading)}</h3><p>${esc(s.body)}</p>`).join("")}
        <h3>Ringkasan Materi</h3>
        <ul>${m.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        ${student ? `<button class="${done ? "secondary" : "primary"}" data-action="toggle-done" data-id="${m.id}">${done ? "✓ Sudah selesai (klik untuk batalkan)" : "Tandai selesai dipelajari"}</button>` : ""}
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

  results(user, quizId = null) {
    if (user.role !== "mahasiswa") return this.recap(quizId);
    const mine = EduStore.data.results.filter((r) => r.studentId === user.username);
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
    const me = App.user ? App.user.username : "";
    const rows = EduStore.data.users.map((u) => `
      <tr>
        <td>${esc(u.name)}</td><td>${esc(u.username)}</td><td>${esc(EduUtils.roleName(u.role))}</td>
        <td class="row-actions">
          <button class="secondary" data-action="reset-user" data-id="${esc(u.username)}">Atur ulang sandi</button>
          ${u.username === me ? '<span class="muted">Akun Anda</span>' : `<button class="danger" data-action="delete-user" data-id="${esc(u.username)}">Hapus</button>`}
        </td>
      </tr>`).join("");
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
      <p id="userListMsg" class="form-error hidden" role="alert"></p>
      <div class="panel">
        <h3>Daftar pengguna (${EduStore.data.users.length})</h3>
        <div class="table-wrap"><table class="user-table">
          <thead><tr><th>Nama</th><th>Nama pengguna</th><th>Peran</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>`;
  },

  profile(user) {
    const results = EduStore.data.results.filter((r) => r.studentId === user.username);
    return `
      <div class="panel">
        <h3>Informasi akun</h3>
        <p><b>Nama:</b> ${esc(user.name)}<br><b>Nama pengguna:</b> ${esc(user.username)}<br><b>Peran:</b> ${esc(EduUtils.roleName(user.role))}
        ${user.role === "mahasiswa" ? `<br><b>Kuis dikerjakan:</b> ${results.length}` : ""}</p>
      </div>
      <form id="nameForm" class="panel form-stack">
        <h3>Ubah nama lengkap</h3>
        <label for="pfName">Nama lengkap</label>
        <input id="pfName" name="name" required value="${esc(user.name)}">
        <p id="nameFormMsg" class="form-error hidden" role="alert"></p>
        <div class="row-actions"><button class="primary" type="submit">Simpan nama</button></div>
      </form>
      <form id="passwordForm" class="panel form-stack">
        <h3>Ganti kata sandi</h3>
        <label for="pfOld">Kata sandi lama</label>
        <input id="pfOld" name="old" type="password" required autocomplete="current-password">
        <label for="pfNew">Kata sandi baru (min. 6 karakter)</label>
        <input id="pfNew" name="password" type="password" required autocomplete="new-password">
        <label for="pfConfirm">Ulangi kata sandi baru</label>
        <input id="pfConfirm" name="confirm" type="password" required autocomplete="new-password">
        <p id="passwordFormMsg" class="form-error hidden" role="alert"></p>
        <div class="row-actions"><button class="primary" type="submit">Ganti kata sandi</button></div>
      </form>`;
  },

  backup() {
    const d = EduStore.data;
    return `
      <p id="backupMsg" class="form-error hidden" role="alert"></p>
      <div class="panel">
        <h3>Cadangan data</h3>
        <p class="muted">Data EduLearn disimpan di browser ini. Unduh cadangan secara berkala agar data tidak hilang jika cache browser dibersihkan, atau untuk memindahkannya ke perangkat lain.</p>
        <p>Isi data saat ini: ${d.users.length} akun, ${d.courses.length} mata kuliah, ${d.materials.length} materi, ${d.quizzes.length} kuis, ${d.results.length} hasil kuis.</p>
        <button class="primary" data-action="backup-download">Unduh cadangan (JSON)</button>
        <p class="muted">Berkas berisi hash kata sandi, jadi simpan dengan aman.</p>
      </div>
      <div class="panel">
        <h3>Pulihkan dari cadangan</h3>
        <p class="muted">Memulihkan akan <b>mengganti seluruh data</b> saat ini. Berkas diperiksa dulu; jika tidak valid, data tidak diubah.</p>
        <input id="backupFile" type="file" accept="application/json,.json" aria-label="Berkas cadangan">
      </div>
      <div class="panel">
        <h3>Kembalikan ke data awal</h3>
        <p class="muted">Menghapus semua perubahan (materi, kuis, akun baru, dan hasil kuis) dan mengembalikan data contoh bawaan.</p>
        <button class="danger" data-action="backup-reset">Kembalikan ke data awal</button>
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

  recap(quizId) {
    const list = EduRecap.list(quizId);
    const s = EduRecap.stats(list);
    const fmt = (n) => n.toLocaleString("id-ID");
    const options = ['<option value="">Semua kuis</option>']
      .concat(EduStore.data.quizzes.map((q) =>
        `<option value="${q.id}" ${q.id === quizId ? "selected" : ""}>${esc(q.title)}</option>`)).join("");
    const rows = list.map((r) => `
      <tr>
        <td>${esc(r.student)}</td>
        <td>${esc(r.quiz)}</td>
        <td><b>${r.score}</b></td>
        <td>${r.correct}/${r.total}</td>
        <td>${esc(r.date)}</td>
      </tr>`).join("");
    return `
      <div class="section-head">
        <h3>Rekap nilai mahasiswa</h3>
        <button class="secondary" data-action="export-csv" ${list.length ? "" : "disabled"}>Ekspor ke CSV</button>
      </div>
      <div class="panel">
        <label for="recapFilter">Tampilkan kuis</label>
        <select id="recapFilter">${options}</select>
      </div>
      <div class="stats four">
        <div class="stat"><span>Jumlah pengerjaan</span><strong>${s.count}</strong></div>
        <div class="stat"><span>Rata-rata nilai</span><strong>${fmt(s.avg)}</strong></div>
        <div class="stat"><span>Nilai tertinggi</span><strong>${s.max}</strong></div>
        <div class="stat"><span>Nilai terendah</span><strong>${s.min}</strong></div>
      </div>
      <div class="panel">
        ${list.length
          ? `<div class="table-wrap"><table class="user-table">
              <thead><tr><th>Mahasiswa</th><th>Kuis</th><th>Nilai</th><th>Benar</th><th>Tanggal</th></tr></thead>
              <tbody>${rows}</tbody>
            </table></div>`
          : '<p class="empty">Belum ada hasil kuis untuk ditampilkan.</p>'}
      </div>`;
  },
};
