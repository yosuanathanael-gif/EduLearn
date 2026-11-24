# EduLearn

Platform pembelajaran daring (LMS) berbasis web untuk Tugas Proyek Manajemen Proyek TI.
Masih berupa prototipe front-end: login memakai kata sandi (di-hash), tetapi data dan akun tersimpan di browser (localStorage), sehingga belum seaman aplikasi dengan server.

## Menjalankan

1. Buka folder ini di VS Code.
2. Klik **Go Live** (ekstensi Live Server), atau buka `index.html` langsung di browser.
3. Jika tampilan lama masih muncul, tekan Ctrl + F5.

## Akun demo

| Peran | Nama pengguna | Kata sandi |
|---|---|---|
| Admin | admin | admin123 |
| Dosen | dosen | dosen123 |
| Mahasiswa | mahasiswa | mahasiswa123 |

Mahasiswa baru dapat mendaftar sendiri lewat tombol Daftar (peran otomatis Mahasiswa). Akun Dosen dan Admin hanya dibuat oleh Admin di menu Pengguna.

## Struktur folder

```
EduLearn/
  index.html        Halaman utama (login dan kerangka aplikasi)
  css/style.css     Seluruh gaya tampilan
  data/             Data awal: courses.js, materials.js, quizzes.js, users.js
  js/
    utils.js        Fungsi bantu (pembersih teks, nama peran, tanggal)
    storage.js      Membaca dan menyimpan data di localStorage
    auth.js         Akun, hash kata sandi, dan sesi login
    materials.js    Tambah, ubah, hapus materi (Dosen dan Admin)
    quiz-admin.js   Tambah/hapus kuis, tambah/ubah/hapus soal (Dosen dan Admin)
    views.js        Tampilan tiap halaman
    quiz.js         Pengerjaan kuis dan penilaian otomatis
    app.js          Login, navigasi, dan penangan klik
```

## Catatan data

- Kunci localStorage: `edulearn_v3` (awalan `edulearn_` sesuai standar kode proyek).
- Materi dan kuis terhubung ke mata kuliah lewat `courseId`, bukan lewat nama.
- Kata sandi tidak disimpan sebagai teks asli, tetapi sebagai hash SHA-256 dengan salt acak per akun.
- Pemeriksaan peran dilakukan di browser, jadi ini belum menggantikan keamanan server (lihat rencana database).
- Data awal dibaca dari folder `data/` hanya saat localStorage masih kosong.
