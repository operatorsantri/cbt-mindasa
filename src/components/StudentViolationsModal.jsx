import React from 'react';
import { 
  AlertTriangle, 
  X, 
  Clock, 
  ShieldAlert, 
  EyeOff, 
  Maximize2, 
  Copy, 
  Monitor,
  CheckCircle2
} from 'lucide-react';

export function StudentViolationsModal({ isOpen, onClose, violations = [], maxViolations = 3, studentName = '' }) {
  if (!isOpen) return null;

  const getViolationIcon = (type) => {
    switch (type) {
      case 'pindah_tab':
        return <EyeOff className="w-5 h-5 text-amber-600" />;
      case 'keluar_fullscreen':
        return <Maximize2 className="w-5 h-5 text-rose-600" />;
      case 'tombol_terlarang':
        return <Copy className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getViolationBadge = (type) => {
    switch (type) {
      case 'pindah_tab':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">Pindah Tab / Minimize</span>;
      case 'keluar_fullscreen':
        return <span className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded-full font-medium">Keluar Fullscreen</span>;
      case 'tombol_terlarang':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">Tombol Dilarang</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full font-medium">Pelanggaran Lain</span>;
    }
  };

  const remainingTolerance = Math.max(0, maxViolations - violations.length);
  const isLocked = violations.length >= maxViolations;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isLocked ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLocked ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-snug">
                Buku Catatan Pelanggaran Siswa
              </h3>
              <p className="text-xs text-slate-500">
                {studentName ? `Peserta: ${studentName}` : 'Integritas & Proctoring Ujian'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Box */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Total Pelanggaran Tercatat:</span>
            <span className="font-bold text-base text-rose-600">{violations.length} Kali</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>Batas Toleransi Server:</span>
            <span>Maksimal {maxViolations} Kali</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2.5">
            <div 
              className={`h-full transition-all duration-300 ${
                violations.length === 0 ? 'bg-emerald-500' :
                violations.length < maxViolations ? 'bg-amber-500' : 'bg-rose-600'
              }`}
              style={{ width: `${Math.min(100, (violations.length / maxViolations) * 100)}%` }}
            />
          </div>

          {isLocked ? (
            <div className="mt-2.5 text-xs text-rose-700 bg-rose-100/80 p-2.5 rounded-lg border border-rose-200 font-medium">
              ⚠️ Peringatan Kritis: Anda telah mencapai batas maksimal ({maxViolations}x). Ujian Anda dapat dikunci oleh pengawas sekolah.
            </div>
          ) : (
            <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
              <span>Sisa toleransi peringatan:</span>
              <span className="font-bold text-slate-800">{remainingTolerance} kali kesempatan</span>
            </div>
          )}
        </div>

        {/* Violation List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {violations.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">Belum Ada Pelanggaran!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Luar biasa! Anda menjunjung tinggi integritas ujian dengan tetap berada di layar penuh tanpa membuka tab lain.
              </p>
            </div>
          ) : (
            violations.map((v, index) => (
              <div 
                key={v.id || index}
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-slate-100">
                      {getViolationIcon(v.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">
                        {index + 1}. {v.title || 'Pelanggaran Ujian'}
                      </div>
                      <div className="mt-0.5">
                        {getViolationBadge(v.type)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{v.timestamp || 'Baru saja'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {v.description || 'Aktivitas keluar dari area ujian terdeteksi sistem proctoring otomatis.'}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Log proctoring tersimpan secara real-time ke sistem pengawas.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Tutup & Lanjutkan
          </button>
        </div>

      </div>
    </div>
  );
}
