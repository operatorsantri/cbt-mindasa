import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export function LoginView({ onLogin, users = [], settings }) {
  const [roleTab, setRoleTab] = useState('siswa');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmedUser = username.trim().toLowerCase();
    const found = users.find(u =>
      (u.username.toLowerCase() === trimmedUser || (u.nisn && u.nisn === trimmedUser)) &&
      u.password === password &&
      u.role === roleTab
    );
    if (found) {
      onLogin(found);
    } else {
      setErrorMsg('Username/NISN atau kata sandi tidak cocok.');
    }
  };

  const roles = [
    { key: 'siswa',  label: 'Siswa',      icon: User,         color: 'emerald' },
    { key: 'guru',   label: 'Guru',       icon: GraduationCap, color: 'blue'    },
    { key: 'admin',  label: 'Admin',      icon: ShieldCheck,  color: 'violet'  },
  ];

  const colorMap = {
    emerald: { active: 'bg-emerald-600 text-white shadow-emerald-200', dot: 'bg-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' },
    blue:    { active: 'bg-blue-600 text-white shadow-blue-200',       dot: 'bg-blue-500',     btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'     },
    violet:  { active: 'bg-violet-600 text-white shadow-violet-200',   dot: 'bg-violet-500',   btn: 'bg-violet-600 hover:bg-violet-700 focus:ring-violet-500' },
  };

  const active = roles.find(r => r.key === roleTab);
  const activeColor = colorMap[active.color];

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* LEFT PANEL — branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-800 to-teal-700 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-white/5 rounded-full" />

        <img
          src={settings?.schoolLogo || './logo-min2.png'}
          alt="Logo MIN 2 Kota Surabaya"
          className="w-32 h-32 object-contain drop-shadow-2xl mb-6 relative z-10"
        />
        <h1 className="text-3xl font-black tracking-tight text-center leading-tight relative z-10">
          CBT Mindasa
        </h1>
        <p className="mt-2 text-green-200 text-sm font-medium text-center relative z-10">
          {settings?.schoolName || 'MIN 2 KOTA SURABAYA'}
        </p>
        <div className="mt-10 space-y-3 relative z-10 w-full max-w-xs">
          {[
            'Ujian Berbasis Komputer',
            'Pengacakan Soal Otomatis',
            'Sistem Anti-Kecurangan',
            'Analisis Nilai & Rapor Digital',
          ].map(f => (
            <div key={f} className="flex items-center space-x-3 bg-white/10 rounded-xl px-4 py-2.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-300 shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        
        {/* Logo mobile only */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <img
            src={settings?.schoolLogo || './logo-min2.png'}
            alt="Logo MIN 2 Kota Surabaya"
            className="w-20 h-20 object-contain drop-shadow-lg mb-3"
          />
          <h1 className="text-xl font-black text-slate-800">CBT Mindasa</h1>
          <p className="text-xs text-slate-500 mt-0.5">{settings?.schoolName || 'MIN 2 KOTA SURABAYA'}</p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Selamat Datang</h2>
            <p className="text-slate-500 text-sm mt-1">Silakan pilih peran dan masukkan akun Anda.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setRoleTab(key); setErrorMsg(''); }}
                className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  roleTab === key
                    ? `${colorMap[color].active} border-transparent shadow-lg`
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {roleTab === 'siswa' ? 'Username atau NISN' : 'Username'}
              </label>
              <input
                type="text"
                required
                placeholder={roleTab === 'siswa' ? 'Contoh: siswa1 atau 0085432101' : roleTab === 'guru' ? 'Contoh: guru1' : 'Contoh: admin'}
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-400 focus:border-blue-400 transition pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center space-x-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer shadow-md ${activeColor.btn}`}
            >
              <span>Masuk sebagai {active.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            © 2026 CBT Mindasa • {settings?.schoolName || 'MIN 2 KOTA SURABAYA'}
          </p>
        </div>
      </div>
    </div>
  );
}
