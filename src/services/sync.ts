import { supabase } from './supabase';

const KODE_KELAS_KEY = 'ekspedisi_kode_kelas';

export function getKodeKelas(): string | null {
  try {
    return localStorage.getItem(KODE_KELAS_KEY);
  } catch {
    return null;
  }
}

export function setKodeKelas(kode: string): void {
  try {
    localStorage.setItem(KODE_KELAS_KEY, kode.trim());
  } catch (err) {
    console.warn('Gagal menyimpan kode kelas ke localStorage:', err);
  }
}

export interface KirimProgresParams {
  kodeKelas?: string;
  namaTim: string;
  levelId: string;
  selesai: boolean;
  bintang: number;
  varianId: number;
  badges: string[];
}

export async function kirimProgres(params: KirimProgresParams): Promise<void> {
  const kode = (params.kodeKelas || getKodeKelas() || '').trim();
  if (!supabase || !kode) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  try {
    const { error } = await supabase.rpc('simpan_progres', {
      p_kode: kode,
      p_tim: params.namaTim,
      p_level: params.levelId,
      p_selesai: params.selesai,
      p_bintang: params.bintang,
      p_varian: params.varianId,
      p_badges: params.badges,
    });
    if (error) {
      console.warn('Gagal menyimpan progres ke Supabase:', error.message);
    }
  } catch (error) {
    console.warn('Gagal menyinkronkan progres ke Supabase (offline/best-effort):', error);
  }
}

export interface KirimPercobaanParams {
  kodeKelas?: string;
  namaTim: string;
  levelId: string;
  varianId: number;
  semuaLulus: boolean;
  kasusLulus: number;
  totalKasus: number;
  petunjukTerbuka: number;
  gagalBerturut: number;
  bintangDiperoleh: number;
}

export async function kirimPercobaan(params: KirimPercobaanParams): Promise<void> {
  const kode = (params.kodeKelas || getKodeKelas() || '').trim();
  if (!supabase || !kode) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  try {
    const { error } = await supabase.rpc('catat_percobaan', {
      p_kode: kode,
      p_tim: params.namaTim,
      p_level: params.levelId,
      p_varian: params.varianId,
      p_semua_lulus: params.semuaLulus,
      p_kasus_lulus: params.kasusLulus,
      p_total_kasus: params.totalKasus,
      p_petunjuk: params.petunjukTerbuka,
      p_gagal: params.gagalBerturut,
      p_bintang: params.bintangDiperoleh,
    });
    if (error) {
      console.warn('Gagal mencatat percobaan ke Supabase:', error.message);
    }
  } catch (error) {
    console.warn('Gagal menyinkronkan data percobaan ke Supabase (offline/best-effort):', error);
  }
}
