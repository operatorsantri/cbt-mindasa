// Data Awal CBT Pro (Bank Soal, Pengguna, Jadwal Ujian)
// Mendukung 4 model soal: PG, PG Kompleks, Menjodohkan, Benar/Salah

export const INITIAL_USERS = [
  {
    id: 'u-admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator CBT',
    role: 'admin',
    email: 'admin@sekolah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-guru-1',
    username: 'guru1',
    password: 'guru123',
    name: 'Budi Santoso, M.Pd.',
    role: 'guru',
    subject: 'Bahasa & Literasi',
    email: 'budi.santoso@sekolah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-guru-2',
    username: 'guru2',
    password: 'guru123',
    name: 'Dr. Retno Lestari, M.Si.',
    role: 'guru',
    subject: 'MIPA & Sains',
    email: 'retno.lestari@sekolah.sch.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-siswa-1',
    username: 'siswa1',
    password: 'siswa123',
    name: 'Ahmad Rizki Pratama',
    role: 'siswa',
    nisn: '0085432101',
    className: 'XII MIPA 1',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-siswa-2',
    username: 'siswa2',
    password: 'siswa123',
    name: 'Siti Nurhaliza Putri',
    role: 'siswa',
    nisn: '0085432102',
    className: 'XII MIPA 1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-siswa-3',
    username: 'siswa3',
    password: 'siswa123',
    name: 'Muhammad Fadhil',
    role: 'siswa',
    nisn: '0085432103',
    className: 'XII MIPA 2',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_QUESTIONS = [
  // ================= KATEGORI: LITERASI & BAHASA =================
  {
    id: 'q-101',
    category: 'Literasi & Bahasa',
    type: 'pg', // Pilihan Ganda Tunggal
    question: 'Bacalah kutipan berikut:\n"Hutan mangrove di pesisir utara Jawa memegang peranan krusial sebagai benteng penahan abrasi ombak laut serta habitat pemijahan ikan."\n\nIde pokok paragraf di atas adalah...',
    image: '',
    options: [
      { key: 'A', text: 'Kerusakan pesisir utara pulau Jawa akibat abrasi.' },
      { key: 'B', text: 'Peranan krusial hutan mangrove bagi pesisir dan ekosistem laut.' },
      { key: 'C', text: 'Habitat pemijahan ikan di perairan dalam.' },
      { key: 'D', text: 'Upaya reboisasi pohon kelapa di sepanjang pantai Jawa.' },
      { key: 'E', text: 'Penangkapan ikan berlebihan oleh nelayan tradisional.' }
    ],
    correctAnswer: 'B',
    explanation: 'Kalimat utama menjelaskan peranan krusial hutan mangrove bagi ekosistem dan perlindungan pesisir.',
    scoreWeight: 10
  },
  {
    id: 'q-102',
    category: 'Literasi & Bahasa',
    type: 'pg_kompleks', // Pilihan Ganda Kompleks (Centang Lebih dari Satu)
    question: 'Manakah dari pernyataan berikut yang merupakan ciri-ciri teks laporan hasil observasi (LHO)? (Pilihlah semua jawaban yang benar)',
    image: '',
    options: [
      { key: 'A', text: 'Bersifat objektif, faktual, dan tidak memuat prasangka/opini sepihak.' },
      { key: 'B', text: 'Memuat dialog fiksi antar tokoh imajinatif.' },
      { key: 'C', text: 'Ditulis berdasarkan hasil pengamatan langsung atau riset ilmiah.' },
      { key: 'D', text: 'Informasi disajikan secara sistematis dengan klasifikasi aspek tertentu.' },
      { key: 'E', text: 'Menggunakan sudut pandang orang pertama sebagai pelaku utama alur cerita.' }
    ],
    correctAnswer: ['A', 'C', 'D'], // Array kunci jawaban benar
    explanation: 'Teks LHO bersifat objektif (A), berbasis pengamatan langsung (C), dan disajikan sistematis dengan struktur klasifikasi (D). B dan E adalah ciri prosa narasi fiksi.',
    scoreWeight: 15
  },
  {
    id: 'q-103',
    category: 'Literasi & Bahasa',
    type: 'menjodohkan', // Menjodohkan
    question: 'Jodohkan istilah majas di sebelah kiri dengan contoh kalimat atau definisi yang tepat di sebelah kanan!',
    image: '',
    leftItems: [
      { id: 'L1', text: 'Personifikasi' },
      { id: 'L2', text: 'Hiperbola' },
      { id: 'L3', text: 'Metafora' },
      { id: 'L4', text: 'Ironi' }
    ],
    rightItems: [
      { id: 'R1', text: 'Pena menari-nari di atas lembaran kertas putih' },
      { id: 'R2', text: 'Keringatnya membanjiri seluruh lapangan bola' },
      { id: 'R3', text: 'Perpustakaan adalah gudang ilmu pengetahuan' },
      { id: 'R4', text: 'Harum sekali bau sepatumu hingga kucing pun menjauh' },
      { id: 'R5', text: 'Suara gemuruh halilintar menggetarkan jagat raya' } // Pengecoh
    ],
    correctPairs: {
      'L1': 'R1', // Personifikasi -> Pena menari-nari
      'L2': 'R2', // Hiperbola -> Keringat membanjiri
      'L3': 'R3', // Metafora -> Perpustakaan gudang ilmu
      'L4': 'R4'  // Ironi -> Harum sekali bau sepatu...
    },
    explanation: 'Personifikasi memberikan sifat manusia pada benda mati. Hiperbola melebih-lebihkan. Metafora perbandingan langsung. Ironi sindiran halus.',
    scoreWeight: 20
  },
  {
    id: 'q-104',
    category: 'Literasi & Bahasa',
    type: 'benar_salah', // Benar / Salah
    question: 'Tentukan apakah pernyataan berikut terkait kaidah kebahasaan Bahasa Indonesia BENAR atau SALAH!',
    image: '',
    statements: [
      { id: 'S1', text: 'Kata "di mana" baku jika digunakan sebagai kata penghubung dalam kalimat pernyataan.' },
      { id: 'S2', text: 'Penulisan kata baku yang tepat adalah "antre", bukan "antri".' },
      { id: 'S3', text: 'Singkatan s.d. (sampai dengan) ditulis menggunakan huruf kecil bertitik dua.' },
      { id: 'S4', text: 'Awalan "di-" pada kata kerja pasif seperti "dimakan" ditulis terpisah dengan spasi.' }
    ],
    correctAnswers: {
      'S1': false, // Salah (seharusnya tempat/tanya)
      'S2': true,  // Benar (antre baku)
      'S3': true,  // Benar (s.d. baku)
      'S4': false  // Salah (harus serangkai: dimakan)
    },
    explanation: 'Kata "di mana" hanya untuk tanya tempat. "Antre" dan "s.d." adalah baku. Awalan "di-" disambung pada verba pasif.',
    scoreWeight: 15
  },

  // ================= KATEGORI: NUMERASI & LOGIKA =================
  {
    id: 'q-201',
    category: 'Numerasi & Logika',
    type: 'pg',
    question: 'Sebuah toko memberikan diskon ganda 20% + 10% untuk sebuah jaket dengan harga awal Rp 200.000,00. Berapakah harga akhir yang harus dibayar pembeli?',
    image: '',
    options: [
      { key: 'A', text: 'Rp 140.000,00' },
      { key: 'B', text: 'Rp 144.000,00' },
      { key: 'C', text: 'Rp 150.000,00' },
      { key: 'D', text: 'Rp 160.000,00' },
      { key: 'E', text: 'Rp 176.000,00' }
    ],
    correctAnswer: 'B',
    explanation: 'Diskon pertama: 200.000 - 20% = 160.000. Diskon kedua: 160.000 - 10% = 144.000.',
    scoreWeight: 10
  },
  {
    id: 'q-202',
    category: 'Numerasi & Logika',
    type: 'pg_kompleks',
    question: 'Diberikan fungsi kuadrat f(x) = x^2 - 6x + 8. Manakah pernyataan berikut yang bernilai BENAR? (Pilihlah semua jawaban yang sesuai)',
    image: '',
    options: [
      { key: 'A', text: 'Grafik memotong sumbu X di titik (2, 0) dan (4, 0).' },
      { key: 'B', text: 'Grafik membuka ke arah bawah karena koefisien a > 0.' },
      { key: 'C', text: 'Sumbu simetri grafik adalah garis x = 3.' },
      { key: 'D', text: 'Nilai minimum fungsi tersebut adalah y = -1.' },
      { key: 'E', text: 'Grafik memotong sumbu Y di titik (0, -8).' }
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Akar x=2 dan x=4 (A). Sumbu simetri x = -(-6)/2 = 3 (C). Nilai min: 3^2 - 6(3) + 8 = -1 (D). B salah karena a>0 grafik terbuka ke atas, E salah karena potong sumbu Y di (0, 8).',
    scoreWeight: 15
  },
  {
    id: 'q-203',
    category: 'Numerasi & Logika',
    type: 'menjodohkan',
    question: 'Jodohkan bangun ruang berikut dengan rumus volume yang sesuai!',
    image: '',
    leftItems: [
      { id: 'L1', text: 'Tabung (Silinder)' },
      { id: 'L2', text: 'Kerucut' },
      { id: 'L3', text: 'Bola' },
      { id: 'L4', text: 'Prisma Segitiga' }
    ],
    rightItems: [
      { id: 'R1', text: 'π × r² × t' },
      { id: 'R2', text: '(1/3) × π × r² × t' },
      { id: 'R3', text: '(4/3) × π × r³' },
      { id: 'R4', text: 'Luas alas × tinggi' },
      { id: 'R5', text: '2 × π × r × (r + t)' } // Pengecoh (Luas permukaan)
    ],
    correctPairs: {
      'L1': 'R1',
      'L2': 'R2',
      'L3': 'R3',
      'L4': 'R4'
    },
    explanation: 'Volume tabung = πr²t, kerucut = 1/3 πr²t, bola = 4/3 πr³, prisma = Luas alas × t.',
    scoreWeight: 20
  },
  {
    id: 'q-204',
    category: 'Numerasi & Logika',
    type: 'benar_salah',
    question: 'Evaluasi kebenaran pernyataan logika matematika dan probabilitas berikut:',
    image: '',
    statements: [
      { id: 'S1', text: 'Peluang munculnya jumlah mata dadu sama dengan 7 pada pelemparan dua dadu adalah 1/6.' },
      { id: 'S2', text: 'Jika pernyataan P bernilai Salah dan Q bernilai Benar, maka implikasi P → Q bernilai Benar.' },
      { id: 'S3', text: 'Rata-rata (mean) dari data selalu sama dengan nilai median pada data acak apa pun.' },
      { id: 'S4', text: 'Bilangan prima genap satu-satunya di dunia adalah angka 2.' }
    ],
    correctAnswers: {
      'S1': true,  // 6/36 = 1/6 (Benar)
      'S2': true,  // S -> B bernilai Benar dalam tabel kebenaran
      'S3': false, // Tidak selalu sama kecuali data simetris sempurna
      'S4': true   // Benar, angka 2 adalah satu-satunya bilangan prima genap
    },
    explanation: 'Pasangan jumlah 7 ada 6 dari 36 kemungkinan (1/6). F -> T bernilai True. Mean != Median secara umum. Angka 2 adalah prima genap tunggal.',
    scoreWeight: 15
  },

  // ================= KATEGORI: SAINS & TEKNOLOGI =================
  {
    id: 'q-301',
    category: 'Sains & Teknologi',
    type: 'pg',
    question: 'Proses fotosintesis pada tumbuhan hijau terjadi di organel sel yang disebut...',
    image: '',
    options: [
      { key: 'A', text: 'Mitokondria' },
      { key: 'B', text: 'Kloroplas' },
      { key: 'C', text: 'Ribosom' },
      { key: 'D', text: 'Badan Golgi' },
      { key: 'E', text: 'Vakuola Sentral' }
    ],
    correctAnswer: 'B',
    explanation: 'Kloroplas mengandung klorofil tempat berlangsungnya reaksi fotosintesis (terang dan gelap).',
    scoreWeight: 10
  },
  {
    id: 'q-302',
    category: 'Sains & Teknologi',
    type: 'pg_kompleks',
    question: 'Manakah dari pernyataan berikut yang merupakan komponen penyusun jaringan komputer arsitektur klien-server (Client-Server)? (Pilihlah semua jawaban yang benar)',
    image: '',
    options: [
      { key: 'A', text: 'Server yang menyediakan layanan sumber daya terpusat.' },
      { key: 'B', text: 'Klien yang mengirimkan permintaan layanan kepada server.' },
      { key: 'C', text: 'Protokol jaringan (seperti HTTP/TCP/IP) sebagai media komunikasi.' },
      { key: 'D', text: 'Setiap komputer wajib memiliki spesifikasi server berskala superkomputer.' },
      { key: 'E', text: 'Media transmisi kabel (UTP/Fiber) atau nirkabel (Wi-Fi).' }
    ],
    correctAnswer: ['A', 'B', 'C', 'E'],
    explanation: 'Arsitektur client-server terdiri dari server penyedia layanan (A), klien pemohon (B), protokol komunikasi (C), dan media transmisi (E). Klien tidak perlu berspesifikasi superkomputer (D salah).',
    scoreWeight: 15
  },
  {
    id: 'q-303',
    category: 'Sains & Teknologi',
    type: 'menjodohkan',
    question: 'Jodohkan istilah energi terbarukan di sebelah kiri dengan sumber energinya di sebelah kanan!',
    image: '',
    leftItems: [
      { id: 'L1', text: 'Pembangkit Listrik Tenaga Surya (PLTS)' },
      { id: 'L2', text: 'Pembangkit Listrik Tenaga Bayu (PLTB)' },
      { id: 'L3', text: 'Pembangkit Listrik Tenaga Panas Bumi (PLTP)' },
      { id: 'L4', text: 'Pembangkit Listrik Tenaga Mikrohidro (PLTMH)' }
    ],
    rightItems: [
      { id: 'R1', text: 'Radiasi foton cahaya matahari' },
      { id: 'R2', text: 'Kinetik hembusan angin' },
      { id: 'R3', text: 'Uap panas magmatik geotermal bumi' },
      { id: 'R4', text: 'Aliran debit air sungai kecil/irigasi' },
      { id: 'R5', text: 'Pembakaran batu bara lignit' } // Pengecoh
    ],
    correctPairs: {
      'L1': 'R1',
      'L2': 'R2',
      'L3': 'R3',
      'L4': 'R4'
    },
    explanation: 'PLTS dari foton matahari, PLTB dari angin, PLTP dari panas bumi, PLTMH dari aliran debit air.',
    scoreWeight: 20
  },
  {
    id: 'q-304',
    category: 'Sains & Teknologi',
    type: 'benar_salah',
    question: 'Tentukan BENAR atau SALAH pada fakta ilmu pengetahuan alam dan digital berikut:',
    image: '',
    statements: [
      { id: 'S1', text: 'Hukum Kekekalan Energi menyatakan bahwa energi tidak dapat diciptakan maupun dimusnahkan.' },
      { id: 'S2', text: 'Gelombang suara dapat merambat melalui ruang hampa udara (vakum) luar angkasa.' },
      { id: 'S3', text: 'Protokol HTTPS menggunakan enkripsi SSL/TLS untuk mengamankan data pengguna di internet.' },
      { id: 'S4', text: 'Fotosintesis menghasilkan gas karbon dioksida sebagai produk akhir utama bagi manusia.' }
    ],
    correctAnswers: {
      'S1': true,  // Hukum termodinamika 1
      'S2': false, // Gelombang mekanik butuh medium, tidak bisa lewat vakum
      'S3': true,  // HTTPS menggunakan enkripsi TLS/SSL
      'S4': false  // Fotosintesis menghasilkan oksigen (O2) dan glukosa, bukan CO2
    },
    explanation: 'Energi bersifat kekal (Benar). Suara tidak merambat di ruang hampa (Salah). HTTPS terenkripsi (Benar). Fotosintesis menghasilkan O2 bukan CO2 (Salah).',
    scoreWeight: 15
  }
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-2026-cbt',
    title: 'Asesmen Sumatif Akhir Jenjang (CBT ANBK Pro)',
    subject: 'Literasi, Numerasi & Sains Terpadu',
    token: 'ANBK26',
    durationMinutes: 45,
    maxViolations: 3, // Maksimal 3 pelanggaran sebelum dikunci
    categories: ['Literasi & Bahasa', 'Numerasi & Logika', 'Sains & Teknologi'],
    shuffleQuestionsByCategory: true, // Acak soal per kategori!
    shuffleOptions: true,             // Acak urutan opsi jawaban!
    isActive: true,
    scheduledStart: '2026-10-08 08:00',
    scheduledEnd: '2026-10-08 17:00',
    instructions: [
      'Gunakan browser modern (Chrome/Edge/Firefox) dengan koneksi internet stabil.',
      'Sistem akan otomatis masuk ke Mode Layar Penuh (Fullscreen).',
      'DILARANG membuka tab lain, berpindah jendela, meminimalisir layar, atau menekan tombol F12/Ctrl+C/Ctrl+V.',
      'Setiap tindakan mencurigakan akan dicatat sebagai PELANGGARAN dan dapat dibaca oleh peserta serta pengawas.',
      'Soal dan pilihan jawaban telah diacak otomatis oleh sistem per kategori.',
      'Pastikan menekan tombol "Selesai Ujian" hanya jika telah yakin dengan semua jawaban.'
    ]
  }
];

// Data hasil ujian dummy untuk demonstrasi analisis data oleh Guru
export const INITIAL_RESULTS = [
  {
    id: 'res-001',
    examId: 'exam-2026-cbt',
    studentId: 'u-siswa-2',
    studentName: 'Siti Nurhaliza Putri',
    studentNisn: '0085432102',
    className: 'XII MIPA 1',
    submittedAt: '2026-10-08 09:42:15',
    durationSpentSeconds: 2140,
    score: 92.5,
    totalQuestions: 12,
    correctCount: 11,
    wrongCount: 1,
    answers: {
      'q-101': 'B',
      'q-102': ['A', 'C', 'D'],
      'q-103': { 'L1': 'R1', 'L2': 'R2', 'L3': 'R3', 'L4': 'R4' },
      'q-104': { 'S1': false, 'S2': true, 'S3': true, 'S4': false },
      'q-201': 'B',
      'q-202': ['A', 'C', 'D'],
      'q-203': { 'L1': 'R1', 'L2': 'R2', 'L3': 'R3', 'L4': 'R4' },
      'q-204': { 'S1': true, 'S2': true, 'S3': false, 'S4': true },
      'q-301': 'B',
      'q-302': ['A', 'B', 'C', 'E'],
      'q-303': { 'L1': 'R1', 'L2': 'R2', 'L3': 'R3', 'L4': 'R4' },
      'q-304': { 'S1': true, 'S2': false, 'S3': true, 'S4': false }
    },
    violations: [
      {
        id: 'viol-sample-1',
        type: 'pindah_tab',
        title: 'Meninggalkan Tab Ujian',
        description: 'Peserta beralih ke tab atau aplikasi lain selama 3 detik.',
        timestamp: '2026-10-08 09:15:22'
      }
    ]
  },
  {
    id: 'res-002',
    examId: 'exam-2026-cbt',
    studentId: 'u-siswa-3',
    studentName: 'Muhammad Fadhil',
    studentNisn: '0085432103',
    className: 'XII MIPA 2',
    submittedAt: '2026-10-08 09:50:30',
    durationSpentSeconds: 2450,
    score: 68.0,
    totalQuestions: 12,
    correctCount: 8,
    wrongCount: 4,
    answers: {
      'q-101': 'A', // Salah
      'q-102': ['A', 'C'], // Kurang D
      'q-103': { 'L1': 'R1', 'L2': 'R2', 'L3': 'R3', 'L4': 'R4' },
      'q-104': { 'S1': false, 'S2': true, 'S3': true, 'S4': false },
      'q-201': 'B',
      'q-202': ['A', 'C', 'D'],
      'q-203': { 'L1': 'R1', 'L2': 'R2', 'L3': 'R4', 'L4': 'R3' }, // Salah sebagian
      'q-204': { 'S1': true, 'S2': false, 'S3': false, 'S4': true },
      'q-301': 'B',
      'q-302': ['A', 'B'], // Kurang
      'q-303': { 'L1': 'R1', 'L2': 'R2', 'L3': 'R3', 'L4': 'R4' },
      'q-304': { 'S1': true, 'S2': true, 'S3': true, 'S4': false } // S2 salah
    },
    violations: [
      {
        id: 'viol-sample-2',
        type: 'keluar_fullscreen',
        title: 'Keluar Mode Layar Penuh',
        description: 'Peserta menekan tombol ESC atau keluar dari fullscreen.',
        timestamp: '2026-10-08 09:22:11'
      },
      {
        id: 'viol-sample-3',
        type: 'tombol_terlarang',
        title: 'Kombinasi Tombol Pintas Dilarang',
        description: 'Peserta mencoba kombinasi tombol Ctrl+C (salin teks).',
        timestamp: '2026-10-08 09:35:40'
      }
    ]
  }
];
