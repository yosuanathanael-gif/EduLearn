/* Pengelolaan materi: validasi, tambah, ubah, dan hapus. */
const EduMaterials = {
  nextId() {
    return Math.max(0, ...EduStore.data.materials.map((m) => m.id)) + 1;
  },

  // Mengubah isian formulir menjadi data materi, atau mengembalikan teks error.
  parse({ courseId, title, summary, headings, bodies, points }) {
    if (!EduStore.course(courseId)) return { error: "Pilih mata kuliah terlebih dahulu." };
    if (title.trim().length < 3) return { error: "Judul materi minimal 3 karakter." };
    if (!summary.trim()) return { error: "Ringkasan singkat wajib diisi." };

    const sections = [];
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i].trim();
      const body = (bodies[i] || "").trim();
      if (!heading && !body) continue; // bagian kosong diabaikan
      if (!heading || !body) return { error: `Bagian ${i + 1}: judul dan isi harus diisi keduanya.` };
      sections.push({ heading, body });
    }
    if (!sections.length) return { error: "Tambahkan minimal satu bagian materi." };

    const pointList = points.split("\n").map((p) => p.trim()).filter(Boolean);
    if (!pointList.length) return { error: "Tambahkan minimal satu poin ringkasan." };

    return { data: { courseId, title: title.trim(), summary: summary.trim(), sections, points: pointList } };
  },

  // id null = materi baru, selain itu = ubah materi yang ada.
  save(id, input) {
    const parsed = this.parse(input);
    if (parsed.error) return { ok: false, error: parsed.error };
    if (id === null) {
      EduStore.data.materials.push({ id: this.nextId(), ...parsed.data });
    } else {
      const material = EduStore.material(id);
      if (!material) return { ok: false, error: "Materi tidak ditemukan." };
      Object.assign(material, parsed.data);
    }
    EduStore.save();
    return { ok: true };
  },

  remove(id) {
    EduStore.data.materials = EduStore.data.materials.filter((m) => m.id !== id);
    EduStore.save();
  },
};
