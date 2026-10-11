export type OperatorPerbandingan = '=' | '!=' | '>' | '>=' | '<' | '<=';

export type TipeKejadian = 'izinkan' | 'tolak' | 'buka' | 'pesan' | 'alarm';

export interface Kejadian {
  tipe: TipeKejadian;
  nilai?: string;
}

export interface KasusUji {
  data: Record<string, string | number>;
  harapan: Kejadian[];
  keterangan?: string;
}

export interface Varian {
  id: number;
  ringkasan?: string;
  aturan?: { jika: string; maka: string; selainItu?: string }[];
  konteks: string;
  pesanTersedia: string[];
  dataUji: KasusUji[];
  namaData: string;
  pembandingDefault: string | number;
  operatorBenar: '=' | '!=' | '>' | '>=' | '<' | '<=';
}

export interface Level {
  id: string;
  nama: string;
  cerita: string;
  tujuan: string;
  palet: string[];
  varian: Varian[];
  petunjuk: string[];
  ikon?: string;
}

// Blok Pemrograman
export type TipeAksi = 'izinkan' | 'tolak' | 'buka' | 'pesan' | 'alarm';

export interface KondisiModel {
  namaData: string;
  operator: OperatorPerbandingan;
  pembanding: string | number;
}

export interface BlokAksi {
  id: string;
  tipe: 'aksi';
  tipeAksi: TipeAksi | '' | null;
  nilai?: string; // Untuk pesan (contoh: 'LULUS', 'REMIDI', 'PANAS', 'NORMAL')
}

export interface BlokJika {
  id: string;
  tipe: 'jika';
  kondisi: KondisiModel;
  makaAksi: BlokAksi[];
  punyaSelainItu: boolean;
  selainItuAksi: BlokAksi[];
}

export type BlokProgram = BlokAksi | BlokJika;

export interface HasilEksekusiKasus {
  kasusIndex: number;
  data: Record<string, string | number>;
  harapan: Kejadian[];
  dihasilkan: Kejadian[];
  lulus: boolean;
  pesanEvaluasi: string;
  jejakLangkah?: string[];
}

export interface HasilUjiLevel {
  semuaLulus: boolean;
  totalKasus: number;
  kasusLulus: number;
  hasilPerKasus: HasilEksekusiKasus[];
}

export interface TimProfil {
  namaTim: string;
  terdaftarPada: number;
}

export interface ProgresLevel {
  levelId: string;
  selesai: boolean;
  bintang: number;
  varianAktifId: number;
  programTersimpan?: BlokProgram[];
  terakhirDimainkan?: number;
}

export interface LeaderboardEntry {
  id: string;
  namaTim: string;
  bintang: number;
  badgeCount: number;
  terakhirAktif: number;
  isCurrentTeam?: boolean;
}

