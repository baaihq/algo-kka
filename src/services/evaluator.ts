import { BlokProgram, HasilUjiLevel, HasilEksekusiKasus, KasusUji, Kejadian } from '../types/game';
import { jalankanProgram } from './interpreter';

/**
 * Membandingkan daftar kejadian hasil eksekusi dengan daftar kejadian harapan secara persis.
 * Urutan, jumlah, tipe, dan nilai harus sama persis.
 */
export function bandingkanKejadian(aktual: Kejadian[], harapan: Kejadian[]): boolean {
  if (aktual.length !== harapan.length) {
    return false;
  }

  for (let i = 0; i < harapan.length; i++) {
    const act = aktual[i];
    const exp = harapan[i];

    if (act.tipe !== exp.tipe) return false;

    const actVal = act.nilai !== undefined ? String(act.nilai).trim() : '';
    const expVal = exp.nilai !== undefined ? String(exp.nilai).trim() : '';

    if (actVal !== expVal) return false;
  }

  return true;
}

export function formatKejadian(daftar: Kejadian[]): string {
  if (daftar.length === 0) return '[Tidak ada tindakan]';
  return daftar
    .map((k) => {
      switch (k.tipe) {
        case 'izinkan':
          return 'Izinkan Masuk';
        case 'tolak':
          return 'Tolak Masuk';
        case 'buka':
          return 'Buka Gerbang';
        case 'pesan':
          return `Pesan: "${k.nilai || ''}"`;
        case 'alarm':
          return 'Alarm Bunyi';
      }
    })
    .join(', ');
}

export function buatKalimatUmpanBalik(
  lulus: boolean,
  data: Record<string, string | number>,
  aktual: Kejadian[],
  harapan: Kejadian[]
): string {
  const formatData = Object.entries(data)
    .map(([k, v]) => `${k} = "${v}"`)
    .join(', ');

  if (lulus) {
    if (harapan.length === 0) {
      return `Tepat! Saat ${formatData}, robot ALGO diam sesuai instruksi stasiun.`;
    }
    return `Tepat sekali! Saat ${formatData}, robot berhasil mengeksekusi ${formatKejadian(harapan)}.`;
  }

  // Jika gagal
  const adaIzinkanAtauBuka = aktual.some((k) => k.tipe === 'izinkan' || k.tipe === 'buka');
  const adaTolak = aktual.some((k) => k.tipe === 'tolak');
  if (adaIzinkanAtauBuka && adaTolak) {
    return 'Perhatian: programmu memerintahkan dua aksi bertentangan dalam satu jalur. Periksa kembali logikamu.';
  }

  if (harapan.length === 0 && aktual.length > 0) {
    return `Kurang tepat: Saat ${formatData}, seharusnya tidak ada aksi, tetapi program mengeksekusi ${formatKejadian(aktual)}.`;
  }

  if (harapan.length > 0 && aktual.length === 0) {
    return `Kurang tepat: Saat ${formatData}, diharapkan ${formatKejadian(harapan)}, tetapi robot tidak melakukan tindakan apa pun.`;
  }

  return `Kurang tepat: Harapan adalah ${formatKejadian(harapan)}, sedangkan robot menghasilkan ${formatKejadian(aktual)}.`;
}

export function ujiSemuaKasusLevel(
  program: BlokProgram[],
  daftarKasus: KasusUji[]
): HasilUjiLevel {
  const hasilPerKasus: HasilEksekusiKasus[] = [];
  let kasusLulus = 0;

  for (let i = 0; i < daftarKasus.length; i++) {
    const kasus = daftarKasus[i];
    const hasilInterp = jalankanProgram(program, kasus.data);
    const lulus = bandingkanKejadian(hasilInterp.kejadian, kasus.harapan);

    if (lulus) {
      kasusLulus++;
    }

    const umpanBalik = buatKalimatUmpanBalik(lulus, kasus.data, hasilInterp.kejadian, kasus.harapan);

    hasilPerKasus.push({
      kasusIndex: i,
      data: kasus.data,
      harapan: kasus.harapan,
      dihasilkan: hasilInterp.kejadian,
      lulus,
      pesanEvaluasi: umpanBalik,
      jejakLangkah: hasilInterp.jejak
    });
  }

  const semuaLulus = kasusLulus === daftarKasus.length && daftarKasus.length > 0;

  return {
    semuaLulus,
    totalKasus: daftarKasus.length,
    kasusLulus,
    hasilPerKasus
  };
}
