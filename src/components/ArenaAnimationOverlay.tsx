import React from 'react';
import { StatusAlgo } from './RobotAlgo';
import { Kejadian } from '../types/game';
import { ShieldAlert, DoorOpen, Radio, ScanLine } from 'lucide-react';

interface ArenaAnimationOverlayProps {
  statusAlgo: StatusAlgo;
  sedangJalan: boolean;
  pesanAktif?: string;
  pesanList?: string[];
  daftarKejadian?: Kejadian[];
}

export const ArenaAnimationOverlay: React.FC<ArenaAnimationOverlayProps> = ({
  statusAlgo,
  sedangJalan,
  pesanAktif,
  pesanList = [],
  daftarKejadian = []
}) => {
  const status = statusAlgo || 'idle';

  // Kumpulkan semua pesan unik yang aktif dieksekusi
  const semuaPesan = pesanList.length > 0
    ? pesanList
    : pesanAktif
    ? [pesanAktif]
    : daftarKejadian.filter((k) => k.tipe === 'pesan' && k.nilai).map((k) => k.nilai as string);

  const adaAksiBuka = status === 'izinkan' || status === 'buka' || daftarKejadian.some((k) => k.tipe === 'izinkan' || k.tipe === 'buka');
  const adaAksiTolak = status === 'tolak' || daftarKejadian.some((k) => k.tipe === 'tolak');
  const adaAksiPesan = status === 'pesan' || semuaPesan.length > 0;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20 flex flex-col justify-between">
      {/* 1. Bar Indikator Status & Pesan Logika di Bagian Paling Atas (Tidak Menutupi ALGO) */}
      <div className="pt-2 px-2 flex flex-wrap items-center justify-center gap-1.5 z-30 pointer-events-none">
        {/* Indikator Gerbang Dibuka */}
        {adaAksiBuka && (
          <div className="bg-emerald-600 text-white border-2 border-emerald-300 px-3 py-1 rounded-full shadow-md text-xs md:text-sm font-black flex items-center gap-1.5 animate-in zoom-in-75 duration-300 whitespace-nowrap">
            <DoorOpen className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>GERBANG DIBUKA</span>
          </div>
        )}

        {/* Indikator Akses Ditolak */}
        {adaAksiTolak && (
          <div className="bg-rose-600 text-white border-2 border-rose-300 px-3 py-1 rounded-full shadow-md text-xs md:text-sm font-black flex items-center gap-1.5 animate-in zoom-in-75 duration-300 whitespace-nowrap">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-200 shrink-0" />
            <span>AKSES DITOLAK (PERISAI AKTIF)</span>
          </div>
        )}

        {/* Indikator Pesan Logika (Mendukung 1 atau 2 Kondisi Terpenuhi) */}
        {adaAksiPesan && semuaPesan.length > 0 ? (
          semuaPesan.map((psn, idx) => (
            <div
              key={idx}
              className={`text-white border-2 px-3.5 py-1.5 rounded-full shadow-lg text-xs md:text-sm font-black flex items-center gap-2 animate-in zoom-in-75 duration-300 whitespace-nowrap ${
                idx === 0
                  ? 'bg-purple-600 border-purple-300'
                  : 'bg-indigo-600 border-indigo-300'
              }`}
            >
              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                idx === 0 ? 'bg-purple-800 text-purple-100 border-purple-400' : 'bg-indigo-800 text-indigo-100 border-indigo-400'
              }`}>
                KONDISI #{idx + 1}
              </span>
              <Radio className="w-3.5 h-3.5 text-purple-200 animate-pulse shrink-0" />
              <span>
                PESAN: &quot;{psn}&quot;
              </span>
            </div>
          ))
        ) : adaAksiPesan ? (
          <div className="bg-purple-600 text-white border-2 border-purple-300 px-3.5 py-1.5 rounded-full shadow-lg text-xs md:text-sm font-black flex items-center gap-2 animate-in zoom-in-75 duration-300 whitespace-nowrap">
            <Radio className="w-3.5 h-3.5 text-purple-200 animate-pulse shrink-0" />
            <span>PESAN LOGIKA: &quot;{pesanAktif || '-'}&quot;</span>
          </div>
        ) : null}
      </div>

      {/* 2. Sinar Pindai Sensor Pastel saat Memindai Input */}
      {(sedangJalan || status === 'berpikir') && (
        <div className="absolute inset-x-0 h-10 anim-scan-beam-pastel bg-gradient-to-b from-transparent via-sky-400/25 to-transparent border-b-2 border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] pointer-events-none">
          <div className="absolute right-4 top-1 flex items-center gap-1.5 text-[10px] font-mono text-sky-800 font-black tracking-wider uppercase bg-white/95 px-2.5 py-1 rounded-full border border-sky-200 shadow-sm">
            <ScanLine className="w-3.5 h-3.5 text-sky-500 animate-spin" />
            <span>MEMINDAI SENSOR...</span>
          </div>
        </div>
      )}

      {/* 3. Efek Visual Daun Pintu Geser Isometrik */}
      {adaAksiBuka && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-emerald-100/50 to-transparent anim-gate-left pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-emerald-100/50 to-transparent anim-gate-right pointer-events-none"></div>
        </div>
      )}

      {/* 4. Efek Gelembung Perisai Pastel saat Tolak Masuk */}
      {adaAksiTolak && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-rose-400/80 anim-bubble-pulse bg-rose-300/20 shadow-[0_0_30px_rgba(251,113,133,0.35)] backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-rose-300/60 animate-spin [animation-duration:12s]"></div>
          </div>
        </div>
      )}

      {/* 5. Pancaran Gelombang Sinyal Lavender */}
      {adaAksiPesan && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-purple-400/60 anim-signal-wave bg-purple-300/10"></div>
          <div className="absolute w-32 h-32 rounded-full border-2 border-purple-300/80 anim-signal-wave [animation-delay:0.35s]"></div>
        </div>
      )}
    </div>
  );
};
