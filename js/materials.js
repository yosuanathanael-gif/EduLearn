/* Pengelolaan materi: validasi, tambah, ubah, dan hapus. */
const EduMaterials = {
  nextId() {
    return Math.max(0, ...EduStore.data.materials.map((m) => m.id)) + 1;
  },

  MAX_VIDEOS: 5,

  // Mengambil ID video (11 karakter) dari tautan YouTube, atau null jika bukan tautan YouTube yang valid.
  youtubeId(text) {
    let url;
    try {
      url = new URL(text.trim());
    } catch (error) {
      return null;
    }
    if (!["https:", "http:"].includes(url.protocol)) return null;
    const host = url.hostname.replace(/^www\.|^m\./, "");
    let id = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (["embed", "shorts", "live"].includes(parts[0])) id = parts[1];
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? id : null;
  },

  // Tautan tampilan di formulir untuk ID video yang tersimpan.
  videoUrl(id) {
    return `https://www.youtube.com/watch?v=${id}`;
  },

  // Mengubah isian formulir menjadi data materi, atau mengembalikan teks error.
  parse({ courseId, title, summary, headings, bodies, points, videoUrls = "" }) {
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

    // Tautan video bersifat opsional: satu tautan YouTube per baris.
    const lines = videoUrls.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > this.MAX_VIDEOS) return { error: `Maksimal ${this.MAX_VIDEOS} tautan video per materi.` };
    const videoIds = [];
    for (const [i, line] of lines.entries()) {
      const id = this.youtubeId(line);
      if (!id) return { error: `Tautan video baris ${i + 1} bukan tautan YouTube yang valid.` };
      if (!videoIds.includes(id)) videoIds.push(id);
    }

    return { data: { courseId, title: title.trim(), summary: summary.trim(), sections, points: pointList, videoIds } };
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
