/**
 * =========================================================================
 * CBT MINDASA - GOOGLE APPS SCRIPT BACKEND
 * MIN 2 KOTA SURABAYA
 * =========================================================================
 * Data disimpan di Google Drive (JSON) DAN langsung ke tab Spreadsheet.
 * =========================================================================
 */

var DB_FILE_NAME = "cbt_mindasa_database.json";

// ==================== HANDLER GET ====================
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";

  if (action === "ping") {
    return createJsonResponse({
      status: "success",
      message: "Server Google Apps Script CBT Mindasa aktif dan siap menerima data!",
      timestamp: new Date().toISOString()
    });
  }

  if (action === "getData") {
    var data = getDatabaseData();
    return createJsonResponse({ status: "success", data: data });
  }

  return createJsonResponse({ status: "error", message: "Aksi tidak dikenal: " + action });
}

// ==================== HANDLER POST ====================
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action || "saveData";

    if (action === "saveData") {
      // 1. Simpan JSON backup ke Google Drive
      saveDatabaseData(payload);

      // 2. Tulis ke tab-tab Spreadsheet agar terlihat langsung
      writeToSpreadsheet(payload);

      return createJsonResponse({
        status: "success",
        message: "Data CBT Mindasa berhasil disimpan ke Google Drive & Google Sheets!"
      });
    }

    if (action === "submitResult") {
      var currentDb = getDatabaseData();
      if (!currentDb.results) currentDb.results = [];

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
      logResultToSheet(payload.result);

      return createJsonResponse({
        status: "success",
        message: "Hasil ujian siswa berhasil dicatat!"
      });
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak didukung: " + action });
  } catch (error) {
    return createJsonResponse({ status: "error", message: "Error: " + error.toString() });
  }
}

// ==================== TULIS KE SPREADSHEET ====================
function writeToSpreadsheet(payload) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;

    // --- Tab: DATA_SISWA ---
    if (payload.users) {
      var siswaSheet = getOrCreateSheet(ss, "DATA_SISWA");
      siswaSheet.clearContents();
      siswaSheet.appendRow(["ID", "Username", "Nama Lengkap", "Role", "NISN", "Kelas", "Mata Pelajaran", "Email"]);
      payload.users.forEach(function(u) {
        siswaSheet.appendRow([
          u.id || "", u.username || "", u.name || "", u.role || "",
          u.nisn || "", u.className || "", u.subject || "", u.email || ""
        ]);
      });
      formatHeaderRow(siswaSheet);
    }

    // --- Tab: BANK_SOAL ---
    if (payload.questions) {
      var soalSheet = getOrCreateSheet(ss, "BANK_SOAL");
      soalSheet.clearContents();
      soalSheet.appendRow(["ID", "Tipe Soal", "Kategori", "Pertanyaan", "Pilihan/Pasangan", "Kunci Jawaban", "Poin"]);
      payload.questions.forEach(function(q) {
        var opsi = "";
        if (q.options) opsi = q.options.join(" | ");
        else if (q.pairs) opsi = q.pairs.map(function(p){ return p.left + " → " + p.right; }).join(" | ");
        soalSheet.appendRow([
          q.id || "", q.type || "", q.category || "",
          q.question || q.stem || "",
          opsi,
          Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : (q.correctAnswer || ""),
          q.points || 1
        ]);
      });
      formatHeaderRow(soalSheet);
    }

    // --- Tab: JADWAL_UJIAN ---
    if (payload.exams) {
      var ujianSheet = getOrCreateSheet(ss, "JADWAL_UJIAN");
      ujianSheet.clearContents();
      ujianSheet.appendRow(["ID", "Judul Ujian", "Mata Pelajaran", "Durasi (Menit)", "Token", "Kategori", "Maks Pelanggaran"]);
      payload.exams.forEach(function(ex) {
        ujianSheet.appendRow([
          ex.id || "", ex.title || "", ex.subject || "",
          ex.durationMinutes || 60, ex.token || "",
          (ex.categories || []).join(", "),
          ex.maxViolations || 3
        ]);
      });
      formatHeaderRow(ujianSheet);
    }

    // --- Tab: HASIL_UJIAN ---
    if (payload.results) {
      var hasilSheet = getOrCreateSheet(ss, "HASIL_UJIAN");
      hasilSheet.clearContents();
      hasilSheet.appendRow(["Waktu", "Nama Siswa", "NISN", "Kelas", "Ujian", "Skor", "Benar", "Total Soal", "Pelanggaran"]);
      payload.results.forEach(function(r) {
        hasilSheet.appendRow([
          r.submittedAt || "", r.studentName || "", r.studentNisn || "",
          r.className || "", r.examTitle || "",
          r.score || 0, r.correctCount || 0, r.totalQuestions || 0,
          (r.violations && r.violations.length) || 0
        ]);
      });
      formatHeaderRow(hasilSheet);
    }

  } catch (err) {
    // Jika bukan Google Sheets (misal deploy dari Drive saja), lewati
    Logger.log("writeToSpreadsheet error: " + err);
  }
}

// ==================== LOG HASIL SISWA ====================
function logResultToSheet(result) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sheet = getOrCreateSheet(ss, "HASIL_UJIAN");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Waktu", "Nama Siswa", "NISN", "Kelas", "Ujian", "Skor", "Benar", "Total Soal", "Pelanggaran"]);
      formatHeaderRow(sheet);
    }
    sheet.appendRow([
      result.submittedAt || new Date().toISOString(),
      result.studentName || "", result.studentNisn || "", result.className || "",
      result.examTitle || "", result.score || 0,
      result.correctCount || 0, result.totalQuestions || 0,
      (result.violations && result.violations.length) || 0
    ]);
  } catch (err) {
    Logger.log("logResultToSheet error: " + err);
  }
}

// ==================== HELPER SPREADSHEET ====================
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function formatHeaderRow(sheet) {
  try {
    var header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    header.setBackground("#1a7f5a");
    header.setFontColor("#ffffff");
    header.setFontWeight("bold");
    sheet.setFrozenRows(1);
  } catch(e) {}
}

// ==================== JSON FILE (BACKUP PENUH) ====================
function getDatabaseData() {
  var files = DriveApp.getFilesByName(DB_FILE_NAME);
  if (files.hasNext()) {
    try { return JSON.parse(files.next().getBlob().getDataAsString()); }
    catch (e) { return {}; }
  }
  return {};
}

function saveDatabaseData(data) {
  var files = DriveApp.getFilesByName(DB_FILE_NAME);
  var jsonString = JSON.stringify(data, null, 2);
  if (files.hasNext()) {
    files.next().setContent(jsonString);
  } else {
    DriveApp.createFile(DB_FILE_NAME, jsonString, MimeType.PLAIN_TEXT);
  }
}

// ==================== RESPONSE HELPER ====================
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
