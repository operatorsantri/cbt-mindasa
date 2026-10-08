# 🎓 CBT Pro - Sistem Ujian Berbasis Komputer & Proctoring Anti-Curang

Aplikasi ujian Computer-Based Test (CBT) modern dengan standar tampilan asesmen nasional (ANBK/UTBK). Dilengkapi dengan **4 Model Soal**, **Pengacakan Soal & Opsi Berdasarkan Kategori**, **Sistem Proctoring Anti-Curang dengan Transparansi Log Pelanggaran**, serta backend serverless gratis berbasis **Google Drive & Google Sheets (Google Apps Script)**.

---

## 🌟 Fitur Utama

### 1. 4 Model Soal Lengkap
- **Pilihan Ganda (PG)**: Pilihan tunggal A, B, C, D, E dengan kunci jawaban otomatis.
- **Pilihan Ganda Kompleks (PG Kompleks)**: Pilihan majemuk (centang lebih dari satu jawaban yang benar).
- **Menjodohkan (Matching)**: Memasangkan pernyataan sisi kiri dengan sisi kanan secara interaktif.
- **Benar / Salah (Matrix)**: Menilai serangkaian pernyataan sebagai BENAR atau SALAH.

### 2. Pengacakan Soal & Jawaban Sesuai Kategori
- **Acak Soal per Kategori**: Soal dikelompokkan berdasarkan kategori (contoh: *Literasi & Bahasa*, *Numerasi & Logika*, *Sains & Teknologi*). Soal diacak di dalam masing-masing rumpun kategori tersebut.
- **Acak Opsi Jawaban**: Posisi opsi A, B, C, D, E diacak secara dinamis untuk setiap siswa tanpa merusak pemetaan kunci jawaban.

### 3. Tiga Tingkat Akses (Multi-Role)
- **👑 Administrator (Full Control)**:
  - Ringkasan statistik sistem & koneksi cloud.
  - Kelola pengguna (tambah/hapus akun Admin, Guru, Siswa).
  - Konfigurasi Google Drive & Apps Script API (Tes koneksi, backup & restore data).
  - Pengaturan sensitivitas proctoring & reset data demo.
- **👨‍🏫 Guru (Pengampu Mata Pelajaran)**:
  - Kelola Bank Soal: Tambah, edit, dan hapus 4 model soal beserta bobot dan pembahasannya.
  - Pengacakan & Jadwal: Tentukan durasi ujian, generate token ujian 6 huruf (contoh: `ANBK26`), dan aktifkan fitur acak soal/opsi.
  - Unduh Nilai: Ekspor rekapitulasi nilai lengkap siswa ke format **Excel / CSV** (UTF-8 BOM siap buka di Microsoft Excel).
  - Analisis Data:
    - Statistik Kelas: Rata-rata, Tertinggi, Terendah, Standar Deviasi, dan Persentase Kelulusan KKM.
    - Analisis Butir Soal: Menghitung **Tingkat Kesukaran ($P$)** dan **Daya Pembeda ($D$)**.
    - Rekapitulasi Pelanggaran Kelas: Memantau siswa yang melakukan perpindahan tab atau keluar layar penuh.
- **👨‍🎓 Siswa (Peserta Ujian)**:
  - Masuk menggunakan Akun / NISN dan konfirmasi Token Ujian.
  - Layar ujian profesional (Timer dengan peringatan sisa waktu, navigasi nomor, penanda ragu-ragu, font resizer).
  - **Membaca Pelanggaran yang Dilakukan**:
    - Tombol khusus *"Pelanggaran: Nx (Baca Detail)"* dapat diklik langsung oleh siswa saat ujian berlangsung maupun setelah selesai ujian untuk meninjau jenis pelanggaran dan batas toleransi server.

### 4. Sistem Proctoring & Anti-Curang
- Mode Layar Penuh (Fullscreen Enforcement).
- Deteksi otomatis:
  - Keluar dari layar penuh (Fullscreen exit).
  - Pindah tab browser / Minimize jendela.
  - Tombol keyboard terlarang (F12, Inspect Element, Ctrl+C, Ctrl+V, PrintScreen).
  - Klik kanan dinonaktifkan.
- Peringatan popup instan ke siswa saat pelanggaran terjadi + opsi batas toleransi sebelum ujian dikunci.

---

## 🚀 Akun Demo untuk Uji Coba

Anda dapat login langsung menggunakan tombol **"Masuk Cepat Demo (1-Klik)"** pada halaman login:

| Peran (Role) | Username | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Administrator utama |
| **Guru** | `guru1` | `guru123` | Budi Santoso, M.Pd. (Literasi) |
| **Guru** | `guru2` | `guru123` | Dr. Retno Lestari (MIPA) |
| **Siswa** | `siswa1` / `0085432101` | `siswa123` | Ahmad Rizki Pratama (XII MIPA 1) |
| **Siswa** | `siswa2` / `0085432102` | `siswa123` | Siti Nurhaliza Putri (XII MIPA 1) |

*Token Ujian Bawaan*: **`ANBK26`**

---

## 🛠️ Cara Menjalankan Secara Lokal (Local Development)

1. Pastikan komputer Anda telah terpasang **Node.js** (v18+).
2. Buka terminal di folder proyek ini:
   ```bash
   npm install
   npm run dev
   ```
3. Buka browser di alamat yang tertera (biasanya `http://localhost:5173`).

---

## 📦 Cara Membangun (Build) & Upload ke GitHub

### 1. Bangun Berkas Produksi
```bash
npm run build
```
Hasil file statis yang siap di-hosting akan berada di folder `dist/`.

### 2. Upload ke Repositori GitHub
Inisialisasi git dan push ke repositori GitHub Anda:
```bash
git init
git add .
git commit -m "feat: CBT Pro Web Ujian dengan 4 model soal & GDrive database"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO_CBT.git
git push -u origin main
```

### 3. Deploy Gratis ke GitHub Pages / Vercel
- **Vercel / Netlify**: Hubungkan repositori GitHub Anda, klik deploy (otomatis mengenali Vite).
- **GitHub Pages**: Di tab *Settings > Pages* di repositori GitHub Anda, atur source ke branch `gh-pages` atau gunakan GitHub Actions deploy Vite.

---

## ☁️ Cara Menghubungkan ke Database Google Drive (Google Apps Script)

Aplikasi ini sudah menyediakan file backend siap pakai di:
📂 `google-apps-script/Code.gs`

### Langkah-langkah (Hanya 2 Menit):
1. Buka [Google Drive](https://drive.google.com).
2. Buat Google Spreadsheet baru (beri nama misalnya: `CBT_DATABASE_2026`).
3. Pada menu atas Spreadsheet, klik: **Ekstensi (Extensions) > Apps Script**.
4. Hapus kode default di Apps Script, lalu salin dan tempel (paste) seluruh isi file `google-apps-script/Code.gs`.
5. Klik **Simpan (ikon disket / Ctrl+S)**.
6. Klik tombol biru **Terapkan (Deploy)** di pojok kanan atas > **Penerapan Baru (New Deployment)**.
7. Pilih jenis **Aplikasi Web (Web App)**:
   - **Deskripsi**: `CBT API v1`
   - **Jalankan sebagai (Execute as)**: `Saya (email Anda)`
   - **Siapa yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** *(Sangat penting agar aplikasi web dapat berkomunikasi)*
8. Klik **Terapkan (Deploy)** dan berikan izin akses (klik *Review permissions > Advanced > Go to ... (unsafe) > Allow*).
9. Salin **URL Aplikasi Web** yang didapat (format: `https://script.google.com/macros/s/.../exec`).
10. Masuk ke CBT Pro sebagai **Admin**, buka tab **Database Google Drive**, tempelkan URL tersebut dan klik **Tes Koneksi**!
11. Klik **"Cadangkan Data ke Google Drive"** untuk menyimpan seluruh bank soal dan pengguna ke Drive Anda.

---

## 📁 Struktur Berkas Proyek

```
cbt-app/
├── google-apps-script/
│   └── Code.gs               # Backend API gratis untuk Google Drive & Sheets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigasi & indikator status cloud/lokal
│   │   └── StudentViolationsModal.jsx # Modal interaktif membaca pelanggaran siswa
│   ├── data/
│   │   └── initialData.js    # Data awal 4 model soal, jadwal, & user demo
│   ├── services/
│   │   ├── storageService.js # Manajemen penyimpanan lokal & sinkronisasi
│   │   └── gdriveService.js  # Komunikasi API dengan Google Drive
│   ├── utils/
│   │   ├── analysis.js       # Analisis Butir Soal (P, D) & statistik kelas
│   │   ├── exportUtils.js    # Ekspor nilai ke CSV / Excel (UTF-8 BOM)
│   │   ├── scoring.js        # Mesin penilaian 4 model soal CBT
│   │   └── shuffle.js        # Algoritma pengacak soal per kategori & opsi
│   ├── views/
│   │   ├── AdminDashboard.jsx   # Kontrol admin, pengguna & Google Drive
│   │   ├── ExamRoom.jsx         # Ruang pengerjaan ujian ANBK + proctoring
│   │   ├── ExamSummary.jsx      # Rekap skor & pembacaan pelanggaran siswa
│   │   ├── LoginView.jsx        # Halaman masuk dengan tombol 1-klik demo
│   │   ├── StudentDashboard.jsx # Portal siswa & input token ujian
│   │   └── TeacherDashboard.jsx # Portal guru (soal, unduh nilai, analisis)
│   ├── App.jsx               # Komponen utama & router peran
│   ├── index.css             # Tailwind CSS konfigurasi
│   └── main.jsx              # Entry point React
├── index.html                # Dokumen HTML utama
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📜 Lisensi
Dikembangkan untuk mendukung digitalisasi asesmen sekolah dan simulasi ujian berstandar nasional. Bebas digunakan dan dimodifikasi untuk keperluan edukasi.
