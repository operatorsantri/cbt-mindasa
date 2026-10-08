// Utility untuk pengacakan soal dan opsi jawaban
// Mendukung pengacakan per kategori (soal dan jawaban bisa diacak sesuai kategorinya)

/**
 * Algoritma Fisher-Yates Shuffle murni
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Mengacak soal dan opsi jawaban berdasarkan pengaturan ujian
 * @param {Array} rawQuestions Daftar seluruh soal
 * @param {Object} options { shuffleQuestionsByCategory: boolean, shuffleOptions: boolean, allowedCategories: Array }
 * @returns {Array} Daftar soal yang telah diacak dan dinormalisasi untuk sesi ujian peserta
 */
export function prepareExamQuestions(rawQuestions, options = {}) {
  const {
    shuffleQuestionsByCategory = true,
    shuffleOptions = true,
    allowedCategories = []
  } = options;

  // Filter berdasarkan kategori yang dipilih jika ada
  let filtered = rawQuestions;
  if (allowedCategories && allowedCategories.length > 0) {
    filtered = rawQuestions.filter(q => allowedCategories.includes(q.category));
  }

  let finalQuestions = [];

  if (shuffleQuestionsByCategory) {
    // Kelompokkan soal per kategori terlebih dahulu
    const categoryGroups = {};
    filtered.forEach(q => {
      const cat = q.category || 'Umum';
      if (!categoryGroups[cat]) categoryGroups[cat] = [];
      categoryGroups[cat].push(q);
    });

    // Acak soal di DALAM masing-masing kategori
    Object.keys(categoryGroups).forEach(cat => {
      const shuffledInGroup = shuffleArray(categoryGroups[cat]);
      finalQuestions.push(...shuffledInGroup);
    });
  } else {
    // Acak seluruh soal tanpa memandang kategori
    finalQuestions = shuffleArray(filtered);
  }

  // Jika opsi jawaban juga perlu diacak:
  return finalQuestions.map((question, index) => {
    const qCopy = JSON.parse(JSON.stringify(question));
    qCopy.displayNumber = index + 1; // Nomor urut tampilan siswa

    if (shuffleOptions) {
      if (qCopy.type === 'pg' || qCopy.type === 'pg_kompleks') {
        // Acak urutan array options
        if (Array.isArray(qCopy.options)) {
          const shuffledOptions = shuffleArray(qCopy.options);
          // Label ulang key tampilan (A, B, C, D, E) sambil menjaga id/key asli untuk penilaian
          // ATAU pertahankan key asli namun ubah urutan display
          qCopy.displayOptions = shuffledOptions;
        }
      } else if (qCopy.type === 'menjodohkan') {
        // Acak urutan rightItems (pilihan di sebelah kanan)
        if (Array.isArray(qCopy.rightItems)) {
          qCopy.displayRightItems = shuffleArray(qCopy.rightItems);
        }
      } else if (qCopy.type === 'benar_salah') {
        // Opsi urutan pernyataan bisa diacak atau dibiarkan berurutan
        if (Array.isArray(qCopy.statements)) {
          qCopy.displayStatements = shuffleArray(qCopy.statements);
        }
      }
    } else {
      // Jika opsi tidak diacak, gunakan urutan default
      qCopy.displayOptions = qCopy.options;
      qCopy.displayRightItems = qCopy.rightItems;
      qCopy.displayStatements = qCopy.statements;
    }

    return qCopy;
  });
}
