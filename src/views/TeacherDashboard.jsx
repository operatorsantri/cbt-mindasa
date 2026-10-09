import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  BarChart3, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Shuffle, 
  FileSpreadsheet, 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  RefreshCw,
  Eye,
  KeyRound,
  FileText
} from 'lucide-react';
import { calculateExamAnalytics } from '../utils/analysis';
import { exportToCsv, formatExamResultsForExport } from '../utils/exportUtils';
import { StudentViolationsModal } from '../components/StudentViolationsModal';

export function TeacherDashboard({ 
  currentUser, 
  questions = [], 
  onSaveQuestions, 
  exams = [], 
  onSaveExams, 
  results = [],
  settings,
  subjects = [],
  onSaveSubjects
}) {
  const [activeTab, setActiveTab] = useState('soal'); // 'soal' | 'ujian' | 'nilai' | 'analisis'

  // Toggle Ujian Aktif / Nonaktif oleh Guru
  const handleToggleExamActive = (examId) => {
    if (!onSaveExams) return;
    const updated = exams.map(e => e.id === examId ? { ...e, isActive: e.isActive === false ? true : false } : e);
    onSaveExams(updated);
  };
  
  // Filter state untuk Soal
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Soal Baru / Edit
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Form State untuk Soal
  const [formCategory, setFormCategory] = useState('Literasi & Bahasa');
  const [formType, setFormType] = useState('pg');
  const [formQuestion, setFormQuestion] = useState('');
  const [formWeight, setFormWeight] = useState(10);
  const [formExplanation, setFormExplanation] = useState('');
  
  // State opsi PG / PG Kompleks
  const [formOptions, setFormOptions] = useState([
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' }
  ]);
  const [formCorrectPG, setFormCorrectPG] = useState('A');
  const [formCorrectPGKompleks, setFormCorrectPGKompleks] = useState(['A']);

  // State Menjodohkan
  const [formLeftItems, setFormLeftItems] = useState([
    { id: 'L1', text: '' },
    { id: 'L2', text: '' }
  ]);
  const [formRightItems, setFormRightItems] = useState([
    { id: 'R1', text: '' },
    { id: 'R2', text: '' }
  ]);
  const [formCorrectPairs, setFormCorrectPairs] = useState({ 'L1': 'R1', 'L2': 'R2' });

  // State Benar / Salah
  const [formStatements, setFormStatements] = useState([
    { id: 'S1', text: '' },
    { id: 'S2', text: '' }
  ]);
  const [formCorrectBS, setFormCorrectBS] = useState({ 'S1': true, 'S2': false });

  // Modal Pelanggaran Siswa (guru membaca pelanggaran siswa tertentu)
  const [selectedStudentViolations, setSelectedStudentViolations] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [isViolModalOpen, setIsViolModalOpen] = useState(false);

  // Analisis Data Engine
  const analytics = calculateExamAnalytics(questions, results, 75);

  // Helper buka form tambah soal
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setFormCategory(subjects[0] || 'Matematika');
    setFormType('pg');
    setFormQuestion('');
    setFormWeight(10);
    setFormExplanation('');
    setFormOptions([
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' }
    ]);
    setFormCorrectPG('A');
    setFormCorrectPGKompleks(['A']);
    setFormLeftItems([
      { id: 'L1', text: 'Istilah 1' },
      { id: 'L2', text: 'Istilah 2' }
    ]);
    setFormRightItems([
      { id: 'R1', text: 'Definisi 1' },
      { id: 'R2', text: 'Definisi 2' }
    ]);
    setFormCorrectPairs({ 'L1': 'R1', 'L2': 'R2' });
    setFormStatements([
      { id: 'S1', text: 'Pernyataan 1' },
      { id: 'S2', text: 'Pernyataan 2' }
    ]);
    setFormCorrectBS({ 'S1': true, 'S2': false });
    setIsQuestionModalOpen(true);
  };

  // Helper simpan soal (Create or Update)
  const handleSaveQuestionSubmit = (e) => {
    e.preventDefault();

    const newQuestionObj = {
      id: editingQuestion ? editingQuestion.id : `q-${Date.now()}`,
      category: formCategory,
      type: formType,
      question: formQuestion,
      scoreWeight: Number(formWeight) || 10,
      explanation: formExplanation,
      image: editingQuestion?.image || ''
    };

    if (formType === 'pg') {
      newQuestionObj.options = formOptions;
      newQuestionObj.correctAnswer = formCorrectPG;
    } else if (formType === 'pg_kompleks') {
      newQuestionObj.options = formOptions;
      newQuestionObj.correctAnswer = formCorrectPGKompleks;
    } else if (formType === 'menjodohkan') {
      newQuestionObj.leftItems = formLeftItems;
      newQuestionObj.rightItems = formRightItems;
      newQuestionObj.correctPairs = formCorrectPairs;
    } else if (formType === 'benar_salah') {
      newQuestionObj.statements = formStatements;
      newQuestionObj.correctAnswers = formCorrectBS;
    }

    let updatedQuestions;
    if (editingQuestion) {
      updatedQuestions = questions.map(q => q.id === editingQuestion.id ? newQuestionObj : q);
    } else {
      updatedQuestions = [newQuestionObj, ...questions];
    }

    onSaveQuestions(updatedQuestions);
    setIsQuestionModalOpen(false);
  };

  // Hapus soal
  const handleDeleteQuestion = (id) => {
    if (window.confirm('Yakin ingin menghapus butir soal ini?')) {
      const updated = questions.filter(q => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  // Unduh Nilai ke Excel / CSV
  const handleExportGrades = () => {
    const formatted = formatExamResultsForExport(results, exams[0]?.title || 'Ujian CBT');
    exportToCsv(formatted, `rekap_nilai_cbt_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Generate Token Acak untuk Ujian
  const handleGenerateToken = (examId) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randToken = '';
    for (let i = 0; i < 6; i++) {
      randToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const updated = exams.map(e => e.id === examId ? { ...e, token: randToken } : e);
    onSaveExams(updated);
  };

  // Toggle Shuffle Config
  const handleToggleShuffle = (examId, field) => {
    const updated = exams.map(e => e.id === examId ? { ...e, [field]: !e[field] } : e);
    onSaveExams(updated);
  };

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    const matchCat = categoryFilter === 'all' || q.category === categoryFilter;
    const matchType = typeFilter === 'all' || q.type === typeFilter;
    const matchSearch = !searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Guru */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit mb-2">
            <span>Portal Guru & Pengampu CBT</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Guru: {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CBT Mindasa — MIN 2 KOTA SURABAYA • Kelola Bank Soal, Jadwal Ujian, Unduh Nilai, dan Analisis Butir Soal.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenAddQuestion}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Butir Soal</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu Guru */}
      <div className="flex border-b border-slate-200 space-x-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('soal')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'soal'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kelola Bank Soal ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ujian')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'ujian'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>Pengacakan & Token Ujian</span>
        </button>

        <button
          onClick={() => setActiveTab('nilai')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'nilai'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Unduh Nilai ({results.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analisis')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'analisis'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis Data & Butir Soal</span>
        </button>
      </div>

      {/* ================= TAB 1: KELOLA BANK SOAL ================= */}
      {activeTab === 'soal' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Filter Kategori / Mapel */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
              >
                <option value="all">Semua Mata Pelajaran / Kategori</option>
                {subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>

              {/* Filter Model Soal */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
              >
                <option value="all">Semua Model Soal</option>
                <option value="pg">Pilihan Ganda (PG)</option>
                <option value="pg_kompleks">PG Kompleks (Multi Jawaban)</option>
                <option value="menjodohkan">Menjodohkan</option>
                <option value="benar_salah">Benar / Salah</option>
              </select>

            </div>

            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari teks soal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Table / List Soal */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-36">Kategori</th>
                    <th className="py-3 px-4 w-40">Model Soal</th>
                    <th className="py-3 px-4">Isi Pertanyaan</th>
                    <th className="py-3 px-4 w-20 text-center">Bobot</th>
                    <th className="py-3 px-4 w-28 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <div className="font-semibold text-slate-600">Bank Soal Masih Kosong (0 Butir)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Klik tombol <strong>"+ Tambah Butir Soal"</strong> di pojok kanan atas untuk mulai menginput soal baru.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q, idx) => (
                      <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                            {q.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            q.type === 'pg' ? 'bg-indigo-50 text-indigo-700' :
                            q.type === 'pg_kompleks' ? 'bg-purple-50 text-purple-700' :
                            q.type === 'menjodohkan' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {q.type === 'pg' ? 'Pilihan Ganda' :
                             q.type === 'pg_kompleks' ? 'PG Kompleks' :
                             q.type === 'menjodohkan' ? 'Menjodohkan' : 'Benar / Salah'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 font-medium max-w-md truncate">
                          {q.question}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          {q.scoreWeight || 10}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: PENGACAKAN & TOKEN UJIAN ================= */}
      {activeTab === 'ujian' && (
        <div className="space-y-6">
          {exams.map(ex => (
            <div key={ex.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {ex.subject}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{ex.title}</h3>
                  <p className="text-xs text-slate-500">Durasi: {ex.durationMinutes} Menit | Toleransi Pelanggaran: {ex.maxViolations || 3}x</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Toggle Ujian Aktif/Nonaktif */}
                  <div className="flex items-center space-x-2.5 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Status Ujian</div>
                      <div className={`text-xs font-black ${ex.isActive !== false ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {ex.isActive !== false ? '🟢 DIBUKA' : '⚪ DITUTUP'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleExamActive(ex.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        ex.isActive !== false ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                      title={ex.isActive !== false ? 'Klik untuk Tutup/Nonaktifkan Ujian' : 'Klik untuk Buka/Aktifkan Ujian'}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                    </button>
                  </div>

                  {/* Token Box */}
                  <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Token Siswa</div>
                      <div className="text-xl font-mono font-black text-blue-700 tracking-wider">{ex.token}</div>
                    </div>
                    <button
                      onClick={() => handleGenerateToken(ex.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Buat Token Baru"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pengaturan Pengacakan Sesuai Kategori */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <Shuffle className="w-4 h-4 text-emerald-600" />
                  <span>Pengaturan Pengacakan Soal & Opsi Jawaban</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Card Acak Soal per Kategori */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        Acak Soal Berdasarkan Kategori
                      </div>
                      <p className="text-slate-500 mt-1">
                        Sistem mengelompokkan bank soal ke kategori (Literasi, Numerasi, Sains) dan mengacak urutan butir soal di dalam masing-masing rumpun kategori tersebut.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleShuffle(ex.id, 'shuffleQuestionsByCategory')}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-4 ${
                        ex.shuffleQuestionsByCategory ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                    </button>
                  </div>

                  {/* Card Acak Pilihan Opsi */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        Acak Urutan Opsi Pilihan Jawaban
                      </div>
                      <p className="text-slate-500 mt-1">
                        Mengacak letak posisi pilihan A, B, C, D, E pada soal Pilihan Ganda & PG Kompleks untuk setiap peserta tanpa merusak kunci jawaban.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleShuffle(ex.id, 'shuffleOptions')}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-4 ${
                        ex.shuffleOptions ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 3: UNDUH NILAI ================= */}
      {activeTab === 'nilai' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Rekapitulasi Nilai Siswa</h3>
              <p className="text-xs text-slate-500">Total {results.length} lembar jawaban siswa telah masuk.</p>
            </div>
            
            <button
              onClick={handleExportGrades}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh Rekap Excel / CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">NISN</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4 text-center">Skor (0-100)</th>
                    <th className="py-3 px-4 text-center">Benar / Salah</th>
                    <th className="py-3 px-4 text-center">Durasi (Menit)</th>
                    <th className="py-3 px-4 text-center">Pelanggaran</th>
                    <th className="py-3 px-4 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Belum ada siswa yang menyelesaikan ujian.
                      </td>
                    </tr>
                  ) : (
                    results.map((res) => {
                      const viols = res.violations || [];
                      return (
                        <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{res.studentName}</td>
                          <td className="py-3.5 px-4 font-mono">{res.studentNisn}</td>
                          <td className="py-3.5 px-4">{res.className}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block font-bold text-sm px-2.5 py-0.5 rounded-lg ${
                              res.score >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {res.score}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-emerald-700 font-bold">{res.correctCount}</span> / <span className="text-rose-600">{res.wrongCount}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono">
                            {Math.round(res.durationSpentSeconds / 60)}m
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {viols.length === 0 ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">0x (Aman)</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedStudentViolations(viols);
                                  setSelectedStudentName(res.studentName);
                                  setIsViolModalOpen(true);
                                }}
                                className="text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold cursor-pointer transition-colors"
                              >
                                {viols.length}x Pelanggaran
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedStudentViolations(viols);
                                setSelectedStudentName(res.studentName);
                                setIsViolModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                            >
                              Log Kejadian
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ANALISIS DATA & BUTIR SOAL ================= */}
      {activeTab === 'analisis' && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Rata-Rata Kelas</div>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {analytics.summary.averageScore}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Dari skala 100</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Nilai Tertinggi / Terendah</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                <span className="text-emerald-600">{analytics.summary.highestScore}</span> / <span className="text-rose-600">{analytics.summary.lowestScore}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Rentang nilai siswa</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Standar Deviasi (SD)</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {analytics.summary.stdDeviation}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Sebaran homogenitas nilai</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Tingkat Kelulusan KKM</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {analytics.summary.passRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{analytics.summary.passedCount} dari {analytics.summary.totalStudents} siswa lulus</div>
            </div>
          </div>

          {/* Tabel Analisis Butir Soal (Tingkat Kesukaran & Daya Pembeda) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Analisis Kualitas Butir Soal (Item Analysis)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi Tingkat Kesukaran (P) dan Daya Pembeda (D) untuk mengetahui butir soal yang bermutu atau memerlukan revisi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-3 w-32">Kategori</th>
                    <th className="py-3 px-3 w-28">Tipe Soal</th>
                    <th className="py-3 px-3">Potongan Pertanyaan</th>
                    <th className="py-3 px-3 text-center">Tingkat Kesukaran (P)</th>
                    <th className="py-3 px-3 text-center">Daya Pembeda (D)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.itemAnalysis.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">{item.number}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{item.category}</td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">{item.type}</td>
                      <td className="py-3 px-3 max-w-xs truncate text-slate-800">{item.questionText}</td>
                      
                      {/* Tingkat Kesukaran */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-xs ${item.difficultyColor}`}>
                          {item.difficultyIndex} ({item.difficultyCategory})
                        </span>
                      </td>

                      {/* Daya Pembeda */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-xs ${item.discriminationColor}`}>
                          {item.discriminationIndex} ({item.discriminationCategory})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekapitulasi Pelanggaran Kelas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Rekapitulasi Pelanggaran Integritas Ujian Kelas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-rose-600 font-medium">Total Pelanggaran</div>
                <div className="text-2xl font-black text-rose-800 mt-1">{analytics.violationSummary.totalViolations} Kali</div>
                <div className="text-[11px] text-rose-600 mt-0.5">Tercatat di server proctoring</div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="text-amber-700 font-medium">Siswa Terlibat Pelanggaran</div>
                <div className="text-2xl font-black text-amber-900 mt-1">{analytics.violationSummary.studentsWithViolations} Siswa</div>
                <div className="text-[11px] text-amber-700 mt-0.5">Perlu bimbingan kejujuran</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-slate-600 font-medium">Jenis Terbanyak</div>
                <div className="text-sm font-bold text-slate-800 mt-2">
                  {Object.entries(analytics.violationSummary.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between py-0.5">
                      <span className="capitalize">{type.replace('_', ' ')}:</span>
                      <strong>{count}x</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL BACA PELANGGARAN SISWA TERTENTU (GURU BISA MELIHAT) */}
      <StudentViolationsModal
        isOpen={isViolModalOpen}
        onClose={() => setIsViolModalOpen(false)}
        violations={selectedStudentViolations}
        maxViolations={3}
        studentName={selectedStudentName}
      />

      {/* MODAL FORM TAMBAH / EDIT SOAL (MENDUKUNG 4 MODEL SOAL) */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
              Buat Butir Soal Baru
            </h3>

            <form onSubmit={handleSaveQuestionSubmit} className="space-y-4 mt-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mata Pelajaran / Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    {subjects.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                    <option value="Umum">Umum / Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Model Soal</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-blue-700"
                  >
                    <option value="pg">Pilihan Ganda (PG)</option>
                    <option value="pg_kompleks">PG Kompleks (Multi Checkbox)</option>
                    <option value="menjodohkan">Menjodohkan</option>
                    <option value="benar_salah">Benar / Salah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Teks Pertanyaan</label>
                <textarea
                  required
                  rows={4}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Tuliskan pertanyaan soal secara lengkap..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              {/* Input Opsi Jawaban berdasarkan Tipe Soal */}
              {formType === 'pg' && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-700 uppercase">Pilihan Jawaban & Kunci Benar:</div>
                  {formOptions.map((opt, i) => (
                    <div key={opt.key} className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700 w-6">{opt.key}.</span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[i].text = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Teks pilihan ${opt.key}...`}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="radio"
                        name="correctPG"
                        checked={formCorrectPG === opt.key}
                        onChange={() => setFormCorrectPG(opt.key)}
                        title="Pilih sebagai kunci benar"
                      />
                    </div>
                  ))}
                </div>
              )}

              {formType === 'pg_kompleks' && (
                <div className="space-y-2 p-3 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="font-bold text-purple-900 uppercase">Pilihan Jawaban & Centang Kunci Benar (Bisa &gt; 1):</div>
                  {formOptions.map((opt, i) => (
                    <div key={opt.key} className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700 w-6">{opt.key}.</span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[i].text = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Teks pilihan ${opt.key}...`}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="checkbox"
                        checked={formCorrectPGKompleks.includes(opt.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormCorrectPGKompleks([...formCorrectPGKompleks, opt.key]);
                          } else {
                            setFormCorrectPGKompleks(formCorrectPGKompleks.filter(k => k !== opt.key));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {formType === 'menjodohkan' && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="font-bold text-emerald-900 uppercase">Pasangan Menjodohkan (Kiri & Kanan):</div>
                  {formLeftItems.map((left, idx) => (
                    <div key={left.id} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={left.text}
                        onChange={(e) => {
                          const updated = [...formLeftItems];
                          updated[idx].text = e.target.value;
                          setFormLeftItems(updated);
                        }}
                        placeholder={`Sisi Kiri ${idx + 1}`}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        required
                        value={formRightItems[idx]?.text || ''}
                        onChange={(e) => {
                          const updated = [...formRightItems];
                          updated[idx].text = e.target.value;
                          setFormRightItems(updated);
                        }}
                        placeholder={`Sisi Kanan ${idx + 1} (Jawaban Benar)`}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {formType === 'benar_salah' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <div className="font-bold text-amber-900 uppercase">Daftar Pernyataan & Kunci:</div>
                  {formStatements.map((stmt, idx) => (
                    <div key={stmt.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        required
                        value={stmt.text}
                        onChange={(e) => {
                          const updated = [...formStatements];
                          updated[idx].text = e.target.value;
                          setFormStatements(updated);
                        }}
                        placeholder={`Pernyataan ${idx + 1}...`}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <select
                        value={formCorrectBS[stmt.id] ? 'true' : 'false'}
                        onChange={(e) => {
                          setFormCorrectBS({
                            ...formCorrectBS,
                            [stmt.id]: e.target.value === 'true'
                          });
                        }}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      >
                        <option value="true">BENAR</option>
                        <option value="false">SALAH</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Bobot Skor</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Penjelasan / Pembahasan</label>
                  <input
                    type="text"
                    value={formExplanation}
                    onChange={(e) => setFormExplanation(e.target.value)}
                    placeholder="Opsional penjelasan..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Simpan Soal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
