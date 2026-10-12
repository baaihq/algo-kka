import React, { useState, useEffect, useCallback } from 'react';
import {
  signOut,
  daftarKelas,
  buatKelas,
  dataKelas,
  type ClassItem,
  type ClassDataResult,
  type TeamSummary
} from '../services/teacher';
import {
  GraduationCap,
  LogOut,
  RefreshCw,
  Plus,
  Users,
  Star,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { ThemeMenu } from './ThemeMenu';
import { DAFTAR_LEVEL } from '../data/levels';

interface TeacherDashboardProps {
  onKeluarDashboard: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onKeluarDashboard
}) => {
  const [listKelas, setListKelas] = useState<ClassItem[]>([]);
  const [kodeKelasTerpilih, setKodeKelasTerpilih] = useState<string>('');
  const [namaKelasBaru, setNamaKelasBaru] = useState<string>('');
  const [kodeBaruDibuat, setKodeBaruDibuat] = useState<string | null>(null);

  const [detailData, setDetailData] = useState<ClassDataResult | null>(null);
  const [timDetailTerbuka, setTimDetailTerbuka] = useState<string | null>(null);

  const [isLoadingKelas, setIsLoadingKelas] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [isCreatingKelas, setIsCreatingKelas] = useState<boolean>(false);
  const [errorPesan, setErrorPesan] = useState<string>('');
  const [suksesSalin, setSuksesSalin] = useState<boolean>(false);

  // Ambil daftar kelas saat pertama kali mount
  const loadKelasList = useCallback(async (preferKode?: string) => {
    setIsLoadingKelas(true);
    setErrorPesan('');
    const data = await daftarKelas();
    setListKelas(data);
    setIsLoadingKelas(false);

    if (data.length > 0) {
      const selected = preferKode && data.some(k => k.kode === preferKode)
        ? preferKode
        : data[0].kode;
      setKodeKelasTerpilih(selected);
    } else {
      setKodeKelasTerpilih('');
      setDetailData(null);
    }
  }, []);

  useEffect(() => {
    loadKelasList();
  }, [loadKelasList]);

  // Ambil detail data kelas terpilih
  const muatDataKelas = useCallback(async (kode: string) => {
    if (!kode) {
      setDetailData(null);
      return;
    }
    setIsLoadingDetail(true);
    setErrorPesan('');
    const res = await dataKelas(kode);
    setIsLoadingDetail(false);

    if (res.error) {
      setErrorPesan(res.error.message);
      setDetailData(null);
    } else {
      setDetailData(res.data);
    }
  }, []);

  useEffect(() => {
    if (kodeKelasTerpilih) {
      muatDataKelas(kodeKelasTerpilih);
    }
  }, [kodeKelasTerpilih, muatDataKelas]);

  // Handler Buat Kelas
  const handleBuatKelas = async (e: React.FormEvent) => {
    e.preventDefault();
    const nama = namaKelasBaru.trim();
    if (!nama) return;

    setIsCreatingKelas(true);
    setErrorPesan('');
    setKodeBaruDibuat(null);

    const res = await buatKelas(nama);
    setIsCreatingKelas(false);

    if (res.error) {
      setErrorPesan(res.error.message);
    } else if (res.data) {
      setNamaKelasBaru('');
      setKodeBaruDibuat(res.data.kode);
      await loadKelasList(res.data.kode);
    }
  };

  // Handler Salin Kode
  const handleSalinKode = (kode: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(kode);
      setSuksesSalin(true);
      setTimeout(() => setSuksesSalin(false), 2000);
    }
  };

  // Handler Logout Guru
  const handleLogout = async () => {
    await signOut();
    onKeluarDashboard();
  };

  // Format Waktu Relatif atau Tanggal Indonesia
  const formatWaktu = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar Pastel Tebal */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-2 border-sky-100 dark:border-slate-800 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <span>Dashboard Guru</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Online
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Monitoring Progres & Evaluasi Percabangan Logika Siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeMenu tampilkanLabel={false} />

            <button
              onClick={() => {
                if (kodeKelasTerpilih) muatDataKelas(kodeKelasTerpilih);
                else loadKelasList();
              }}
              disabled={isLoadingDetail || isLoadingKelas}
              title="Muat Ulang Data"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingDetail ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Muat Ulang</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/80 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Pesan Kesalahan jika ada */}
        {errorPesan && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Terjadi Kesalahan</p>
              <p className="text-xs mt-0.5">{errorPesan}</p>
            </div>
          </div>
        )}

        {/* Section 1: Manajemen Kelas & Buat Kelas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Pilih Kelas Aktif */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-sky-500" />
                  <span>Pilih Kelas Belajar</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pilih kelas untuk melihat progres belajar kelompok siswa
                </p>
              </div>

              {/* Badges Info Jumlah Kelas */}
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
                Total: {listKelas.length} Kelas
              </span>
            </div>

            {isLoadingKelas ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                <span className="text-xs font-medium">Memuat daftar kelas...</span>
              </div>
            ) : listKelas.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Belum Ada Kelas</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Buat kelas pertama Anda di formulir sebelah kanan, lalu bagikan kode kelas unik kepada kelompok siswa.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Selector Dropdown / Radio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {listKelas.map((k) => {
                    const isSelected = k.kode === kodeKelasTerpilih;
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setKodeKelasTerpilih(k.kode)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-sm shadow-sky-500/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-sky-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {k.nama}
                          </span>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="font-mono text-xs font-black tracking-wider px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                            {k.kode}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatWaktu(k.dibuat_pada).split(',')[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Banner Kode Kelas Terpilih untuk Dibagikan ke Siswa */}
                {detailData && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-sky-500/20">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-sky-100 font-bold">
                        Bagikan Kode Kelas Ini ke Murid
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-black font-mono tracking-widest bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm">
                          {detailData.kelas.kode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSalinKode(detailData.kelas.kode)}
                          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer active:scale-95"
                          title="Salin Kode Kelas"
                        >
                          {suksesSalin ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-sky-100 sm:text-right">
                      <p className="font-bold text-white text-sm">{detailData.kelas.nama}</p>
                      <p className="opacity-90">Siswa memasukkan kode ini saat pertama kali memulai ekspedisi.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Buat Kelas Baru */}
          <div className="bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                <span>Buat Kelas Baru</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kode kelas unik (6 karakter) akan dibuat secara otomatis
              </p>

              <form onSubmit={handleBuatKelas} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Nama Kelas / Rombel
                  </label>
                  <input
                    type="text"
                    value={namaKelasBaru}
                    onChange={(e) => setNamaKelasBaru(e.target.value)}
                    placeholder="Contoh: Kelas 7A — Informatika"
                    disabled={isCreatingKelas}
                    required
                    maxLength={50}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500 font-medium transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingKelas || !namaKelasBaru.trim()}
                  className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isCreatingKelas ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Membuat Kelas...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Buat & Dapatkan Kode</span>
                    </>
                  )}
                </button>
              </form>

              {/* Notifikasi Kode Baru */}
              {kodeBaruDibuat && (
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    Kelas berhasil dibuat! Kode kelas Anda:
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-lg font-black tracking-widest text-emerald-700 dark:text-emerald-300">
                      {kodeBaruDibuat}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSalinKode(kodeBaruDibuat)}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              Setiap kelompok siswa yang memakai kode ini datanya akan otomatis tersinkron ke tabel kelas ini.
            </p>
          </div>
        </div>

        {/* Section 2: Tabel Monitoring Progres Siswa */}
        <section className="bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                <span>Monitoring Kelompok Siswa</span>
                {detailData && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {detailData.kelas.nama}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daftar tim, perolehan bintang, status penyelesaian 6 level, dan riwayat uji program
              </p>
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
              <span>Total:</span>
              <span className="px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-black">
                {detailData?.teams.length || 0} Kelompok
              </span>
            </div>
          </div>

          {isLoadingDetail ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              <p className="text-sm font-semibold">Mengambil data progres tim...</p>
            </div>
          ) : !detailData || detailData.teams.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">
                Belum Ada Kelompok Terdaftar di Kelas Ini
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Minta siswa untuk membuka game, memasukkan kode kelas{' '}
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {kodeKelasTerpilih || '...'}
                </span>
                , lalu menguji program mereka. Data akan otomatis masuk ke sini!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tabel Tim */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Nama Kelompok</th>
                      <th className="py-3 px-4 text-center">Total Bintang</th>
                      <th className="py-3 px-4 text-center">Progres Level (6 Level)</th>
                      <th className="py-3 px-4 text-center">Badge / Lencana</th>
                      <th className="py-3 px-4 text-right">Terakhir Aktif</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {detailData.teams.map((tim) => {
                      const isExpanded = timDetailTerbuka === tim.nama_tim;
                      return (
                        <React.Fragment key={tim.nama_tim}>
                          <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            {/* Nama Tim */}
                            <td className="py-3 px-4 font-black text-slate-800 dark:text-white text-sm">
                              {tim.nama_tim}
                            </td>

                            {/* Total Bintang */}
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>{tim.totalBintang}</span>
                              </span>
                            </td>

                            {/* Progres 6 Level (Pip Indicator) */}
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                {DAFTAR_LEVEL.map((lvl, idx) => {
                                  const prog = tim.progressList.find((p) => p.level_id === lvl.id);
                                  const selesai = prog?.selesai;
                                  const btg = prog?.bintang || 0;
                                  return (
                                    <div
                                      key={lvl.id}
                                      title={`${lvl.nama}: ${selesai ? `${btg} ★` : 'Belum selesai'}`}
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                                        selesai
                                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                                      }`}
                                    >
                                      {idx + 1}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>

                            {/* Badges */}
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                                <Award className="w-3.5 h-3.5" />
                                <span>{tim.badges.length} Badge</span>
                              </div>
                            </td>

                            {/* Terakhir Aktif */}
                            <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 font-medium">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{formatWaktu(tim.terakhir_aktif)}</span>
                              </span>
                            </td>

                            {/* Tombol Detail */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setTimDetailTerbuka(isExpanded ? null : tim.nama_tim)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 mx-auto ${
                                  isExpanded
                                    ? 'bg-sky-500 text-white shadow-sm'
                                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span>{isExpanded ? 'Tutup' : 'Detail'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>

                          {/* Baris Accordion Detail Tim */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="bg-sky-50/40 dark:bg-slate-900/80 p-4 md:p-6 border-t border-b border-sky-100 dark:border-slate-800">
                                <DetailTimExpanded tim={tim} formatWaktu={formatWaktu} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

interface DetailTimExpandedProps {
  tim: TeamSummary;
  formatWaktu: (iso?: string) => string;
}

const DetailTimExpanded: React.FC<DetailTimExpandedProps> = ({ tim, formatWaktu }) => {
  return (
    <div className="space-y-5 animate-fade-in text-xs">
      {/* 1. Rincian Progres Per Level */}
      <div>
        <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px] mb-3">
          <BookOpen className="w-4 h-4 text-sky-500" />
          <span>Rincian Capaian 6 Level</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {DAFTAR_LEVEL.map((lvl, index) => {
            const prog = tim.progressList.find((p) => p.level_id === lvl.id);
            const selesai = Boolean(prog?.selesai);
            const bintang = prog?.bintang || 0;
            return (
              <div
                key={lvl.id}
                className={`p-3 rounded-2xl border flex flex-col justify-between ${
                  selesai
                    ? 'bg-white dark:bg-slate-800/90 border-emerald-300 dark:border-emerald-800 shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                    Level {index + 1}
                  </span>
                  <p className="font-bold text-slate-800 dark:text-white truncate" title={lvl.nama}>
                    {lvl.nama}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span
                    className={`font-black text-[11px] flex items-center gap-1 ${
                      selesai ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {selesai ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{selesai ? 'Lulus' : 'Belum'}</span>
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= bintang
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Riwayat 5 Percobaan Terakhir */}
      <div>
        <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px] mb-3">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>5 Percobaan Terakhir (Evaluasi Program)</span>
        </h4>

        {tim.attempts.length === 0 ? (
          <p className="text-slate-400 italic py-2">Belum ada riwayat percobaan yang tercatat untuk tim ini.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Kasus Lulus</th>
                  <th className="py-2.5 px-3 text-center">Petunjuk Digunakan</th>
                  <th className="py-2.5 px-3 text-center">Kegagalan Berturut</th>
                  <th className="py-2.5 px-3 text-center">Bintang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tim.attempts.map((att, idx) => {
                  const levelNama =
                    DAFTAR_LEVEL.find((l) => l.id === att.level_id)?.nama || att.level_id;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-500 dark:text-slate-400 font-mono">
                        {formatWaktu(att.dibuat_pada)}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {levelNama}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${
                            att.semua_lulus
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {att.semua_lulus ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{att.semua_lulus ? 'SEMUA LULUS' : 'GAGAL'}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold">
                        {att.kasus_lulus} / {att.total_kasus}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <HelpCircle className="w-3 h-3 text-amber-500" />
                          <span>{att.petunjuk_terbuka}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-300 font-semibold">
                        {att.gagal_berturut} kali
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center gap-0.5 text-amber-500 font-black">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{att.bintang_diperoleh}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Daftar Badge / Lencana yang Diperoleh */}
      {tim.badges.length > 0 && (
        <div>
          <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px] mb-2">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Lencana yang Diraih ({tim.badges.length})</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {tim.badges.map((b) => (
              <span
                key={b}
                className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-[11px]"
              >
                🏅 {b}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
