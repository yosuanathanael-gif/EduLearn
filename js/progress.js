/* Progres belajar: materi yang ditandai selesai dipelajari, disimpan per pengguna. */
const EduProgress = {
  doneIds(username) {
    return EduStore.data.progress[username] || [];
  },

  isDone(username, materialId) {
    return this.doneIds(username).includes(materialId);
  },

  // Membalik status selesai/belum. Mengembalikan status terbaru.
  toggle(username, materialId) {
    if (!EduStore.material(materialId)) return false;
    const ids = this.doneIds(username);
    const done = ids.includes(materialId);
    EduStore.data.progress[username] = done ? ids.filter((id) => id !== materialId) : ids.concat(materialId);
    EduStore.save();
    return !done;
  },

  // Hitung hanya materi yang masih ada (materi yang sudah dihapus tidak dihitung).
  summary(username, courseId = null) {
    const materials = EduStore.data.materials.filter((m) => courseId === null || m.courseId === courseId);
    const done = materials.filter((m) => this.isDone(username, m.id)).length;
    const total = materials.length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  },
};
