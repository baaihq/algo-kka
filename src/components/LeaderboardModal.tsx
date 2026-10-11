import React from 'react';
import { LeaderboardEntry } from '../types/game';
import { Trophy, Star, Award, X, Sparkles } from 'lucide-react';

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
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/45 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-white border-2 border-yellow-300 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-300">
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

        {/* Subheader info motivasi */}
        <div className="bg-amber-50/70 px-4 py-2 border-b-2 border-amber-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">Koleksi Bintang Terbanyak Kelas X</span>
          </div>
          <span className="font-mono text-sky-800 font-black text-[11px]">Tim: {currentTeamName}</span>
        </div>

        {/* Daftar Top 5 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {entries.length === 0 ? (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🏆
              </div>
              <h4 className="font-black text-slate-900 text-sm md:text-base mb-1">
                Belum Ada Data Peringkat
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
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
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {/* Ranking Medal & Nama Tim */}
                  <div className="flex items-center gap-3">
                    {renderMedal(rank)}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-black text-sm md:text-base ${
                            isMe ? 'text-amber-950 font-extrabold' : 'text-slate-900'
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
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono font-bold mt-0.5">
                        <span>Peringkat #{rank}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-purple-700">
                          <Award className="w-3 h-3" />
                          <span>{entry.badgeCount} Badge</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skor Bintang */}
                  <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-2xl shadow-2xs shrink-0">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                    <span className="font-mono font-black text-amber-950 text-sm md:text-base">
                      {entry.bintang}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sky-50 border-t-2 border-sky-100 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 italic font-medium">
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
