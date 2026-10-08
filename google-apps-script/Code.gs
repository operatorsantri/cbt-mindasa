/**
 * =========================================================================
 * CBT PRO - GOOGLE APPS SCRIPT BACKEND (DATABASE GOOGLE DRIVE & SHEETS)
 * =========================================================================
 * Script ini bertindak sebagai API serverless gratis di Google Drive Anda.
 * Data tersimpan aman di Google Drive / Google Sheets Anda sendiri.
 *
 * CARA MEMASANG (HANYA 2 MENIT):
 * 1. Buka Google Drive (drive.google.com).
 * 2. Buat Google Spreadsheet baru, beri nama misalnya "CBT_DATABASE_2026".
 * 3. Di menu atas Spreadsheet, klik: Ekstensi (Extensions) -> Apps Script.
 * 4. Hapus semua kode default di Apps Script, lalu salin-tempel (paste) seluruh isi file ini.
 * 5. Klik Simpan (ikon disket / Ctrl+S).
 * 6. Klik tombol biru "Terapkan" (Deploy) di kanan atas -> "Penerapan Baru" (New Deployment).
 * 7. Pilih Jenis: "Aplikasi Web" (Web App).
 *    - Deskripsi: CBT API v1
 *    - Jalankan sebagai (Execute as): Saya (email Anda)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 8. Klik "Terapkan" (Deploy). Berikan izin akses (Review Permissions -> Pilih Akun -> Advanced -> Go to ... (unsafe) -> Allow).
 * 9. Salin "URL Aplikasi Web" (contoh: https://script.google.com/macros/s/AKfycb.../exec).
 * 10. Tempelkan URL tersebut ke menu Admin CBT Pro -> Pengaturan Google Drive.
 * =========================================================================
 */

// Nama file JSON database cadangan di Google Drive (otomatis dibuat jika belum ada)
var DB_FILE_NAME = "cbt_database_master.json";

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  
  if (action === "ping") {
    return createJsonResponse({
      status: "success",
      message: "Server Google Apps Script CBT Pro aktif dan siap menerima data!",
      timestamp: new Date().toISOString()
    });
  }
  
  if (action === "getData") {
    var data = getDatabaseData();
    return createJsonResponse({
      status: "success",
      data: data
    });
  }
  
  return createJsonResponse({
    status: "error",
    message: "Aksi tidak dikenal: " + action
  });
}

function doPost(e) {
  try {
    var rawPostData = e.postData.contents;
    var payload = JSON.parse(rawPostData);
    var action = payload.action || "saveData";
    
    if (action === "saveData") {
      saveDatabaseData(payload);
      return createJsonResponse({
        status: "success",
        message: "Data CBT (Soal, Pengguna, Ujian, Hasil) berhasil disimpan ke Google Drive!"
      });
    }
    
    if (action === "submitResult") {
      var currentDb = getDatabaseData();
      if (!currentDb.results) currentDb.results = [];
      
      // Tambah atau update hasil siswa
      var existingIndex = -1;
      for (var i = 0; i < currentDb.results.length; i++) {
        if (currentDb.results[i].studentId === payload.result.studentId && 
            currentDb.results[i].examId === payload.result.examId) {
          existingIndex = i;
          break;
        }
      }
      
      if (existingIndex >= 0) {
        currentDb.results[existingIndex] = payload.result;
      } else {
        currentDb.results.unshift(payload.result);
      }
      
      saveDatabaseData(currentDb);
      
      // Opsional: Catat juga ke tab sheet "Hasil_Ujian" jika terhubung ke Spreadsheet
      try {
        logResultToSheet(payload.result);
      } catch (sheetErr) {
        // Abaikan jika bukan Google Sheet langsung
      }
      
      return createJsonResponse({
        status: "success",
        message: "Hasil ujian siswa berhasil dicatat ke Google Drive!"
      });
    }
    
    return createJsonResponse({
      status: "error",
      message: "Aksi POST tidak didukung: " + action
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Gagal memproses data: " + error.toString()
    });
  }
}

/**
 * Mengambil database JSON dari file di Google Drive
 */
function getDatabaseData() {
  var files = DriveApp.getFilesByName(DB_FILE_NAME);
  if (files.hasNext()) {
    var file = files.next();
    var content = file.getBlob().getDataAsString();
    try {
      return JSON.parse(content);
    } catch (e) {
      return {};
    }
  }
  return {};
}

/**
 * Menyimpan database JSON ke file di Google Drive
 */
function saveDatabaseData(data) {
  var files = DriveApp.getFilesByName(DB_FILE_NAME);
  var jsonString = JSON.stringify(data, null, 2);
  
  if (files.hasNext()) {
    var file = files.next();
    file.setContent(jsonString);
  } else {
    DriveApp.createFile(DB_FILE_NAME, jsonString, MimeType.PLAIN_TEXT);
  }
}

/**
 * Mencatat hasil siswa ke tab sheet Google Spreadsheet agar mudah dilihat langsung
 */
function logResultToSheet(result) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;
  
  var sheet = ss.getSheetByName("Hasil_Ujian");
  if (!sheet) {
    sheet = ss.insertSheet("Hasil_Ujian");
    sheet.appendRow([
      "Waktu Selesai",
      "ID Ujian",
      "Nama Siswa",
      "NISN",
      "Kelas",
      "Skor Akhir (0-100)",
      "Benar",
      "Salah",
      "Jumlah Pelanggaran",
      "Durasi (Detik)"
    ]);
  }
  
  sheet.appendRow([
    result.submittedAt || new Date().toISOString(),
    result.examId || "",
    result.studentName || "",
    result.studentNisn || "",
    result.className || "",
    result.score || 0,
    result.correctCount || 0,
    result.wrongCount || 0,
    (result.violations && result.violations.length) || 0,
    result.durationSpentSeconds || 0
  ]);
}

/**
 * Helper untuk mengembalikan respons JSON dengan header CORS yang tepat
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
