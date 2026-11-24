/* Fungsi bantu umum yang dipakai oleh modul lain. */
const EduUtils = {
  $(id) {
    return document.getElementById(id);
  },

  // Membersihkan teks agar aman ditampilkan sebagai HTML.
  esc(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  },

  roleName(role) {
    return { admin: "Admin", dosen: "Dosen", mahasiswa: "Mahasiswa" }[role] || role;
  },

  today() {
    return new Date().toLocaleDateString("id-ID");
  },
};
