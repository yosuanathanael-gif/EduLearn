// Versi data baru agar materi lama yang hanya berupa contoh tidak tercampur.
const KEY = "edulearn_demo_v2";
const starter = {
  "courses": [
    {
      "id": 1,
      "name": "Pengantar Teknologi Informasi",
      "code": "TI101",
      "teacher": "Dosen EduLearn",
      "description": "Mengenal konsep dasar teknologi informasi, perangkat komputer, data, dan jaringan."
    },
    {
      "id": 2,
      "name": "Manajemen Proyek TI",
      "code": "TI202",
      "teacher": "Dosen EduLearn",
      "description": "Mempelajari perencanaan, pelaksanaan, pengendalian, dan penutupan proyek teknologi informasi."
    },
    {
      "id": 3,
      "name": "Pemrograman Web",
      "code": "TI303",
      "teacher": "Dosen EduLearn",
      "description": "Mempelajari dasar pembuatan halaman web menggunakan HTML, CSS, dan JavaScript."
    }
  ],
  "materials": [
    {
      "id": 101,
      "course": "Pengantar Teknologi Informasi",
      "title": "Konsep Dasar Teknologi Informasi",
      "summary": "Pengertian teknologi informasi dan perannya dalam kehidupan sehari-hari.",
      "sections": [
        [
          "Pengertian Teknologi Informasi",
          "Teknologi informasi adalah penggunaan teknologi untuk mengumpulkan, mengolah, menyimpan, dan menyampaikan informasi. Teknologi ini menggabungkan perangkat keras, perangkat lunak, data, dan jaringan komunikasi."
        ],
        [
          "Komponen Utama",
          "Komponen utama teknologi informasi meliputi perangkat keras (hardware), perangkat lunak (software), pengguna (brainware), data, serta prosedur dan jaringan komunikasi."
        ],
        [
          "Manfaat Teknologi Informasi",
          "Teknologi informasi membantu mempercepat komunikasi, mempermudah pengolahan data, mendukung kegiatan pendidikan, meningkatkan efisiensi pekerjaan, dan menyediakan akses informasi."
        ]
      ],
      "points": [
        "Teknologi informasi mengolah data menjadi informasi yang berguna.",
        "Hardware adalah bagian fisik komputer.",
        "Software berisi instruksi untuk menjalankan tugas."
      ]
    },
    {
      "id": 102,
      "course": "Pengantar Teknologi Informasi",
      "title": "Perangkat Keras dan Perangkat Lunak",
      "summary": "Mengenal perangkat komputer dan fungsi sistem operasi serta aplikasi.",
      "sections": [
        [
          "Perangkat Keras",
          "Perangkat keras adalah bagian komputer yang dapat dilihat dan disentuh. Contohnya keyboard, mouse, monitor, prosesor, RAM, dan media penyimpanan."
        ],
        [
          "Perangkat Lunak",
          "Perangkat lunak adalah kumpulan program yang mengatur kerja komputer. Perangkat lunak sistem contohnya sistem operasi, sedangkan perangkat lunak aplikasi contohnya pengolah kata dan browser."
        ],
        [
          "Hubungan Hardware dan Software",
          "Hardware dan software saling membutuhkan. Hardware menjalankan instruksi dari software, sedangkan software memerlukan hardware agar dapat digunakan."
        ]
      ],
      "points": [
        "CPU memproses instruksi.",
        "RAM menyimpan data sementara saat program berjalan.",
        "Sistem operasi mengelola sumber daya komputer."
      ]
    },
    {
      "id": 103,
      "course": "Pengantar Teknologi Informasi",
      "title": "Data, Informasi, dan Jaringan Komputer",
      "summary": "Memahami perbedaan data dan informasi serta dasar jaringan komputer.",
      "sections": [
        [
          "Data dan Informasi",
          "Data merupakan fakta mentah yang belum diolah, sedangkan informasi adalah data yang telah diproses sehingga memiliki makna dan dapat digunakan untuk mengambil keputusan."
        ],
        [
          "Jaringan Komputer",
          "Jaringan komputer adalah hubungan antara dua atau lebih perangkat untuk bertukar data dan berbagi sumber daya."
        ],
        [
          "Jenis Jaringan",
          "LAN mencakup area lokal seperti ruang atau gedung. MAN mencakup wilayah kota. WAN mencakup wilayah geografis yang luas, contohnya koneksi antarkota atau internet."
        ]
      ],
      "points": [
        "Data diolah menjadi informasi.",
        "Jaringan memungkinkan perangkat saling berkomunikasi.",
        "Internet merupakan jaringan global."
      ]
    },
    {
      "id": 201,
      "course": "Manajemen Proyek TI",
      "title": "Dasar-Dasar Manajemen Proyek TI",
      "summary": "Pengertian proyek, karakteristik, dan tujuan manajemen proyek TI.",
      "sections": [
        [
          "Pengertian Proyek",
          "Proyek adalah kegiatan sementara yang dilakukan untuk menghasilkan produk, layanan, atau hasil yang unik. Proyek memiliki awal dan akhir yang jelas."
        ],
        [
          "Manajemen Proyek TI",
          "Manajemen proyek TI adalah penerapan pengetahuan, keterampilan, alat, dan teknik untuk mengelola kegiatan proyek teknologi informasi agar tujuan tercapai."
        ],
        [
          "Kendala Proyek",
          "Proyek umumnya memperhatikan ruang lingkup, waktu, biaya, dan kualitas. Perubahan pada salah satu aspek dapat memengaruhi aspek lainnya."
        ]
      ],
      "points": [
        "Proyek bersifat sementara dan memiliki hasil tertentu.",
        "Manajemen proyek membantu pekerjaan lebih terarah.",
        "Ruang lingkup, waktu, biaya, dan kualitas perlu dikendalikan."
      ]
    },
    {
      "id": 202,
      "course": "Manajemen Proyek TI",
      "title": "Perencanaan dan Penjadwalan Proyek",
      "summary": "Menyusun ruang lingkup, WBS, jadwal, dan pembagian pekerjaan.",
      "sections": [
        [
          "Ruang Lingkup",
          "Ruang lingkup menjelaskan pekerjaan yang termasuk dan tidak termasuk dalam proyek. Ruang lingkup yang jelas membantu mencegah pekerjaan melebar tanpa kendali."
        ],
        [
          "Work Breakdown Structure",
          "WBS adalah pembagian pekerjaan proyek menjadi bagian yang lebih kecil dan mudah dikelola. WBS disusun secara bertingkat dari proyek utama hingga paket pekerjaan."
        ],
        [
          "Penjadwalan",
          "Jadwal menunjukkan urutan kegiatan, durasi, dan hubungan antarpekerjaan. Gantt Chart dapat digunakan untuk menggambarkan jadwal proyek secara visual."
        ]
      ],
      "points": [
        "WBS membagi pekerjaan menjadi bagian yang terstruktur.",
        "Gantt Chart menampilkan jadwal kegiatan.",
        "Ketergantungan pekerjaan perlu diperhatikan saat menyusun jadwal."
      ]
    },
    {
      "id": 203,
      "course": "Manajemen Proyek TI",
      "title": "Risiko, Pengujian, dan Penutupan Proyek",
      "summary": "Mengidentifikasi risiko, menjaga kualitas, dan menyelesaikan proyek.",
      "sections": [
        [
          "Manajemen Risiko",
          "Risiko adalah peristiwa yang belum pasti dan dapat memengaruhi tujuan proyek. Risiko perlu diidentifikasi, dianalisis, dan direncanakan responsnya."
        ],
        [
          "Pengujian Perangkat Lunak",
          "Pengujian dilakukan untuk memeriksa apakah perangkat lunak berjalan sesuai kebutuhan. Pengujian membantu menemukan kesalahan sebelum produk digunakan."
        ],
        [
          "Penutupan Proyek",
          "Penutupan dilakukan setelah pekerjaan dan hasil proyek diperiksa. Kegiatan ini dapat mencakup dokumentasi akhir, serah terima, dan pencatatan pembelajaran proyek."
        ]
      ],
      "points": [
        "Risiko dapat berdampak positif atau negatif.",
        "Pengujian memeriksa kesesuaian fungsi dengan kebutuhan.",
        "Lessons learned mencatat pengalaman untuk proyek berikutnya."
      ]
    },
    {
      "id": 301,
      "course": "Pemrograman Web",
      "title": "Pengenalan HTML",
      "summary": "Memahami struktur dasar dokumen HTML dan elemen pembentuk halaman web.",
      "sections": [
        [
          "Pengertian HTML",
          "HTML (HyperText Markup Language) adalah bahasa markup untuk menyusun struktur dan konten halaman web, seperti judul, paragraf, gambar, tautan, dan formulir."
        ],
        [
          "Struktur Dokumen",
          "Dokumen HTML umumnya memiliki deklarasi DOCTYPE, elemen html, head, dan body. Bagian head berisi informasi dokumen, sedangkan body berisi konten yang terlihat."
        ],
        [
          "Elemen dan Atribut",
          "Elemen HTML ditulis menggunakan tag. Atribut memberikan informasi tambahan pada elemen, misalnya atribut href pada tautan dan src pada gambar."
        ]
      ],
      "points": [
        "HTML menyusun struktur halaman web.",
        "Elemen p digunakan untuk paragraf.",
        "Elemen a digunakan untuk membuat tautan."
      ]
    },
    {
      "id": 302,
      "course": "Pemrograman Web",
      "title": "Dasar-Dasar CSS",
      "summary": "Mengatur warna, ukuran, jarak, dan tata letak halaman web.",
      "sections": [
        [
          "Pengertian CSS",
          "CSS (Cascading Style Sheets) digunakan untuk mengatur tampilan elemen HTML, termasuk warna, tipografi, jarak, garis tepi, dan tata letak."
        ],
        [
          "Aturan CSS",
          "Aturan CSS terdiri dari selector, property, dan value. Selector memilih elemen yang akan diberi gaya, property menentukan aspek tampilan, dan value menentukan nilainya."
        ],
        [
          "Layout Responsif",
          "Desain responsif membuat halaman menyesuaikan ukuran layar. Media query dapat digunakan untuk menerapkan aturan berbeda pada ukuran layar tertentu."
        ]
      ],
      "points": [
        "CSS memisahkan struktur dan tampilan.",
        "Selector memilih elemen HTML.",
        "Media query membantu membuat desain responsif."
      ]
    },
    {
      "id": 303,
      "course": "Pemrograman Web",
      "title": "Dasar JavaScript dan Interaksi",
      "summary": "Menggunakan JavaScript untuk menambahkan perilaku interaktif pada halaman web.",
      "sections": [
        [
          "Pengertian JavaScript",
          "JavaScript adalah bahasa pemrograman yang dapat membuat halaman web menjadi interaktif, misalnya merespons klik, memvalidasi formulir, dan memperbarui konten."
        ],
        [
          "Variabel dan Fungsi",
          "Variabel digunakan untuk menyimpan nilai. Fungsi merupakan blok kode yang dapat dipanggil untuk menjalankan tugas tertentu."
        ],
        [
          "Event",
          "Event adalah kejadian yang dapat ditangani oleh JavaScript, misalnya klik tombol, pengiriman formulir, atau perubahan nilai input."
        ]
      ],
      "points": [
        "JavaScript menambahkan interaksi pada halaman web.",
        "Fungsi membantu mengelompokkan instruksi.",
        "Event listener merespons tindakan pengguna."
      ]
    }
  ],
  "quizzes": [],
  "results": []
};
const quizBank = {
  "Pengantar Teknologi Informasi": [
    [
      "Apa tujuan utama teknologi informasi?",
      [
        "Mengolah dan menyampaikan informasi",
        "Menghias perangkat komputer",
        "Mengganti seluruh pekerjaan manusia",
        "Membatasi komunikasi"
      ],
      0
    ],
    [
      "Manakah yang termasuk perangkat keras?",
      [
        "Sistem operasi",
        "Keyboard",
        "Browser",
        "Aplikasi pengolah kata"
      ],
      1
    ],
    [
      "Perangkat lunak disebut juga ...",
      [
        "Hardware",
        "Brainware",
        "Software",
        "Firmware saja"
      ],
      2
    ],
    [
      "Komponen komputer yang memproses instruksi adalah ...",
      [
        "Monitor",
        "CPU",
        "Mouse",
        "Speaker"
      ],
      1
    ],
    [
      "RAM umumnya digunakan untuk ...",
      [
        "Penyimpanan sementara saat program berjalan",
        "Mencetak dokumen",
        "Menampilkan gambar",
        "Menghubungkan kabel jaringan"
      ],
      0
    ],
    [
      "Data yang telah diolah dan memiliki makna disebut ...",
      [
        "Folder",
        "Informasi",
        "Perangkat",
        "Program"
      ],
      1
    ],
    [
      "Jaringan komputer dalam area lokal seperti gedung disebut ...",
      [
        "WAN",
        "MAN",
        "LAN",
        "PAN global"
      ],
      2
    ],
    [
      "Contoh perangkat input adalah ...",
      [
        "Monitor",
        "Printer",
        "Keyboard",
        "Speaker"
      ],
      2
    ],
    [
      "Program yang mengelola sumber daya komputer disebut ...",
      [
        "Sistem operasi",
        "Pengolah gambar",
        "Pemutar musik",
        "Mesin pencari"
      ],
      0
    ],
    [
      "Internet dapat dijelaskan sebagai ...",
      [
        "Satu komputer pribadi",
        "Jaringan global yang saling terhubung",
        "Jenis perangkat input",
        "Sistem operasi"
      ],
      1
    ]
  ],
  "Manajemen Proyek TI": [
    [
      "Proyek memiliki karakteristik ...",
      [
        "Berjalan tanpa akhir",
        "Bersifat sementara dan menghasilkan keluaran unik",
        "Tidak memiliki tujuan",
        "Selalu dikerjakan satu orang"
      ],
      1
    ],
    [
      "Manajemen proyek TI bertujuan untuk ...",
      [
        "Mengelola pekerjaan agar tujuan proyek tercapai",
        "Menghapus seluruh dokumentasi",
        "Menghindari perencanaan",
        "Menambah fitur tanpa batas"
      ],
      0
    ],
    [
      "Dokumen yang menjelaskan ruang lingkup proyek disebut ...",
      [
        "Scope Statement",
        "User Manual",
        "Source Code",
        "Invoice"
      ],
      0
    ],
    [
      "WBS merupakan singkatan dari ...",
      [
        "Web Based System",
        "Work Breakdown Structure",
        "Work Browser Service",
        "Wide Business Software"
      ],
      1
    ],
    [
      "Fungsi utama WBS adalah ...",
      [
        "Membagi pekerjaan menjadi bagian lebih kecil",
        "Menghitung nilai kuis",
        "Mendesain logo",
        "Menghapus risiko"
      ],
      0
    ],
    [
      "Gantt Chart digunakan untuk menggambarkan ...",
      [
        "Struktur organisasi saja",
        "Jadwal kegiatan proyek",
        "Kode program",
        "Hasil kuis"
      ],
      1
    ],
    [
      "Risiko proyek adalah ...",
      [
        "Peristiwa tidak pasti yang dapat memengaruhi proyek",
        "Pekerjaan yang pasti selesai",
        "Daftar anggota kelompok",
        "Fitur aplikasi"
      ],
      0
    ],
    [
      "Pengujian perangkat lunak dilakukan untuk ...",
      [
        "Memeriksa kesesuaian sistem dengan kebutuhan",
        "Mengganti seluruh desain",
        "Menambah biaya",
        "Menghapus database"
      ],
      0
    ],
    [
      "Lessons learned berisi ...",
      [
        "Catatan pembelajaran dari pelaksanaan proyek",
        "Daftar password pengguna",
        "Kode sumber saja",
        "Jadwal libur"
      ],
      0
    ],
    [
      "Salah satu aspek yang perlu dikendalikan dalam proyek adalah ...",
      [
        "Waktu",
        "Warna meja",
        "Merek sepatu",
        "Cuaca harian"
      ],
      0
    ]
  ],
  "Pemrograman Web": [
    [
      "HTML digunakan untuk ...",
      [
        "Mengatur struktur konten halaman web",
        "Mengelola jaringan listrik",
        "Mengedit suara",
        "Menghapus browser"
      ],
      0
    ],
    [
      "CSS berfungsi untuk ...",
      [
        "Mengatur tampilan halaman web",
        "Menyimpan database server",
        "Mengirim email otomatis",
        "Mengganti sistem operasi"
      ],
      0
    ],
    [
      "JavaScript digunakan untuk ...",
      [
        "Menambahkan interaksi pada halaman web",
        "Membuat kabel jaringan",
        "Mengatur perangkat keras",
        "Mengganti HTML sepenuhnya"
      ],
      0
    ],
    [
      "Tag HTML untuk paragraf adalah ...",
      [
        "<h1>",
        "<p>",
        "<img>",
        "<br>"
      ],
      1
    ],
    [
      "Atribut href biasanya digunakan pada elemen ...",
      [
        "a",
        "p",
        "div",
        "table"
      ],
      0
    ],
    [
      "Bagian HTML yang berisi konten yang terlihat adalah ...",
      [
        "head",
        "meta",
        "body",
        "title saja"
      ],
      2
    ],
    [
      "Dalam aturan CSS, selector berfungsi untuk ...",
      [
        "Memilih elemen yang akan diberi gaya",
        "Menjalankan server",
        "Menyimpan gambar",
        "Mengirim formulir"
      ],
      0
    ],
    [
      "Media query pada CSS berguna untuk ...",
      [
        "Membuat tampilan menyesuaikan kondisi layar",
        "Menghapus elemen HTML",
        "Mengubah JavaScript menjadi CSS",
        "Membuat database"
      ],
      0
    ],
    [
      "Variabel digunakan untuk ...",
      [
        "Menyimpan nilai",
        "Mengatur warna monitor saja",
        "Mencetak halaman",
        "Membuat folder otomatis"
      ],
      0
    ],
    [
      "Event click terjadi ketika pengguna ...",
      [
        "Mengklik elemen",
        "Menutup komputer",
        "Mengganti kabel",
        "Mencetak dokumen"
      ],
      0
    ]
  ]
};

let db = JSON.parse(localStorage.getItem(KEY) || "null") || starter;
if (!db.quizzes.length) {
  let id = 1;
  for (const [course, questions] of Object.entries(quizBank)) {
    db.quizzes.push({id:id++, course, title:"Kuis " + course, questions});
  }
  localStorage.setItem(KEY, JSON.stringify(db));
}
let currentUser = null;
let page = "dashboard";
const $ = id => document.getElementById(id);
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const roleName = r => ({admin:"Admin",dosen:"Dosen",mahasiswa:"Mahasiswa"}[r] || r);

$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  currentUser = {name:$("username").value.trim(), role:$("role").value};
  $("loginView").classList.add("hidden"); $("appView").classList.remove("hidden");
  $("sideName").textContent=currentUser.name; $("sideRole").textContent=roleName(currentUser.role);
  $("sideAvatar").textContent=currentUser.name.charAt(0).toUpperCase();
  $("topName").textContent=currentUser.name; $("topAvatar").textContent=currentUser.name.charAt(0).toUpperCase();
  render();
});
$("logoutBtn").addEventListener("click",()=>{currentUser=null;$("appView").classList.add("hidden");$("loginView").classList.remove("hidden");$("username").value="";});
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>{page=b.dataset.page;render();}));
function setActive(){document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.page===page));}
function render(){
  setActive();
  const titles={dashboard:"Dashboard",courses:"Mata Kuliah",materials:"Materi Pembelajaran",quizzes:"Kuis",results:"Hasil Nilai"};
  $("pageTitle").textContent=titles[page];
  const root=$("pageContent");
  if(page==="dashboard") root.innerHTML=dashboard();
  if(page==="courses") root.innerHTML=coursesPage();
  if(page==="materials") root.innerHTML=materialsPage();
  if(page==="quizzes") root.innerHTML=quizzesPage();
  if(page==="results") root.innerHTML=resultsPage();
  bindPageActions();
}
function dashboard(){
 return `<div class="welcome"><h2>Selamat datang, ${esc(currentUser.name)}!</h2><p>Selamat belajar bersama EduLearn. Pilih mata kuliah dan pelajari materinya.</p></div>
 <div class="stats"><div class="stat"><span>Total Mata Kuliah</span><strong>${db.courses.length}</strong></div><div class="stat"><span>Total Materi</span><strong>${db.materials.length}</strong></div><div class="stat"><span>Total Kuis</span><strong>${db.quizzes.length}</strong></div></div>
 <div class="section-head"><h3>Mata Kuliah</h3><button class="secondary" data-go="courses">Lihat semua</button></div>${courseCards()}`;
}
function courseCards(){return `<div class="course-grid">${db.courses.map(c=>`<div class="course-card"><span class="tag">${esc(c.code)}</span><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><button data-course-material="${c.id}">Lihat materi</button></div>`).join("")}</div>`}
function coursesPage(){
 return `<div class="section-head"><h3>Daftar Mata Kuliah</h3></div><div class="course-grid">${db.courses.map(c=>`<div class="course-card"><span class="tag">${esc(c.code)}</span><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><p>Pengajar: ${esc(c.teacher)}</p><button data-course-material="${c.id}">Buka materi</button></div>`).join("")}</div>`;
}
function materialsPage(){
 const selected = new URLSearchParams(location.search).get("course");
 const list = selected ? db.materials.filter(m=>m.course===selected) : db.materials;
 return `<div class="section-head"><h3>${selected?esc(selected):"Semua Materi"}</h3>${selected?`<button class="secondary" id="allMaterials">Semua mata kuliah</button>`:""}</div>
 <div class="material-grid">${list.map(m=>`<article class="material-card"><span class="tag">${esc(m.course)}</span><h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p><button class="secondary" data-read="${m.id}">Baca materi</button></article>`).join("")}</div>
 ${list.length?"":'<p class="empty">Belum ada materi untuk mata kuliah ini.</p>'}`;
}
function materialDetail(id){
 const m=db.materials.find(x=>x.id===id); if(!m)return;
 $("pageContent").innerHTML=`<button class="back-button" id="backMaterials">← Kembali ke daftar materi</button>
 <article class="material-detail"><span class="tag">${esc(m.course)}</span><h2>${esc(m.title)}</h2><p>${esc(m.summary)}</p>
 ${m.sections.map((s,i)=>`<h3>${i+1}. ${esc(s[0])}</h3><p>${esc(s[1])}</p>`).join("")}
 <h3>Ringkasan Materi</h3><ul>${m.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></article>`;
 $("backMaterials").onclick=()=>render();
}
function quizzesPage(){
 return `<div class="section-head"><h3>Kuis per Mata Kuliah</h3></div><div class="quiz-grid">${db.quizzes.map(q=>`<article class="quiz-card"><span class="tag">${esc(q.course)}</span><h3>${esc(q.title)}</h3><p>${q.questions.length} soal pilihan ganda · Nilai dihitung otomatis</p>${currentUser.role==="mahasiswa"?`<button class="primary" data-start-quiz="${q.id}">Mulai kuis</button>`:'<span class="muted">Mode pengelolaan kuis (demo)</span>'}</article>`).join("")}</div><div id="quizArea"></div>`;
}
function startQuiz(id){
 const q=db.quizzes.find(x=>x.id===id); const area=$("quizArea");
 area.innerHTML=`<form id="answerForm" class="panel"><h3>${esc(q.title)}</h3><p class="muted">Jawab semua ${q.questions.length} pertanyaan berikut.</p>
 ${q.questions.map((item,i)=>`<div class="quiz-question"><p>${i+1}. ${esc(item[0])}</p>${item[1].map((opt,j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${j}" required>${String.fromCharCode(65+j)}. ${esc(opt)}</label>`).join("")}</div>`).join("")}
 <button class="primary" type="submit">Kumpulkan jawaban</button></form>`;
 $("answerForm").onsubmit=e=>{
   e.preventDefault();const form=new FormData(e.target);let correct=0;
   q.questions.forEach((item,i)=>{if(Number(form.get("q"+i))===item[2])correct++;});
   const score=Math.round(correct/q.questions.length*100);
   db.results.push({quiz:q.title,course:q.course,student:currentUser.name,correct,total:q.questions.length,score,date:new Date().toLocaleDateString("id-ID")});
   save();
   area.innerHTML=`<div class="panel"><h3>Kuis selesai!</h3><p>Jawaban benar: <b>${correct} dari ${q.questions.length}</b></p><p>Nilai kamu: <strong>${score}/100</strong></p><p class="muted">Hasil tersimpan di menu Nilai.</p><button class="secondary" id="goResults">Lihat nilai</button></div>`;
   $("goResults").onclick=()=>{page="results";render();};
 };
}
function resultsPage(){
 const mine=db.results.filter(r=>currentUser.role!=="mahasiswa"||r.student===currentUser.name);
 return `<div class="panel"><h3>Riwayat Nilai</h3>${mine.length?mine.slice().reverse().map(r=>`<div class="list-item"><div><b>${esc(r.quiz)}</b><br><small>${esc(r.student)} · ${esc(r.date)} · ${r.correct}/${r.total} benar</small></div><strong>${r.score}/100</strong></div>`).join(""):`<p class="empty">Belum ada hasil kuis. Silakan kerjakan kuis terlebih dahulu.</p>`}</div>`;
}
function bindPageActions(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{page=b.dataset.go;render();});
 document.querySelectorAll("[data-course-material]").forEach(b=>b.onclick=()=>{const c=db.courses.find(x=>x.id===Number(b.dataset.courseMaterial));page="materials";render();const list=db.materials.filter(m=>m.course===c.name);$("pageContent").innerHTML=`<div class="section-head"><h3>${esc(c.name)}</h3><button class="secondary" id="allMaterials">Semua mata kuliah</button></div><div class="material-grid">${list.map(m=>`<article class="material-card"><span class="tag">${esc(m.course)}</span><h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p><button class="secondary" data-read="${m.id}">Baca materi</button></article>`).join("")}</div>`;bindReadButtons();$("allMaterials").onclick=()=>render();});
  bindReadButtons();
  const all=$("allMaterials");if(all)all.onclick=()=>render();
  document.querySelectorAll("[data-start-quiz]").forEach(b=>b.onclick=()=>startQuiz(Number(b.dataset.startQuiz)));
}
function bindReadButtons(){document.querySelectorAll("[data-read]").forEach(b=>b.onclick=()=>materialDetail(Number(b.dataset.read)));}
