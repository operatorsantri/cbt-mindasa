import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  ArrowLeft, 
  FileText, 
  Check, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export function ExamSummary({ result, questions = [], onBackToDashboard }) {
  const isPassed = (result.score || 0) >= 75;
  const violations = result.violations || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Top Banner Skor */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center relative overflow-hidden">
        
        {/* Decorative circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-100/50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span>Hasil Asesmen Ujian CBT</span>
          <span>•</span>
          <span className="font-mono">{result.submittedAt}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {result.examTitle || 'Ujian CBT Selesai'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Peserta: <strong className="text-slate-800">{result.studentName}</strong> ({result.className})
        </p>

        {/* Score Circle / Badge */}
        <div className="my-8 flex justify-center">
          <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-8 shadow-inner transition-transform ${
            isPassed 
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
              : 'border-amber-500 bg-amber-50 text-amber-800'
          }`}>
            <span className="text-xs uppercase tracking-wider font-bold">Skor Akhir</span>
            <span className="text-4xl font-black mt-0.5">{result.score}</span>
            <span className="text-[11px] font-semibold">Skala 100</span>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-slate-400 font-medium">Jawaban Benar</div>
            <div className="text-emerald-600 font-bold text-lg mt-0.5 flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{result.correctCount} Soal</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-slate-400 font-medium">Jawaban Salah</div>
            <div className="text-rose-600 font-bold text-lg mt-0.5 flex items-center justify-center space-x-1">
              <XCircle className="w-4 h-4" />
              <span>{result.wrongCount} Soal</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-slate-400 font-medium">Durasi Pengerjaan</div>
            <div className="text-blue-600 font-bold text-lg mt-0.5 flex items-center justify-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{Math.round(result.durationSpentSeconds / 60)} Menit</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-slate-400 font-medium">Pelanggaran</div>
            <div className={`font-bold text-lg mt-0.5 flex items-center justify-center space-x-1 ${
              violations.length === 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              <ShieldAlert className="w-4 h-4" />
              <span>{violations.length} Kali</span>
            </div>
          </div>
        </div>

      </div>

      {/* REKAP & BUKU CATATAN PELANGGARAN SISWA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            violations.length === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Catatan Pelanggaran Siswa Selama Ujian
            </h3>
            <p className="text-xs text-slate-500">
              Sistem proctoring mencatat seluruh perpindahan layar atau kombinasi tombol terlarang.
            </p>
          </div>
        </div>

        <div className="mt-4">
          {violations.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <div>
                <strong>Integritas Sempurna:</strong> Tidak ada pelanggaran yang terdeteksi selama pengerjaan ujian ini. Pertahankan kejujuran Anda!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 font-medium">
                ⚠️ Anda tercatat melakukan <strong>{violations.length} kali pelanggaran</strong>. Laporan ini telah diteruskan ke guru pengawas.
              </div>

              {violations.map((v, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800 flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{v.title}</span>
                    </div>
                    <p className="text-slate-600 mt-1 pl-7">{v.description}</p>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {v.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DETAIL PEMBAHASAN JAWABAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Evaluasi & Pembahasan Lembar Jawaban
            </h3>
            <p className="text-xs text-slate-500">
              Pelajari kembali soal yang telah Anda kerjakan untuk evaluasi belajar mandiri.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-4 space-y-6">
          {questions.map((q, idx) => {
            const studentAns = result.answers ? result.answers[q.id] : null;

            return (
              <div key={q.id} className="pt-6 first:pt-2 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    Nomor {idx + 1} • {q.category}
                  </span>
                  <span className="text-slate-400">
                    Model: <strong className="text-slate-600 uppercase">{q.type}</strong>
                  </span>
                </div>

                <div className="text-sm text-slate-800 font-medium whitespace-pre-line">
                  {q.question}
                </div>

                {/* Display info jawaban */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div>
                    <span className="text-slate-500">Jawaban Anda: </span>
                    <strong className="text-slate-800 font-mono">
                      {typeof studentAns === 'object' ? JSON.stringify(studentAns) : (studentAns || 'Tidak dijawab')}
                    </strong>
                  </div>

                  {q.explanation && (
                    <div className="pt-2 border-t border-slate-200 text-slate-700">
                      <span className="font-bold text-indigo-700">Pembahasan: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Kembali */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-colors inline-flex items-center space-x-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Siswa</span>
        </button>
      </div>

    </div>
  );
}
