import { ProgresLevel } from '../types/game';
import { ambilKegagalanTotal, ambilPernahGagalPerLevel } from '../services/storage';

export interface Badge {
  id: string;
  nama: string;
  deskripsi: string;
  ikon: string;
  kategori: string;
  syarat: (
    progresMap: Record<string, ProgresLevel>,
    gagalPerLevel?: Record<string, number>,
    kegagalanTotal?: Record<string, number>,
    pernahGagal?: Record<string, boolean>
  ) => boolean;
}

export const DAFTAR_BADGE: Badge[] = [
  {
    id: 'kadet_algo',
    nama: 'Kadet ALGO',
    deskripsi: 'Memulai ekspedisi logika dan mendaftarkan kelompok ke stasiun.',
    ikon: '🤖',
    kategori: 'Dasar',
    syarat: (progresMap) => {
      return Object.keys(progresMap).length > 0;
    }
  },
  {
    id: 'penyelesai_cepat',
    nama: 'Penyelesai Cepat',
    deskripsi: 'Menyelesaikan minimal satu stasiun tanpa memerlukan bantuan petunjuk bertahap.',
    ikon: '⚡',
    kategori: 'Kecepatan',
    syarat: (progresMap, _gagalPerLevel = {}, kegagalanTotal = {}, pernahGagal = {}) => {
      // Terbuka hanya jika ada minimal satu level yang pernahGagal === false (atau total kegagalannya < 3) DAN level itu sudah selesai
      return Object.entries(progresMap).some(([levelId, p]) => {
        if (!p || !p.selesai) return false;
        const totalGagal = kegagalanTotal[levelId] || 0;
        const pernahSalah = pernahGagal[levelId] === true || totalGagal > 0;
        return !pernahSalah || totalGagal < 3;
      });
    }
  },
  {
    id: 'logika_sempurna',
    nama: 'Logika Sempurna',
    deskripsi: 'Menyelesaikan uji kasus stasiun tanpa pernah salah (0 gagal).',
    ikon: '✨',
    kategori: 'Ketepatan',
    syarat: (progresMap, _gagalPerLevel = {}, kegagalanTotal = {}, pernahGagal = {}) => {
      // Terbuka hanya jika ADA minimal satu level yang pernahGagal === false DAN level itu sudah selesai
      return Object.entries(progresMap).some(([levelId, p]) => {
        if (!p || !p.selesai) return false;
        const pernahSalah = pernahGagal[levelId] === true || (kegagalanTotal[levelId] || 0) > 0;
        return !pernahSalah;
      });
    }
  },
  {
    id: 'ahli_percabangan',
    nama: 'Ahli Percabangan',
    deskripsi: 'Berhasil memprogram struktur JIKA - MAKA - SELAIN ITU pada level Lulus atau Remidi.',
    ikon: '🛡️',
    kategori: 'Algoritma',
    syarat: (progresMap) => {
      const p = progresMap['lulus-atau-remidi'];
      return Boolean(p && p.selesai);
    }
  },
  {
    id: 'inspektur_stasiun',
    nama: 'Inspektur Stasiun',
    deskripsi: 'Menyelesaikan seluruh stasiun dalam Ekspedisi Kode dengan predikat bintang penuh.',
    ikon: '🏆',
    kategori: 'Prestasi',
    syarat: (progresMap) => {
      const levelIds = [
        'gerbang-tamu',
        'gerbang-tamu-menengah',
        'gerbang-tamu-sulit',
        'lulus-atau-remidi',
        'lulus-atau-remidi-menengah',
        'lulus-atau-remidi-sulit'
      ];
      return levelIds.every((id) => Boolean(progresMap[id]?.selesai && progresMap[id]?.bintang === 3));
    }
  }
];

export interface StatusBadge extends Badge {
  terbuka: boolean;
}

export function ambilStatusBadgeTim(
  progresMap: Record<string, ProgresLevel>,
  gagalPerLevel: Record<string, number> = {},
  kegagalanTotal?: Record<string, number>,
  pernahGagal?: Record<string, boolean>
): StatusBadge[] {
  const totalGagal = kegagalanTotal ?? ambilKegagalanTotal();
  const flagPernahGagal = pernahGagal ?? ambilPernahGagalPerLevel();

  return DAFTAR_BADGE.map((b) => ({
    ...b,
    terbuka: b.syarat(progresMap, gagalPerLevel, totalGagal, flagPernahGagal)
  }));
}
