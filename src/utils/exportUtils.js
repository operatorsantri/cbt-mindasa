// Utility Export Data ke CSV / Excel

/**
 * Mengonversi array of objects ke CSV dan mengunduhnya
 * @param {Array} rows Data baris
 * @param {string} filename Nama file hasil unduhan
 */
export function exportToCsv(rows, filename = 'rekap_nilai_cbt.csv') {
  if (!rows || rows.length === 0) {
    alert('Tidak ada data yang dapat diekspor.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(fieldName => {
          let value = row[fieldName] ?? '';
          if (typeof value === 'object') {
            value = JSON.stringify(value);
          }
          // Escape quotes and wrap in quotes
          const stringVal = String(value).replace(/"/g, '""');
          return `"${stringVal}"`;
        })
        .join(',')
    )
  ].join('\r\n');

  // Gunakan UTF-8 BOM (\uFEFF) agar simbol dan karakter Bahasa Indonesia terbaca rapi di Microsoft Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format data hasil ujian untuk diunduh oleh Guru
 */
export function formatExamResultsForExport(results, examTitle = 'Ujian CBT') {
  return results.map((r, index) => ({
    'No': index + 1,
    'Nama Peserta': r.studentName,
    'NISN': r.studentNisn,
    'Kelas': r.className,
    'Judul Ujian': examTitle,
    'Nilai Akhir (0-100)': r.score,
    'Jumlah Benar': r.correctCount,
    'Jumlah Salah': r.wrongCount,
    'Total Soal': r.totalQuestions,
    'Waktu Selesai': r.submittedAt,
    'Durasi Pengerjaan (Detik)': r.durationSpentSeconds,
    'Jumlah Pelanggaran': (r.violations && r.violations.length) || 0,
    'Detail Pelanggaran': (r.violations || []).map(v => `[${v.timestamp}] ${v.title}`).join('; ')
  }));
}
