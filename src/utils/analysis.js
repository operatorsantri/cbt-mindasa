// Analisis Data Ujian & Analisis Butir Soal untuk Guru
// Menghitung: Tingkat Kesukaran, Daya Pembeda, Efektivitas Pengecoh, Rekapitulasi Kelas

/**
 * Menghitung analisis butir soal dan statistik keseluruhan kelas
 * @param {Array} questions Daftar soal ujian
 * @param {Array} results Daftar hasil ujian siswa yang sudah selesai
 * @param {number} kkm Batas KKM kelulusan (default 75)
 */
export function calculateExamAnalytics(questions = [], results = [], kkm = 75) {
  if (!results || results.length === 0) {
    return {
      summary: {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        stdDeviation: 0,
        passedCount: 0,
        failedCount: 0,
        passRate: 0
      },
      itemAnalysis: [],
      violationSummary: {
        totalViolations: 0,
        studentsWithViolations: 0,
        byType: {}
      }
    };
  }

  const scores = results.map(r => Number(r.score) || 0);
  const totalStudents = results.length;
  const sumScores = scores.reduce((acc, s) => acc + s, 0);
  const averageScore = Math.round((sumScores / totalStudents) * 10) / 10;
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  // Standar Deviasi
  const variance = scores.reduce((acc, s) => acc + Math.pow(s - averageScore, 2), 0) / totalStudents;
  const stdDeviation = Math.round(Math.sqrt(variance) * 10) / 10;

  // Kelulusan KKM
  const passedCount = scores.filter(s => s >= kkm).length;
  const failedCount = totalStudents - passedCount;
  const passRate = Math.round((passedCount / totalStudents) * 100);

  // Pisahkan kelompok atas dan kelompok bawah untuk Daya Pembeda (D)
  // Urutkan siswa dari skor tertinggi ke terendah
  const sortedResults = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
  const groupSize = Math.max(1, Math.round(totalStudents * 0.27)); // Aturan 27% kelompok atas & bawah
  const upperGroup = sortedResults.slice(0, groupSize);
  const lowerGroup = sortedResults.slice(-groupSize);

  // Analisis Butir Soal per nomor
  const itemAnalysis = questions.map((q, idx) => {
    let totalCorrect = 0;
    let upperCorrect = 0;
    let lowerCorrect = 0;
    const optionCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    results.forEach(res => {
      const ans = res.answers ? res.answers[q.id] : null;

      // Cek apakah siswa menjawab benar
      let isCorrect = false;
      if (q.type === 'pg') {
        if (ans === q.correctAnswer) isCorrect = true;
        if (ans && optionCounts[ans] !== undefined) optionCounts[ans]++;
      } else if (q.type === 'pg_kompleks') {
        const correctKeys = q.correctAnswer || [];
        if (Array.isArray(ans) && ans.length === correctKeys.length && ans.every(k => correctKeys.includes(k))) {
          isCorrect = true;
        }
      } else if (q.type === 'menjodohkan') {
        const pairs = q.correctPairs || {};
        if (ans && Object.keys(pairs).every(k => ans[k] === pairs[k])) {
          isCorrect = true;
        }
      } else if (q.type === 'benar_salah') {
        const answers = q.correctAnswers || {};
        if (ans && Object.keys(answers).every(k => ans[k] === answers[k])) {
          isCorrect = true;
        }
      }

      if (isCorrect) totalCorrect++;
    });

    // Hitung di Upper & Lower group
    upperGroup.forEach(res => {
      const ans = res.answers ? res.answers[q.id] : null;
      if (isAnswerCorrect(q, ans)) upperCorrect++;
    });
    lowerGroup.forEach(res => {
      const ans = res.answers ? res.answers[q.id] : null;
      if (isAnswerCorrect(q, ans)) lowerCorrect++;
    });

    // 1. Tingkat Kesukaran (P = B / N)
    const difficultyIndex = Math.round((totalCorrect / totalStudents) * 100) / 100;
    let difficultyCategory = 'Sedang';
    let difficultyColor = 'text-amber-600 bg-amber-50';
    if (difficultyIndex > 0.70) {
      difficultyCategory = 'Mudah';
      difficultyColor = 'text-emerald-600 bg-emerald-50';
    } else if (difficultyIndex < 0.30) {
      difficultyCategory = 'Sukar';
      difficultyColor = 'text-rose-600 bg-rose-50';
    }

    // 2. Daya Pembeda (D = (Ba - Bb) / n)
    const discriminationIndex = groupSize > 0
      ? Math.round(((upperCorrect - lowerCorrect) / groupSize) * 100) / 100
      : 0;
    let discriminationCategory = 'Cukup';
    let discriminationColor = 'text-blue-600 bg-blue-50';
    if (discriminationIndex >= 0.40) {
      discriminationCategory = 'Sangat Baik';
      discriminationColor = 'text-emerald-700 bg-emerald-50';
    } else if (discriminationIndex >= 0.30) {
      discriminationCategory = 'Baik';
      discriminationColor = 'text-sky-700 bg-sky-50';
    } else if (discriminationIndex >= 0.20) {
      discriminationCategory = 'Cukup (Perlu Revisi)';
      discriminationColor = 'text-amber-700 bg-amber-50';
    } else {
      discriminationCategory = 'Jelek (Buang / Tulis Ulang)';
      discriminationColor = 'text-rose-700 bg-rose-50';
    }

    return {
      number: idx + 1,
      id: q.id,
      category: q.category,
      type: q.type,
      questionText: q.question,
      totalCorrect,
      totalStudents,
      difficultyIndex,
      difficultyCategory,
      difficultyColor,
      discriminationIndex,
      discriminationCategory,
      discriminationColor,
      optionCounts
    };
  });

  // Rekapitulasi Pelanggaran Kelas
  let totalViolations = 0;
  let studentsWithViolations = 0;
  const violationCountsByType = {};

  results.forEach(r => {
    const viols = r.violations || [];
    if (viols.length > 0) {
      studentsWithViolations++;
      totalViolations += viols.length;
      viols.forEach(v => {
        const typeKey = v.type || 'lainnya';
        violationCountsByType[typeKey] = (violationCountsByType[typeKey] || 0) + 1;
      });
    }
  });

  return {
    summary: {
      totalStudents,
      averageScore,
      highestScore,
      lowestScore,
      stdDeviation,
      passedCount,
      failedCount,
      passRate
    },
    itemAnalysis,
    violationSummary: {
      totalViolations,
      studentsWithViolations,
      byType: violationCountsByType
    }
  };
}

function isAnswerCorrect(q, ans) {
  if (!ans) return false;
  if (q.type === 'pg') return ans === q.correctAnswer;
  if (q.type === 'pg_kompleks') {
    const correctKeys = q.correctAnswer || [];
    return Array.isArray(ans) && ans.length === correctKeys.length && ans.every(k => correctKeys.includes(k));
  }
  if (q.type === 'menjodohkan') {
    const pairs = q.correctPairs || {};
    return Object.keys(pairs).every(k => ans[k] === pairs[k]);
  }
  if (q.type === 'benar_salah') {
    const answers = q.correctAnswers || {};
    return Object.keys(answers).every(k => ans[k] === answers[k]);
  }
  return false;
}
