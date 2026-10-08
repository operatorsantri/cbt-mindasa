// Engine Penilaian CBT untuk 4 Model Soal
// (PG, PG Kompleks, Menjodohkan, Benar/Salah)

/**
 * Menghitung skor total ujian dan per butir soal
 * @param {Array} questions Daftar soal lengkap dengan kunci jawaban & bobot
 * @param {Object} studentAnswers Map jawaban siswa { [questionId]: answerValue }
 * @returns {Object} { totalScore, maxPossibleScore, percentageScore, correctCount, wrongCount, details }
 */
export function calculateExamScore(questions, studentAnswers = {}) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let correctCount = 0;
  let wrongCount = 0;
  const details = [];

  questions.forEach(q => {
    const weight = Number(q.scoreWeight) || 10;
    maxPossibleScore += weight;
    const answer = studentAnswers[q.id];

    let earnedWeight = 0;
    let isFullyCorrect = false;

    if (q.type === 'pg') {
      // Pilihan Ganda: Cek key sama persis
      if (answer && answer === q.correctAnswer) {
        earnedWeight = weight;
        isFullyCorrect = true;
      }
    } else if (q.type === 'pg_kompleks') {
      // PG Kompleks: Array jawaban (misal ['A', 'C', 'D'])
      const correctKeys = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
      const studentKeys = Array.isArray(answer) ? answer : [];

      if (correctKeys.length > 0 && studentKeys.length > 0) {
        // Hitung proporsi jawaban benar yang dipilih tanpa jawaban salah
        const correctSelected = studentKeys.filter(k => correctKeys.includes(k)).length;
        const incorrectSelected = studentKeys.filter(k => !correctKeys.includes(k)).length;

        // Formula proporsional: (benar terpilih - salah terpilih) / total benar, minimal 0
        const ratio = Math.max(0, (correctSelected - incorrectSelected) / correctKeys.length);
        earnedWeight = ratio * weight;

        if (ratio >= 0.99) {
          isFullyCorrect = true;
        }
      }
    } else if (q.type === 'menjodohkan') {
      // Menjodohkan: Object { L1: 'R1', L2: 'R2', ... }
      const correctPairs = q.correctPairs || {};
      const studentPairs = answer || {};
      const totalPairs = Object.keys(correctPairs).length;

      if (totalPairs > 0) {
        let matchedCount = 0;
        Object.entries(correctPairs).forEach(([leftKey, rightKey]) => {
          if (studentPairs[leftKey] === rightKey) {
            matchedCount++;
          }
        });

        const ratio = matchedCount / totalPairs;
        earnedWeight = ratio * weight;

        if (matchedCount === totalPairs) {
          isFullyCorrect = true;
        }
      }
    } else if (q.type === 'benar_salah') {
      // Benar / Salah: Object { S1: true/false, S2: true/false, ... }
      const correctAnswers = q.correctAnswers || {};
      const studentStatements = answer || {};
      const totalStatements = Object.keys(correctAnswers).length;

      if (totalStatements > 0) {
        let correctStatementCount = 0;
        Object.entries(correctAnswers).forEach(([statId, expectedVal]) => {
          if (studentStatements[statId] === expectedVal) {
            correctStatementCount++;
          }
        });

        const ratio = correctStatementCount / totalStatements;
        earnedWeight = ratio * weight;

        if (correctStatementCount === totalStatements) {
          isFullyCorrect = true;
        }
      }
    }

    if (isFullyCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }

    totalScore += earnedWeight;
    details.push({
      questionId: q.id,
      type: q.type,
      weight,
      earnedWeight: Math.round(earnedWeight * 100) / 100,
      isFullyCorrect,
      studentAnswer: answer,
      correctAnswer: q.type === 'pg' ? q.correctAnswer : (q.correctAnswer || q.correctPairs || q.correctAnswers)
    });
  });

  const percentageScore = maxPossibleScore > 0
    ? Math.round((totalScore / maxPossibleScore) * 1000) / 10
    : 0;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    maxPossibleScore,
    percentageScore, // Skala 0 - 100
    correctCount,
    wrongCount,
    details
  };
}
