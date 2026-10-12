import React, { useState } from 'react';
import {
  signIn,
  type ClassItem
} from '../services/teacher';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ThemeMenu } from './ThemeMenu';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSukses: (daftarKelasAwal: ClassItem[]) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSukses
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorPesan, setErrorPesan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorPesan('Silakan masukkan email dan password guru.');
      return;
    }

    setIsLoading(true);
    setErrorPesan('');

    const res = await signIn(cleanEmail, password);
    setIsLoading(false);

    if (res.error) {
      setErrorPesan(res.error.message || 'Gagal masuk. Periksa kembali email dan password.');
      return;
    }

    // Login berhasil
    onLoginSukses([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Dekorasi Pojok */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeMenu tampilkanLabel={false} />
        </div>

        {/* Header Modal */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-400/30 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Portal Guru
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Masuk dengan akun guru untuk memantau aktivitas, progres, dan skor kelompok siswa.
          </p>
        </div>

        {/* Pesan Error */}
        {errorPesan && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Guru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorPesan) setErrorPesan('');
                }}
                placeholder="guru@sekolah.sch.id"
                disabled={isLoading}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorPesan) setErrorPesan('');
                }}
                placeholder="••••••••"
                disabled={isLoading}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 font-medium transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 active:scale-[0.98] text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl font-semibold text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Siswa</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Tersambung langsung dengan Supabase Auth & Realtime Sync
          </p>
        </div>
      </div>
    </div>
  );
};
