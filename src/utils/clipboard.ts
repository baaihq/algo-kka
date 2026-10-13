/**
 * Helper untuk menyalin teks ke clipboard dengan dukungan fallback untuk lingkungan iframe
 */
export async function salinKeClipboard(teks: string): Promise<boolean> {
  // 1. Coba navigator.clipboard modern
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(teks);
      return true;
    } catch {
      // Fallback ke execCommand
    }
  }

  // 2. Fallback textarea element (kompatibel dengan berbagai browser & iframe sandbox)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = teks;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const berhasil = document.execCommand('copy');
    textArea.remove();
    return berhasil;
  } catch (err) {
    console.error('Gagal menyalin teks ke clipboard:', err);
    return false;
  }
}

export interface ParameterRingkasanSkorLevel {
  namaTim: string;
  namaLevel: string;
  skenario?: string;
  varianId?: number;
  bintang?: number;
  semuaLulus: boolean;
  kasusLulus: number;
  totalKasus: number;
  totalPetunjukTerbuka?: number;
  percobaanGagal?: number;
}

/**
 * Membuat teks ringkasan skor akhir level yang rapi dan menarik untuk dipamerkan di kelas
 */
export function buatTeksRingkasanSkorLevel(params: ParameterRingkasanSkorLevel): string {
  const {
    namaTim,
    namaLevel,
    skenario,
    varianId,
    bintang = 3,
    semuaLulus,
    kasusLulus,
    totalKasus,
    totalPetunjukTerbuka = 0,
    percobaanGagal = 0
  } = params;

  const bintangVisual = '⭐'.repeat(bintang) + '☆'.repeat(Math.max(0, 3 - bintang));

  if (semuaLulus) {
    const infoBantuan =
      totalPetunjukTerbuka === 0
        ? 'Murni Tanpa Petunjuk! 🧠⚡'
        : `${totalPetunjukTerbuka} Petunjuk Terbuka 💡`;

    const garis = '━'.repeat(25);
    return [
      `🚀 *EKSPEDISI KODE: STASIUN LOGIKA*`,
      garis,
      `👥 Kelompok: *${namaTim}*`,
      `🛰️ Stasiun: *${namaLevel}*`,
      skenario ? `🏷️ Skenario: ${skenario}${varianId ? ` (Varian #${varianId})` : ''}` : '',
      `🏆 Status: *LULUS 100%* ✅`,
      `⭐ Skor: *${bintang}/3 Bintang* (${bintangVisual})`,
      `🧪 Kasus Uji: ${kasusLulus}/${totalKasus} Kasus Selesai`,
      `💡 Bantuan: ${infoBantuan}`,
      `🤖 Robot ALGO sukses membuka gerbang stasiun!`,
      garis,
      `Bisa kalahkan catatan logikaku? 😏🔥`
    ]
      .filter(Boolean)
      .join('\n');
  }

  const garis = '━'.repeat(25);
  return [
    `🚀 *EKSPEDISI KODE: STASIUN LOGIKA*`,
    garis,
    `👥 Kelompok: *${namaTim}*`,
    `🛰️ Stasiun: *${namaLevel}*`,
    skenario ? `🏷️ Skenario: ${skenario}${varianId ? ` (Varian #${varianId})` : ''}` : '',
    `⚠️ Status: Masih Menganalisis (${kasusLulus}/${totalKasus} Kasus Lulus)`,
    percobaanGagal > 0 ? `🔄 Percobaan Gagal: ${percobaanGagal}x` : '',
    `🤖 Robot ALGO sedang menyempurnakan algoritma!`,
    garis
  ]
    .filter(Boolean)
    .join('\n');
}

export interface ParameterRingkasanProgresTim {
  namaTim: string;
  totalBintang: number;
  maksimalBintang: number;
  badgeCount: number;
  totalBadge: number;
  levelSelesaiCount: number;
  totalLevel: number;
}

/**
 * Membuat teks ringkasan pencapaian seluruh stasiun tim
 */
export function buatTeksRingkasanProgresTim(params: ParameterRingkasanProgresTim): string {
  const {
    namaTim,
    totalBintang,
    maksimalBintang,
    badgeCount,
    totalBadge,
    levelSelesaiCount,
    totalLevel
  } = params;

  const garis = '━'.repeat(25);
  return [
    `🚀 *EKSPEDISI KODE: STASIUN LOGIKA*`,
    garis,
    `👥 Kelompok: *${namaTim}*`,
    `⭐ Total Bintang: *${totalBintang}/${maksimalBintang} Bintang*`,
    `🎖️ Koleksi Badge: *${badgeCount}/${totalBadge} Badge*`,
    `🛰️ Stasiun Selesai: *${levelSelesaiCount}/${totalLevel} Stasiun*`,
    garis,
    `Robot ALGO siap menaklukkan seluruh stasiun luar angkasa! 🌌`
  ].join('\n');
}
