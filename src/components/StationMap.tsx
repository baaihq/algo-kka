import React, { useState } from 'react';
import { DAFTAR_LEVEL } from '../data/levels';
import { ProgresLevel, TimProfil } from '../types/game';
import { pilihVarianUntukTim } from '../utils/hash';
import { samarkanOperator } from '../utils/format';
import {
  ambilGagalPerLevel,
  ambilKegagalanTotal,
  ambilPernahGagalPerLevel,
  ambilStatusTutorial,
  simpanStatusTutorial,
  ambilLeaderboard
} from '../services/storage';
import { ambilStatusBadgeTim } from '../data/badges';
import { BadgeListModal } from './BadgeListModal';
import { InteractiveTutorial } from './InteractiveTutorial';
import { LeaderboardModal } from './LeaderboardModal';
import { ThemeMenu } from './ThemeMenu';
import {
  Star,
  Lock,
  Play,
  Users,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Sparkles,
  Award,
  Trophy,
  BookOpen,
  Zap,
  AlertCircle,
  Target,
  FileText
} from 'lucide-react';

interface StationMapProps {
  tim: TimProfil;
  progresMap: Record<string, ProgresLevel>;
  onPilihLevel: (levelId: string) => void;
  onGantiTim: (namaTimBaru: string) => void;
  onResetProgres: () => void;
}

export const StationMap: React.FC<StationMapProps> = ({
  tim,
  progresMap,
  onPilihLevel,
  onGantiTim,
  onResetProgres
}) => {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [tutorialSelesai, setTutorialSelesai] = useState<boolean>(() => ambilStatusTutorial());

  // Modal Ganti Tim & Reset Progres (In-App Modals Pastel)
  const [isGantiTimModalOpen, setIsGantiTimModalOpen] = useState(false);
  const [namaTimBaruInput, setNamaTimBaruInput] = useState(tim.namaTim);
  const [errorGantiTim, setErrorGantiTim] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Hitung total bintang
  const totalBintang = Object.values(progresMap).reduce((acc, p) => acc + (p.bintang || 0), 0);

  // Hitung badge tim
  const gagalPerLevel = ambilGagalPerLevel();
  const kegagalanTotal = ambilKegagalanTotal();
  const pernahGagal = ambilPernahGagalPerLevel();
  const badgesTim = ambilStatusBadgeTim(progresMap, gagalPerLevel, kegagalanTotal, pernahGagal);
  const badgeTerbukaCount = badgesTim.filter((b) => b.terbuka).length;

  // Leaderboard data
  const leaderboardEntries = ambilLeaderboard({
    namaTim: tim.namaTim,
    bintang: totalBintang,
    badgeCount: badgeTerbukaCount
  });

  const handleSelesaiTutorial = () => {
    simpanStatusTutorial(true);
    setTutorialSelesai(true);
    setIsTutorialOpen(false);
  };

  const handleBukaGantiTim = () => {
    setNamaTimBaruInput(tim.namaTim);
    setErrorGantiTim('');
    setIsGantiTimModalOpen(true);
  };

  const handleSimpanNamaTimBaru = (e: React.FormEvent) => {
    e.preventDefault();
    const bersih = namaTimBaruInput.trim();
    if (!bersih) {
      setErrorGantiTim('Nama kelompok tidak boleh kosong.');
      return;
    }
    if (bersih.length < 2) {
      setErrorGantiTim('Nama kelompok minimal 2 karakter.');
      return;
    }
    if (bersih.length > 30) {
      setErrorGantiTim('Nama kelompok maksimal 30 karakter.');
      return;
    }
    onGantiTim(bersih);
    setIsGantiTimModalOpen(false);
  };

  const handleKonfirmasiReset = () => {
    onResetProgres();
    setTutorialSelesai(false);
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col p-4 md:p-6 max-w-4xl mx-auto select-none transition-colors">
      {/* Header Bar Stasiun Pastel */}
      <header className="bg-white/95 dark:bg-slate-900/95 border-2 border-sky-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-6 h-6 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">Kelompok Penjelajah</div>
            <h2
              className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[280px]"
              title={tim.namaTim}
            >
              {tim.namaTim}
            </h2>
          </div>
        </div>

        {/* Bintang, Badge, Leaderboard, Tema & Tombol Header Chunky */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-wrap">
          {/* Badge Total Bintang */}
          <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 px-3 py-2 rounded-2xl border-2 border-amber-300 dark:border-amber-700 border-b-4 border-b-amber-400 dark:border-b-amber-800">
            <Star className="w-4 h-4 fill-amber-500 text-amber-600 dark:text-amber-400" />
            <span className="font-mono font-black text-amber-950 dark:text-amber-200 text-xs md:text-sm">
              {totalBintang} / 18 ⭐
            </span>
          </div>

          {/* Tombol Koleksi Badge Tim */}
          <button
            type="button"
            onClick={() => setIsBadgeModalOpen(true)}
            className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-950/50 dark:hover:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700 border-b-4 border-b-yellow-400 dark:border-b-yellow-800 active:border-b-0 active:translate-y-1 px-3 py-2 rounded-2xl text-xs font-black text-yellow-950 dark:text-yellow-200 transition-all cursor-pointer shadow-xs"
            title="Lihat koleksi badge pencapaian kelompok"
          >
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Badge ({badgeTerbukaCount}/{badgesTim.length})</span>
          </button>

          {/* Tombol Leaderboard */}
          <button
            type="button"
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-1.5 bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/50 dark:hover:bg-sky-900/50 border-2 border-sky-300 dark:border-sky-700 border-b-4 border-b-sky-400 dark:border-b-sky-800 active:border-b-0 active:translate-y-1 px-3 py-2 rounded-2xl text-xs font-black text-sky-950 dark:text-sky-200 transition-all cursor-pointer shadow-xs"
            title="Lihat Papan Peringkat Kelompok"
          >
            <Trophy className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            <span>Top Kelompok</span>
          </button>

          {/* Menu Pilihan Tema (Dark Mode / Light Mode / Auto) */}
          <ThemeMenu tampilkanLabel={true} />

          <button
            type="button"
            onClick={handleBukaGantiTim}
            className="min-h-[42px] px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-black text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Ganti kelompok"
          >
            Ganti Kelompok
          </button>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="min-h-[42px] px-3 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 border-2 border-rose-300 dark:border-rose-700 rounded-2xl text-xs font-black text-rose-800 dark:text-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset progres level"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Hero Peta Stasiun Menara Bug */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 border-2 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200 text-xs font-mono font-black uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Peta Ekspedisi: Sektor Stasiun Logika ALGO</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 font-fredoka">
          Peta Misi Pembelajaran
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
          Selesaikan setiap stasiun secara berurutan. Robot ALGO membutuhkan logika percabanganmu untuk membuka pintu gerbang stasiun berikutnya!
        </p>
      </div>

      {/* Modul Tutorial Interaktif Pastel */}
      <div className="mb-6 p-4 md:p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 w-full sm:w-auto min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 shrink-0 shadow-2xs">
            <BookOpen className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full shrink-0">
                Pelatihan Awal
              </span>
              {tutorialSelesai ? (
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-black whitespace-nowrap bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  ✓ Telah Dipelajari
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 font-black whitespace-nowrap bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                  ★ Disarankan Sebelum Misi 1
                </span>
              )}
            </div>
            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
              Tutorial Interaktif: Cara Kerja JIKA–MAKA–SELAIN ITU
            </h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mt-1">
              Pelajari alur keputusan logika robot ALGO melalui simulasi visual 1-arah dan 2-arah sebelum memulai ekspedisi stasiun.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTutorialOpen(true)}
          className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 active:border-b-0 active:translate-y-1 text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-indigo-600 border-b-4 border-b-indigo-700 shadow-md shrink-0"
        >
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>{tutorialSelesai ? 'Buka Kembali Tutorial' : 'Mulai Tutorial Interaktif'}</span>
        </button>
      </div>

      {/* Grid Level Stasiun (Pastel Floating Island Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1">
        {DAFTAR_LEVEL.map((lvl, idx) => {
          const progres = progresMap[lvl.id];
          const levelSebelumnya = idx > 0 ? DAFTAR_LEVEL[idx - 1] : null;
          const levelSebelumnyaSelesai = levelSebelumnya
            ? progresMap[levelSebelumnya.id]?.selesai
            : true;

          const terbuka = idx === 0 || levelSebelumnyaSelesai;
          const sudahSelesai = Boolean(progres?.selesai);
          const bintangDiperoleh = progres?.bintang || 0;

          const varianIndex = pilihVarianUntukTim(tim.namaTim, lvl.id, lvl.varian.length);
          const varianAktif = lvl.varian[varianIndex];

          const gagalCount = ambilGagalPerLevel()[lvl.id] || 0;
          const tampilkanOperatorCard = sudahSelesai || gagalCount >= 3;
          const isLevelSulit = lvl.id.endsWith('-sulit');

          return (
            <div
              key={lvl.id}
              className={`relative rounded-3xl p-5 md:p-6 border-2 transition-all flex flex-col justify-between overflow-hidden ${
                terbuka
                  ? sudahSelesai
                    ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-300 dark:border-emerald-600/80 shadow-sm'
                    : 'bg-white/95 dark:bg-slate-900/95 border-amber-300 dark:border-amber-600/80 shadow-sm'
                  : 'bg-slate-100/80 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 opacity-75'
              }`}
            >
              {/* Badge Status Pojok Kanan Atas */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  MISI #{idx + 1}
                </span>

                {terbuka ? (
                  sudahSelesai ? (
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-3 py-1 rounded-full text-emerald-900 dark:text-emerald-200 font-black text-xs shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{bintangDiperoleh} ⭐ Selesai</span>
                    </div>
                  ) : (
                    <span className="bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-black text-xs px-3 py-1 rounded-full shadow-2xs">
                      Tersedia
                    </span>
                  )
                ) : (
                  <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400 font-bold text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Terkunci</span>
                  </div>
                )}
              </div>

              {/* Konten Utama Level */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-2xs ${
                      terbuka
                        ? lvl.palet.includes('jika_maka_selain_itu')
                          ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                          : 'bg-sky-100 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300'
                        : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {lvl.ikon === 'Cpu' ? <Cpu className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                      {lvl.nama}
                    </h3>
                    {varianAktif.ringkasan && (
                      <span className="inline-block mt-0.5 text-[11px] font-black bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-700 px-2.5 py-0.5 rounded-full">
                        Skenario: {varianAktif.ringkasan}
                      </span>
                    )}
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      {lvl.palet.includes('jika_maka_selain_itu') ? 'Percabangan 2-Arah (JIKA-MAKA-SELAIN ITU)' : 'Percabangan 1-Arah (JIKA-MAKA)'}
                    </p>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lvl.cerita}
                </p>

                {/* 🌟 KOTAK HIGHLIGHT UTAMA: KETERANGAN MISI & KONDISI WAJIB YANG HARUS DIPENUHI MURID */}
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50/80 to-amber-100/70 dark:from-slate-800/95 dark:via-amber-950/30 dark:to-slate-800/95 border-2 border-amber-400 dark:border-amber-500/80 rounded-2xl p-3.5 md:p-4 shadow-sm ring-2 ring-amber-300/50 dark:ring-amber-500/20 space-y-2.5 transition-all">
                  {/* Header Badge Peringatan / Keterangan Kondisi */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-amber-300/80 dark:border-amber-700/80 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shrink-0 shadow-xs">
                        <Zap className="w-3 h-3 fill-slate-950" />
                      </span>
                      <span className="font-mono font-black text-xs text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                        KETERANGAN & KONDISI WAJIB MISI
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="bg-amber-200/90 dark:bg-amber-900/80 border border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                        Varian #{varianAktif.id} ({varianAktif.dataUji.length} Uji)
                      </span>
                      <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs">
                        Wajib Dipenuhi
                      </span>
                    </div>
                  </div>

                  {/* Keterangan Skenario / Konteks Misi */}
                  {(varianAktif.ringkasan || varianAktif.konteks) && (
                    <div className="bg-white/90 dark:bg-slate-900/80 border border-amber-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 shadow-2xs space-y-1">
                      {varianAktif.ringkasan && (
                        <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-slate-100 text-xs">
                          <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Skenario: {varianAktif.ringkasan}</span>
                        </div>
                      )}
                      {varianAktif.konteks && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-5">
                          {varianAktif.konteks}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Aturan & Kondisi Logika yang Harus Dipenuhi */}
                  {varianAktif.aturan && varianAktif.aturan.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                        <FileText className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        <span>Kondisi Logika yang Harus Diprogram Murid:</span>
                      </div>

                      <div className="space-y-1.5">
                        {varianAktif.aturan.map((at, aIdx) => (
                          <div
                            key={aIdx}
                            className="bg-white dark:bg-slate-900 border-2 border-amber-300/90 dark:border-amber-600/80 rounded-xl p-2 flex flex-wrap items-center gap-1.5 text-xs shadow-xs"
                          >
                            <span className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                              {aIdx + 1}
                            </span>
                            <span className="text-slate-950 font-black uppercase text-[11px] bg-amber-400 px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                              JIKA
                            </span>
                            <span className="font-mono bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-black px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
                              {tampilkanOperatorCard ? at.jika : samarkanOperator(at.jika)}
                            </span>
                            {isLevelSulit ? (
                              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 italic">
                                → Aksi: [Tentukan sendiri dari cerita]
                              </span>
                            ) : (
                              <>
                                <span className="text-amber-700 dark:text-amber-400 font-bold text-xs">→</span>
                                <span className="text-slate-600 dark:text-slate-400 text-[11px] font-bold">MAKA:</span>
                                <span className="font-mono bg-sky-100 dark:bg-sky-950/80 border border-sky-400 dark:border-sky-600 text-sky-950 dark:text-sky-200 font-black px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
                                  {at.maka}
                                </span>
                                {at.selainItu && (
                                  <>
                                    <span className="text-slate-300 dark:text-slate-600 mx-0.5">|</span>
                                    <span className="text-white font-black uppercase text-[11px] bg-rose-500 px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                                      SELAIN ITU
                                    </span>
                                    <span className="text-rose-700 dark:text-rose-400 font-bold text-xs">→</span>
                                    <span className="font-mono bg-rose-100 dark:bg-rose-950/80 border border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-200 font-black px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
                                      {at.selainItu}
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keterangan Peringatan Murid */}
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-300 italic">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Catatan: Pastikan blok perintah yang disusun memenuhi kondisi di atas agar robot ALGO berhasil!</span>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Chunky */}
              {terbuka ? (
                <button
                  type="button"
                  onClick={() => onPilihLevel(lvl.id)}
                  className={`w-full min-h-[46px] rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 ${
                    sudahSelesai
                      ? 'bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:border-b-0 active:translate-y-1 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-slate-700 border-b-4 border-b-sky-400 dark:border-b-slate-900 shadow-xs'
                      : 'bg-amber-400 hover:bg-amber-300 active:border-b-0 active:translate-y-1 text-slate-950 border-amber-500 border-b-4 border-b-amber-600 shadow-md'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{sudahSelesai ? 'Buka Kembali & Latihan' : 'Mulai Memprogram ALGO'}</span>
                </button>
              ) : (
                <div className="w-full min-h-[46px] rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                  <Lock className="w-4 h-4" />
                  <span>Selesaikan {levelSebelumnya ? levelSebelumnya.nama : 'stasiun sebelumnya'} terlebih dahulu</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Koleksi Badge Tim */}
      <BadgeListModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        badges={badgesTim}
        namaTim={tim.namaTim}
        totalBintang={totalBintang}
      />

      {/* Modal Tutorial Interaktif */}
      <InteractiveTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onSelesaiTutorial={handleSelesaiTutorial}
      />

      {/* Modal Leaderboard */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboardEntries}
        currentTeamName={tim.namaTim}
      />

      {/* Modal Ganti Tim Pastel */}
      {isGantiTimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-slate-700 rounded-3xl max-w-md w-full shadow-2xl p-6 text-slate-800 dark:text-slate-100">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1 font-fredoka">Ganti Nama Kelompok</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Progres bintang tetap tersimpan. Masukkan nama kelompok baru:
            </p>
            <form onSubmit={handleSimpanNamaTimBaru} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={30}
                  value={namaTimBaruInput}
                  onChange={(e) => {
                    setNamaTimBaruInput(e.target.value);
                    if (errorGantiTim) setErrorGantiTim('');
                  }}
                  placeholder="Nama kelompok baru (maks. 30 karakter)..."
                  className="w-full min-h-[46px] px-3.5 py-2 bg-sky-50 dark:bg-slate-800 border-2 border-sky-300 dark:border-slate-700 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-sm outline-none placeholder:text-slate-400"
                />
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {errorGantiTim ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{errorGantiTim}</span>
                  ) : (
                    <span>Maksimal 30 karakter</span>
                  )}
                  <span className="font-mono font-bold">{namaTimBaruInput.length}/30</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGantiTimModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-amber-500 border-b-4 border-b-amber-600 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm"
                >
                  Simpan Nama Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Reset Progres Pastel */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-300 dark:border-rose-900 rounded-3xl max-w-md w-full shadow-2xl p-6 text-slate-800 dark:text-slate-100">
            <h3 className="text-lg font-black text-rose-700 dark:text-rose-400 mb-1 font-fredoka">Konfirmasi Reset Progres</h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Hapus seluruh progres dan bintang ekspedisi? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleKonfirmasiReset}
                className="min-h-[44px] px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl border-2 border-rose-600 border-b-4 border-b-rose-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm"
              >
                Ya, Reset Progres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
