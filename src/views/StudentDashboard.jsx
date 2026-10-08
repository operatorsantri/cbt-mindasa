import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  KeyRound, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  History, 
  BookOpen, 
  Shuffle, 
  ListOrdered,
  Eye,
  Info
} from 'lucide-react';
import { StudentViolationsModal } from '../components/StudentViolationsModal';

export function StudentDashboard({ 
  currentUser, 
  exams = [], 
  results = [], 
  questions = [],
  onStartExam,
  onViewSummary 
}) {
  const [tokenInput, setTokenInput] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [tokenError, setTokenError] = useState('');
  const [activeTab, setActiveTab] = useState('tersedia'); // 'tersedia' | 'riwayat'

  // Modal baca pelanggaran
  const [violModalOpen, setViolModalOpen] = useState(false);
  const [activeResultViolations, setActiveResultViolations] = useState([]);
  const [activeResultTitle, setActiveResultTitle] = useState('');

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Filter hasil siswa saat ini
  const myResults = results.filter(r => r.studentId === currentUser.id);

  const handleStartExam = (e) => {
    e.preventDefault();
    setTokenError('');

    if (!selectedExam) {
      setTokenError('Pilih ujian terlebih dahulu.');
      return;
    }

    if (tokenInput.trim().toUpperCase() !== selectedExam.token.toUpperCase()) {
      setTokenError(`Token salah! Token yang benar adalah "${selectedExam.token}".`);
      return;
    }

    onStartExam(selectedExam);
  };

  const openViolationViewer = (result) => {
    setActiveResultViolations(result.violations || []);
    setActiveResultTitle(result.examTitle || 'Ujian Selesai');
    setViolModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Welcome Banner - simpel & bersih */}
      <div className="bg-gradient-to-r from-teal-700 to-green-700 rounded-2xl p-5 sm:p-7 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">Dashboard Siswa</p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {currentUser.name}
          </h1>
          <p className="mt-1 text-green-100 text-sm">
            Kelas <span className="font-semibold">{currentUser.className}</span> &nbsp;·&nbsp; NISN <span className="font-semibold">{currentUser.nisn}</span>
          </p>
        </div>
        <div className="bg-white/15 border border-white/20 rounded-xl px-5 py-3 text-center min-w-[110px]">
          <div className="text-2xl font-black">{myResults.length}</div>
          <div className="text-green-200 text-xs mt-0.5">Ujian Selesai</div>
        </div>
      </div>

      {/* Tabs: Ujian Tersedia vs Riwayat Ujian & Pelanggaran */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('tersedia')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'tersedia'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Ujian Siap Dikerjakan ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('riwayat')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'riwayat'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Ujian & Catatan Pelanggaran ({myResults.length})</span>
        </button>
      </div>

      {/* TAB 1: UJIAN TERSEDIA */}
      {activeTab === 'tersedia' && selectedExam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Detail Ujian & Aturan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                    {selectedExam.subject}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedExam.title}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ujian Aktif</span>
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100 text-sm">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Durasi Ujian</div>
                  <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{selectedExam.durationMinutes} Menit</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Total Bank Soal</div>
                  <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>{questions.length} Butir Soal</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Model Pengacakan</div>
                  <div className="font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                    <Shuffle className="w-4 h-4" />
                    <span>Per Kategori</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Batas Pelanggaran</div>
                  <div className="font-bold text-rose-600 flex items-center space-x-1 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Maks {selectedExam.maxViolations || 3}x</span>
                  </div>
                </div>
              </div>

              {/* Kategori Soal yang diujikan */}
              <div className="mt-5">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Kategori Materi yang Diacak:
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedExam.categories || ['Literasi', 'Numerasi', 'Sains']).map((cat, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium flex items-center space-x-1.5"
                    >
                      <Shuffle className="w-3 h-3 text-blue-600" />
                      <span>{cat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Aturan & Tata Tertib Peserta */}
              <div className="mt-6 bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Tata Tertib Ujian & Sistem Integritas Siswa</span>
                </h4>
                <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
                  {selectedExam.instructions?.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Masukkan Token & Mulai */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Konfirmasi Token Ujian
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Minta 6 karakter token kepada pengawas ujian di ruangan
                </p>
              </div>

              <form onSubmit={handleStartExam} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Token Ujian
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="Contoh: ANBK26"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    className="w-full text-center tracking-widest text-xl font-mono font-bold uppercase py-3 px-4 bg-slate-50 border-2 border-blue-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all text-blue-900"
                  />
                  <div className="text-[11px] text-slate-500 mt-1.5 text-center flex items-center justify-center space-x-1">
                    <Info className="w-3 h-3 text-blue-600" />
                    <span>Token saat ini: <strong className="text-blue-700 font-mono">{selectedExam.token}</strong></span>
                  </div>
                </div>

                {tokenError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{tokenError}</span>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Nama Peserta:</span>
                    <strong className="text-slate-800">{currentUser.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Kelas:</span>
                    <strong className="text-slate-800">{currentUser.className}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Durasi:</span>
                    <strong className="text-slate-800">{selectedExam.durationMinutes} Menit</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai Kerjakan Ujian Sekarang</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RIWAYAT UJIAN & CATATAN PELANGGARAN SISWA */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Riwayat Ujian & Transparansi Catatan Pelanggaran
              </h3>
              <p className="text-xs text-slate-500">
                Siswa dapat meninjau nilai, ketepatan jawaban, serta membaca setiap pelanggaran yang tercatat oleh sistem.
              </p>
            </div>
          </div>

          {myResults.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">Belum Ada Riwayat Ujian</div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Anda belum menyelesaikan ujian apa pun. Silakan masukkan token di tab "Ujian Siap Dikerjakan" untuk memulai.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Waktu Ujian</th>
                    <th className="py-3 px-4">Nama Ujian</th>
                    <th className="py-3 px-4 text-center">Skor (0-100)</th>
                    <th className="py-3 px-4 text-center">Benar / Total</th>
                    <th className="py-3 px-4 text-center">Status Pelanggaran</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myResults.map((res) => {
                    const violCount = (res.violations && res.violations.length) || 0;
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono">{res.submittedAt}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {res.examTitle || 'Asesmen CBT'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block font-bold text-sm px-2.5 py-1 rounded-lg ${
                            res.score >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {res.score}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium">
                          {res.correctCount} / {res.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {violCount === 0 ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Bersih (0x)</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => openViolationViewer(res)}
                              className="inline-flex items-center space-x-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-colors"
                            >
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              <span>{violCount} Pelanggaran (Baca Detail)</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => onViewSummary(res)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold transition-colors cursor-pointer"
                          >
                            Lihat Lembar Jawaban
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Baca Pelanggaran */}
      <StudentViolationsModal
        isOpen={violModalOpen}
        onClose={() => setViolModalOpen(false)}
        violations={activeResultViolations}
        maxViolations={selectedExam?.maxViolations || 3}
        studentName={currentUser.name}
      />

    </div>
  );
}
