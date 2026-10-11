import { BlokProgram, ProgresLevel, TimProfil, LeaderboardEntry } from '../types/game';

const STORAGE_KEY_TIM = 'ekspedisi_kode_tim_profil';
const STORAGE_KEY_PROGRES = 'ekspedisi_kode_progres_level';

export function ambilProfilTim(): TimProfil | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TIM);
    if (!raw) return null;
    return JSON.parse(raw) as TimProfil;
  } catch (err) {
    console.error('Gagal membaca profil tim dari localStorage:', err);
    return null;
  }
}

export function simpanProfilTim(namaTim: string): TimProfil {
  const profil: TimProfil = {
    namaTim: namaTim.trim(),
    terdaftarPada: Date.now()
  };
  localStorage.setItem(STORAGE_KEY_TIM, JSON.stringify(profil));
  return profil;
}

export function hapusProfilTim(): void {
  const profil = ambilProfilTim();
  if (profil?.namaTim) {
    hapusEntriLeaderboard(profil.namaTim);
  }
  localStorage.removeItem(STORAGE_KEY_TIM);
  localStorage.removeItem(STORAGE_KEY_PROGRES);
  localStorage.removeItem(STORAGE_KEY_GAGAL);
  localStorage.removeItem(STORAGE_KEY_KEGAGALAN_TOTAL);
  localStorage.removeItem(STORAGE_KEY_PERNAH_GAGAL);
}

export function ambilSemuaProgres(): Record<string, ProgresLevel> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRES);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ProgresLevel>;
  } catch (err) {
    console.error('Gagal membaca progres level dari localStorage:', err);
    return {};
  }
}

export function ambilProgresLevel(levelId: string): ProgresLevel | undefined {
  const semua = ambilSemuaProgres();
  return semua[levelId];
}

export function simpanProgresLevel(
  levelId: string,
  selesai: boolean,
  bintang: number,
  varianAktifId: number,
  programTersimpan?: BlokProgram[]
): ProgresLevel {
  const semua = ambilSemuaProgres();
  const eksis = semua[levelId];

  // Jika level selesai dan belum pernah tercatat gagal, tandai pernahGagal = false
  if (selesai) {
    const pernah = ambilPernahGagalPerLevel();
    if (pernah[levelId] === undefined) {
      pernah[levelId] = false;
      localStorage.setItem(STORAGE_KEY_PERNAH_GAGAL, JSON.stringify(pernah));
    }
  }

  const update: ProgresLevel = {
    levelId,
    selesai: selesai || (eksis ? eksis.selesai : false),
    bintang: Math.max(eksis ? eksis.bintang : 0, bintang),
    varianAktifId,
    programTersimpan: programTersimpan ?? eksis?.programTersimpan,
    terakhirDimainkan: Date.now()
  };

  semua[levelId] = update;
  localStorage.setItem(STORAGE_KEY_PROGRES, JSON.stringify(semua));
  return update;
}

export function simpanProgramSaja(levelId: string, varianAktifId: number, program: BlokProgram[]): void {
  const semua = ambilSemuaProgres();
  const eksis = semua[levelId];
  semua[levelId] = {
    levelId,
    selesai: eksis?.selesai || false,
    bintang: eksis?.bintang || 0,
    varianAktifId,
    programTersimpan: program,
    terakhirDimainkan: Date.now()
  };
  localStorage.setItem(STORAGE_KEY_PROGRES, JSON.stringify(semua));
}

const STORAGE_KEY_GAGAL = 'ekspedisi_kode_gagal_level';
const STORAGE_KEY_KEGAGALAN_TOTAL = 'ekspedisi_kode_kegagalan_total';
const STORAGE_KEY_PERNAH_GAGAL = 'ekspedisi_kode_pernah_gagal';

export function ambilGagalPerLevel(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GAGAL);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, number>;
  } catch (err) {
    return {};
  }
}

export function ambilGagalLevel(levelId: string): number {
  const data = ambilGagalPerLevel();
  return data[levelId] || 0;
}

export function ambilKegagalanTotal(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KEGAGALAN_TOTAL);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, number>;
  } catch (err) {
    return {};
  }
}

export function ambilPernahGagalPerLevel(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERNAH_GAGAL);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch (err) {
    return {};
  }
}

export function catatKegagalanLevel(levelId: string): Record<string, number> {
  const data = ambilGagalPerLevel();
  data[levelId] = (data[levelId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY_GAGAL, JSON.stringify(data));

  // Catat ke total kegagalan kumulatif yang tidak di-reset saat lulus
  const total = ambilKegagalanTotal();
  total[levelId] = (total[levelId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY_KEGAGALAN_TOTAL, JSON.stringify(total));

  // Catat penanda pernahGagal yang menjadi true sejak ada kegagalan
  const pernah = ambilPernahGagalPerLevel();
  pernah[levelId] = true;
  localStorage.setItem(STORAGE_KEY_PERNAH_GAGAL, JSON.stringify(pernah));

  return data;
}

export function resetKegagalanLevel(levelId: string): void {
  const data = ambilGagalPerLevel();
  data[levelId] = 0;
  localStorage.setItem(STORAGE_KEY_GAGAL, JSON.stringify(data));
  // CATATAN: STORAGE_KEY_KEGAGALAN_TOTAL dan STORAGE_KEY_PERNAH_GAGAL TIDAK di-reset di sini!
}

// --- TUTORIAL PROGRESS ---
const STORAGE_KEY_TUTORIAL = 'ekspedisi_kode_tutorial_selesai';

export function ambilStatusTutorial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_TUTORIAL) === 'true';
  } catch (err) {
    return false;
  }
}

export function simpanStatusTutorial(selesai: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_TUTORIAL, selesai ? 'true' : 'false');
  } catch (err) {
    console.error('Gagal menyimpan status tutorial:', err);
  }
}

// --- LEADERBOARD ---
const STORAGE_KEY_LEADERBOARD = 'ekspedisi_kode_leaderboard';

export function ambilLeaderboard(timSaatIni?: { namaTim: string; bintang: number; badgeCount: number }): LeaderboardEntry[] {
  let list: LeaderboardEntry[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = [];
    }
  } catch (err) {
    list = [];
  }

  // Jika ada tim saat ini dan sudah memiliki progres (misalnya bintang > 0), pastikan tim saat ini tercatat di leaderboard
  if (timSaatIni && timSaatIni.namaTim && timSaatIni.bintang > 0) {
    const namaKecil = timSaatIni.namaTim.trim().toLowerCase();
    const existingIndex = list.findIndex(
      (item) => item.namaTim.trim().toLowerCase() === namaKecil
    );

    if (existingIndex !== -1) {
      list[existingIndex] = {
        ...list[existingIndex],
        bintang: Math.max(list[existingIndex].bintang, timSaatIni.bintang),
        badgeCount: Math.max(list[existingIndex].badgeCount, timSaatIni.badgeCount),
        terakhirAktif: Date.now()
      };
    } else {
      list.push({
        id: `team_${Date.now()}`,
        namaTim: timSaatIni.namaTim.trim(),
        bintang: timSaatIni.bintang,
        badgeCount: timSaatIni.badgeCount,
        terakhirAktif: Date.now()
      });
    }

    try {
      localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(list));
    } catch (e) {}
  }

  // Urutkan: Bintang terbanyak, lalu Badge terbanyak, lalu waktu
  list.sort((a, b) => {
    if (b.bintang !== a.bintang) return b.bintang - a.bintang;
    if (b.badgeCount !== a.badgeCount) return b.badgeCount - a.badgeCount;
    return b.terakhirAktif - a.terakhirAktif;
  });

  // Tandai apakah entri merupakan tim saat ini
  const hasil = list.map((item) => ({
    ...item,
    isCurrentTeam: timSaatIni
      ? item.namaTim.trim().toLowerCase() === timSaatIni.namaTim.trim().toLowerCase()
      : false
  }));

  // Ambil 5 teratas
  return hasil.slice(0, 5);
}

export function hapusEntriLeaderboard(namaTim: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (!raw) return;
    const list: LeaderboardEntry[] = JSON.parse(raw);
    const namaKecil = namaTim.trim().toLowerCase();
    const sisa = list.filter(
      (item) => item.namaTim.trim().toLowerCase() !== namaKecil
    );
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(sisa));
  } catch (err) {
    console.error('Gagal menghapus entri leaderboard:', err);
  }
}


