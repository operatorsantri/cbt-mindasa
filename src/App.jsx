import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { prepareExamQuestions } from './utils/shuffle';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { StudentDashboard } from './views/StudentDashboard';
import { ExamRoom } from './views/ExamRoom';
import { ExamSummary } from './views/ExamSummary';
import { TeacherDashboard } from './views/TeacherDashboard';
import { AdminDashboard } from './views/AdminDashboard';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [settings, setSettings] = useState({});

  // State Ujian Berjalan
  const [activeExam, setActiveExam] = useState(null);
  const [activePreparedQuestions, setActivePreparedQuestions] = useState([]);
  const [viewSummaryResult, setViewSummaryResult] = useState(null);

  // Inisialisasi data dari localStorage
  useEffect(() => {
    storageService.init();
    setUsers(storageService.getUsers());
    setQuestions(storageService.getQuestions());
    setExams(storageService.getExams());
    setResults(storageService.getResults());
    setSettings(storageService.getSettings());

    const savedUser = storageService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Login handler
  const handleLogin = (user) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
    setViewSummaryResult(null);
    setActiveExam(null);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
    setActiveExam(null);
    setViewSummaryResult(null);
  };

  // Mulai Ujian untuk Siswa (Melakukan Pengacakan Soal per Kategori & Opsi)
  const handleStartExam = (exam) => {
    // Siapkan soal dengan pengacakan sesuai kategori dan opsi
    const prepared = prepareExamQuestions(questions, {
      shuffleQuestionsByCategory: exam.shuffleQuestionsByCategory,
      shuffleOptions: exam.shuffleOptions,
      allowedCategories: exam.categories
    });

    setActivePreparedQuestions(prepared);
    setActiveExam(exam);
    setViewSummaryResult(null);
  };

  // Selesai Ujian
  const handleFinishExam = (finalResult) => {
    setActiveExam(null);
    setActivePreparedQuestions([]);
    // Update hasil di state aplikasi
    setResults(storageService.getResults());
    setViewSummaryResult(finalResult);
  };

  // Save Users update
  const handleSaveUsers = (newUsers) => {
    setUsers(newUsers);
    storageService.saveUsers(newUsers);
  };

  // Save Questions update
  const handleSaveQuestions = (newQuestions) => {
    setQuestions(newQuestions);
    storageService.saveQuestions(newQuestions);
  };

  // Save Exams update
  const handleSaveExams = (newExams) => {
    setExams(newExams);
    storageService.saveExams(newExams);
  };

  // Save Settings update
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  // Reset Data to defaults
  const handleResetData = () => {
    if (window.confirm('Reset semua data kembali ke default bawaan?')) {
      storageService.resetToDefaults();
      setUsers(storageService.getUsers());
      setQuestions(storageService.getQuestions());
      setExams(storageService.getExams());
      setResults(storageService.getResults());
      setSettings(storageService.getSettings());
      setActiveExam(null);
      setViewSummaryResult(null);
    }
  };

  // ================= RENDER LOGIC =================

  // 1. Jika Siswa sedang di Ruang Ujian (Fullscreen CBT Room)
  if (currentUser?.role === 'siswa' && activeExam && activePreparedQuestions.length > 0) {
    return (
      <ExamRoom
        currentUser={currentUser}
        exam={activeExam}
        questions={activePreparedQuestions}
        onFinishExam={handleFinishExam}
        settings={settings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Navbar Global */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onResetData={handleResetData}
        settings={settings}
      />

      <main className="flex-1">
        
        {/* Belum Login */}
        {!currentUser && (
          <LoginView
            onLogin={handleLogin}
            users={users}
            settings={settings}
          />
        )}

        {/* Login sebagai SISWA */}
        {currentUser?.role === 'siswa' && (
          <>
            {viewSummaryResult ? (
              <ExamSummary
                result={viewSummaryResult}
                questions={questions}
                onBackToDashboard={() => setViewSummaryResult(null)}
              />
            ) : (
              <StudentDashboard
                currentUser={currentUser}
                exams={exams}
                results={results}
                questions={questions}
                onStartExam={handleStartExam}
                onViewSummary={(res) => setViewSummaryResult(res)}
              />
            )}
          </>
        )}

        {/* Login sebagai GURU */}
        {currentUser?.role === 'guru' && (
          <TeacherDashboard
            currentUser={currentUser}
            questions={questions}
            onSaveQuestions={handleSaveQuestions}
            exams={exams}
            onSaveExams={handleSaveExams}
            results={results}
            settings={settings}
          />
        )}

        {/* Login sebagai ADMIN */}
        {currentUser?.role === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            onSaveUsers={handleSaveUsers}
            questions={questions}
            exams={exams}
            results={results}
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

      </main>

      {/* Global Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 CBT Mindasa • MIN 2 KOTA SURABAYA</span>
          <span className="text-slate-400">Database: Google Drive & Google Sheets API</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
