/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { DAFTAR_LEVEL } from './data/levels';
import { TimProfil, ProgresLevel } from './types/game';
import { ambilProfilTim, simpanProfilTim, ambilSemuaProgres, hapusEntriLeaderboard } from './services/storage';
import { pilihVarianUntukTim } from './utils/hash';
import { TeamScreen } from './components/TeamScreen';
import { StationMap } from './components/StationMap';
import { LevelEditor } from './components/LevelEditor';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { getSesi } from './services/teacher';

type LayarAktif = 'login' | 'peta' | 'editor' | 'guru_dashboard';
type ArahTransisi = 'maju' | 'mundur';

export default function App() {
  const [tim, setTim] = useState<TimProfil | null>(() => ambilProfilTim());
  const [layar, setLayar] = useState<LayarAktif>(() => (ambilProfilTim() ? 'peta' : 'login'));
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);
  const [progresMap, setProgresMap] = useState<Record<string, ProgresLevel>>(() => ambilSemuaProgres());
  const [levelAktifId, setLevelAktifId] = useState<string>('gerbang-tamu');
  const [arahTransisi, setArahTransisi] = useState<ArahTransisi>('maju');
  const shouldReduceMotion = useReducedMotion();

  // Varian animasi fading & sliding yang halus dan ramah aksesibilitas
  const transisiLayarVariants: Variants = {
    enter: (arah: ArahTransisi) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : arah === 'maju' ? 28 : -28,
      scale: shouldReduceMotion ? 1 : 0.995,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.26,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (arah: ArahTransisi) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : arah === 'maju' ? -28 : 28,
      scale: shouldReduceMotion ? 1 : 0.995,
      transition: {
        duration: 0.18,
        ease: [0.4, 0, 1, 1] as const,
      },
    }),
  };

  // Muat ulang progres saat berpindah layar
  const perbaruiSemuaProgres = () => {
    setProgresMap(ambilSemuaProgres());
  };

  // Scroll ke paling atas setiap kali layar berganti
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [layar, levelAktifId]);

  const handleMulaiEkspedisi = (namaTimBaru: string) => {
    const profil = simpanProfilTim(namaTimBaru);
    setTim(profil);
    perbaruiSemuaProgres();
    setArahTransisi('maju');
    setLayar('peta');
  };

  const handlePilihLevel = (id: string) => {
    setArahTransisi('maju');
    setLevelAktifId(id);
    setLayar('editor');
  };

  const handleKembaliKePeta = () => {
    perbaruiSemuaProgres();
    setArahTransisi('mundur');
    setLayar('peta');
  };

  const handleGantiTim = (namaTimBaru: string) => {
    const profil = simpanProfilTim(namaTimBaru);
    setTim(profil);
    perbaruiSemuaProgres();
  };

  const handleResetProgres = () => {
    if (tim?.namaTim) {
      hapusEntriLeaderboard(tim.namaTim);
    }
    localStorage.removeItem('ekspedisi_kode_progres_level');
    localStorage.removeItem('ekspedisi_kode_gagal_level');
    localStorage.removeItem('ekspedisi_kode_kegagalan_total');
    localStorage.removeItem('ekspedisi_kode_pernah_gagal');
    localStorage.removeItem('ekspedisi_kode_onboarding_dilihat');
    localStorage.removeItem('ekspedisi_kode_tutorial_selesai');
    setProgresMap({});
  };

  const handleLanjutLevelBerikutnya = () => {
    const idx = DAFTAR_LEVEL.findIndex((l) => l.id === levelAktifId);
    if (idx !== -1 && idx < DAFTAR_LEVEL.length - 1) {
      const nextId = DAFTAR_LEVEL[idx + 1].id;
      setArahTransisi('maju');
      setLevelAktifId(nextId);
      perbaruiSemuaProgres();
    } else {
      handleKembaliKePeta();
    }
  };

  const handleBukaDashboardGuru = async () => {
    const sesi = await getSesi();
    if (sesi?.user) {
      setArahTransisi('maju');
      setLayar('guru_dashboard');
    } else {
      setIsTeacherLoginOpen(true);
    }
  };

  const handleLoginGuruSukses = () => {
    setIsTeacherLoginOpen(false);
    setArahTransisi('maju');
    setLayar('guru_dashboard');
  };

  const handleKeluarDashboardGuru = () => {
    setArahTransisi('mundur');
    setLayar(tim ? 'peta' : 'login');
  };

  const renderLayar = () => {
    // 0. Layar Dashboard Guru
    if (layar === 'guru_dashboard') {
      return (
        <motion.div
          key="layar-guru-dashboard"
          custom={arahTransisi}
          variants={transisiLayarVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full min-h-screen overflow-x-hidden"
        >
          <TeacherDashboard onKeluarDashboard={handleKeluarDashboardGuru} />
        </motion.div>
      );
    }

    // 1. Layar Masuk Tim
    if (layar === 'login' || !tim) {
      return (
        <motion.div
          key="layar-login"
          custom={arahTransisi}
          variants={transisiLayarVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full min-h-screen overflow-x-hidden"
        >
          <TeamScreen
            onMulaiEkspedisi={handleMulaiEkspedisi}
            namaTimAwal={tim?.namaTim || ''}
            onBukaDashboardGuru={handleBukaDashboardGuru}
          />
        </motion.div>
      );
    }

    // 2. Layar Editor
    if (layar === 'editor') {
      const levelAktif = DAFTAR_LEVEL.find((l) => l.id === levelAktifId) || DAFTAR_LEVEL[0];
      const varianIndex = pilihVarianUntukTim(tim.namaTim, levelAktif.id, levelAktif.varian.length);
      const varianAktif = levelAktif.varian[varianIndex];

      const levelBerikutnyaAda =
        DAFTAR_LEVEL.findIndex((l) => l.id === levelAktif.id) < DAFTAR_LEVEL.length - 1;

      return (
        <motion.div
          key={`layar-editor-${levelAktif.id}`}
          custom={arahTransisi}
          variants={transisiLayarVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full min-h-screen overflow-x-hidden"
        >
          <LevelEditor
            key={levelAktif.id}
            level={levelAktif}
            varian={varianAktif}
            tim={tim}
            onKembaliKePeta={handleKembaliKePeta}
            onLanjutLevelBerikutnya={levelBerikutnyaAda ? handleLanjutLevelBerikutnya : undefined}
          />
        </motion.div>
      );
    }

    // 3. Layar Peta Stasiun
    return (
      <motion.div
        key="layar-peta"
        custom={arahTransisi}
        variants={transisiLayarVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full min-h-screen overflow-x-hidden"
      >
        <StationMap
          tim={tim}
          progresMap={progresMap}
          onPilihLevel={handlePilihLevel}
          onGantiTim={handleGantiTim}
          onResetProgres={handleResetProgres}
        />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50/40 text-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      <AnimatePresence mode="wait" initial={false} custom={arahTransisi}>
        {renderLayar()}
      </AnimatePresence>

      {/* Modal Login Guru */}
      <TeacherLoginModal
        isOpen={isTeacherLoginOpen}
        onClose={() => setIsTeacherLoginOpen(false)}
        onLoginSukses={handleLoginGuruSukses}
      />
    </div>
  );
}
