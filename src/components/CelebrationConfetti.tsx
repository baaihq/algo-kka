import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Award, Zap, PartyPopper } from 'lucide-react';

export interface CelebrationConfettiProps {
  /** Apakah efek perayaan sedang aktif */
  isActive: boolean;
  /** Durasi perayaan sebelum partikel berhenti dibuat ulang (ms), default 5000ms */
  durationMs?: number;
  /** Callback opsional ketika perayaan selesai */
  onComplete?: () => void;
  /** Tampilkan tombol interaktif untuk meletuskan konfeti lagi */
  showTriggerButton?: boolean;
}

interface Particle {
  id: number;
  type: 'rect' | 'circle' | 'strip' | 'star' | 'sparkle' | 'emoji';
  emoji?: string;
  color: string;
  size: number;
  startX: number; // Persentase lebar layar (0 - 100)
  startY: number; // Persentase tinggi layar (0 - 100)
  deltaX: number; // Jarak gerak horizontal (px)
  deltaY: number; // Jarak gerak vertikal (px)
  rotation: number;
  rotationX: number;
  rotationY: number;
  duration: number;
  delay: number;
  swayAmount: number;
}

const CERIA_COLORS = [
  '#f59e0b', // Amber cerah
  '#fbbf24', // Yellow hangat
  '#10b981', // Emerald ceria
  '#06b6d4', // Cyan elektrik
  '#3b82f6', // Biru robot
  '#8b5cf6', // Ungu pastel
  '#ec4899', // Pink cerah
  '#f43f5e', // Rose
  '#f97316', // Orange semangat
  '#eab308'  // Emas juara
];

const CERIA_EMOJIS = ['⭐', '🎉', '🚀', '🤖', '✨', '🏆', '💡', '🌟', '🎊'];

function buatPartikel(jumlah: number, waveId: number): Particle[] {
  const partikel: Particle[] = [];

  for (let i = 0; i < jumlah; i++) {
    const isEmoji = i % 9 === 0;
    const isStar = i % 8 === 1;
    const isSparkle = i % 8 === 2;
    const isStrip = i % 8 === 3;
    const isCircle = i % 8 === 4;

    let type: Particle['type'] = 'rect';
    if (isEmoji) type = 'emoji';
    else if (isStar) type = 'star';
    else if (isSparkle) type = 'sparkle';
    else if (isStrip) type = 'strip';
    else if (isCircle) type = 'circle';

    // Sumber semburan:
    // 35% dari kiri bawah, 35% dari kanan bawah, 30% dari atas tengah melayang turun
    const modeSumber = i % 3;
    let startX = 50;
    let startY = 50;
    let deltaX = 0;
    let deltaY = 0;

    if (modeSumber === 0) {
      // Meriam Kiri Bawah (menyemprot ke arah tengah atas)
      startX = Math.random() * 15;
      startY = 85 + Math.random() * 15;
      deltaX = 150 + Math.random() * 450;
      deltaY = -(350 + Math.random() * 450);
    } else if (modeSumber === 1) {
      // Meriam Kanan Bawah (menyemprot ke arah tengah atas)
      startX = 85 + Math.random() * 15;
      startY = 85 + Math.random() * 15;
      deltaX = -(150 + Math.random() * 450);
      deltaY = -(350 + Math.random() * 450);
    } else {
      // Hujan Ceria dari Langit-Langit Atas (meluncur turun meliuk-liuk)
      startX = Math.random() * 100;
      startY = -5 - Math.random() * 15;
      deltaX = (Math.random() - 0.5) * 200;
      deltaY = 600 + Math.random() * 500;
    }

    const color = CERIA_COLORS[Math.floor(Math.random() * CERIA_COLORS.length)];
    const emoji = isEmoji ? CERIA_EMOJIS[Math.floor(Math.random() * CERIA_EMOJIS.length)] : undefined;
    const size = type === 'strip' ? 14 : type === 'emoji' ? 22 : type === 'star' || type === 'sparkle' ? 16 : 8 + Math.random() * 8;

    partikel.push({
      id: waveId * 1000 + i,
      type,
      emoji,
      color,
      size,
      startX,
      startY,
      deltaX,
      deltaY,
      rotation: (Math.random() - 0.5) * 1080,
      rotationX: Math.random() * 720,
      rotationY: Math.random() * 720,
      duration: 2.2 + Math.random() * 1.8,
      delay: Math.random() * 0.45,
      swayAmount: (Math.random() - 0.5) * 60
    });
  }

  return partikel;
}

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  isActive,
  durationMs = 5000,
  onComplete,
  showTriggerButton = false
}) => {
  const [wave, setWave] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [masihMenari, setMasihMenari] = useState(false);

  // Trigger gelombang baru saat isActive bernilai true
  useEffect(() => {
    if (isActive) {
      setMasihMenari(true);
      setWave((w) => w + 1);
    } else {
      setMasihMenari(false);
      setParticles([]);
    }
  }, [isActive]);

  // Bangkitkan partikel setiap kali wave bertambah
  useEffect(() => {
    if (wave > 0 && isActive) {
      const partikelBaru = buatPartikel(65, wave);
      setParticles(partikelBaru);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, durationMs);

      return () => clearTimeout(timer);
    }
  }, [wave, isActive, durationMs, onComplete]);

  const handleTembakLagi = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMasihMenari(true);
    setWave((w) => w + 1);
  };

  if (!isActive && !masihMenari) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden select-none">
      {/* 🌟 BANNER CERIA PERAYAAN MUNCUL SEJENAK DENGAN FRAMER MOTION */}
      <AnimatePresence>
        {masihMenari && (
          <motion.div
            key={`banner-${wave}`}
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black px-5 py-2 rounded-full shadow-xl border-2 border-yellow-200 pointer-events-auto"
          >
            <motion.div
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            >
              <PartyPopper className="w-5 h-5 text-amber-900" />
            </motion.div>
            <span className="text-xs sm:text-sm tracking-wide font-black">
              LOGIKA SEMPURNA! LEVEL TUNTAS! 🎉
            </span>
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            >
              <Sparkles className="w-4 h-4 text-amber-800" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎊 KUMPULAN PARTIKEL KONFETI & BINTANG CERIA DENGAN FRAMER MOTION */}
      <AnimatePresence>
        {particles.map((p) => {
          return (
            <motion.div
              key={p.id}
              initial={{
                left: `${p.startX}vw`,
                top: `${p.startY}vh`,
                x: 0,
                y: 0,
                scale: 0,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                opacity: 1
              }}
              animate={{
                x: [0, p.deltaX * 0.4 + p.swayAmount, p.deltaX * 0.8 - p.swayAmount, p.deltaX],
                y: [0, p.deltaY * 0.6, p.deltaY * 0.9, p.deltaY + 120],
                scale: [0, 1.2, 1, 0.75],
                rotate: p.rotation,
                rotateX: p.rotationX,
                rotateY: p.rotationY,
                opacity: [1, 1, 0.9, 0]
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                position: 'absolute',
                pointerEvents: 'none'
              }}
            >
              {p.type === 'emoji' && (
                <span
                  style={{
                    fontSize: `${p.size}px`,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                >
                  {p.emoji}
                </span>
              )}

              {p.type === 'star' && (
                <Star
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    color: p.color,
                    fill: p.color,
                    filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.6))'
                  }}
                />
              )}

              {p.type === 'sparkle' && (
                <Sparkles
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    color: p.color,
                    filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.6))'
                  }}
                />
              )}

              {p.type === 'strip' && (
                <div
                  style={{
                    width: `${p.size * 0.45}px`,
                    height: `${p.size * 1.6}px`,
                    backgroundColor: p.color,
                    borderRadius: '2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}
                />
              )}

              {p.type === 'circle' && (
                <div
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    borderRadius: '50%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                />
              )}

              {p.type === 'rect' && (
                <div
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size * 0.7}px`,
                    backgroundColor: p.color,
                    borderRadius: '2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 🚀 TOMBOL INTERAKTIF TEMBAK KONFETI LAGI (Jika diaktifkan) */}
      {showTriggerButton && (
        <div className="absolute bottom-6 right-6 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleTembakLagi}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black px-4 py-2.5 rounded-2xl shadow-lg border-2 border-yellow-300 border-b-4 border-b-amber-700 cursor-pointer text-xs md:text-sm"
            title="Tembakkan partikel perayaan ceria lagi!"
          >
            <PartyPopper className="w-4 h-4 text-yellow-100" />
            <span>Tembak Konfeti Lagi 🎉</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
