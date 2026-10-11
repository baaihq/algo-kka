import React from 'react';
import { Level } from '../types/game';
import { Lightbulb, X, Check, Lock, Unlock, Sparkles, ChevronRight } from 'lucide-react';

interface HintModalProps {
  level: Level;
  isOpen: boolean;
  onClose: () => void;
  jumlahPetunjukTerbuka: number;
  gagalBerturutTurut: number;
  onBukaPetunjukManual?: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  level,
  isOpen,
  onClose,
  jumlahPetunjukTerbuka,
  gagalBerturutTurut,
  onBukaPetunjukManual
}) => {
  if (!isOpen) return null;

  const totalPetunjuk = level.petunjuk.length;
  const terbukaCount = Math.max(0, Math.min(totalPetunjuk, jumlahPetunjukTerbuka));
  const adaPetunjukTerkunci = terbukaCount < totalPetunjuk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 p-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center shrink-0 shadow-inner">
              <Lightbulb className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg flex items-center gap-1.5 font-fredoka">
                <span>Petunjuk Bertahap Logika</span>
              </h3>
              <p className="text-xs text-amber-950 font-bold font-mono">
                {level.nama} • {terbukaCount}/{totalPetunjuk} Petunjuk Terbuka
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-800 hover:text-black rounded-2xl hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Tutup petunjuk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Bantuan Bertahap jika Percobaan Gagal >= 3 */}
        {gagalBerturutTurut >= 3 && (
          <div className="bg-amber-100 border-b-2 border-amber-300 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-950 font-medium">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Bantuan Otomatis Aktif!</strong> Kamu gagal menjalankan uji kasus {gagalBerturutTurut}x berturut-turut. ALGO membuka petunjuk bertahap untuk memandumu.
            </span>
          </div>
        )}

        {/* Isi Petunjuk */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {/* Misi Level */}
          <div className="bg-sky-50 p-3.5 rounded-2xl border-2 border-sky-200 text-xs text-slate-700">
            <span className="font-black text-sky-900 block mb-0.5 uppercase tracking-wider text-[11px]">
              Tujuan Misi ALGO:
            </span>
            <p className="leading-relaxed font-medium">{level.tujuan}</p>
          </div>

          {/* Daftar Petunjuk Bertahap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
              <span>Rangkaian Petunjuk Logika:</span>
              <span className="font-mono text-amber-800 font-bold text-[11px]">
                {terbukaCount === 0 ? 'Belum Ada yang Terbuka' : `Level Bantuan: ${terbukaCount}/${totalPetunjuk}`}
              </span>
            </div>

            {level.petunjuk.map((pt, idx) => {
              const isTerbuka = idx < terbukaCount;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-3.5 border-2 transition-all ${
                    isTerbuka
                      ? 'bg-amber-50/80 border-amber-300 text-slate-800 shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        isTerbuka
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-200 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {isTerbuka ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`font-mono text-xs font-black uppercase tracking-wider ${
                            isTerbuka ? 'text-amber-900' : 'text-slate-500'
                          }`}
                        >
                          Petunjuk #{idx + 1}
                        </span>

                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isTerbuka
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-200 text-slate-500 border border-slate-300'
                          }`}
                        >
                          {isTerbuka ? '✓ Terbuka' : '🔒 Terkunci'}
                        </span>
                      </div>

                      {isTerbuka ? (
                        <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-medium mt-1">
                          {pt}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 italic mt-1 font-normal">
                          {idx === terbukaCount
                            ? `Terbuka otomatis jika gagal ${Math.max(1, 3 + (idx * 1) - gagalBerturutTurut)}x lagi pada uji kasus, atau buka manual.`
                            : 'Selesaikan atau buka petunjuk sebelumnya terlebih dahulu.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Opsi Buka Petunjuk Selanjutnya Secara Manual */}
          {adaPetunjukTerkunci && onBukaPetunjukManual && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-left text-xs text-amber-950 font-medium">
                <span className="font-black block">Perlu bantuan sekarang?</span>
                Buka petunjuk berikutnya tanpa harus menunggu 3x gagal.
              </div>
              <button
                type="button"
                onClick={onBukaPetunjukManual}
                className="min-h-[44px] px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span>Buka Petunjuk #{terbukaCount + 1}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sky-50 border-t-2 border-sky-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 text-slate-950 font-black text-sm rounded-2xl transition-colors flex items-center gap-2 cursor-pointer shadow-md border-2 border-amber-500 border-b-4 border-b-amber-600"
          >
            <Check className="w-4 h-4" />
            <span>Tutup &amp; Lanjutkan Koding</span>
          </button>
        </div>
      </div>
    </div>
  );
};
