import { BlokProgram, BlokAksi, BlokJika, Kejadian, KondisiModel, OperatorPerbandingan } from '../types/game';

export interface HasilInterpretasi {
  kejadian: Kejadian[];
  jejak: string[];
  blokTerlewatiIds: string[];
}

export function evaluasiKondisi(
  data: Record<string, string | number>,
  kondisi: KondisiModel
): { hasil: boolean; log: string } {
  const nilaiData = data[kondisi.namaData];
  const pembanding = kondisi.pembanding;
  const operator: OperatorPerbandingan = kondisi.operator;

  if (nilaiData === undefined) {
    return {
      hasil: false,
      log: `Data "${kondisi.namaData}" tidak ditemukan pada sensor stasiun!`
    };
  }

  // Jika kedua nilai adalah angka
  const adalahAngka = !isNaN(Number(nilaiData)) && !isNaN(Number(pembanding));
  let hasil = false;

  if (adalahAngka) {
    const numA = Number(nilaiData);
    const numB = Number(pembanding);

    switch (operator) {
      case '=':
        hasil = numA === numB;
        break;
      case '!=':
        hasil = numA !== numB;
        break;
      case '>':
        hasil = numA > numB;
        break;
      case '>=':
        hasil = numA >= numB;
        break;
      case '<':
        hasil = numA < numB;
        break;
      case '<=':
        hasil = numA <= numB;
        break;
    }
  } else {
    // Perbandingan teks string (case-sensitive or normalized)
    const strA = String(nilaiData).trim();
    const strB = String(pembanding).trim();

    switch (operator) {
      case '=':
        hasil = strA === strB;
        break;
      case '!=':
        hasil = strA !== strB;
        break;
      case '>':
        hasil = strA > strB;
        break;
      case '>=':
        hasil = strA >= strB;
        break;
      case '<':
        hasil = strA < strB;
        break;
      case '<=':
        hasil = strA <= strB;
        break;
    }
  }

  const statusTeks = hasil ? 'BENAR' : 'SALAH';
  const log = `Evaluasi: [${kondisi.namaData}: "${nilaiData}"] ${operator} ["${pembanding}"] → ${statusTeks}`;
  return { hasil, log };
}

function eksekusiAksi(blok: BlokAksi, daftarKejadian: Kejadian[], jejak: string[], blokIds: string[]): void {
  blokIds.push(blok.id);
  if (!blok.tipeAksi) {
    jejak.push('⚠️ Aksi perintah belum dipilih (masih kosong). Silakan pilih aksi terlebih dahulu.');
    return;
  }
  switch (blok.tipeAksi) {
    case 'izinkan':
      daftarKejadian.push({ tipe: 'izinkan' });
      jejak.push('Robot ALGO menjalankan: "Izinkan Masuk" (Pintu terbuka).');
      break;
    case 'tolak':
      daftarKejadian.push({ tipe: 'tolak' });
      jejak.push('Robot ALGO menjalankan: "Tolak Masuk" (Akses ditolak).');
      break;
    case 'buka':
      daftarKejadian.push({ tipe: 'buka' });
      jejak.push('Robot ALGO menjalankan: "Buka Gerbang" (Dermaga kargo terbuka).');
      break;
    case 'pesan':
      daftarKejadian.push({ tipe: 'pesan', nilai: blok.nilai || '' });
      jejak.push(`Robot ALGO menampilkan pesan: "${blok.nilai || '(kosong)'}"`);
      break;
    case 'alarm':
      daftarKejadian.push({ tipe: 'alarm' });
      jejak.push('Robot ALGO menyalakan sirine alarm!');
      break;
  }
}

export function jalankanProgram(
  program: BlokProgram[],
  data: Record<string, string | number>
): HasilInterpretasi {
  const kejadian: Kejadian[] = [];
  const jejak: string[] = [];
  const blokTerlewatiIds: string[] = [];

  jejak.push(`=== MEMULAI PROGRAM (Data: ${JSON.stringify(data)}) ===`);

  for (const blok of program) {
    blokTerlewatiIds.push(blok.id);

    if (blok.tipe === 'aksi') {
      eksekusiAksi(blok, kejadian, jejak, blokTerlewatiIds);
    } else if (blok.tipe === 'jika') {
      const evalRes = evaluasiKondisi(data, blok.kondisi);
      jejak.push(evalRes.log);

      if (evalRes.hasil) {
        jejak.push('>> Kondisi BENAR: Memasuki blok MAKA');
        if (blok.makaAksi.length === 0) {
          jejak.push('(Rongga MAKA kosong, tidak ada aksi)');
        }
        for (const aksi of blok.makaAksi) {
          eksekusiAksi(aksi, kejadian, jejak, blokTerlewatiIds);
        }
      } else {
        jejak.push('>> Kondisi SALAH');
        if (blok.punyaSelainItu) {
          jejak.push('>> Memasuki blok SELAIN ITU');
          if (blok.selainItuAksi.length === 0) {
            jejak.push('(Rongga SELAIN ITU kosong, tidak ada aksi)');
          }
          for (const aksi of blok.selainItuAksi) {
            eksekusiAksi(aksi, kejadian, jejak, blokTerlewatiIds);
          }
        } else {
          jejak.push('>> Tidak ada blok SELAIN ITU, lewati percabangan.');
        }
      }
    }
  }

  // Deteksi aksi bertentangan dalam satu jalur eksekusi
  const adaIzinkanAtauBuka = kejadian.some((k) => k.tipe === 'izinkan' || k.tipe === 'buka');
  const adaTolak = kejadian.some((k) => k.tipe === 'tolak');
  if (adaIzinkanAtauBuka && adaTolak) {
    jejak.push('⚠️ Perhatian: programmu memerintahkan dua aksi bertentangan dalam satu jalur. Periksa kembali logikamu.');
  }

  jejak.push('=== PROGRAM SELESAI ===');

  return {
    kejadian,
    jejak,
    blokTerlewatiIds
  };
}
