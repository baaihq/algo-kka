import React, { useState } from 'react';
import { StatusBadge } from '../data/badges';
import { Award, CheckCircle2, Lock, X, Share2, Loader2, Star } from 'lucide-react';
import {
  bagikanKoleksiBadgeKeWhatsApp,
  bagikanSatuBadgeKeWhatsApp
} from '../utils/badgeCardImage';

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

interface BadgeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: StatusBadge[];
  namaTim?: string;
  totalBintang?: number;
}

export const BadgeListModal: React.FC<BadgeListModalProps> = ({
  isOpen,
  onClose,
  badges,
  namaTim = 'Kelompok Penjelajah',
  totalBintang = 0
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notif, setNotif] = useState<string | null>(null);

  if (!isOpen) return null;

  const jumlahTerbuka = badges.filter((b) => b.terbuka).length;

  const handleShareKoleksi = async () => {
    if (loadingId !== null) return;
    setLoadingId('semua');
    setNotif(null);

    try {
      const res = await bagikanKoleksiBadgeKeWhatsApp({
        namaTim,
        totalBintang,
        badges
      });

      if (res.sukses && res.mode !== 'canceled') {
        setNotif(res.pesan);
        setTimeout(() => setNotif(null), 6000);
      }
    } catch (err) {
      console.error('Gagal membagikan koleksi badge:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleShareSatuBadge = async (badge: StatusBadge) => {
    if (loadingId !== null) return;
    setLoadingId(badge.id);
    setNotif(null);

    try {
      const res = await bagikanSatuBadgeKeWhatsApp({
        namaTim,
        totalBintang,
        badge
      });

      if (res.sukses && res.mode !== 'canceled') {
        setNotif(res.pesan);
        setTimeout(() => setNotif(null), 6000);
      }
    } catch (err) {
      console.error(`Gagal membagikan badge ${badge.nama}:`, err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-yellow-300 dark:border-amber-600 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 dark:from-amber-600 dark:via-amber-500 dark:to-yellow-600 p-4 text-slate-950 dark:text-slate-950 flex items-center justify-between border-b-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg font-fredoka">Koleksi Badge Kelompok</h3>
              <p className="text-xs text-amber-950 font-mono font-bold">
                {jumlahTerbuka} dari {badges.length} Badge Terbuka • {namaTim}
              </p>
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

        {/* Subheader: Tombol Share Bukti Badge (Gambar) */}
        <div className="bg-amber-50/70 dark:bg-slate-800/80 py-3 px-4 border-b-2 border-amber-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-black text-amber-950 dark:text-amber-200 bg-amber-200/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-xl">
              <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{jumlahTerbuka}/{badges.length} BADGE</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono font-black text-yellow-950 dark:text-amber-200 bg-yellow-200/90 dark:bg-amber-950/70 border border-yellow-300 dark:border-amber-700 px-2.5 py-1 rounded-xl">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600 dark:text-amber-400" />
              <span>{totalBintang}/18 BINTANG</span>
            </div>
          </div>

          {/* Tombol Share Bukti Koleksi Badge WhatsApp */}
          <button
            type="button"
            onClick={handleShareKoleksi}
            disabled={loadingId !== null || jumlahTerbuka === 0}
            className={`w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              jumlahTerbuka > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white border-2 border-emerald-500 border-b-4 border-b-emerald-700'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
            }`}
            title={
              jumlahTerbuka > 0
                ? 'Bagikan sertifikat gambar bukti koleksi badge kelompok ke WhatsApp'
                : 'Buka minimal 1 badge untuk membagikan bukti koleksi'
            }
          >
            {loadingId === 'semua' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memproses Gambar...</span>
              </>
            ) : (
              <>
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                <Share2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span className="whitespace-nowrap">Share Bukti Badge</span>
              </>
            )}
          </button>
        </div>

        {/* Notifikasi Toast */}
        {notif && (
          <div className="bg-emerald-100 border-b-2 border-emerald-300 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-900 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold leading-tight">{notif}</span>
          </div>
        )}

        {/* Daftar Badge */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 border-2 transition-all flex items-start gap-3.5 ${
                badge.terbuka
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/80 shadow-xs text-slate-800 dark:text-slate-200'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 opacity-75'
              }`}
            >
              {/* Icon Badge */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                  badge.terbuka
                    ? 'bg-amber-200/80 dark:bg-amber-900/60 border-2 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                }`}
              >
                {badge.terbuka ? badge.ikon : <Lock className="w-5 h-5" />}
              </div>

              {/* Info Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span
                      className={`font-black text-sm md:text-base break-words ${
                        badge.terbuka ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {badge.nama}
                    </span>
                    <span className="text-[10px] font-mono bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-300 px-2 py-0.5 rounded-md border border-sky-300 dark:border-sky-700 shrink-0 whitespace-nowrap font-bold">
                      {badge.kategori}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {badge.terbuka ? (
                      <>
                        <span className="flex items-center gap-1 text-[11px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Terbuka</span>
                        </span>

                        {/* Tombol Share per Badge */}
                        <button
                          type="button"
                          onClick={() => handleShareSatuBadge(badge)}
                          disabled={loadingId !== null}
                          className="min-h-[30px] px-2.5 py-1 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 active:scale-95 shadow-xs"
                          title={`Bagikan gambar bukti perolehan ${badge.nama} ke WhatsApp`}
                        >
                          {loadingId === badge.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          ) : (
                            <>
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
                              <span className="whitespace-nowrap">Share</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 whitespace-nowrap">
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans break-words font-medium">
                  {badge.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sky-50 dark:bg-slate-800/80 border-t-2 border-sky-100 dark:border-slate-700 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            Bukti lencana dapat dibagikan langsung sebagai gambar sertifikat.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-black text-sm rounded-2xl transition-colors cursor-pointer border border-slate-300 dark:border-slate-600"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
