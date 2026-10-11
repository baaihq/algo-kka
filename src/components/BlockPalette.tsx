import React, { useState } from 'react';
import { Level, Varian, BlokProgram, BlokJika } from '../types/game';
import { Plus, ShieldCheck, DoorOpen, ShieldAlert, MessageSquare, Split, ChevronRight } from 'lucide-react';

interface BlockPaletteProps {
  level: Level;
  varian: Varian;
  hasJikaInProgram: boolean;
  program?: BlokProgram[];
  onAddBlockRoot: (tipe: 'jika_maka' | 'jika_maka_selain_itu' | 'izinkan' | 'tolak' | 'buka' | 'pesan') => void;
  onAddNestedAction: (branch: 'maka' | 'selainItu', tipeAksi: 'izinkan' | 'tolak' | 'buka' | 'pesan', targetJikaId?: string) => void;
  onAddNestedActionDirect?: (jikaId: string, branch: 'maka' | 'selainItu', tipeAksi: 'izinkan' | 'tolak' | 'buka' | 'pesan') => void;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  level,
  varian,
  hasJikaInProgram,
  program = [],
  onAddBlockRoot,
  onAddNestedAction,
  onAddNestedActionDirect
}) => {
  // Modal / selector tujuan penyisipan untuk aksi ketika ada blok JIKA
  const [pendingAction, setPendingAction] = useState<'izinkan' | 'tolak' | 'buka' | 'pesan' | null>(null);
  const [pendingBranch, setPendingBranch] = useState<'maka' | 'selainItu' | null>(null);

  const daftarBlokJika = program.filter((b): b is BlokJika => b.tipe === 'jika');

  const handleActionClick = (tipe: 'izinkan' | 'tolak' | 'buka' | 'pesan') => {
    if (hasJikaInProgram) {
      setPendingAction(tipe);
      setPendingBranch(null);
    } else {
      onAddBlockRoot(tipe);
    }
  };

  const handleSelectBranch = (branch: 'maka' | 'selainItu') => {
    if (!pendingAction) return;

    if (daftarBlokJika.length > 1) {
      // Jika lebih dari satu blok JIKA, tampilkan pilihan blok tujuan
      setPendingBranch(branch);
    } else {
      // Jika hanya ada 1 blok JIKA (atau tidak ada), perilaku tetap sama
      if (daftarBlokJika.length === 1 && onAddNestedActionDirect) {
        onAddNestedActionDirect(daftarBlokJika[0].id, branch, pendingAction);
      } else {
        onAddNestedAction(branch, pendingAction);
      }
      setPendingAction(null);
      setPendingBranch(null);
    }
  };

  const handleSelectTargetJika = (jikaId: string) => {
    if (!pendingAction || !pendingBranch) return;

    if (onAddNestedActionDirect) {
      onAddNestedActionDirect(jikaId, pendingBranch, pendingAction);
    } else {
      onAddNestedAction(pendingBranch, pendingAction, jikaId);
    }
    setPendingAction(null);
    setPendingBranch(null);
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border-t-2 border-sky-200 dark:border-slate-800 p-3 md:p-4 rounded-t-3xl shadow-xl backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
          <span className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Palet Blok Perintah (Tap untuk Memasang)
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
          Ketuk blok chunky untuk menyusun logika robot ALGO
        </span>
      </div>

      {/* Daftar Tombol Blok Chunky Pastel ala MENARA BUG */}
      <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
        {/* 1. Blok Struktur: JIKA ... MAKA (Peach Pastel Chunky) */}
        {level.palet.includes('jika_maka') && (
          <button
            type="button"
            onClick={() => onAddBlockRoot('jika_maka')}
            className="min-h-[46px] px-4 py-2.5 bg-amber-100 hover:bg-amber-200 active:translate-y-1 active:border-b-0 border-2 border-amber-300 border-b-4 border-b-amber-400 text-amber-950 font-black text-xs md:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            title="Tambah struktur JIKA MAKA"
          >
            <Split className="w-4 h-4 text-amber-600" />
            <span>JIKA ... MAKA</span>
            <Plus className="w-4 h-4 text-amber-600 ml-0.5" />
          </button>
        )}

        {/* 2. Blok Struktur: JIKA ... MAKA ... SELAIN ITU (Warm Orange Pastel Chunky) */}
        {level.palet.includes('jika_maka_selain_itu') && (
          <button
            type="button"
            onClick={() => onAddBlockRoot('jika_maka_selain_itu')}
            className="min-h-[46px] px-4 py-2.5 bg-orange-100 hover:bg-orange-200 active:translate-y-1 active:border-b-0 border-2 border-orange-300 border-b-4 border-b-orange-400 text-orange-950 font-black text-xs md:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            title="Tambah struktur JIKA MAKA SELAIN ITU"
          >
            <Split className="w-4 h-4 text-orange-600" />
            <span>JIKA ... MAKA ... SELAIN ITU</span>
            <Plus className="w-4 h-4 text-orange-600 ml-0.5" />
          </button>
        )}

        {/* 3. Blok Aksi: Izinkan Masuk (Mint Pastel Chunky) */}
        {level.palet.includes('izinkan') && (
          <button
            type="button"
            onClick={() => handleActionClick('izinkan')}
            className="min-h-[46px] px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 active:translate-y-1 active:border-b-0 border-2 border-emerald-300 border-b-4 border-b-emerald-400 text-emerald-950 font-black text-xs md:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            title="Tambah aksi Izinkan Masuk"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Izinkan Masuk</span>
            <Plus className="w-4 h-4 text-emerald-600 ml-0.5" />
          </button>
        )}

        {/* 4. Blok Aksi: Buka Gerbang (Cyan/Sky Pastel Chunky) */}
        {level.palet.includes('buka') && (
          <button
            type="button"
            onClick={() => handleActionClick('buka')}
            className="min-h-[46px] px-4 py-2.5 bg-sky-100 hover:bg-sky-200 active:translate-y-1 active:border-b-0 border-2 border-sky-300 border-b-4 border-b-sky-400 text-sky-950 font-black text-xs md:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            title="Tambah aksi Buka Gerbang"
          >
            <DoorOpen className="w-4 h-4 text-sky-600" />
            <span>Buka Gerbang</span>
            <Plus className="w-4 h-4 text-sky-600 ml-0.5" />
          </button>
        )}

        {/* 5. Blok Aksi: Tolak Masuk (Coral Rose Pastel Chunky) */}
        {level.palet.includes('tolak') && (
          <button
            type="button"
            onClick={() => handleActionClick('tolak')}
            className="min-h-[46px] px-4 py-2.5 bg-rose-100 hover:bg-rose-200 active:translate-y-1 active:border-b-0 border-2 border-rose-300 border-b-4 border-b-rose-400 text-rose-950 font-black text-xs md:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            title="Tambah aksi Tolak Masuk"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Tolak Masuk</span>
            <Plus className="w-4 h-4 text-rose-600 ml-0.5" />
          </button>
        )}

        {/* 6. Blok Aksi: Tampilkan Pesan (Lavender Pastel Chunky) */}
        {level.palet.includes('pesan') && (
          <button
            type="button"
            onClick={() => handleActionClick('pesan')}
            className="min-h-[46px] px-4 py-2.5 bg-purple-100 hover:bg-purple-200 active:translate-y-1 active:border-b-0 border-2 border-purple-300 border-b-4 border-b-purple-400 text-purple-950 font-black text-xs md:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            title="Tambah aksi Tampilkan Pesan"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>Tampilkan Pesan</span>
            <Plus className="w-4 h-4 text-purple-600 ml-0.5" />
          </button>
        )}
      </div>

      {/* Popover Chunky Pastel Penempatan Aksi (Multi-JIKA Selector) */}
      {pendingAction && (
        <div className="mt-3 p-3 bg-sky-50 dark:bg-slate-800/90 border-2 border-sky-300 dark:border-slate-700 rounded-2xl shadow-md animate-in fade-in slide-in-from-bottom duration-200 transition-colors">
          {!pendingBranch ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Pilih posisi penempatan untuk blok &quot;{pendingAction}&quot;:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPendingAction(null);
                    setPendingBranch(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold px-2 py-1 cursor-pointer"
                >
                  Batal
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectBranch('maka')}
                  className="min-h-[44px] p-2 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 border-b-4 border-b-emerald-400 text-emerald-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Di dalam MAKA (BENAR)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>

                {level.palet.includes('jika_maka_selain_itu') && (
                  <button
                    type="button"
                    onClick={() => handleSelectBranch('selainItu')}
                    className="min-h-[44px] p-2 bg-rose-100 hover:bg-rose-200 border-2 border-rose-300 border-b-4 border-b-rose-400 text-rose-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Di dalam SELAIN ITU (SALAH)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-rose-700" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onAddBlockRoot(pendingAction);
                    setPendingAction(null);
                    setPendingBranch(null);
                  }}
                  className="min-h-[44px] p-2 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-slate-400 dark:border-b-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Di Luar (Program Utama)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Pilih blok keputusan tujuan di dalam{' '}
                  <span className={pendingBranch === 'maka' ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-rose-700 dark:text-rose-400 font-extrabold'}>
                    {pendingBranch === 'maka' ? 'MAKA' : 'SELAIN ITU'}
                  </span>{' '}
                  untuk &quot;{pendingAction}&quot;:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingBranch(null)}
                    className="text-xs text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 px-2 py-1 cursor-pointer font-bold"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingAction(null);
                      setPendingBranch(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold px-2 py-1 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {daftarBlokJika.map((jika, idx) => (
                  <button
                    key={jika.id}
                    type="button"
                    onClick={() => handleSelectTargetJika(jika.id)}
                    className="min-h-[44px] p-2.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 border-b-4 border-b-amber-400 text-amber-950 rounded-xl text-xs font-black flex items-center justify-between gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <span className="truncate">
                      Keputusan #{idx + 1} ({jika.kondisi.namaData})
                    </span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-amber-700" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
