# EduLearn

Platform pembelajaran daring (LMS) berbasis web untuk Tugas Proyek Manajemen Proyek TI.
Masih berupa prototipe front-end: login belum memakai kata sandi dan data tersimpan di browser (localStorage).

## Menjalankan

1. Buka folder ini di VS Code.
2. Klik **Go Live** (ekstensi Live Server), atau buka `index.html` langsung di browser.
3. Jika tampilan lama masih muncul, tekan Ctrl + F5.

## Struktur folder

```
EduLearn/
  index.html        Halaman utama (login dan kerangka aplikasi)
  css/style.css     Seluruh gaya tampilan
  data/             Data awal: courses.js, materials.js, quizzes.js
  js/
    utils.js        Fungsi bantu (pembersih teks, nama peran, tanggal)
    storage.js      Membaca dan menyimpan data di localStorage
    views.js        Tampilan tiap halaman
    quiz.js         Pengerjaan kuis dan penilaian otomatis
    app.js          Login, navigasi, dan penangan klik
```

## Catatan data

- Kunci localStorage: `edulearn_v3` (awalan `edulearn_` sesuai standar kode proyek).
- Materi dan kuis terhubung ke mata kuliah lewat `courseId`, bukan lewat nama.
- Data awal dibaca dari folder `data/` hanya saat localStorage masih kosong.
