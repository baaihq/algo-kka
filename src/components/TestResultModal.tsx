import React, { useEffect, useState } from 'react';
import { HasilUjiLevel, Level } from '../types/game';
import {
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  RotateCcw,
  MapPin,
  Award,
  Lightbulb,
  Share2,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { bagikanSkorKeWhatsApp } from '../utils/scoreCardImage';

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

interface TestResultModalProps {
  level: Level;
  hasilUji: HasilUjiLevel;
  isOpen: boolean;
  onClose: () => void;
  gagalBerturutTurut: number;
  onBukaPetunjuk?: () => void;
  onLanjutLevelBerikutnya?: () => void;
  onKembaliKePeta: () => void;
  bintangDiperoleh?: number;
  namaTim?: string;
  skenarioRingkasan?: string;
  varianId?: number;
  totalPetunjukTerbuka?: number;
  onUlangiLevel?: () => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  level,
  hasilUji,
  isOpen,
  onClose,
  gagalBerturutTurut,
  onBukaPetunjuk,
  onLanjutLevelBerikutnya,
  onKembaliKePeta,
  bintangDiperoleh = 3,
  namaTim = 'Tim Penjelajah',
  skenarioRingkasan,
  varianId,
  totalPetunjukTerbuka = 0,
  onUlangiLevel
}) => {
  const [loadingGambar, setLoadingGambar] = useState(false);
  const [notifGambar, setNotifGambar] = useState<{ pesan: string; tipe: 'whatsapp' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNotifGambar(null);
      setLoadingGambar(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && hasilUji.semuaLulus) {
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#7dd3fc', '#fde047', '#86efac', '#d8b4fe', '#fda4af', '#fed7aa']
        });
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
    return () => {
      try {
        confetti.reset();
      } catch (e) {
        // ignore
      }
    };
  }, [isOpen, hasilUji.semuaLulus]);

  if (!isOpen) return null;

  const paramsSkor = {
    namaTim,
    namaLevel: level.nama,
    skenario: skenarioRingkasan,
    varianId,
    bintang: bintangDiperoleh,
    semuaLulus: hasilUji.semuaLulus,
    kasusLulus: hasilUji.kasusLulus,
    totalKasus: hasilUji.totalKasus,
    totalPetunjukTerbuka,
    percobaanGagal: gagalBerturutTurut
  };

  const handleShareBuktiLulus = async () => {
    if (loadingGambar) return;
    setLoadingGambar(true);
    setNotifGambar(null);

    try {
      const hasil = await bagikanSkorKeWhatsApp(paramsSkor);

      if (hasil.sukses && hasil.mode !== 'canceled') {
        setNotifGambar({
          pesan: hasil.pesan,
          tipe: 'whatsapp'
        });
        setTimeout(() => setNotifGambar(null), 6000);
      }
    } catch (e) {
      console.error('Gagal membagikan bukti lulus:', e);
    } finally {
      setLoadingGambar(false);
    }
  };

  const handleLanjutLevel = () => {
    try {
      confetti.reset();
    } catch (e) {
      // ignore
    }
    onClose();
    if (onLanjutLevelBerikutnya) {
      onLanjutLevelBerikutnya();
    }
  };

  const handleKembaliPeta = () => {
    try {
      confetti.reset();
    } catch (e) {
      // ignore
    }
    onClose();
    onKembaliKePeta();
  };

  const handleUlangi = () => {
    try {
      confetti.reset();
    } catch (e) {
      // ignore
    }
    onClose();
    if (onUlangiLevel) {
      onUlangiLevel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-2 border-sky-300 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal Pastel Ceria */}
        <div
          className={`p-5 text-white flex items-center gap-3 border-b-2 ${
            hasilUji.semuaLulus
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 border-emerald-400'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 border-amber-400'
          }`}
        >
          {hasilUji.semuaLulus ? (
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-7 h-7 text-yellow-200" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center shrink-0 shadow-inner">
              <XCircle className="w-7 h-7 text-white" />
            </div>
          )}

          <div>
            <h3 className="text-lg md:text-xl font-black tracking-wide font-fredoka">
              {hasilUji.semuaLulus ? 'SEMUA KASUS UJI LULUS! 🎉' : 'HASIL UJI KASUS: BELUM LENGKAP ⚠️'}
            </h3>
            <p className="text-xs md:text-sm text-white/95 leading-snug">
              {hasilUji.semuaLulus
                ? `Hebat! Logika program robot ALGO berhasil menyelesaikan ${level.nama}.`
                : `${hasilUji.kasusLulus} dari ${hasilUji.totalKasus} kasus uji berhasil dilewati. Percobaan gagal: ${gagalBerturutTurut}x.`}
            </p>
          </div>
        </div>

        {/* Bintang Prestasi & Tombol Share Bukti Lulus WhatsApp */}
        {hasilUji.semuaLulus && (
          <div className="bg-amber-50/80 py-3 px-4 border-b-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((b) => (
                  <Star
                    key={b}
                    className={`w-6 h-6 transition-transform ${
                      b <= bintangDiperoleh
                        ? 'fill-amber-400 text-amber-500 animate-bounce'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                    style={{ animationDelay: `${(b - 1) * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-black text-amber-900 bg-amber-200/90 border border-amber-300 px-2.5 py-0.5 rounded-full ml-1 whitespace-nowrap">
                {bintangDiperoleh} / 3 BINTANG
              </span>
            </div>

            {/* Tombol Share Bukti Lulus (WhatsApp + Gambar) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleShareBuktiLulus}
                disabled={loadingGambar}
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white border-2 border-emerald-500 border-b-4 border-b-emerald-700"
                title="Bagikan sertifikat/gambar bukti penyelesaian level langsung ke WhatsApp"
              >
                {loadingGambar ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memproses Gambar...</span>
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                    <Share2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                    <span className="whitespace-nowrap">Share Bukti Lulus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Notifikasi Toast Gambar Tersalin / Diunduh / WhatsApp */}
        {notifGambar && (
          <div className="bg-emerald-100 border-b-2 border-emerald-300 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-900 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold leading-tight">{notifGambar.pesan}</span>
          </div>
        )}

        {/* Banner Bantuan Petunjuk Bertahap saat Gagal >= 3 Kali */}
        {!hasilUji.semuaLulus && gagalBerturutTurut >= 3 && (
          <div className="mx-4 mt-3 mb-1 p-3.5 bg-amber-100 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 fill-slate-950 text-slate-950 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Petunjuk Bertahap Terbuka! ({gagalBerturutTurut}x Gagal)
                </h4>
                <p className="text-xs text-amber-900 leading-snug">
                  ALGO membuka petunjuk logika untuk membantumu memecahkan kode stasiun.
                </p>
              </div>
            </div>
            {onBukaPetunjuk && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBukaPetunjuk();
                }}
                className="w-full sm:w-auto min-h-[42px] px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-amber-500 shadow-xs"
              >
                <Lightbulb className="w-4 h-4 fill-slate-950" />
                <span>Buka Petunjuk</span>
              </button>
            )}
          </div>
        )}

        {/* Daftar Hasil Per Kasus Uji */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs font-black text-slate-600 uppercase tracking-wider">
            RINCIAN KASUS UJI ({hasilUji.kasusLulus}/{hasilUji.totalKasus} LULUS):
          </div>

          {hasilUji.hasilPerKasus.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-3.5 border-2 transition-all ${
                item.lulus
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-1.5">
                <div className="flex items-center gap-2 shrink-0">
                  {item.lulus ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span className="font-black text-sm whitespace-nowrap">
                    Kasus #{idx + 1}:
                  </span>
                </div>

                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded-lg border border-slate-300 font-bold break-all">
                  {JSON.stringify(item.data)}
                </span>

                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-auto shrink-0 whitespace-nowrap ${
                    item.lulus
                      ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                      : 'bg-rose-200 text-rose-900 border border-rose-400'
                  }`}
                >
                  {item.lulus ? '✓ Lulus' : '✗ Gagal'}
                </span>
              </div>

              <p className="text-xs text-slate-600 pl-7 leading-relaxed font-medium">
                {item.pesanEvaluasi}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Tombol Aksi Chunky */}
        <div className="p-4 bg-sky-50 border-t-2 border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!hasilUji.semuaLulus ? (
            <div className="flex items-center justify-between gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap border border-slate-300"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border-2 border-amber-500 border-b-4 border-b-amber-600 active:border-b-0 active:translate-y-1"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Perbaiki Program</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full">
              {/* Tombol Sekunder: Peta & Ulangi */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleKembaliPeta}
                  className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 border-2 border-sky-300 border-b-4 border-b-sky-400 active:border-b-0 active:translate-y-1 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                  <span className="whitespace-nowrap">Peta Stasiun</span>
                </button>

                {onUlangiLevel && (
                  <button
                    type="button"
                    onClick={handleUlangi}
                    className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 border-b-4 border-b-amber-400 active:border-b-0 active:translate-y-1 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Ulangi level ini untuk raih bintang lebih tinggi"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0 text-amber-700" />
                    <span className="whitespace-nowrap">Ulangi</span>
                  </button>
                )}
              </div>

              {/* Tombol Utama: Level Berikutnya */}
              {onLanjutLevelBerikutnya ? (
                <button
                  type="button"
                  onClick={handleLanjutLevel}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-emerald-600 border-b-4 border-b-emerald-700 active:border-b-0 active:translate-y-1 shadow-md"
                >
                  <span className="whitespace-nowrap">Level Berikutnya</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs sm:text-sm transition-colors cursor-pointer border border-slate-300"
                >
                  <span className="whitespace-nowrap">Tutup</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
