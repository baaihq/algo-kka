/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { TemaPilihan, ambilTemaPilihan, terapkanTema, apakahModeGelapEfektif } from '../services/theme';

interface ThemeMenuProps {
  tampilkanLabel?: boolean;
  className?: string;
}

export const ThemeMenu: React.FC<ThemeMenuProps> = ({
  tampilkanLabel = false,
  className = ''
}) => {
  const [temaAktif, setTemaAktif] = useState<TemaPilihan>(() => ambilTemaPilihan());
  const [isGelap, setIsGelap] = useState<boolean>(() => apakahModeGelapEfektif());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync state dengan DOM & listener sistem
  useEffect(() => {
    const handleUpdate = () => {
      setTemaAktif(ambilTemaPilihan());
      setIsGelap(apakahModeGelapEfektif());
    };

    // Dengarkan event storage atau perubahan tema
    window.addEventListener('storage', handleUpdate);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener?.('change', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      mediaQuery.removeEventListener?.('change', handleUpdate);
    };
  }, []);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePilihTema = (tema: TemaPilihan) => {
    terapkanTema(tema);
    setTemaAktif(tema);
    setIsGelap(apakahModeGelapEfektif());
    setIsOpen(false);
  };

  const getIkonTrigger = () => {
    if (temaAktif === 'system') {
      return <Monitor className="w-4 h-4 text-sky-600 dark:text-sky-300" />;
    }
    if (temaAktif === 'dark' || isGelap) {
      return <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />;
    }
    return <Sun className="w-4 h-4 text-amber-500 dark:text-amber-300" />;
  };

  const getJudulTombol = () => {
    if (temaAktif === 'dark') return 'Mode Gelap Aktif';
    if (temaAktif === 'light') return 'Mode Terang Aktif';
    return `Otomatis (${isGelap ? 'Gelap' : 'Terang'})`;
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      {/* Tombol Pemicu Chunky */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border-2 border-sky-200 border-b-4 border-b-sky-300 active:border-b-0 active:translate-y-1 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700 dark:border-b-slate-900 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        title="Pilih tema tampilan (Terang / Gelap / Sistem)"
        aria-label="Menu Pilihan Tema Tampilan"
        aria-expanded={isOpen}
      >
        {getIkonTrigger()}
        {tampilkanLabel && (
          <span className="hidden sm:inline font-bold text-xs">
            {temaAktif === 'dark' ? 'Gelap' : temaAktif === 'light' ? 'Terang' : 'Auto'}
          </span>
        )}
      </button>

      {/* Menu Pilihan Tema Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-sky-200 dark:border-slate-700 shadow-2xl p-2 z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-sky-100 dark:border-slate-800 mb-1">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tema Tampilan
            </span>
          </div>

          <div className="space-y-1">
            {/* 1. Mode Terang */}
            <button
              type="button"
              onClick={() => handlePilihTema('light')}
              className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                temaAktif === 'light'
                  ? 'bg-amber-100/90 text-amber-950 font-black border-2 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-600'
                  : 'hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-300/60 shadow-2xs">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black">Mode Terang</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Stasiun Siang (Cerah)
                  </div>
                </div>
              </div>
              {temaAktif === 'light' && (
                <Check className="w-4 h-4 text-amber-700 dark:text-amber-300 shrink-0" />
              )}
            </button>

            {/* 2. Mode Gelap */}
            <button
              type="button"
              onClick={() => handlePilihTema('dark')}
              className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                temaAktif === 'dark'
                  ? 'bg-indigo-100/90 text-indigo-950 font-black border-2 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500'
                  : 'hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-300/60 shadow-2xs">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black">Mode Gelap</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Stasiun Kosmis (Malam)
                  </div>
                </div>
              </div>
              {temaAktif === 'dark' && (
                <Check className="w-4 h-4 text-indigo-700 dark:text-indigo-300 shrink-0" />
              )}
            </button>

            {/* 3. Otomatis / Sistem */}
            <button
              type="button"
              onClick={() => handlePilihTema('system')}
              className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                temaAktif === 'system'
                  ? 'bg-sky-100/90 text-sky-950 font-black border-2 border-sky-300 dark:bg-slate-800 dark:text-sky-200 dark:border-sky-500'
                  : 'hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-300 flex items-center justify-center shrink-0 border border-sky-300/60 shadow-2xs">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black">Otomatis</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Ikuti sistem perangkat
                  </div>
                </div>
              </div>
              {temaAktif === 'system' && (
                <Check className="w-4 h-4 text-sky-700 dark:text-sky-300 shrink-0" />
              )}
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-sky-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Status aktif: {getJudulTombol()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
