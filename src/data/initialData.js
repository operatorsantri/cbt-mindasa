// Data Awal CBT Mindasa - MIN 2 KOTA SURABAYA
// Mendukung 4 model soal: PG, PG Kompleks, Menjodohkan, Benar/Salah

export const INITIAL_USERS = [
  {
    id: 'u-admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator CBT',
    role: 'admin',
    email: 'admin@min2surabaya.sch.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-guru-1',
    username: 'guru1',
    password: 'guru123',
    name: 'Budi Santoso, M.Pd.',
    role: 'guru',
    subject: 'Bahasa Indonesia',
    email: 'budi.santoso@min2surabaya.sch.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-guru-2',
    username: 'guru2',
    password: 'guru123',
    name: 'Dr. Retno Lestari, M.Si.',
    role: 'guru',
    subject: 'Matematika',
    email: 'retno.lestari@min2surabaya.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-siswa-1',
    username: 'siswa1',
    password: 'siswa123',
    name: 'Ahmad Rizki Pratama',
    role: 'siswa',
    nisn: '0085432101',
    className: 'VI A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-siswa-2',
    username: 'siswa2',
    password: 'siswa123',
    name: 'Siti Nurhaliza Putri',
    role: 'siswa',
    nisn: '0085432102',
    className: 'VI A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-siswa-3',
    username: 'siswa3',
    password: 'siswa123',
    name: 'Muhammad Fadhil',
    role: 'siswa',
    nisn: '0085432103',
    className: 'VI B',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

// Daftar Mata Pelajaran Awal (Mapel yang bisa dipilih dan dikembangkan guru)
export const INITIAL_SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'IPA',
  'IPS',
  'Al-Qur\'an Hadis',
  'Akidah Akhlak',
  'Fiqih',
  'Sejarah Kebudayaan Islam (SKI)',
  'Bahasa Arab',
  'Pendidikan Pancasila',
  'Bahasa Inggris',
  'PJOK',
  'Seni Budaya'
];

// Soal awal kosong (guru membuat soal dari nol)
export const INITIAL_QUESTIONS = [];

// Jadwal Ujian Awal
export const INITIAL_EXAMS = [
  {
    id: 'exam-2026-cbt',
    title: 'Penilaian Akhir Semester (PAS) CBT Mindasa',
    subject: 'Matematika',
    token: 'PAS2026',
    durationMinutes: 60,
    maxViolations: 3,
    categories: ['Matematika'],
    shuffleQuestionsByCategory: true,
    shuffleOptions: true,
    isActive: true, // Status aktif: true (bisa dikerjakan) / false (belum aktif)
    scheduledStart: '2026-10-09 08:00',
    scheduledEnd: '2026-10-09 17:00',
    instructions: [
      'Gunakan browser modern (Chrome/Edge/Firefox) dengan koneksi internet stabil.',
      'Sistem akan otomatis masuk ke Mode Layar Penuh (Fullscreen).',
      'DILARANG membuka tab lain, berpindah jendela, meminimalisir layar, atau menekan tombol F12/Ctrl+C/Ctrl+V.',
      'Setiap tindakan mencurigakan akan dicatat sebagai PELANGGARAN dan dapat dibaca oleh pengawas.',
      'Soal dan pilihan jawaban telah diacak otomatis oleh sistem per kategori.',
      'Pastikan menekan tombol "Selesai Ujian" hanya jika telah yakin dengan semua jawaban.'
    ]
  }
];

export const INITIAL_RESULTS = [];
