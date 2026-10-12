import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface ClassItem {
  id: string;
  kode: string;
  nama: string;
  teacher_id: string;
  dibuat_pada: string;
}

export interface TeamItem {
  class_code: string;
  nama_tim: string;
  badges: string[];
  terakhir_aktif: string;
}

export interface LevelProgressItem {
  class_code: string;
  nama_tim: string;
  level_id: string;
  selesai: boolean;
  bintang: number;
  varian_id: number;
  terakhir_dimainkan: string;
}

export interface AttemptItem {
  class_code: string;
  nama_tim: string;
  level_id: string;
  varian_id: number;
  semua_lulus: boolean;
  kasus_lulus: number;
  total_kasus: number;
  petunjuk_terbuka: number;
  gagal_berturut: number;
  bintang_diperoleh: number;
  dibuat_pada: string;
}

export interface TeamSummary {
  nama_tim: string;
  totalBintang: number;
  badges: string[];
  terakhir_aktif: string;
  progressList: LevelProgressItem[];
  attempts: AttemptItem[];
}

export interface ClassDataResult {
  kelas: ClassItem;
  teams: TeamSummary[];
}

/**
 * Otentikasi Guru: Masuk menggunakan email & password
 */
export async function signIn(email: string, password: string):Promise<{ user: User | null; error: Error | null }> {
  if (!supabase) {
    return { user: null, error: new Error('Layanan Supabase belum dikonfigurasi.') };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { user: null, error: new Error(error.message) };
    }
    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal masuk akun guru.';
    return { user: null, error: new Error(message) };
  }
}

/**
 * Otentikasi Guru: Keluar sesi
 */
export async function signOut(): Promise<{ error: Error | null }> {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: new Error(error.message) };
    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal keluar sesi.';
    return { error: new Error(message) };
  }
}

/**
 * Mengambil sesi guru saat ini
 */
export async function getSesi(): Promise<Session | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Mengambil daftar kelas milik guru yang sedang login
 */
export async function daftarKelas(): Promise<ClassItem[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('dibuat_pada', { ascending: false });

    if (error) {
      console.error('Gagal mengambil daftar kelas:', error.message);
      return [];
    }
    return (data as ClassItem[]) || [];
  } catch (err) {
    console.error('Error daftarKelas:', err);
    return [];
  }
}

/**
 * Menghasilkan kode kelas acak alfanumerik 6 karakter (huruf besar & angka tanpa ambigu)
 */
function generateKodeKelas(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hasil = '';
  for (let i = 0; i < 6; i++) {
    hasil += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hasil;
}

/**
 * Membuat kelas baru milik guru yang sedang login
 */
export async function buatKelas(nama: string): Promise<{ data: ClassItem | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Layanan Supabase belum dikonfigurasi.') };
  }
  const namaTrim = nama.trim();
  if (!namaTrim) {
    return { data: null, error: new Error('Nama kelas tidak boleh kosong.') };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) {
      return { data: null, error: new Error('Sesi guru tidak ditemukan. Silakan login kembali.') };
    }

    // Coba beberapa kali untuk menjamin keunikan kode
    let lastError: Error | null = null;
    for (let percobaan = 0; percobaan < 5; percobaan++) {
      const kode = generateKodeKelas();
      const { data, error } = await supabase
        .from('classes')
        .insert({
          kode,
          nama: namaTrim,
          teacher_id: user.id,
        })
        .select()
        .single();

      if (!error && data) {
        return { data: data as ClassItem, error: null };
      }
      lastError = error ? new Error(error.message) : new Error('Gagal membuat kelas.');
    }
    return { data: null, error: lastError || new Error('Gagal membuat kelas baru.') };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat kelas.';
    return { data: null, error: new Error(message) };
  }
}

/**
 * Mengambil data lengkap kelas: info kelas, tim, level_progress, dan 5 attempts terbaru per tim
 */
export async function dataKelas(kode: string): Promise<{ data: ClassDataResult | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Layanan Supabase belum dikonfigurasi.') };
  }
  const kodeTrim = kode.trim().toUpperCase();

  try {
    // 1. Ambil info kelas
    const { data: kelasData, error: kelasError } = await supabase
      .from('classes')
      .select('*')
      .eq('kode', kodeTrim)
      .maybeSingle();

    if (kelasError) {
      return { data: null, error: new Error(kelasError.message) };
    }
    if (!kelasData) {
      return { data: null, error: new Error(`Kelas dengan kode "${kodeTrim}" tidak ditemukan atau Anda tidak memiliki akses.`) };
    }

    // 2. Ambil data tim di kelas tersebut
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('class_code', kodeTrim)
      .order('terakhir_aktif', { ascending: false });

    if (teamsError) {
      return { data: null, error: new Error(teamsError.message) };
    }

    const daftarTim: TeamItem[] = (teamsData as TeamItem[]) || [];

    // 3. Ambil data level_progress kelas
    const { data: progressData, error: progressError } = await supabase
      .from('level_progress')
      .select('*')
      .eq('class_code', kodeTrim);

    if (progressError) {
      return { data: null, error: new Error(progressError.message) };
    }
    const allProgress: LevelProgressItem[] = (progressData as LevelProgressItem[]) || [];

    // 4. Ambil attempts kelas diurutkan dari yang terbaru
    const { data: attemptsData, error: attemptsError } = await supabase
      .from('attempts')
      .select('*')
      .eq('class_code', kodeTrim)
      .order('dibuat_pada', { ascending: false });

    if (attemptsError) {
      return { data: null, error: new Error(attemptsError.message) };
    }
    const allAttempts: AttemptItem[] = (attemptsData as AttemptItem[]) || [];

    // 5. Kelompokkan data per tim (termasuk 5 attempt terbaru)
    const teamsSummary: TeamSummary[] = daftarTim.map((tim) => {
      const timProgress = allProgress.filter((p) => p.nama_tim === tim.nama_tim);
      const timAttempts = allAttempts
        .filter((a) => a.nama_tim === tim.nama_tim)
        .slice(0, 5); // 5 attempt terbaru per tim

      // Hitung total bintang dari level_progress
      const totalBintang = timProgress.reduce((acc, curr) => acc + (curr.bintang || 0), 0);

      return {
        nama_tim: tim.nama_tim,
        totalBintang,
        badges: Array.isArray(tim.badges) ? tim.badges : [],
        terakhir_aktif: tim.terakhir_aktif,
        progressList: timProgress,
        attempts: timAttempts,
      };
    });

    return {
      data: {
        kelas: kelasData as ClassItem,
        teams: teamsSummary,
      },
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan mengambil data kelas.';
    return { data: null, error: new Error(message) };
  }
}
