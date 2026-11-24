// Akun demo awal. Kata sandi disimpan sebagai hash SHA-256 + salt, bukan teks asli.
window.EDULEARN_SEED = window.EDULEARN_SEED || {};
window.EDULEARN_SEED.users = [
  {
    "username": "admin",
    "name": "Administrator",
    "role": "admin",
    "salt": "7d08e3680d49f43bf5a7dd1ecd42fc89",
    "hash": "4fb84fda92d3c5f69c1559dae661ad654564203da3dabc607e9131ed7ca6c548"
  },
  {
    "username": "dosen",
    "name": "Dosen EduLearn",
    "role": "dosen",
    "salt": "05d871d6b6d269550f7ec94c08f11f48",
    "hash": "3a1de4a718bb254236d86936197925a5554aa63b80e81657b03d00ec46d75ebf"
  },
  {
    "username": "mahasiswa",
    "name": "Mahasiswa Demo",
    "role": "mahasiswa",
    "salt": "812afa977554913adae27c20c0382e3a",
    "hash": "6f3334506ecfbe706c53b52394982e08c46517cca785afe54797980d8273bcd1"
  }
];
