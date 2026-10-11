import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game';
import { Trophy, Star, Award, X, Sparkles, Share2, Loader2, CheckCircle2 } from 'lucide-react';
import { bagikanLeaderboardKeWhatsApp } from '../utils/leaderboardCardImage';

// WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 2.152.68 4.148 1.84 5.786L2.5 21.5l3.828-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.954 7.954 0 01-4.223-1.206l-.303-.18-2.274.778.791-2.218-.198-.314A7.956 7.956 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
  </svg>
);

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentTeamName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentTeamName
}) => {
  const [loadingShare, setLoadingShare] = useState<boolean>(false);
  const [notif, setNotif] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShareLeaderboard = async () => {
    if (loadingShare) return;
    setLoadingShare(true);
    setNotif(null);

    try {
      const res = await bagikanLeaderboardKeWhatsApp({
        currentTeamName,
        entries
      });

      if (res.sukses && res.mode !== 'canceled') {
        setNotif(res.pesan);
        setTimeout(() => setNotif(null), 6000);
      }
    } catch (err) {
      console.error('Gagal membagikan leaderboard:', err);
    } finally {
      setLoadingShare(false);
    }
  };

  const renderMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-9 h-9 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-lg shadow-2xs">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-9 h-9 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-lg shadow-2xs">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-9 h-9 rounded-2xl bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-lg shadow-2xs">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-xs font-mono font-black text-slate-600">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-yellow-300 dark:border-amber-600 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 dark:from-amber-600 dark:via-amber-500 dark:to-yellow-600 p-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center shrink-0 shadow-inner">
              <Trophy className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-black">
                  Top 5 Stasiun
                </span>
              </div>
              <h3 className="font-black text-base md:text-lg font-fredoka">Papan Peringkat (Leaderboard)</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-800 hover:text-black rounded-2xl hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader: Info Tim & Tombol Share Leaderboard WhatsApp */}
        <div className="bg-amber-50/70 dark:bg-slate-800/80 px-4 py-3 border-b-2 border-amber-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tim: <span className="font-mono text-amber-950 dark:text-amber-300 font-black">{currentTeamName}</span></span>
            </div>
          </div>

          {/* Tombol Share Leaderboard (WhatsApp + Gambar Sertifikat) */}
          <button
            type="button"
            onClick={handleShareLeaderboard}
            disabled={loadingShare || entries.length === 0}
            className={`w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              entries.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white border-2 border-emerald-500 border-b-4 border-b-emerald-700'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-60'
            }`}
            title="Bagikan sertifikat gambar papan peringkat ke WhatsApp"
          >
            {loadingShare ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memproses Gambar...</span>
              </>
            ) : (
              <>
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                <Share2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span className="whitespace-nowrap">Share Leaderboard</span>
              </>
            )}
          </button>
        </div>

        {/* Notifikasi Toast Peringkat Berhasil Dibagikan */}
        {notif && (
          <div className="bg-emerald-100 border-b-2 border-emerald-300 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-900 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold leading-tight">{notif}</span>
          </div>
        )}

        {/* Daftar Top 5 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {entries.length === 0 ? (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🏆
              </div>
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm md:text-base mb-1">
                Belum Ada Data Peringkat
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Belum ada data peringkat. Selesaikan level untuk mencatatkan timmu!
              </p>
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rank = idx + 1;
              const isMe =
                entry.isCurrentTeam ||
                entry.namaTim.trim().toLowerCase() === currentTeamName.trim().toLowerCase();

              return (
                <div
                  key={entry.id}
                  className={`rounded-2xl p-3.5 border-2 transition-all flex items-center justify-between gap-3 ${
                    isMe
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-300 dark:ring-amber-500/50 shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {/* Ranking Medal & Nama Tim */}
                  <div className="flex items-center gap-3">
                    {renderMedal(rank)}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-black text-sm md:text-base ${
                            isMe ? 'text-amber-950 dark:text-amber-200 font-extrabold' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {entry.namaTim}
                        </h4>
                        {isMe && (
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-full shadow-2xs">
                            Tim Anda
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold mt-0.5">
                        <span>Peringkat #{rank}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-purple-700 dark:text-purple-400">
                          <Award className="w-3 h-3" />
                          <span>{entry.badgeCount} Badge</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skor Bintang & Tombol Share */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-2xl shadow-2xs">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-600 dark:text-amber-400" />
                      <span className="font-mono font-black text-amber-950 dark:text-amber-200 text-sm md:text-base">
                        {entry.bintang}
                      </span>
                    </div>

                    {/* Tombol Share per Entry Papan Peringkat */}
                    <button
                      type="button"
                      onClick={handleShareLeaderboard}
                      disabled={loadingShare}
                      className="min-h-[34px] px-2.5 py-1 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white border border-emerald-500 shadow-xs"
                      title={`Bagikan papan peringkat dan prestasi ${entry.namaTim} ke WhatsApp`}
                    >
                      {loadingShare ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <>
                          <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="whitespace-nowrap">Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sky-50 dark:bg-slate-800/80 border-t-2 border-sky-100 dark:border-slate-700 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic font-medium">
            Selesaikan misi dengan bintang 3 untuk memuncaki klasemen!
          </p>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 text-slate-950 font-black text-sm rounded-2xl transition-all cursor-pointer shadow-md border-2 border-amber-500 border-b-4 border-b-amber-600 shrink-0"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
