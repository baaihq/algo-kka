import React, { useState, useEffect, useRef } from 'react';
import { Level, Varian, BlokProgram, BlokAksi, BlokJika, OperatorPerbandingan, HasilUjiLevel, TimProfil, Kejadian } from '../types/game';
import { DAFTAR_LEVEL } from '../data/levels';
import { ArenaView } from './ArenaView';
import { ProgramArea } from './ProgramArea';
import { BlockPalette } from './BlockPalette';
import { TestResultModal } from './TestResultModal';
import { HintModal } from './HintModal';
import { ThemeMenu } from './ThemeMenu';
import { StatusAlgo } from './RobotAlgo';
import { jalankanProgram } from '../services/interpreter';
import { ujiSemuaKasusLevel } from '../services/evaluator';
import {
  simpanProgramSaja,
  simpanProgresLevel,
  ambilProgresLevel,
  ambilSemuaProgres,
  ambilGagalLevel,
  catatKegagalanLevel,
  resetKegagalanLevel
} from '../services/storage';
import { ambilStatusBadgeTim } from '../data/badges';
import { kirimPercobaan, kirimProgres } from '../services/sync';
import { ArrowLeft, Play, FlaskConical, RotateCcw, Lightbulb, CheckCircle2, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';
import {
  playSoundBlokDipasang,
  playSoundBlokDihapus,
  playSoundLevelSelesai,
  playSoundKesalahanLogika,
  playSoundJalankan,
  playSoundAksiAlgo,
  isAudioMuted,
  setAudioMuted
} from '../utils/audio';

interface LevelEditorProps {
  level: Level;
  varian: Varian;
  tim: TimProfil;
  onKembaliKePeta: () => void;
  onLanjutLevelBerikutnya?: () => void;
}

export const LevelEditor: React.FC<LevelEditorProps> = ({
  level,
  varian,
  tim,
  onKembaliKePeta,
  onLanjutLevelBerikutnya
}) => {
  // 1. Program State
  const [program, setProgram] = useState<BlokProgram[]>(() => {
    const tersimpan = ambilProgresLevel(level.id);
    if (level.id === 'lulus-atau-remidi-sulit') {
      // Jika program tersimpan berasal dari template otomatis lama (blok_jika_init_6), kosongkan agar area koding bersih
      if (
        tersimpan?.programTersimpan &&
        tersimpan.programTersimpan.some((b) => b.id.includes('blok_jika_init_6'))
      ) {
        return [];
      }
    }
    if (tersimpan?.programTersimpan && tersimpan.programTersimpan.length > 0) {
      return tersimpan.programTersimpan;
    }
    return inisialisasiProgramAwal(level, varian);
  });

  // 2. Simulasi & Eksekusi State
  const [statusAlgo, setStatusAlgo] = useState<StatusAlgo>('idle');
  const [pesanAlgo, setPesanAlgo] = useState<string | undefined>(undefined);
  const [pesanList, setPesanList] = useState<string[]>([]);
  const [daftarKejadian, setDaftarKejadian] = useState<Kejadian[]>([]);
  const [kasusAktifIndex, setKasusAktifIndex] = useState<number>(0);
  const [jejakLangkah, setJejakLangkah] = useState<string[]>([]);
  const [sedangJalan, setSedangJalan] = useState<boolean>(false);
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | undefined>(undefined);

  // 3. Modal Uji & Petunjuk State
  const [hasilUji, setHasilUji] = useState<HasilUjiLevel | null>(null);
  const [bintangDiperoleh, setBintangDiperoleh] = useState<number>(() => {
    return ambilProgresLevel(level.id)?.bintang || 0;
  });
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [tampilkanToastSimpan, setTampilkanToastSimpan] = useState<boolean>(false);
  const [audioMuteState, setAudioMuteState] = useState<boolean>(() => isAudioMuted());

  // Nomor Misi
  const indexLevel = DAFTAR_LEVEL.findIndex((l) => l.id === level.id);
  const nomorMisi = indexLevel !== -1 ? indexLevel + 1 : 1;

  // Bintang yang tersimpan sebelumnya untuk level ini
  const progresTersimpan = ambilProgresLevel(level.id);
  const bintangTersimpan = progresTersimpan?.bintang || 0;

  // Sistem Petunjuk Bertahap
  const [gagalBerturutTurut, setGagalBerturutTurut] = useState<number>(() => ambilGagalLevel(level.id));
  const [manualPetunjukTerbuka, setManualPetunjukTerbuka] = useState<number>(0);

  const autoPetunjukTerbuka = gagalBerturutTurut >= 3 ? Math.max(1, gagalBerturutTurut - 2) : 0;
  const totalPetunjukTerbuka = Math.min(
    level.petunjuk.length,
    Math.max(autoPetunjukTerbuka, manualPetunjukTerbuka)
  );

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const bersihkanSemuaTimeout = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  useEffect(() => {
    return () => {
      bersihkanSemuaTimeout();
    };
  }, []);

  const perbaruiProgramDanSimpan = (programBaru: BlokProgram[]) => {
    setProgram(programBaru);
    setStatusAlgo('idle');
    setPesanAlgo(undefined);
    setPesanList([]);
    setDaftarKejadian([]);
    simpanProgramSaja(level.id, varian.id, programBaru);
    setTampilkanToastSimpan(true);
    setTimeout(() => setTampilkanToastSimpan(false), 1200);
  };

  // --- INTERAKSI BLOK ---
  const handleAddBlockRoot = (
    tipe: 'jika_maka' | 'jika_maka_selain_itu' | BlokAksi['tipeAksi']
  ) => {
    const idUnik = `blok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (tipe === 'jika_maka' || tipe === 'jika_maka_selain_itu') {
      const isDuaArah = tipe === 'jika_maka_selain_itu';
      let namaDataKondisi = varian.namaData;
      let pembandingKondisi = varian.pembandingDefault;
      let operatorKondisi: OperatorPerbandingan = isDuaArah ? '>=' : '=';

      if (level.id === 'lulus-atau-remidi-sulit' && varian.aturan && varian.aturan[1]) {
        const sudahAdaDataUtama = program.some(
          (b) => b.tipe === 'jika' && b.kondisi.namaData === varian.namaData
        );
        if (sudahAdaDataUtama) {
          const match = varian.aturan[1].jika.match(/^([a-zA-Z0-9_]+)\s*([<>=!]+)\s*(.+)$/);
          if (match) {
            namaDataKondisi = match[1];
            operatorKondisi = match[2] as OperatorPerbandingan;
            pembandingKondisi = isNaN(Number(match[3])) ? match[3].replace(/['"]/g, '') : Number(match[3]);
          }
        }
      }

      const isLulusAtauRemidi = level.id.startsWith('lulus-atau-remidi');
      // Untuk Misi #4 dan #5, blok percabangan baru diberi slot aksi kosong (-- Pilih Aksi --)
      // Untuk Misi #6, rongga aksi dibuat kosong ([]), sehingga siswa memasang sendiri aksi dari palet
      const aksiMakaAwal: BlokAksi[] = (isLulusAtauRemidi && level.id !== 'lulus-atau-remidi-sulit')
        ? [{ id: `aksi_maka_${Date.now()}_1`, tipe: 'aksi', tipeAksi: '' as any, nilai: '' }]
        : [];
      const aksiSelainItuAwal: BlokAksi[] = (isLulusAtauRemidi && isDuaArah && level.id !== 'lulus-atau-remidi-sulit')
        ? [{ id: `aksi_selainitu_${Date.now()}_2`, tipe: 'aksi', tipeAksi: '' as any, nilai: '' }]
        : [];

      const blokJika: BlokJika = {
        id: idUnik,
        tipe: 'jika',
        kondisi: {
          namaData: namaDataKondisi,
          operator: operatorKondisi,
          pembanding: pembandingKondisi
        },
        makaAksi: aksiMakaAwal,
        punyaSelainItu: isDuaArah,
        selainItuAksi: aksiSelainItuAwal
      };
      perbaruiProgramDanSimpan([...program, blokJika]);
      playSoundBlokDipasang();
    } else {
      const blokAksi: BlokAksi = {
        id: idUnik,
        tipe: 'aksi',
        tipeAksi: tipe,
        // Dibuat kosong ('') terlebih dahulu agar siswa memikirkan dan memilih jawaban/pesan sendiri
        nilai: tipe === 'pesan' ? '' : undefined
      };
      perbaruiProgramDanSimpan([...program, blokAksi]);
      playSoundBlokDipasang();
    }
  };

  const handleAddNestedAction = (
    branch: 'maka' | 'selainItu',
    tipeAksi: BlokAksi['tipeAksi'],
    targetJikaId?: string
  ) => {
    if (targetJikaId) {
      handleAddNestedActionDirect(targetJikaId, branch, tipeAksi);
      return;
    }

    const targetJikaIndex = program.findIndex((b) => b.tipe === 'jika');
    if (targetJikaIndex === -1) {
      handleAddBlockRoot(tipeAksi);
      return;
    }

    const idAksi = `aksi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    // Pilihan aksi pesan saat BENAR maupun SALAH dibuat kosong dulu agar siswa menentukan sendiri pilihannya
    const nilaiDefault = tipeAksi === 'pesan' ? '' : undefined;

    const aksiBaru: BlokAksi = {
      id: idAksi,
      tipe: 'aksi',
      tipeAksi,
      nilai: nilaiDefault
    };

    const programUpdate = [...program];
    const target = { ...(programUpdate[targetJikaIndex] as BlokJika) };

    if (branch === 'maka') {
      target.makaAksi = [...target.makaAksi, aksiBaru];
    } else {
      target.selainItuAksi = [...target.selainItuAksi, aksiBaru];
    }

    programUpdate[targetJikaIndex] = target;
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDipasang();
  };

  const handleAddNestedActionDirect = (
    jikaId: string,
    branch: 'maka' | 'selainItu',
    tipeAksi: BlokAksi['tipeAksi']
  ) => {
    const idAksi = `aksi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    // Pilihan aksi pesan saat BENAR maupun SALAH dibuat kosong dulu agar siswa menentukan sendiri pilihannya
    const nilaiDefault = tipeAksi === 'pesan' ? '' : undefined;

    const aksiBaru: BlokAksi = {
      id: idAksi,
      tipe: 'aksi',
      tipeAksi,
      nilai: nilaiDefault
    };

    const programUpdate = program.map((b) => {
      if (b.id === jikaId && b.tipe === 'jika') {
        const j = { ...b };
        if (branch === 'maka') {
          j.makaAksi = [...j.makaAksi, aksiBaru];
        } else {
          j.selainItuAksi = [...j.selainItuAksi, aksiBaru];
        }
        return j;
      }
      return b;
    });

    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDipasang();
  };

  const handleDeleteNestedAction = (jikaId: string, branch: 'maka' | 'selainItu', actionId: string) => {
    const programUpdate = program.map((b) => {
      if (b.id === jikaId && b.tipe === 'jika') {
        const j = { ...b };
        if (branch === 'maka') {
          j.makaAksi = j.makaAksi.filter((a) => a.id !== actionId);
        } else {
          j.selainItuAksi = j.selainItuAksi.filter((a) => a.id !== actionId);
        }
        return j;
      }
      return b;
    });
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDihapus();
  };

  const handleUpdateNestedPesan = (
    jikaId: string,
    branch: 'maka' | 'selainItu',
    actionId: string,
    nilai: string
  ) => {
    const programUpdate = program.map((b) => {
      if (b.id === jikaId && b.tipe === 'jika') {
        const j = { ...b };
        if (branch === 'maka') {
          j.makaAksi = j.makaAksi.map((a) => (a.id === actionId ? { ...a, nilai } : a));
        } else {
          j.selainItuAksi = j.selainItuAksi.map((a) => (a.id === actionId ? { ...a, nilai } : a));
        }
        return j;
      }
      return b;
    });
    perbaruiProgramDanSimpan(programUpdate);
  };

  const handleUpdateOperator = (blockId: string, operator: OperatorPerbandingan) => {
    const programUpdate = program.map((b) => {
      if (b.id === blockId && b.tipe === 'jika') {
        return {
          ...b,
          kondisi: {
            ...b.kondisi,
            operator
          }
        };
      }
      return b;
    });
    perbaruiProgramDanSimpan(programUpdate);
  };

  const handleUpdatePesanNilai = (blockId: string, nilai: string) => {
    const programUpdate = program.map((b) => {
      if (b.id === blockId && b.tipe === 'aksi') {
        return { ...b, nilai };
      }
      return b;
    });
    perbaruiProgramDanSimpan(programUpdate);
  };

  const handleUpdateTipeAksi = (blockId: string, tipeAksi: BlokAksi['tipeAksi']) => {
    const programUpdate = program.map((b) => {
      if (b.id === blockId && b.tipe === 'aksi') {
        return {
          ...b,
          tipeAksi,
          nilai: tipeAksi === 'pesan' ? '' : undefined
        };
      }
      return b;
    });
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDipasang();
  };

  const handleUpdateNestedTipeAksi = (
    jikaId: string,
    branch: 'maka' | 'selainItu',
    actionId: string,
    tipeAksi: BlokAksi['tipeAksi']
  ) => {
    const programUpdate = program.map((b) => {
      if (b.id === jikaId && b.tipe === 'jika') {
        const j = { ...b };
        const updateAksi = (a: BlokAksi) =>
          a.id === actionId
            ? { ...a, tipeAksi, nilai: tipeAksi === 'pesan' ? '' : undefined }
            : a;

        if (branch === 'maka') {
          j.makaAksi = j.makaAksi.map(updateAksi);
        } else {
          j.selainItuAksi = j.selainItuAksi.map(updateAksi);
        }
        return j;
      }
      return b;
    });
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDipasang();
  };

  const handleDeleteBlock = (blockId: string) => {
    const programUpdate = program.filter((b) => b.id !== blockId);
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDihapus();
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= program.length) return;

    const programUpdate = [...program];
    const temp = programUpdate[index];
    programUpdate[index] = programUpdate[targetIdx];
    programUpdate[targetIdx] = temp;
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDipasang();
  };

  const handleReorderBlocks = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= program.length || toIndex < 0 || toIndex >= program.length) return;
    const programUpdate = [...program];
    const [moved] = programUpdate.splice(fromIndex, 1);
    programUpdate.splice(toIndex, 0, moved);
    perbaruiProgramDanSimpan(programUpdate);
    playSoundBlokDipasang();
  };

  const handleBukaResetProgram = () => {
    setIsResetConfirmOpen(true);
  };

  const handleKonfirmasiResetProgram = () => {
    const template = inisialisasiProgramAwal(level, varian);
    perbaruiProgramDanSimpan(template);
    setStatusAlgo('idle');
    setPesanAlgo(undefined);
    setPesanList([]);
    setDaftarKejadian([]);
    setJejakLangkah([]);
    setIsResetConfirmOpen(false);
    playSoundBlokDihapus();
  };

  // Reset percobaan bersih saat menekan "Ulangi" pada modal hasil uji
  // Mengosongkan penalti sesi (petunjuk manual & kegagalan level ini) agar siswa bisa mengejar 3 bintang
  const mulaiUlangPercobaanBersih = () => {
    perbaruiProgramDanSimpan(inisialisasiProgramAwal(level, varian));
    setManualPetunjukTerbuka(0);
    setGagalBerturutTurut(0);
    resetKegagalanLevel(level.id);
    bersihkanSemuaTimeout();
    setStatusAlgo('idle');
    setPesanAlgo(undefined);
    setPesanList([]);
    setDaftarKejadian([]);
    setJejakLangkah([]);
  };

  // --- EKSEKUSI ▶ JALANKAN ---
  const handleJalankan = () => {
    if (sedangJalan) return;
    bersihkanSemuaTimeout();
    setSedangJalan(true);
    setStatusAlgo('berpikir');
    setPesanAlgo(undefined);
    setPesanList([]);
    setDaftarKejadian([]);
    playSoundJalankan();

    const kasusAktif = varian.dataUji[kasusAktifIndex] || varian.dataUji[0];
    const hasil = jalankanProgram(program, kasusAktif.data);
    setJejakLangkah(hasil.jejak);

    let delay = 350;

    program.forEach((blok) => {
      const t1 = setTimeout(() => {
        setHighlightedBlockId(blok.id);
      }, delay);
      timeoutRefs.current.push(t1);

      delay += 550;
    });

    const tFinal = setTimeout(() => {
      setHighlightedBlockId(undefined);
      setSedangJalan(false);
      setDaftarKejadian(hasil.kejadian);

      if (hasil.kejadian.length === 0) {
        setStatusAlgo('idle');
        setPesanAlgo(undefined);
        setPesanList([]);
      } else {
        playSoundAksiAlgo();

        // Kumpulkan semua pesan (mendukung 1 atau 2 kondisi yang terpenuhi)
        const daftarSemuaPesan = hasil.kejadian
          .filter((k) => k.tipe === 'pesan' && k.nilai)
          .map((k) => k.nilai as string);
        setPesanList(daftarSemuaPesan);

        const adaPesan = daftarSemuaPesan.length > 0;
        const adaTolak = hasil.kejadian.some((k) => k.tipe === 'tolak');
        const adaIzinkan = hasil.kejadian.some((k) => k.tipe === 'izinkan');
        const adaBuka = hasil.kejadian.some((k) => k.tipe === 'buka');

        if (adaPesan) {
          setStatusAlgo('pesan');
          setPesanAlgo(daftarSemuaPesan[0]);
        } else if (adaTolak) {
          setStatusAlgo('tolak');
          setPesanAlgo(undefined);
        } else if (adaIzinkan) {
          setStatusAlgo('izinkan');
          setPesanAlgo(undefined);
        } else if (adaBuka) {
          setStatusAlgo('buka');
          setPesanAlgo(undefined);
        } else {
          setStatusAlgo('idle');
          setPesanAlgo(undefined);
        }
      }
    }, delay);

    timeoutRefs.current.push(tFinal);
  };

  // --- 🧪 UJI (EVALUASI SEMUA KASUS) ---
  const handleUjiSemuaKasus = () => {
    const hasil = ujiSemuaKasusLevel(program, varian.dataUji);
    setHasilUji(hasil);
    setIsTestModalOpen(true);

    const gagalSebelumnya = gagalBerturutTurut;
    let bintang = 0;

    if (hasil.semuaLulus) {
      bintang = 3;
      if (totalPetunjukTerbuka > 0) {
        bintang = 1;
      } else if (gagalBerturutTurut > 0) {
        bintang = 2;
      }
      setBintangDiperoleh(bintang);
      setStatusAlgo('sukses');
      playSoundLevelSelesai();
      setGagalBerturutTurut(0);
      resetKegagalanLevel(level.id);
      simpanProgresLevel(level.id, true, bintang, varian.id, program);

      // Hitung badges yang terbuka dan sinkronkan progres ke Supabase
      const semuaProgres = ambilSemuaProgres();
      const badgesTerbuka = ambilStatusBadgeTim(semuaProgres)
        .filter((b) => b.terbuka)
        .map((b) => b.id);

      kirimProgres({
        namaTim: tim.namaTim,
        levelId: level.id,
        selesai: true,
        bintang,
        varianId: varian.id,
        badges: badgesTerbuka,
      });
    } else {
      const updated = catatKegagalanLevel(level.id);
      setGagalBerturutTurut(updated[level.id] || (gagalBerturutTurut + 1));
      playSoundKesalahanLogika();
    }

    // Catat percobaan ke Supabase setiap kali tombol Uji ditekan (best-effort)
    kirimPercobaan({
      namaTim: tim.namaTim,
      levelId: level.id,
      varianId: varian.id,
      semuaLulus: hasil.semuaLulus,
      kasusLulus: hasil.kasusLulus,
      totalKasus: hasil.totalKasus,
      petunjukTerbuka: totalPetunjukTerbuka,
      gagalBerturut: gagalSebelumnya,
      bintangDiperoleh: bintang,
    });
  };

  const handleBukaPetunjukManual = () => {
    setManualPetunjukTerbuka((prev) =>
      Math.min(level.petunjuk.length, Math.max(prev, totalPetunjukTerbuka) + 1)
    );
  };

  const hasJikaInProgram = program.some((b) => b.tipe === 'jika');

  const tampilkanOperator =
    gagalBerturutTurut >= 3 ||
    totalPetunjukTerbuka > 0 ||
    Boolean(ambilProgresLevel(level.id)?.selesai);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between select-none transition-colors">
      {/* 1. Bar Navigasi Atas — Gaya Misi MENARA BUG */}
      <header className="bg-white/95 dark:bg-slate-900/95 border-b-2 border-sky-200 dark:border-slate-800 px-3 py-2.5 md:px-6 md:py-3 sticky top-0 z-30 backdrop-blur-md shadow-xs transition-colors">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Tombol Chunky Kembali ke Peta */}
          <button
            type="button"
            onClick={onKembaliKePeta}
            className="min-h-[44px] px-3.5 py-1.5 rounded-2xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-900 dark:text-sky-300 border-2 border-sky-300 dark:border-slate-700 border-b-4 border-b-sky-400 dark:border-b-slate-900 active:border-b-0 active:translate-y-1 font-black text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Kembali ke Peta Stasiun"
          >
            <ArrowLeft className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            <span className="hidden sm:inline">Peta</span>
          </button>

          {/* Top Bar Judul: Nama Game, Label Misi, Indikator Bintang */}
          <div className="text-center flex flex-col items-center">
            {/* Nama Game */}
            <div className="flex items-center gap-1 text-[11px] font-black text-sky-700 dark:text-sky-400 tracking-wider uppercase font-fredoka">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Ekspedisi Kode: Stasiun Logika</span>
            </div>

            {/* Label Misi & Level */}
            <h1 className="text-sm md:text-base font-black text-slate-900 dark:text-slate-100 flex flex-wrap items-center justify-center gap-1.5">
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-xl font-black text-xs shadow-xs">
                MISI {nomorMisi}
              </span>
              <span>{level.nama}</span>
              {varian.ringkasan && (
                <span className="text-[10px] bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 px-2.5 py-0.5 rounded-full font-bold hidden md:inline">
                  {varian.ringkasan}
                </span>
              )}
            </h1>

            {/* Indikator 3 Bintang Misi */}
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((b) => (
                <Star
                  key={b}
                  className={`w-3.5 h-3.5 transition-colors ${
                    b <= bintangTersimpan
                      ? 'fill-amber-400 text-amber-500'
                      : 'fill-slate-200 dark:fill-slate-700 text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold ml-1">
                Kelompok: <span className="text-amber-700 dark:text-amber-400 font-black">{tim.namaTim}</span>
              </span>
            </div>
          </div>

          {/* Tombol Audio, Tema & Petunjuk */}
          <div className="flex items-center gap-1.5">
            {/* Tombol Mute / Suara */}
            <button
              type="button"
              onClick={() => {
                const nextMuted = !audioMuteState;
                setAudioMuted(nextMuted);
                setAudioMuteState(nextMuted);
              }}
              className="min-h-[44px] min-w-[44px] p-2 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-800 dark:text-slate-200 border-2 border-sky-200 dark:border-slate-700 border-b-4 border-b-sky-300 dark:border-b-slate-900 active:border-b-0 active:translate-y-1 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title={audioMuteState ? 'Aktifkan Efek Suara' : 'Bisukan Efek Suara'}
              aria-label={audioMuteState ? 'Aktifkan Efek Suara' : 'Bisukan Efek Suara'}
            >
              {audioMuteState ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              )}
            </button>

            {/* Menu Pilihan Tema (Terang / Gelap / Sistem) */}
            <ThemeMenu />

            {/* Tombol Petunjuk Chunky */}
            <button
              type="button"
              onClick={() => setIsHintModalOpen(true)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer relative border-2 ${
                gagalBerturutTurut >= 3
                  ? 'bg-amber-400 text-slate-950 border-amber-500 border-b-4 border-b-amber-600 active:border-b-0 active:translate-y-1 shadow-md animate-pulse'
                  : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 border-b-4 border-b-amber-400 dark:border-b-amber-800 active:border-b-0 active:translate-y-1 shadow-xs'
              }`}
              title="Buka petunjuk level"
            >
              <Lightbulb
                className={`w-4 h-4 ${
                  gagalBerturutTurut >= 3 ? 'fill-slate-950 text-slate-950' : 'text-amber-600 dark:text-amber-400'
                }`}
              />
              <span className="hidden sm:inline">Petunjuk</span>
              {totalPetunjukTerbuka > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                    gagalBerturutTurut >= 3
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {totalPetunjukTerbuka}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Badan Editor (3 Bagian Vertikal Mobile-First) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 md:p-4 flex flex-col gap-3">
        {/* Toast Disimpan Otomatis Pastel */}
        {tampilkanToastSimpan && (
          <div className="fixed top-16 right-4 z-40 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-xs font-black px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Program tersimpan otomatis</span>
          </div>
        )}

        {/* Bagian 1: Arena Diorama Isometrik 2.5D (Robot ALGO + Skenario + Sensor) */}
        <section>
          <ArenaView
            level={level}
            varian={varian}
            statusAlgo={statusAlgo}
            sedangJalan={sedangJalan}
            pesanAlgo={pesanAlgo}
            pesanList={pesanList}
            daftarKejadian={daftarKejadian}
            kasusTerpilihIndex={kasusAktifIndex}
            onPilihKasusIndex={setKasusAktifIndex}
            jejakTerakhir={jejakLangkah}
            onBersihkanMonitor={() => setJejakLangkah([])}
            tampilkanOperator={tampilkanOperator}
          />
        </section>

        {/* Banner Petunjuk Bertahap jika Gagal >= 3 Kali */}
        {gagalBerturutTurut >= 3 && (
          <div className="bg-amber-100 border-2 border-amber-400 border-b-4 border-b-amber-500 rounded-3xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Lightbulb className="w-5 h-5 fill-slate-950 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-2 flex-wrap">
                  <span>Bantuan ALGO Terbuka ({gagalBerturutTurut}x Belum Berhasil)</span>
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-mono font-black">
                    {totalPetunjukTerbuka}/{level.petunjuk.length} Petunjuk
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-0.5 leading-snug">
                  ALGO membuka petunjuk logika secara bertahap untuk membantumu memecahkan kode stasiun.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHintModalOpen(true)}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-2xl border-2 border-amber-500 border-b-4 border-b-amber-600 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <Lightbulb className="w-4 h-4 fill-slate-950" />
              <span>Baca Petunjuk #{totalPetunjukTerbuka}</span>
            </button>
          </div>
        )}

        {/* Baris Tombol Aksi Utama Chunky (▶ Jalankan, 🧪 Uji, Reset Program) */}
        <section className="bg-white/95 dark:bg-slate-900/95 border-2 border-sky-200 dark:border-slate-800 rounded-3xl p-2.5 shadow-sm flex items-center justify-between gap-2 flex-wrap transition-colors">
          <div className="flex items-center gap-2">
            {/* Tombol ▶ Jalankan (Chunky Cyan) */}
            <button
              type="button"
              disabled={sedangJalan}
              onClick={handleJalankan}
              className="min-h-[46px] px-5 py-2.5 bg-sky-500 hover:bg-sky-400 active:border-b-0 active:translate-y-1 text-white font-black text-xs md:text-sm rounded-2xl shadow-md border-2 border-sky-600 border-b-4 border-b-sky-700 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Jalankan program pada kasus sensor aktif"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{sedangJalan ? 'Mengeksekusi...' : '▶ Jalankan'}</span>
            </button>

            {/* Tombol 🧪 Uji (Chunky Emerald) */}
            <button
              type="button"
              onClick={handleUjiSemuaKasus}
              className="min-h-[46px] px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:border-b-0 active:translate-y-1 text-white font-black text-xs md:text-sm rounded-2xl shadow-md border-2 border-emerald-600 border-b-4 border-b-emerald-700 flex items-center gap-2 transition-all cursor-pointer"
              title="Uji program pada seluruh kasus uji level stasiun"
            >
              <FlaskConical className="w-4 h-4" />
              <span>🧪 Uji ({varian.dataUji.length} Kasus)</span>
            </button>
          </div>

          {/* Tombol Reset Program (Chunky Stone) */}
          <button
            type="button"
            onClick={handleBukaResetProgram}
            className="min-h-[46px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:border-b-0 active:translate-y-1 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-2xl text-xs font-black border-2 border-slate-300 dark:border-slate-700 border-b-4 border-b-slate-400 dark:border-b-slate-900 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset susunan blok program"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Program</span>
          </button>
        </section>
        {/* Bagian 2: Area Program (Bingkai MULAI ... SELESAI Pastel) */}
        <section className="flex-1 flex flex-col min-h-[300px]">
          <ProgramArea
            program={program}
            pesanTersedia={varian.pesanTersedia}
            highlightedBlockId={highlightedBlockId}
            onUpdateOperator={handleUpdateOperator}
            onUpdateTipeAksi={handleUpdateTipeAksi}
            onUpdatePesanNilai={handleUpdatePesanNilai}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onAddNestedAction={handleAddNestedActionDirect}
            onDeleteNestedAction={handleDeleteNestedAction}
            onUpdateNestedTipeAksi={handleUpdateNestedTipeAksi}
            onUpdateNestedPesan={handleUpdateNestedPesan}
            onReorderBlocks={handleReorderBlocks}
          />
        </section>
      </main>

      {/* Bagian 3: Palet Blok Chunky (Bawah) */}
      <footer className="sticky bottom-0 z-20 max-w-5xl w-full mx-auto">
        <BlockPalette
          level={level}
          varian={varian}
          hasJikaInProgram={hasJikaInProgram}
          program={program}
          onAddBlockRoot={handleAddBlockRoot}
          onAddNestedAction={handleAddNestedAction}
          onAddNestedActionDirect={handleAddNestedActionDirect}
        />
      </footer>

      {/* Modal Evaluasi Kasus Uji */}
      {hasilUji && (
        <TestResultModal
          level={level}
          hasilUji={hasilUji}
          isOpen={isTestModalOpen}
          onClose={() => {
            setIsTestModalOpen(false);
            setHasilUji(null);
          }}
          gagalBerturutTurut={gagalBerturutTurut}
          onBukaPetunjuk={() => setIsHintModalOpen(true)}
          onLanjutLevelBerikutnya={
            onLanjutLevelBerikutnya
              ? () => {
                  setIsTestModalOpen(false);
                  setHasilUji(null);
                  onLanjutLevelBerikutnya();
                }
              : undefined
          }
          onKembaliKePeta={onKembaliKePeta}
          bintangDiperoleh={bintangDiperoleh}
          namaTim={tim.namaTim}
          skenarioRingkasan={varian.ringkasan}
          varianId={varian.id}
          totalPetunjukTerbuka={totalPetunjukTerbuka}
          onUlangiLevel={mulaiUlangPercobaanBersih}
        />
      )}

      {/* Modal Petunjuk Bertahap */}
      <HintModal
        level={level}
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        jumlahPetunjukTerbuka={totalPetunjukTerbuka}
        gagalBerturutTurut={gagalBerturutTurut}
        onBukaPetunjukManual={handleBukaPetunjukManual}
      />

      {/* Modal Konfirmasi Reset Program Pastel */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
          <div className="bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-slate-700 rounded-3xl max-w-md w-full shadow-2xl p-6 text-slate-800 dark:text-slate-100">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-500" />
              <span>Reset Susunan Program</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Kembalikan susunan blok ke keadaan awal level ini? Blok yang telah kamu pasang akan dikosongkan kembali.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleKonfirmasiResetProgram}
                className="min-h-[44px] px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl border-2 border-amber-600 border-b-4 border-b-amber-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function inisialisasiProgramAwal(level: Level, varian: Varian): BlokProgram[] {
  // Misi #4 (Lulus atau Remidi — Mudah)
  if (level.id === 'lulus-atau-remidi') {
    return [
      {
        id: `blok_jika_init_4_${Date.now()}`,
        tipe: 'jika',
        kondisi: {
          namaData: varian.namaData,
          operator: varian.operatorBenar,
          pembanding: varian.pembandingDefault
        },
        punyaSelainItu: true,
        // State inisialisasi aksi dibuat null / kosong secara default agar siswa memilih aksi secara manual
        makaAksi: [
          {
            id: `aksi_maka_init_4_${Date.now()}`,
            tipe: 'aksi',
            tipeAksi: '' as any,
            nilai: ''
          }
        ],
        selainItuAksi: [
          {
            id: `aksi_selainitu_init_4_${Date.now()}`,
            tipe: 'aksi',
            tipeAksi: '' as any,
            nilai: ''
          }
        ]
      }
    ];
  }

  // Misi #5 (Lulus atau Remidi — Menengah)
  if (level.id === 'lulus-atau-remidi-menengah') {
    return [
      {
        id: `blok_jika_init_5_${Date.now()}`,
        tipe: 'jika',
        kondisi: {
          namaData: varian.namaData,
          operator: '<=',
          pembanding: varian.pembandingDefault
        },
        punyaSelainItu: true,
        // State inisialisasi aksi dibuat null / kosong secara default agar siswa memilih aksi secara manual
        makaAksi: [
          {
            id: `aksi_maka_init_5_${Date.now()}`,
            tipe: 'aksi',
            tipeAksi: '' as any,
            nilai: ''
          }
        ],
        selainItuAksi: [
          {
            id: `aksi_selainitu_init_5_${Date.now()}`,
            tipe: 'aksi',
            tipeAksi: '' as any,
            nilai: ''
          }
        ]
      }
    ];
  }

  // Misi #6 (Lulus atau Remidi — Sulit):
  // Bagian area koding Robot ALGO masih kosong secara default (tidak ada palet blok perintah yang terisi),
  // sehingga siswa harus menyusun sendiri seluruh alur logika dari palet blok perintah.
  if (level.id === 'lulus-atau-remidi-sulit') {
    return [];
  }

  return [];
}
