import React from 'react';
import { Level, Varian, KasusUji, Kejadian } from '../types/game';
import { RobotAlgo, StatusAlgo } from './RobotAlgo';
import { ArenaAnimationOverlay } from './ArenaAnimationOverlay';
import { Info, Gauge, Sparkles, Terminal, Trash2, DoorOpen } from 'lucide-react';
import { samarkanOperator } from '../utils/format';

interface ArenaViewProps {
  level: Level;
  varian: Varian;
  statusAlgo: StatusAlgo;
  sedangJalan: boolean;
  pesanAlgo?: string;
  pesanList?: string[];
  daftarKejadian?: Kejadian[];
  kasusTerpilihIndex: number;
  onPilihKasusIndex: (index: number) => void;
  jejakTerakhir: string[];
  onBersihkanMonitor?: () => void;
  tampilkanOperator?: boolean;
}

export const ArenaView: React.FC<ArenaViewProps> = ({
  level,
  varian,
  statusAlgo,
  sedangJalan,
  pesanAlgo,
  pesanList = [],
  daftarKejadian = [],
  kasusTerpilihIndex,
  onPilihKasusIndex,
  jejakTerakhir,
  onBersihkanMonitor,
  tampilkanOperator = false
}) => {
  const kasusAktif: KasusUji | undefined = varian.dataUji[kasusTerpilihIndex] || varian.dataUji[0];
  const isGerbangTerbuka =
    statusAlgo === 'izinkan' ||
    statusAlgo === 'buka' ||
    daftarKejadian.some((k) => k.tipe === 'izinkan' || k.tipe === 'buka');

  return (
    <div className="bg-white/95 border-2 border-sky-200/90 rounded-3xl shadow-lg p-3 md:p-4 flex flex-col gap-3 backdrop-blur-sm">
      {/* 1. SENSOR INPUT STASIUN — POSISI PALING ATAS, SANGAT MENCOLOK, KONTRAS TINGGI & BESAR */}
      <div className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 border-4 border-amber-600 rounded-3xl p-4 md:p-5 shadow-lg ring-4 ring-amber-400/80 animate-in fade-in select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-500/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-700"></span>
            </span>
            <div className="flex items-center gap-2 text-sm md:text-base font-black uppercase text-amber-950 tracking-wide font-mono">
              <Sparkles className="w-5 h-5 text-amber-800 animate-pulse" />
              <span>SENSOR INPUT STASIUN</span>
            </div>
            <span className="bg-amber-500 text-slate-950 text-xs md:text-sm font-mono font-black px-3 py-1 rounded-full border-2 border-amber-700 shadow-xs">
              KASUS #{kasusTerpilihIndex + 1} DARI {varian.dataUji.length}
            </span>
          </div>

          {/* Pemilih Kasus Uji Chunky Berukuran Besar (#1, #2, dst.) */}
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-black text-amber-950 uppercase tracking-wide">PILIH KASUS:</span>
            <div className="flex items-center gap-1.5">
              {varian.dataUji.map((kasus, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPilihKasusIndex(idx)}
                  className={`min-h-[42px] min-w-[42px] px-3.5 py-1 rounded-2xl text-xs md:text-sm font-mono font-black transition-all cursor-pointer shadow-sm ${
                    kasusTerpilihIndex === idx
                      ? 'bg-amber-600 text-white ring-3 ring-amber-300 border-2 border-amber-800 scale-105 shadow-md'
                      : 'bg-white text-slate-800 hover:bg-amber-100 border-2 border-amber-400'
                  }`}
                  title={`Periksa data sensor kasus ke-${idx + 1}`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nilai Sensor Input Ditampilkan Ekstra Besar & Kontras Tinggi */}
        {kasusAktif && (
          <div className="mt-3.5 flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-black uppercase text-amber-950 tracking-wider">
              <span>DATA INPUT SENSOR:</span>
            </div>
            {Object.entries(kasusAktif.data).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border-3 border-amber-600 shadow-md animate-in fade-in"
              >
                <span className="text-slate-800 font-black text-sm md:text-base font-mono uppercase tracking-wide">
                  {k} =
                </span>
                <span className="text-amber-950 font-black text-xl md:text-3xl font-mono bg-amber-200 border-2 border-amber-400 px-4 py-0.5 rounded-xl shadow-inner tracking-wider">
                  &quot;{v}&quot;
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Keterangan & Penjelasan Kasus Uji */}
        <div className="text-xs md:text-sm text-amber-950 font-extrabold mt-3 bg-amber-100/95 p-3 rounded-2xl border-2 border-amber-400 leading-snug flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-lg shrink-0">💡</span>
            <span>{kasusAktif?.keterangan}</span>
          </div>
          <span className="text-[11px] font-sans font-black bg-amber-300/80 px-2.5 py-0.5 rounded-lg text-amber-950 border border-amber-500">
            Periksa kecocokan data ini pada aturan logika di bawah ⬇
          </span>
        </div>
      </div>

      {/* 2. Baris Informasi: Situasi, Ringkasan & Aturan Level (Menara Bug Pastel Card) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-sky-100 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase tracking-wide">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Misi Stasiun: {level.nama}</span>
          </div>

          {/* Ringkasan Level (WAJIB DIPERTAHANKAN) */}
          {varian.ringkasan && (
            <div className="text-sky-800 font-extrabold text-sm md:text-base mt-0.5">
              {varian.ringkasan}
            </div>
          )}

          {/* Kalimat skenario (konteks) */}
          {varian.konteks && (
            <p className="text-xs md:text-sm text-slate-600 mt-1 leading-snug">
              {varian.konteks}
            </p>
          )}

          {/* Aturan Level (WAJIB DIPERTAHANKAN) disajikan dalam chip pastel rapi */}
          {varian.aturan && varian.aturan.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {varian.aturan.map((at, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-mono font-bold text-xs">{idx + 1}.</span>
                  <span className="text-amber-800 font-black uppercase tracking-wider text-[11px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                    JIKA
                  </span>
                  <span className="font-mono bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold px-2 py-0.5 rounded text-xs shadow-xs">
                    {tampilkanOperator ? at.jika : samarkanOperator(at.jika)}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">→</span>
                  <span className="font-mono bg-sky-50 border border-sky-300 text-sky-800 font-bold px-2 py-0.5 rounded text-xs shadow-xs">
                    {at.maka}
                  </span>
                  {at.selainItu && (
                    <>
                      <span className="text-slate-400 text-xs mx-0.5">·</span>
                      <span className="text-rose-800 font-black uppercase tracking-wider text-[11px] bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300">
                        SELAIN ITU
                      </span>
                      <span className="text-slate-400 text-xs font-bold">→</span>
                      <span className="font-mono bg-rose-50 border border-rose-300 text-rose-800 font-bold px-2 py-0.5 rounded text-xs shadow-xs">
                        {at.selainItu}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {!tampilkanOperator && (
            <p className="text-[11px] text-amber-700 font-semibold italic mt-1.5">
              🔎 Operator disembunyikan — buka Petunjuk atau coba 3× untuk melihatnya.
            </p>
          )}
        </div>
      </div>

      {/* 2. Panggung Diorama Isometrik 2.5D ala MENARA BUG */}
      <div className="relative rounded-2xl border-2 border-sky-200 overflow-hidden min-h-[250px] md:min-h-[300px] bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50/60 p-3 md:p-4 flex flex-col justify-between select-none">
        {/* Dekorasi Langit & Awan Berawan Melayang (Pastel Clouds) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Awan Kiri Atas */}
          <div className="absolute -top-4 left-6 anim-cloud-slow opacity-85">
            <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
              <path
                d="M20 38 Q5 38 5 25 Q5 12 22 12 Q28 2 45 4 Q60 6 62 16 Q72 14 80 22 Q95 22 92 38 Z"
                fill="#ffffff"
                opacity="0.9"
              />
            </svg>
          </div>
          {/* Awan Kanan Atas */}
          <div className="absolute top-2 right-8 anim-cloud-fast opacity-80">
            <svg width="100" height="42" viewBox="0 0 100 42" fill="none">
              <path
                d="M15 32 Q4 32 4 20 Q4 10 18 10 Q24 2 38 4 Q50 6 52 14 Q60 12 68 18 Q80 18 78 32 Z"
                fill="#ffffff"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* SVG Diorama Pulau Melayang Isometrik 2.5D (Isometric Floating Island) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none anim-island-hover">
          <svg
            viewBox="0 0 700 340"
            className="w-full h-full max-h-[340px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="cliffGradLeft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="cliffGradRight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="grassGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="gateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* 1. Tebing Bawah Pulau Melayang (2.5D Cliff Drop Strata) */}
            <path
              d="M 120 180 L 350 295 L 350 325 L 120 210 Z"
              fill="url(#cliffGradLeft)"
            />
            <path
              d="M 350 295 L 580 180 L 580 210 L 350 325 Z"
              fill="url(#cliffGradRight)"
            />
            <path
              d="M 170 205 L 350 295 L 530 205"
              stroke="#64748b"
              strokeWidth="2.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 230 235 L 350 295 L 470 235"
              stroke="#475569"
              strokeWidth="2.5"
              fill="none"
              opacity="0.6"
            />

            {/* 2. Permukaan Atas Pulau Isometrik (Lawn Surface) */}
            <polygon
              points="350,65 580,180 350,295 120,180"
              fill="url(#grassGrad)"
              stroke="#6ee7b7"
              strokeWidth="3"
            />

            {/* 3. Grid Ubin Isometrik & Jalur Jalan Menuju Gerbang */}
            <polygon
              points="350,115 450,165 350,215 250,165"
              fill="url(#pathGrad)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <polygon
              points="350,215 400,240 350,265 300,240"
              fill="url(#pathGrad)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {/* 4. Pohon-Pohon Bulat Pastel Imut */}
            <g transform="translate(180, 130)">
              <rect x="18" y="32" width="6" height="16" fill="#a16207" rx="2" />
              <circle cx="21" cy="22" r="18" fill="#4ade80" />
              <circle cx="16" cy="16" r="12" fill="#86efac" />
              <circle cx="14" cy="13" r="3" fill="#ffffff" opacity="0.6" />
            </g>
            <g transform="translate(225, 110)">
              <rect x="10" y="24" width="4" height="12" fill="#a16207" rx="1.5" />
              <circle cx="12" cy="16" r="12" fill="#22c55e" />
              <circle cx="9" cy="12" r="8" fill="#4ade80" />
            </g>
            <g transform="translate(480, 130)">
              <rect x="18" y="32" width="6" height="16" fill="#a16207" rx="2" />
              <circle cx="21" cy="22" r="18" fill="#4ade80" />
              <circle cx="16" cy="16" r="12" fill="#86efac" />
              <circle cx="14" cy="13" r="3" fill="#ffffff" opacity="0.6" />
            </g>
            <g transform="translate(445, 110)">
              <rect x="10" y="24" width="4" height="12" fill="#a16207" rx="1.5" />
              <circle cx="12" cy="16" r="12" fill="#22c55e" />
              <circle cx="9" cy="12" r="8" fill="#4ade80" />
            </g>

            {/* 5. Kristal Beacon Sensor */}
            <g transform="translate(260, 205)">
              <polygon points="10,0 18,12 10,24 2,12" fill="#38bdf8" />
              <polygon points="10,0 18,12 10,24" fill="#0284c7" opacity="0.7" />
              <circle cx="10" cy="8" r="2" fill="#ffffff" />
            </g>
            <g transform="translate(430, 205)">
              <polygon points="10,0 18,12 10,24 2,12" fill="#f59e0b" />
              <polygon points="10,0 18,12 10,24" fill="#d97706" opacity="0.7" />
              <circle cx="10" cy="8" r="2" fill="#ffffff" />
            </g>
            <circle cx="210" cy="180" r="3" fill="#f43f5e" />
            <circle cx="218" cy="184" r="3" fill="#fbbf24" />
            <circle cx="490" cy="180" r="3" fill="#c084fc" />
            <circle cx="482" cy="184" r="3" fill="#f43f5e" />

            {/* 6. GERBANG STASIUN ISOMETRIK */}
            <g id="gerbangStasiun" transform="translate(300, 45)">
              <rect x="0" y="20" width="16" height="75" rx="6" fill="#0284c7" />
              <rect x="2" y="22" width="12" height="71" rx="4" fill="#38bdf8" />
              <rect
                x="6"
                y="30"
                width="4"
                height="50"
                rx="2"
                fill={isGerbangTerbuka ? '#4ade80' : statusAlgo === 'tolak' ? '#f43f5e' : '#bae6fd'}
                className="animate-pulse"
              />

              <rect x="84" y="20" width="16" height="75" rx="6" fill="#0284c7" />
              <rect x="86" y="22" width="12" height="71" rx="4" fill="#38bdf8" />
              <rect
                x="90"
                y="30"
                width="4"
                height="50"
                rx="2"
                fill={isGerbangTerbuka ? '#4ade80' : statusAlgo === 'tolak' ? '#f43f5e' : '#bae6fd'}
                className="animate-pulse"
              />

              <path
                d="M 0 26 Q 50 2 100 26 L 100 38 Q 50 14 0 38 Z"
                fill="#0284c7"
              />
              <path
                d="M 3 28 Q 50 6 97 28 L 97 35 Q 50 13 3 35 Z"
                fill="#38bdf8"
              />
              <circle
                cx="50"
                cy="18"
                r="7"
                fill={isGerbangTerbuka ? '#22c55e' : statusAlgo === 'tolak' ? '#ef4444' : '#e0f2fe'}
                className="animate-pulse"
              />
              <circle cx="50" cy="18" r="4" fill="#ffffff" />

              {/* Daun Pintu Gerbang Geser */}
              <rect
                x={isGerbangTerbuka ? -20 : 16}
                y="38"
                width="34"
                height="55"
                rx="4"
                fill="#0369a1"
                opacity={isGerbangTerbuka ? 0.35 : 0.95}
                className="transition-all duration-500 ease-out"
              />
              <rect
                x={isGerbangTerbuka ? 86 : 50}
                y="38"
                width="34"
                height="55"
                rx="4"
                fill="#0369a1"
                opacity={isGerbangTerbuka ? 0.35 : 0.95}
                className="transition-all duration-500 ease-out"
              />
            </g>
          </svg>
        </div>

        {/* Overlay Animasi Efek Aksi (Gerbang Buka, Perisai Balon, Banner Pesan di Atas) */}
        <ArenaAnimationOverlay
          statusAlgo={statusAlgo}
          sedangJalan={sedangJalan}
          pesanAktif={pesanAlgo}
          pesanList={pesanList}
          daftarKejadian={daftarKejadian}
        />

        {/* Konten Panggung 3 Kolom Responsif dengan Headroom Cukup agar ALGO & PESAN Sama-sama Terlihat Jelas */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 my-auto pt-14 md:pt-16 pb-2">
          {/* Sisi Kiri: Status Dermaga & Gerbang Stasiun */}
          <div className="bg-white/95 border-2 border-sky-300 rounded-2xl p-2.5 shadow-sm text-xs w-full md:w-52 shrink-0 backdrop-blur-xs">
            <div className="text-[10px] font-black uppercase text-sky-800 tracking-wide mb-1.5 flex items-center gap-1.5 border-b border-sky-100 pb-1">
              <DoorOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Gerbang Stasiun</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">Status Akses:</span>
              <span
                className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-lg border ${
                  isGerbangTerbuka
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                    : statusAlgo === 'tolak'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-sky-100 text-sky-800 border-sky-200'
                }`}
              >
                {isGerbangTerbuka ? 'TERBUKA' : statusAlgo === 'tolak' ? 'DITOLAK' : 'SIAGA'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              {isGerbangTerbuka
                ? '✅ Robot ALGO melangkah masuk.'
                : statusAlgo === 'tolak'
                ? '⛔ Perisai stasiun aktif.'
                : 'Menunggu instruksi logika...'}
            </div>
          </div>

          {/* Tengah: Robot ALGO (Chubby Cute Bot) — Posisinya Terbuka Tanpa Tertutup Pesan */}
          <div
            className={`py-1 shrink-0 transition-transform duration-500 my-2 md:my-0 ${
              isGerbangTerbuka ? 'anim-algo-hop' : ''
            }`}
          >
            <RobotAlgo
              status={statusAlgo}
              pesanAktif={pesanAlgo}
              pesanList={pesanList}
            />
          </div>

          {/* Sisi Kanan: Mini Monitor Log Eksekusi */}
          <div className="bg-white/95 border-2 border-sky-300 rounded-2xl p-2.5 md:p-3 shadow-md w-full md:w-56 max-h-36 md:max-h-44 overflow-y-auto font-mono text-[11px] shrink-0 backdrop-blur-xs">
            <div className="text-[10px] text-slate-600 uppercase font-black flex items-center justify-between gap-1 mb-1 border-b border-sky-100 pb-1">
              <div className="flex items-center gap-1 text-sky-800">
                <Terminal className="w-3 h-3 text-sky-600" />
                <span>Monitor ALGO</span>
              </div>
              {onBersihkanMonitor && (
                <button
                  type="button"
                  onClick={onBersihkanMonitor}
                  className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Hapus riwayat monitor"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              )}
            </div>

            {jejakTerakhir.length === 0 ? (
              <p className="text-slate-400 italic text-[10px]">
                Tekan &quot;▶ Jalankan&quot; untuk mengamati alur logika ALGO.
              </p>
            ) : (
              <div className="space-y-1 text-slate-700">
                {jejakTerakhir.map((line, i) => (
                  <div
                    key={i}
                    className={`leading-tight text-[10px] ${
                      line.startsWith('──')
                        ? 'text-sky-700 font-bold border-b border-sky-100 pb-0.5 mt-1'
                        : line.includes('BENAR')
                        ? 'text-emerald-700 font-bold'
                        : line.includes('SALAH')
                        ? 'text-amber-700 font-bold'
                        : line.includes('Perhatian:')
                        ? 'text-rose-700 font-bold bg-rose-50 p-1 rounded border border-rose-200'
                        : line.includes('menjalankan') || line.includes('pesan')
                        ? 'text-sky-700 font-bold'
                        : 'text-slate-600'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
