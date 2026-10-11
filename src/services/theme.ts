/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TemaPilihan = 'light' | 'dark' | 'system';

const STORAGE_KEY_TEMA = 'ekspedisi_kode_tema';

/**
 * Membaca pengaturan tema dari localStorage, default 'system'
 */
export function ambilTemaPilihan(): TemaPilihan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMA);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
  } catch (err) {
    console.warn('Gagal membaca tema dari localStorage:', err);
  }
  return 'system';
}

/**
 * Mengecek apakah preferensi perangkat sistem saat ini adalah gelap
 */
export function cekPreferensiSistemGelap(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Mengetahui apakah mode gelap secara efektif aktif (mempertimbangkan 'system')
 */
export function apakahModeGelapEfektif(): boolean {
  const tema = ambilTemaPilihan();
  if (tema === 'dark') return true;
  if (tema === 'light') return false;
  return cekPreferensiSistemGelap();
}

/**
 * Menerapkan class 'dark' pada documentElement (<html>)
 */
export function terapkanTema(tema: TemaPilihan): void {
  if (typeof document === 'undefined') return;

  const isDark = tema === 'dark' || (tema === 'system' && cekPreferensiSistemGelap());
  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Simpan ke localStorage
  try {
    localStorage.setItem(STORAGE_KEY_TEMA, tema);
  } catch (err) {
    console.warn('Gagal menyimpan tema:', err);
  }

  // Update meta theme-color jika ada
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', isDark ? '#090d16' : '#e0f2fe');
}

/**
 * Inisialisasi tema saat aplikasi pertama kali dimuat dan pasang listener perubahan sistem
 */
export function inisialisasiTema(): () => void {
  const temaAwal = ambilTemaPilihan();
  terapkanTema(temaAwal);

  // Pasang mediaQuery listener untuk mendeteksi perubahan tema sistem jika pengguna memilih 'system'
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      const temaSekarang = ambilTemaPilihan();
      if (temaSekarang === 'system') {
        terapkanTema('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else if ('addListener' in mediaQuery) {
      // Fallback browser lama
      (mediaQuery as any).addListener(listener);
      return () => (mediaQuery as any).removeListener(listener);
    }
  }

  return () => {};
}
