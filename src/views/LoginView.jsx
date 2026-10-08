import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export function LoginView({ onLogin, users = [], settings }) {
  const [roleTab, setRoleTab] = useState('siswa'); // 'siswa' | 'guru' | 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim().toLowerCase();
    const found = users.find(u => 
      (u.username.toLowerCase() === trimmedUser || (u.nisn && u.nisn === trimmedUser)) && 
      u.password === password
    );

    if (found) {
      onLogin(found);
    } else {
      setErrorMsg('Username/NISN atau kata sandi tidak cocok. Silakan periksa kembali!');
    }
  };

  const handleQuickLogin = (demoRole) => {
    const demoUser = users.find(u => u.role === demoRole);
    if (demoUser) {
      onLogin(demoUser);
    } else {
      setErrorMsg(`Akun demo ${demoRole} tidak ditemukan.`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-50/40">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        
        {/* Logo Resmi MIN 2 Kota Surabaya */}
        <div className="flex justify-center mb-4">
          <img
            src={settings?.schoolLogo || './logo-min2.png'}
            alt="Logo MIN 2 Kota Surabaya"
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </div>

        {/* CBT Badge */}
        <div className="inline-flex items-center space-x-2 bg-green-100/80 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-xs border border-green-200">
          <Sparkles className="w-3.5 h-3.5 text-green-600" />
          <span>Sistem Ujian Berbasis Komputer CBT Mindasa 2026</span>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Portal Masuk CBT Mindasa
        </h2>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          {settings?.schoolName || 'MIN 2 KOTA SURABAYA'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setRoleTab('siswa'); setErrorMsg(''); }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                roleTab === 'siswa' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => { setRoleTab('guru'); setErrorMsg(''); }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                roleTab === 'guru' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Guru</span>
            </button>
            <button
              type="button"
              onClick={() => { setRoleTab('admin'); setErrorMsg(''); }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                roleTab === 'admin' 
                  ? 'bg-white text-purple-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {roleTab === 'siswa' ? 'Username / NISN Siswa' : 'Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={
                    roleTab === 'siswa' ? 'Contoh: siswa1 atau 0085432101' : 
                    roleTab === 'guru' ? 'Contoh: guru1' : 'Contoh: admin'
                  }
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Shortcut */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Masuk Cepat Demo (1-Klik)</span>
              </span>
              <span className="text-[11px] text-slate-400">Siap Uji Langsung</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('siswa')}
                className="p-2.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl text-center transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-emerald-800">Siswa</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Ahmad Rizki</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('guru')}
                className="p-2.5 border border-blue-200 bg-blue-50 hover:bg-blue-100/80 rounded-xl text-center transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-blue-800">Guru</div>
                <div className="text-[10px] text-blue-600 mt-0.5">Budi, M.Pd.</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 border border-purple-200 bg-purple-50 hover:bg-purple-100/80 rounded-xl text-center transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-purple-800">Admin</div>
                <div className="text-[10px] text-purple-600 mt-0.5">Full Control</div>
              </button>
            </div>
          </div>

        </div>

        {/* Feature summary pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
            ✓ 4 Model Soal (PG, PG Kompleks, Menjodohkan, B/S)
          </span>
          <span className="bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
            ✓ Acak Soal per Kategori
          </span>
          <span className="bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
            ✓ Anti-Curang & Proctoring
          </span>
          <span className="bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
            ✓ Google Drive Ready
          </span>
        </div>

      </div>
    </div>
  );
}
