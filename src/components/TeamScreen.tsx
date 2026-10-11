import React, { useState } from 'react';
import { RobotAlgo } from './RobotAlgo';
import { Sparkles, Users, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface TeamScreenProps {
  onMulaiEkspedisi: (namaTim: string) => void;
  namaTimAwal?: string;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({
  onMulaiEkspedisi,
  namaTimAwal = ''
}) => {
  const [namaTim, setNamaTim] = useState(namaTimAwal);
  const [errorPesan, setErrorPesan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bersih = namaTim.trim();
    if (!bersih) {
      setErrorPesan('Masukkan nama tim atau nama siswa terlebih dahulu!');
      return;
    }
    if (bersih.length < 2) {
      setErrorPesan('Nama tim minimal 2 karakter.');
      return;
    }
    if (bersih.length > 30) {
      setErrorPesan('Nama tim maksimal 30 karakter.');
      return;
    }
    setErrorPesan('');
    onMulaiEkspedisi(bersih.slice(0, 30));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50/60 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
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
      <div className="relative z-10 max-w-md w-full bg-white/95 border-2 border-sky-200 rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-md flex flex-col items-center text-center">
        {/* Badge Kurikulum */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Koding &amp; Kecerdasan Artifisial • SMA Kelas X</span>
        </div>

        {/* Robot ALGO Hero (Chubby Cute Design) */}
        <div className="my-2">
          <RobotAlgo status="idle" className="scale-110" />
        </div>

        {/* Judul & Pengantar */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-2 mb-0.5 font-fredoka">
          Ekspedisi Kode
        </h1>
        <h2 className="text-sm md:text-base font-black text-sky-700 tracking-wider mb-2">
          Stasiun Logika ALGO
        </h2>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
          Selamat datang di pulau stasiun logika! Pelajari percabangan algoritma <span className="text-amber-800 font-black bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">JIKA</span>–<span className="text-emerald-800 font-black bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">MAKA</span>–<span className="text-rose-800 font-black bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300">SELAIN ITU</span> bersama robot ALGO.
        </p>

        {/* Form Masuk Tim */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="text-left space-y-1.5">
            <label
              htmlFor="inputNamaTim"
              className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>Nama Tim / Peserta Didik</span>
            </label>
            <input
              id="inputNamaTim"
              type="text"
              value={namaTim}
              onChange={(e) => {
                setNamaTim(e.target.value);
                if (errorPesan) setErrorPesan('');
              }}
              placeholder="Contoh: Tim Alfa 10-A, Tim Orion..."
              maxLength={30}
              className="w-full min-h-[48px] px-4 py-2.5 bg-sky-50/70 border-2 border-sky-300 focus:border-amber-400 focus:bg-white rounded-2xl text-slate-900 font-bold text-sm md:text-base outline-none transition-all placeholder:text-slate-400 shadow-2xs"
            />
            {errorPesan && (
              <p className="text-xs text-rose-600 font-bold pl-1 animate-in fade-in">
                {errorPesan}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[50px] bg-amber-400 hover:bg-amber-300 active:translate-y-1 active:border-b-0 text-slate-950 font-black text-base rounded-2xl shadow-md border-2 border-amber-500 border-b-4 border-b-amber-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Mulai Ekspedisi</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </form>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 w-full mt-6 pt-5 border-t-2 border-sky-100 text-[11px] text-slate-600 font-bold">
          <div className="flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-left">Percabangan 1-Arah &amp; 2-Arah</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50 p-2 rounded-xl border border-sky-200">
            <Cpu className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-left">Evaluasi Kasus Otomatis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
