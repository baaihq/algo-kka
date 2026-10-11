// Utilitas efek suara sintetis menggunakan Web Audio API murni (tanpa file audio eksternal)
// Bekerja 100% offline di browser

const MUTE_STORAGE_KEY = 'ekspedisi_kode_audio_muted';

let audioCtx: AudioContext | null = null;
let audioMuted: boolean = typeof localStorage !== 'undefined'
  ? localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
  : false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }

  // Resume context jika ter-suspended karena kebijakan autoplay browser
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Cek status mute suara
 */
export function isAudioMuted(): boolean {
  return audioMuted;
}

/**
 * Mengatur mute / unmute suara dan menyimpannya ke localStorage
 */
export function setAudioMuted(muted: boolean): void {
  audioMuted = muted;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
    } catch {
      // Abaikan jika ada pembatasan kuota
    }
  }
}

/**
 * Mainkan nada sederhana dengan envelope attack-decay
 */
function playTone(
  frequency: number,
  type: OscillatorType = 'sine',
  duration: number = 0.15,
  gainLevel: number = 0.12,
  startTimeOffset: number = 0
): void {
  if (audioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTimeOffset);

    const now = ctx.currentTime + startTimeOffset;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Abaikan jika browser memblokir audio sementara
  }
}

/**
 * Efek suara saat blok kode dipasang atau dihubungkan ke program
 * Menghasilkan bunyi klik / pop "snappy" yang memuaskan
 */
export function playSoundBlokDipasang(): void {
  if (audioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Glissando frekuensi cepat dari 440Hz naik ke 880Hz (bunyi klik snap)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Fail silently
  }
}

/**
 * Efek suara kustom untuk blok dilepas / dihapus
 */
export function playSoundBlokDihapus(): void {
  if (audioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frekuensi turun lembut
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Fail silently
  }
}

/**
 * Efek suara saat level selesai (semua kasus uji lulus / kemenangan)
 * Arpeggio melodi riang (C5 - E5 - G5 - B5 - C6)
 */
export function playSoundLevelSelesai(): void {
  if (audioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.10, gain: 0.14, type: 'triangle' as OscillatorType }, // C5
      { freq: 659.25, time: 0.09, dur: 0.10, gain: 0.15, type: 'triangle' as OscillatorType }, // E5
      { freq: 783.99, time: 0.18, dur: 0.12, gain: 0.16, type: 'triangle' as OscillatorType }, // G5
      { freq: 987.77, time: 0.28, dur: 0.12, gain: 0.18, type: 'triangle' as OscillatorType }, // B5
      { freq: 1046.50, time: 0.38, dur: 0.50, gain: 0.22, type: 'sine' as OscillatorType }      // C6
    ];

    notes.forEach((n) => {
      playTone(n.freq, n.type, n.dur, n.gain, n.time);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Alias untuk playSoundLevelSelesai (sukses target)
 */
export function playSoundSuksesTarget(): void {
  playSoundLevelSelesai();
}

/**
 * Efek suara saat terjadi kesalahan logika / kasus uji gagal
 * Menghasilkan nada disonan rendah (error buzz)
 */
export function playSoundKesalahanLogika(): void {
  if (audioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Dual oscillator sawtooth + square disonan
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(185, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.28);

    gain2.gain.setValueAtTime(0.001, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.10);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.28);
  } catch {
    // Fail silently
  }
}

/**
 * Efek suara saat tombol Jalankan dipencet
 */
export function playSoundJalankan(): void {
  if (audioMuted) return;
  playTone(330, 'sine', 0.08, 0.1, 0);
  playTone(660, 'triangle', 0.12, 0.12, 0.06);
}

/**
 * Efek suara saat aksi berhasil dieksekusi oleh ALGO di arena (mis. Izinkan/Buka gerbang)
 */
export function playSoundAksiAlgo(): void {
  if (audioMuted) return;
  playTone(587.33, 'triangle', 0.12, 0.12, 0); // D5
  playTone(880.00, 'sine', 0.16, 0.12, 0.08);   // A5
}

/**
 * Efek suara klik UI umum
 */
export function playSoundKlik(): void {
  if (audioMuted) return;
  playTone(800, 'sine', 0.04, 0.08, 0);
}

