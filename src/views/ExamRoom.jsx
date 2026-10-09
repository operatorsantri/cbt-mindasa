import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  X, 
  Send, 
  HelpCircle, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Volume2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StudentViolationsModal } from '../components/StudentViolationsModal';
import { calculateExamScore } from '../utils/scoring';
import { storageService } from '../services/storageService';
import { gdriveService } from '../services/gdriveService';

export function ExamRoom({ 
  currentUser, 
  exam, 
  questions = [], 
  onFinishExam, 
  settings 
}) {
  // State navigasi
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: answerValue }
  const [doubts, setDoubts] = useState({}); // { [questionId]: boolean }
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'small' | 'normal' | 'large'

  // Timer state (dalam detik)
  const initialSeconds = (exam.durationMinutes || 60) * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Proctoring & Pelanggaran
  const [violations, setViolations] = useState([]);
  const [activeWarning, setActiveWarning] = useState(null); // Alert popup saat kejadian
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [isExamLocked, setIsExamLocked] = useState(false);

  const maxViolations = exam.maxViolations || settings?.maxViolationsAllowed || 3;
  const timerRef = useRef(null);
  const currentQuestion = questions[currentIndex] || questions[0];

  // Request Fullscreen saat masuk ujian
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen request bypassed by browser security policy:', err);
      }
    };
    enterFullscreen();
  }, []);

  // Timer Countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit('Waktu ujian telah habis!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Helper mencatat pelanggaran
  const recordViolation = (type, title, description) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newViol = {
      id: `viol-${Date.now()}`,
      type,
      title,
      description,
      timestamp: timeStr
    };

    setViolations(prev => {
      const updated = [...prev, newViol];
      
      // Tampilkan warning modal saat pelanggaran terjadi
      setActiveWarning({
        ...newViol,
        total: updated.length,
        remaining: Math.max(0, maxViolations - updated.length)
      });

      // Kunci jika melampaui batas
      if (updated.length >= maxViolations) {
        setIsExamLocked(true);
      }

      return updated;
    });
  };

  // Event Listeners Proctoring (Visibility, Blur, Fullscreen, Keydown)
  useEffect(() => {
    if (!settings?.enableProctoring) return;

    // 1. Deteksi Tab Switch / Minimize
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation(
          'pindah_tab',
          'Pindah Tab Browser Terdeteksi',
          'Peserta terdeteksi berpindah ke tab lain atau meminimalisir jendela browser ujian.'
        );
      }
    };

    // 2. Deteksi Keluar Fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation(
          'keluar_fullscreen',
          'Keluar dari Layar Penuh (Fullscreen)',
          'Peserta keluar dari mode fullscreen. Sesuai tata tertib, ujian wajib dikerjakan dalam layar penuh.'
        );
      }
    };

    // 3. Deteksi Shortcut Terlarang (F12, Inspect, Ctrl+C, Ctrl+V, PrintScreen)
    const handleKeyDown = (e) => {
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        recordViolation('tombol_terlarang', 'Membuka DevTools (F12)', 'Peserta menekan tombol F12 inspect element.');
      }
      // Ctrl+Shift+I atau Ctrl+Shift+J atau Ctrl+U
      if (e.ctrlKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        recordViolation('tombol_terlarang', 'Membuka Kode Sumber', 'Peserta mencoba melihat inspect sumber halaman.');
      }
      // Ctrl+C (Salin teks) atau Ctrl+V (Tempel)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        recordViolation('tombol_terlarang', 'Mencoba Menyalin Teks (Ctrl+C)', 'Fitur copy dilarang selama sesi ujian CBT.');
      }
      if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        recordViolation('tombol_terlarang', 'Mencoba Menempel Teks (Ctrl+V)', 'Fitur paste dilarang selama sesi ujian CBT.');
      }
      // PrintScreen
      if (e.key === 'PrintScreen') {
        recordViolation('tombol_terlarang', 'Tangkapan Layar (PrintScreen)', 'Tindakan screenshot terdeteksi oleh sistem.');
      }
    };

    // 4. Cegah Klik Kanan (Context Menu)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [settings?.enableProctoring, maxViolations]);

  // Format detik ke HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h.toString().padStart(2, '0')}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handler jawaban PG
  const handleSelectPG = (optionKey) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionKey
    }));
  };

  // Handler jawaban PG Kompleks (multi checkbox)
  const handleTogglePGKompleks = (optionKey) => {
    setAnswers(prev => {
      const currentSelected = Array.isArray(prev[currentQuestion.id]) ? [...prev[currentQuestion.id]] : [];
      const exists = currentSelected.includes(optionKey);
      const updated = exists 
        ? currentSelected.filter(k => k !== optionKey)
        : [...currentSelected, optionKey].sort();
      return {
        ...prev,
        [currentQuestion.id]: updated
      };
    });
  };

  // Handler jawaban Menjodohkan
  const handleSelectMatching = (leftId, rightId) => {
    setAnswers(prev => {
      const currentPairs = typeof prev[currentQuestion.id] === 'object' && prev[currentQuestion.id] !== null && !Array.isArray(prev[currentQuestion.id])
        ? { ...prev[currentQuestion.id] }
        : {};
      currentPairs[leftId] = rightId;
      return {
        ...prev,
        [currentQuestion.id]: currentPairs
      };
    });
  };

  // Handler jawaban Benar / Salah
  const handleSelectBenarSalah = (statementId, booleanValue) => {
    setAnswers(prev => {
      const currentStatements = typeof prev[currentQuestion.id] === 'object' && prev[currentQuestion.id] !== null && !Array.isArray(prev[currentQuestion.id])
        ? { ...prev[currentQuestion.id] }
        : {};
      currentStatements[statementId] = booleanValue;
      return {
        ...prev,
        [currentQuestion.id]: currentStatements
      };
    });
  };

  // Toggle status Ragu-Ragu
  const toggleDoubt = () => {
    setDoubts(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Cek apakah soal sudah dijawab
  const isQuestionAnswered = (qId) => {
    const ans = answers[qId];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'object') return Object.keys(ans).length > 0;
    return ans !== '';
  };

  // Final Submit Ujian
  const handleFinalSubmit = (reasonMsg = 'Ujian selesai dikerjakan.') => {
    clearInterval(timerRef.current);
    
    // Hitung skor akhir menggunakan scoring engine
    const scoreResult = calculateExamScore(questions, answers);
    
    const durationSpent = initialSeconds - timeLeft;
    const finalResult = {
      id: `res-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNisn: currentUser.nisn,
      className: currentUser.className,
      submittedAt: new Date().toLocaleString('id-ID'),
      durationSpentSeconds: durationSpent,
      score: scoreResult.percentageScore,
      totalQuestions: questions.length,
      correctCount: scoreResult.correctCount,
      wrongCount: scoreResult.wrongCount,
      answers,
      violations,
      scoreDetails: scoreResult.details
    };

    // Simpan ke storage lokal
    storageService.addResult(finalResult);
    storageService.clearActiveExamSession();

    // Kirim ke Google Drive jika URL terpasang
    if (settings?.gdriveScriptUrl) {
      gdriveService.submitExamResultToDrive(settings.gdriveScriptUrl, finalResult);
    }

    // Keluar fullscreen
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    } catch (e) {
      // ignore
    }

    onFinishExam(finalResult);
  };

  // Font size classes
  const fontClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      
      {/* TOP CBT HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Info Ujian & Nomor */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {currentIndex + 1}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  {exam.subject}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">• {exam.title}</span>
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center space-x-2 mt-0.5">
                <span>Soal No. {currentIndex + 1} dari {questions.length}</span>
              </div>
            </div>
          </div>

          {/* Center: Countdown Timer */}
          <div className="flex items-center space-x-2">
            <div className={`px-4 py-2 rounded-xl flex items-center space-x-2 border transition-all ${
              timeLeft < 300 
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-urgent font-bold' 
                : 'bg-slate-50 text-slate-800 border-slate-200 font-semibold'
            }`}>
              <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="font-mono text-base tracking-wider">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Right: Font Size & Floating Pelanggaran Pill & Drawer Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Font Adjuster */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'small' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
                title="Ukuran Font Kecil"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'normal' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
                title="Ukuran Font Normal"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'large' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
                title="Ukuran Font Besar"
              >
                A+
              </button>
            </div>

            {/* FLOATING VIOLATION PILL (Siswa bisa membaca pelanggarannya secara transparan!) */}
            <button
              onClick={() => setIsViolationModalOpen(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                violations.length === 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 shadow-xs'
              }`}
              title="Klik untuk membaca detail pelanggaran yang Anda lakukan"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>
                {violations.length === 0 
                  ? 'Pelanggaran: 0x' 
                  : `Pelanggaran: ${violations.length}x (Baca Detail)`}
              </span>
            </button>

            {/* Tombol Grid Soal */}
            <button
              onClick={() => setIsGridOpen(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 sm:px-3 text-xs font-bold"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Soal</span>
            </button>

          </div>

        </div>
      </header>

      {/* MAIN EXAM CONTENT AREA */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-between">
        
        {/* QUESTION CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          
          {/* Header Soal: Kategori & Model Soal */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200">
                Kategori: {currentQuestion.category || 'Umum'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                currentQuestion.type === 'pg' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                currentQuestion.type === 'pg_kompleks' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                currentQuestion.type === 'menjodohkan' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {currentQuestion.type === 'pg' ? 'Pilihan Ganda' :
                 currentQuestion.type === 'pg_kompleks' ? 'PG Kompleks (Multi Jawaban)' :
                 currentQuestion.type === 'menjodohkan' ? 'Menjodohkan' : 'Benar / Salah'}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Bobot Skor: <strong className="text-slate-700">{currentQuestion.scoreWeight || 10} Poin</strong>
            </div>
          </div>

          {/* Teks Soal */}
          <div className={`${fontClasses[fontSize]} text-slate-800 leading-relaxed font-normal whitespace-pre-line mb-6`}>
            {currentQuestion.question}
          </div>

          {/* Opsional Gambar Soal */}
          {currentQuestion.image && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 max-w-lg">
              <img 
                src={currentQuestion.image} 
                alt="Ilustrasi Soal" 
                className="w-full object-cover max-h-72" 
              />
            </div>
          )}

          {/* AREA INTERAKTIF JAWABAN (4 MODEL SOAL) */}
          <div className="pt-2">

            {/* ================= MODEL 1: PILIHAN GANDA (PG) ================= */}
            {currentQuestion.type === 'pg' && (
              <div className="space-y-3">
                {(currentQuestion.displayOptions || currentQuestion.options || []).map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => handleSelectPG(opt.key)}
                      className={`flex items-start space-x-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 transition-colors text-sm ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.key}
                      </div>
                      <div className={`${fontClasses[fontSize]} text-slate-800 pt-0.5 leading-normal`}>
                        {opt.text}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* ================= MODEL 2: PG KOMPLEKS (MULTI PILIHAN) ================= */}
            {currentQuestion.type === 'pg_kompleks' && (
              <div>
                <p className="text-xs text-purple-700 font-semibold mb-3 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                  ℹ️ Anda dapat memilih lebih dari satu jawaban yang benar. Centang kotak pilihan di bawah ini:
                </p>
                <div className="space-y-3">
                  {(currentQuestion.displayOptions || currentQuestion.options || []).map((opt) => {
                    const currentSelected = answers[currentQuestion.id] || [];
                    const isChecked = Array.isArray(currentSelected) && currentSelected.includes(opt.key);

                    return (
                      <label
                        key={opt.key}
                        onClick={() => handleTogglePGKompleks(opt.key)}
                        className={`flex items-start space-x-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          isChecked
                            ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                          isChecked 
                            ? 'bg-purple-600 border-purple-600 text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div className={`${fontClasses[fontSize]} text-slate-800 pt-0.5 leading-normal`}>
                          <span className="font-bold mr-2 text-purple-900">{opt.key}.</span>
                          {opt.text}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= MODEL 3: MENJODOHKAN ================= */}
            {currentQuestion.type === 'menjodohkan' && (
              <div>
                <p className="text-xs text-emerald-800 font-semibold mb-3 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  ℹ️ Pasangkan pernyataan di kolom sebelah kiri dengan jawaban yang sesuai di kolom sebelah kanan:
                </p>
                
                <div className="space-y-3.5">
                  {(currentQuestion.leftItems || []).map((leftItem, lIdx) => {
                    const currentPairs = answers[currentQuestion.id] || {};
                    const selectedRightId = currentPairs[leftItem.id] || '';
                    const rightOptions = currentQuestion.displayRightItems || currentQuestion.rightItems || [];

                    return (
                      <div 
                        key={leftItem.id}
                        className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="sm:w-1/2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md mr-2">
                            Pernyataan {lIdx + 1}
                          </span>
                          <span className={`${fontClasses[fontSize]} font-semibold text-slate-800`}>
                            {leftItem.text}
                          </span>
                        </div>

                        <div className="sm:w-1/2">
                          <select
                            value={selectedRightId}
                            onChange={(e) => handleSelectMatching(leftItem.id, e.target.value)}
                            className="w-full text-xs sm:text-sm p-3 bg-white border-2 border-emerald-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
                          >
                            <option value="">-- Pilih Pasangan Jawaban --</option>
                            {rightOptions.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= MODEL 4: BENAR / SALAH ================= */}
            {currentQuestion.type === 'benar_salah' && (
              <div>
                <p className="text-xs text-amber-800 font-semibold mb-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  ℹ️ Tentukan status kebenaran (BENAR atau SALAH) pada setiap pernyataan di bawah ini:
                </p>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-4">Pernyataan</th>
                        <th className="p-4 text-center w-32">BENAR</th>
                        <th className="p-4 text-center w-32">SALAH</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(currentQuestion.displayStatements || currentQuestion.statements || []).map((stmt, sIdx) => {
                        const currentSelections = answers[currentQuestion.id] || {};
                        const val = currentSelections[stmt.id];

                        return (
                          <tr key={stmt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 text-slate-800 leading-normal font-medium">
                              <span className="text-xs font-bold text-slate-400 mr-2">{sIdx + 1}.</span>
                              {stmt.text}
                            </td>
                            
                            {/* Pilihan BENAR */}
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleSelectBenarSalah(stmt.id, true)}
                                className={`w-24 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  val === true
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                              >
                                BENAR
                              </button>
                            </td>

                            {/* Pilihan SALAH */}
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleSelectBenarSalah(stmt.id, false)}
                                className={`w-24 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  val === false
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                                }`}
                              >
                                SALAH
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* BOTTOM CBT ACTION BAR */}
        <div className="mt-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex items-center justify-between gap-2">
          
          {/* Tombol Sebelumnya */}
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              currentIndex === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Soal Sebelumnya</span>
          </button>

          {/* Tombol Ragu-Ragu */}
          <button
            type="button"
            onClick={toggleDoubt}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
              doubts[currentQuestion.id]
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ragu - Ragu</span>
          </button>

          {/* Tombol Berikutnya ATAU Selesai */}
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <span className="hidden sm:inline">Soal Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmSubmitOpen(true)}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Selesai Ujian</span>
            </button>
          )}

        </div>

      </main>

      {/* DRAWER / SIDEBAR DAFTAR NOMOR SOAL */}
      {isGridOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Grid className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-base">Daftar Nomor Soal</h3>
                </div>
                <button
                  onClick={() => setIsGridOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-between text-xs py-3 border-b border-slate-100 text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
                  <span>Sudah ({questions.filter(q => isQuestionAnswered(q.id) && !doubts[q.id]).length})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-amber-400"></span>
                  <span>Ragu ({questions.filter(q => doubts[q.id]).length})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-200"></span>
                  <span>Belum ({questions.filter(q => !isQuestionAnswered(q.id) && !doubts[q.id]).length})</span>
                </div>
              </div>

              {/* Grid 1 - N */}
              <div className="grid grid-cols-5 gap-3 mt-4 overflow-y-auto max-h-[60vh] p-1">
                {questions.map((q, idx) => {
                  const answered = isQuestionAnswered(q.id);
                  const isDoubt = doubts[q.id];
                  const isCurrent = currentIndex === idx;

                  let bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
                  if (isDoubt) {
                    bgClass = 'bg-amber-400 text-amber-950 font-bold border-amber-500';
                  } else if (answered) {
                    bgClass = 'bg-emerald-500 text-white font-bold border-emerald-600';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsGridOpen(false);
                      }}
                      className={`h-12 rounded-xl text-sm border-2 flex items-center justify-center transition-all cursor-pointer relative ${bgClass} ${
                        isCurrent ? 'ring-4 ring-blue-500/40 border-blue-600 font-extrabold scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsGridOpen(false);
                  setIsConfirmSubmitOpen(true);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kumpulkan & Selesai Ujian</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP PERINGATAN SAAT PELANGGARAN TERJADI REAL-TIME */}
      {activeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border-2 border-rose-300">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>
            
            <h3 className="text-xl font-black text-rose-700">
              PERINGATAN PELANGGARAN!
            </h3>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {activeWarning.title}
            </p>
            <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {activeWarning.description}
            </p>

            <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 font-medium">
              Pelanggaran ke-{activeWarning.total} dari batas maksimal {maxViolations}x.
              {activeWarning.remaining > 0 ? (
                <div className="mt-1 font-bold text-rose-900">
                  Sisa toleransi: {activeWarning.remaining} kali lagi!
                </div>
              ) : (
                <div className="mt-1 font-extrabold text-rose-900">
                  BATAS TOLERANSI HABIS! Ujian Anda telah dikunci.
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveWarning(null);
                  setIsViolationModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Baca Catatan Pelanggaran
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveWarning(null);
                  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  }
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Kembali ke Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI SELESAI UJIAN */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Send className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Konfirmasi Selesai Ujian?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Periksa kembali seluruh jawaban Anda sebelum mengirim ke server.
            </p>

            <div className="my-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span>Total Soal:</span>
                <strong className="text-slate-800">{questions.length} Soal</strong>
              </div>
              <div className="flex justify-between">
                <span>Sudah Dijawab:</span>
                <strong className="text-emerald-600 font-bold">
                  {questions.filter(q => isQuestionAnswered(q.id)).length} Soal
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Masih Ragu-Ragu:</span>
                <strong className="text-amber-600 font-bold">
                  {questions.filter(q => doubts[q.id]).length} Soal
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Belum Dijawab:</span>
                <strong className="text-rose-600 font-bold">
                  {questions.filter(q => !isQuestionAnswered(q.id)).length} Soal
                </strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirmSubmitOpen(false);
                  handleFinalSubmit();
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BACA PELANGGARAN SISWA */}
      <StudentViolationsModal
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        violations={violations}
        maxViolations={maxViolations}
        studentName={currentUser.name}
      />

    </div>
  );
}
