import React, { useState } from 'react';
import { RobotAlgo } from './RobotAlgo';
import { ThemeMenu } from './ThemeMenu';
import { Sparkles, Users, ArrowRight, ShieldCheck, KeyRound, GraduationCap } from 'lucide-react';
import { getKodeKelas, setKodeKelas } from '../services/sync';
import { isSupabaseConfigured } from '../services/supabase';

interface TeamScreenProps {
  onMulaiEkspedisi: (namaTim: string) => void;
  namaTimAwal?: string;
  onBukaDashboardGuru?: () => void;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({
  onMulaiEkspedisi,
  namaTimAwal = '',
  onBukaDashboardGuru
}) => {
  const [namaTim, setNamaTim] = useState(namaTimAwal);
  const [kodeKelas, setKodeKelasInput] = useState(() => getKodeKelas() || '');
  const [errorPesan, setErrorPesan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bersihKode = kodeKelas.trim();
    const bersihNama = namaTim.trim();

    if (!bersihKode) {
      setErrorPesan('Masukkan kode kelas terlebih dahulu!');
      return;
    }
    if (bersihKode.length < 4) {
      setErrorPesan('Kode kelas minimal 4 karakter.');
      return;
    }
    if (!bersihNama) {
      setErrorPesan('Masukkan nama kelompok terlebih dahulu!');
      return;
    }
    if (bersihNama.length < 2) {
      setErrorPesan('Nama kelompok minimal 2 karakter.');
      return;
    }
    if (bersihNama.length > 30) {
      setErrorPesan('Nama kelompok maksimal 30 karakter.');
      return;
    }

    setErrorPesan('');
    setKodeKelas(bersihKode);
    onMulaiEkspedisi(bersihNama.slice(0, 30));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none transition-colors">
      {/* Tombol Dashboard Guru di Pojok Kiri Atas (Hanya tampil jika Supabase terkonfigurasi) */}
      <div className="absolute top-4 left-4 z-20">
        {isSupabaseConfigured && onBukaDashboardGuru ? (
          <button
            type="button"
            onClick={onBukaDashboardGuru}
            className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 border-2 border-sky-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2 text-xs font-black cursor-pointer backdrop-blur-xs"
          >
            <GraduationCap className="w-4 h-4 text-sky-500" />
            <span className="hidden sm:inline">Dashboard Guru</span>
          </button>
        ) : (
          <div
            title="Fitur Dashboard Guru online belum dikonfigurasi (VITE_SUPABASE_URL & ANON_KEY kosong)"
            className="px-3 py-1.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 text-slate-400 text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-xs cursor-default"
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="hidden sm:inline">Mode Offline</span>
          </div>
        )}
      </div>

      {/* Tombol Pilihan Tema di Pojok Kanan Atas */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeMenu tampilkanLabel={true} />
      </div>
      {/* Dekorasi Awan Pastel Melayang di Latar Belakang */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-12 anim-cloud-slow opacity-80">
          <svg width="150" height="60" viewBox="0 0 120 50" fill="none">
            <path
              d="M20 38 Q5 38 5 25 Q5 12 22 12 Q28 2 45 4 Q60 6 62 16 Q72 14 80 22 Q95 22 92 38 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div className="absolute top-16 right-16 anim-cloud-fast opacity-75">
          <svg width="130" height="55" viewBox="0 0 100 42" fill="none">
            <path
              d="M15 32 Q4 32 4 20 Q4 10 18 10 Q24 2 38 4 Q50 6 52 14 Q60 12 68 18 Q80 18 78 32 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div className="absolute bottom-12 left-1/4 anim-cloud-slow opacity-60">
          <svg width="180" height="70" viewBox="0 0 120 50" fill="none">
            <path
              d="M20 38 Q5 38 5 25 Q5 12 22 12 Q28 2 45 4 Q60 6 62 16 Q72 14 80 22 Q95 22 92 38 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Kartu Masuk Utama Pastel MENARA BUG */}
      <div className="relative z-10 max-w-lg w-full bg-white/95 dark:bg-slate-900/95 border-2 border-sky-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-md flex flex-col items-center text-center transition-colors">
        {/* Badge Kurikulum (1 Baris Rapi) */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-[10.5px] sm:text-xs font-black uppercase tracking-tight whitespace-nowrap mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Koding &amp; Kecerdasan Artifisial • SMA/MA Kelas X</span>
        </div>

        {/* Robot ALGO Hero (Chubby Cute Design) */}
        <div className="my-2">
          <RobotAlgo status="idle" className="scale-110" />
        </div>

        {/* Judul & Pengantar */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2 mb-0.5 font-fredoka">
          Ekspedisi Kode
        </h1>
        <h2 className="text-sm md:text-base font-black text-sky-700 dark:text-sky-400 tracking-wider mb-2">
          Stasiun Logika ALGO
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Selamat datang di pulau stasiun logika!
          <br />
          Pelajari percabangan algoritma
          <br />
          <span className="inline-flex items-center justify-center gap-1 my-0.5 whitespace-nowrap">
            <span className="text-amber-800 dark:text-amber-300 font-black bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700">
              JIKA
            </span>
            <span>–</span>
            <span className="text-emerald-800 dark:text-emerald-300 font-black bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
              MAKA
            </span>
            <span>–</span>
            <span className="text-rose-800 dark:text-rose-300 font-black bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-700 whitespace-nowrap">
              SELAIN ITU
            </span>
          </span>
          <br />
          bersama robot ALGO.
        </p>

        {/* Form Masuk Tim */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Input Kode Kelas */}
            <div className="space-y-1.5">
              <label
                htmlFor="inputKodeKelas"
                className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Kode Kelas</span>
              </label>
              <input
                id="inputKodeKelas"
                type="text"
                value={kodeKelas}
                onChange={(e) => {
                  setKodeKelasInput(e.target.value.toUpperCase());
                  if (errorPesan) setErrorPesan('');
                }}
                placeholder="Mis. KELAS-10A"
                maxLength={20}
                className="w-full min-h-[48px] px-3.5 py-2.5 bg-sky-50/70 dark:bg-slate-800/80 border-2 border-sky-300 dark:border-slate-700 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 font-mono font-bold text-sm md:text-base outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs tracking-wide uppercase"
              />
            </div>

            {/* Input Nama Kelompok */}
            <div className="space-y-1.5">
              <label
                htmlFor="inputNamaTim"
                className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Nama Kelompok</span>
              </label>
              <input
                id="inputNamaTim"
                type="text"
                value={namaTim}
                onChange={(e) => {
                  setNamaTim(e.target.value);
                  if (errorPesan) setErrorPesan('');
                }}
                placeholder="Isi Nama Kelompok"
                maxLength={30}
                className="w-full min-h-[48px] px-3.5 py-2.5 bg-sky-50/70 dark:bg-slate-800/80 border-2 border-sky-300 dark:border-slate-700 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm md:text-base outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
              />
            </div>
          </div>

          {errorPesan && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-left pl-1 animate-in fade-in">
              {errorPesan}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[50px] bg-amber-400 hover:bg-amber-300 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-base rounded-2xl shadow-md border-2 border-amber-500 border-b-4 border-b-amber-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Mulai Ekspedisi</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>

        {/* Feature Badges (1 Baris Rapi) */}
        <div className="w-full mt-6 pt-5 border-t-2 border-sky-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-bold">
          <div className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-extrabold tracking-wide">Percabangan 1-Arah &amp; 2-Arah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
