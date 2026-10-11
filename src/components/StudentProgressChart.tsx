import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
} from 'recharts';
import { DAFTAR_LEVEL } from '../data/levels';
import { ProgresLevel } from '../types/game';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Star,
  CheckCircle2,
  Trophy,
  Sparkles,
  Zap
} from 'lucide-react';

interface StudentProgressChartProps {
  progresMap: Record<string, ProgresLevel>;
  namaTim: string;
  onPilihLevel?: (levelId: string) => void;
}

export const StudentProgressChart: React.FC<StudentProgressChartProps> = ({
  progresMap,
  namaTim,
  onPilihLevel
}) => {
  const [activeTab, setActiveTab] = useState<'bar' | 'area' | 'pie'>('bar');

  // Siapkan data per level untuk recharts
  const levelChartData = DAFTAR_LEVEL.map((lvl, index) => {
    const progres = progresMap[lvl.id];
    const selesai = Boolean(progres?.selesai);
    const bintang = progres?.bintang || 0;
    const nomor = index + 1;
    const shortName = `Stasiun ${nomor}`;
    const tipePercabangan = lvl.palet.includes('jika_maka_selain_itu')
      ? '2-Arah (JIKA-MAKA-SELAIN ITU)'
      : '1-Arah (JIKA-MAKA)';

    return {
      id: lvl.id,
      nomor,
      namaLengkap: lvl.nama,
      label: shortName,
      bintang,
      target: 3,
      selesai,
      status: selesai ? (bintang === 3 ? 'Sempurna' : 'Selesai') : 'Belum Selesai',
      tipePercabangan,
      persen: Math.round((bintang / 3) * 100)
    };
  });

  // Hitung data tren akumulasi bintang
  let runningTotal = 0;
  const areaTrendData = levelChartData.map((d) => {
    runningTotal += d.bintang;
    return {
      nomor: `S${d.nomor}`,
      stasiun: d.label,
      nama: d.namaLengkap,
      totalBintang: runningTotal,
      maksBintang: d.nomor * 3
    };
  });

  // Metrik ringkasan
  const totalBintang = levelChartData.reduce((acc, curr) => acc + curr.bintang, 0);
  const maxBintang = DAFTAR_LEVEL.length * 3; // 18 bintang
  const totalSelesai = levelChartData.filter((d) => d.selesai).length;
  const totalSempurna = levelChartData.filter((d) => d.bintang === 3).length;
  const persentaseTotal = Math.round((totalBintang / maxBintang) * 100);

  // Data pie chart status
  const countSempurna = totalSempurna;
  const countSelesaiSebagian = levelChartData.filter((d) => d.selesai && d.bintang < 3).length;
  const countBelumSelesai = DAFTAR_LEVEL.length - totalSelesai;

  const pieData = [
    { name: 'Bintang 3 (Sempurna)', value: countSempurna, color: '#f59e0b' },
    { name: 'Bintang 1-2 (Perlu Peningkatan)', value: countSelesaiSebagian, color: '#38bdf8' },
    { name: 'Belum Selesai', value: countBelumSelesai, color: '#94a3b8' }
  ].filter((d) => d.value > 0);

  // Custom Tooltip untuk Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border-2 border-amber-400 text-xs space-y-1.5 backdrop-blur-md min-w-[200px] animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 gap-2">
            <span className="font-mono font-black text-amber-400 uppercase">
              {data.label}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                data.bintang === 3
                  ? 'bg-amber-400 text-slate-950'
                  : data.selesai
                  ? 'bg-sky-400 text-slate-950'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {data.status}
            </span>
          </div>
          <div className="font-bold text-slate-200 text-xs">
            {data.namaLengkap}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {data.tipePercabangan}
          </div>
          <div className="flex items-center justify-between pt-1 font-mono font-black text-amber-300">
            <span>Bintang:</span>
            <span className="flex items-center gap-1">
              {data.bintang} / 3 ⭐ ({data.persen}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip untuk Area Chart
  const CustomAreaTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border-2 border-emerald-400 text-xs space-y-1 backdrop-blur-md min-w-[190px]">
          <div className="font-mono font-black text-emerald-400 uppercase border-b border-slate-700 pb-1">
            {data.stasiun}: {data.nama}
          </div>
          <div className="flex items-center justify-between pt-1 font-mono text-xs">
            <span className="text-slate-300">Akumulasi Bintang:</span>
            <span className="font-black text-amber-400">{data.totalBintang} ⭐</span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>Target Maksimum:</span>
            <span>{data.maksBintang} ⭐</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-sky-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-sm mb-6 backdrop-blur-md transition-colors select-none">
      {/* Header Bagian Grafik */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-sky-100 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-mono font-black uppercase mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Pantauan Prestasi Belajar</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 font-fredoka flex items-center gap-2">
            <span>Grafik Progres Misi Tim:</span>
            <span className="text-amber-600 dark:text-amber-400 font-extrabold truncate max-w-[200px]">
              {namaTim}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualisasi pencapaian bintang dan penguasaan materi percabangan algoritma di setiap stasiun.
          </p>
        </div>

        {/* Tab Pilihan Grafik */}
        <div className="flex items-center gap-1 bg-sky-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-sky-200 dark:border-slate-700 shrink-0 self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('bar')}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bar'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Tampilkan grafik batang per stasiun"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Per Stasiun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('area')}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'area'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Tampilkan tren akumulasi bintang"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tren Akumulasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pie')}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pie'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Tampilkan ringkasan status kelulusan"
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Distribusi</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Angka KPI Utama (Stat Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3 mb-5">
        {/* KPI 1: Bintang */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs font-black">
            <Star className="w-5 h-5 fill-slate-950 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase text-amber-800 dark:text-amber-300">
              Total Bintang
            </div>
            <div className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
              {totalBintang} <span className="text-xs text-slate-400">/ {maxBintang}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Stasiun Selesai */}
        <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/80 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase text-sky-800 dark:text-sky-300">
              Stasiun Tuntas
            </div>
            <div className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
              {totalSelesai} <span className="text-xs text-slate-400">/ {DAFTAR_LEVEL.length}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Sempurna 3 Bintang */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">
              Skor Sempurna
            </div>
            <div className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
              {totalSempurna} <span className="text-xs text-slate-400">Stasiun</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Persentase Penguasaan */}
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-black">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase text-purple-800 dark:text-purple-300">
              Tingkat Kelulusan
            </div>
            <div className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
              {persentaseTotal}%
            </div>
          </div>
        </div>
      </div>

      {/* Kontainer Grafik Interaktif Recharts */}
      <div className="bg-sky-50/50 dark:bg-slate-950/50 rounded-2xl p-3 md:p-4 border border-sky-100 dark:border-slate-800">
        {activeTab === 'bar' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono mb-2 px-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Jumlah Bintang per Stasiun (Maks. 3 ⭐)
              </span>
              <span className="text-[11px] hidden sm:inline">
                Klik batang stasiun untuk fokus pada level
              </span>
            </div>

            <div className="h-[240px] md:h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={levelChartData}
                  margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis
                    domain={[0, 3]}
                    ticks={[0, 1, 2, 3]}
                    tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="bintang"
                    radius={[8, 8, 0, 0]}
                    onClick={(data) => {
                      if (onPilihLevel && data && data.id) {
                        onPilihLevel(data.id);
                      }
                    }}
                    cursor="pointer"
                  >
                    {levelChartData.map((entry, idx) => {
                      let color = '#94a3b8'; // Slate (belum selesai)
                      if (entry.bintang === 3) {
                        color = '#f59e0b'; // Amber emas (3 bintang)
                      } else if (entry.bintang > 0) {
                        color = '#38bdf8'; // Sky blue (1-2 bintang)
                      }
                      return <Cell key={`cell-${idx}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Kustom */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold mt-2 pt-2 border-t border-sky-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>⭐⭐⭐ Sempurna (3 Bintang)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                <span>⭐ / ⭐⭐ Selesai (1-2 Bintang)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span>Belum Diselesaikan (0 Bintang)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'area' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono mb-2 px-1">
              <span className="font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Tren Pertumbuhan Akumulasi Bintang Misi
              </span>
              <span className="text-[11px] hidden sm:inline">
                Target Sempurna: 18 ⭐
              </span>
            </div>

            <div className="h-[240px] md:h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={areaTrendData}
                  margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis
                    dataKey="stasiun"
                    tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis
                    domain={[0, 18]}
                    tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="totalBintang"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorStars)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 italic mt-2">
              Grafik garis kurva menunjukkan kenaikan total bintang yang berhasil dikumpulkan seiring penyelesaian setiap stasiun.
            </p>
          </div>
        )}

        {activeTab === 'pie' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono mb-2 px-1">
              <span className="font-bold flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-purple-500" />
                Proporsi Status Penyelesaian Stasiun
              </span>
              <span className="text-[11px] hidden sm:inline">
                Total {DAFTAR_LEVEL.length} Stasiun
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="h-[220px] w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-amber-400 text-xs font-mono shadow-md">
                              <span className="font-bold">{data.name}: </span>
                              <span className="font-black text-amber-400">{data.value} Stasiun</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Rincian Status Legend */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-black text-amber-950 dark:text-amber-200">
                      Bintang 3 Sempurna
                    </div>
                    <div className="text-[11px] text-amber-800 dark:text-amber-300">
                      {countSempurna} dari {DAFTAR_LEVEL.length} stasiun ({Math.round((countSempurna / DAFTAR_LEVEL.length) * 100)}%)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-400 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-black text-sky-950 dark:text-sky-200">
                      Bintang 1-2 (Perlu Peningkatan)
                    </div>
                    <div className="text-[11px] text-sky-800 dark:text-sky-300">
                      {countSelesaiSebagian} dari {DAFTAR_LEVEL.length} stasiun ({Math.round((countSelesaiSebagian / DAFTAR_LEVEL.length) * 100)}%)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-400 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-black text-slate-800 dark:text-slate-200">
                      Belum Selesai / Terkunci
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      {countBelumSelesai} dari {DAFTAR_LEVEL.length} stasiun ({Math.round((countBelumSelesai / DAFTAR_LEVEL.length) * 100)}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
