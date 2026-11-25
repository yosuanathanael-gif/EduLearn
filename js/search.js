/* Pencarian materi dan ringkasan akun. */
const EduSearch = {
  // Cocok jika kata kunci ada di judul, ringkasan, isi bagian, poin, atau nama mata kuliah.
  materials(query, courseId = null) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return EduStore.data.materials.filter((m) => {
      if (courseId && m.courseId !== courseId) return false;
      if (!words.length) return true;
      const text = [
        m.title, m.summary, EduStore.courseName(m.courseId),
        ...m.sections.map((s) => `${s.heading} ${s.body}`),
        ...m.points,
      ].join(" ").toLowerCase();
      return words.every((w) => text.includes(w));
    });
  },
};
