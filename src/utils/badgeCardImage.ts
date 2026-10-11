import { StatusBadge } from '../data/badges';

export interface ParameterKoleksiBadge {
  namaTim: string;
  totalBintang: number;
  badges: StatusBadge[];
}

export interface ParameterSatuBadge {
  namaTim: string;
  totalBintang?: number;
  badge: StatusBadge;
}

/**
 * Helper untuk menggambar teks dengan word wrapping pada canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      lineCount++;
      if (lineCount >= maxLines) {
        return currentY;
      }
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (lineCount < maxLines) {
    ctx.fillText(line.trim(), x, currentY);
  }
  return currentY;
}

/**
 * Helper untuk menggambar rounded rectangle dengan fallback
 */
function roundRectPolyfill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
}

/**
 * Membuat Blob Gambar PNG Sertifikat Koleksi Badge Tim
 */
export async function buatGambarKoleksiBadge(params: ParameterKoleksiBadge): Promise<Blob> {
  const width = 1000;
  const height = 620;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Gagal mendapatkan konteks 2D canvas');
  }

  // 1. Background Gradient Kosmik
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#030712');
  bgGrad.addColorStop(0.45, '#0b192e');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Radial Glow Effects
  const glowGrad1 = ctx.createRadialGradient(250, 140, 20, 250, 140, 360);
  glowGrad1.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
  glowGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad1;
  ctx.beginPath();
  ctx.arc(250, 140, 360, 0, Math.PI * 2);
  ctx.fill();

  const glowGrad2 = ctx.createRadialGradient(800, 420, 20, 800, 420, 360);
  glowGrad2.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
  glowGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad2;
  ctx.beginPath();
  ctx.arc(800, 420, 360, 0, Math.PI * 2);
  ctx.fill();

  // 2. Bingkai Luar
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Corner Accents
  const corners = [
    [20, 20],
    [width - 20, 20],
    [20, height - 20],
    [width - 20, height - 20]
  ];
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3. Header Top Pills
  // Left: Ekspedisi Kode
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPolyfill(ctx, 50, 42, 420, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('🚀 EKSPEDISI KODE: STASIUN LOGIKA', 70, 66);

  // Right: Status Verifikasi
  const jumlahTerbuka = params.badges.filter((b) => b.terbuka).length;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  roundRectPolyfill(ctx, width - 340, 42, 290, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#34d399';
  ctx.fillText('STATUS: RESMI TERVERIFIKASI ✅', width - 325, 66);

  // 4. Judul Sertifikat
  ctx.font = 'black 30px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('BUKTI PENCAPAIAN KOLEKSI BADGE', 50, 122);

  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Sertifikat Resmi Kelulusan & Penguasaan Konsep Logika ALGO', 50, 146);

  // 5. Container Card Utama
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRectPolyfill(ctx, 50, 165, width - 100, 385, 20);
  ctx.fill();
  ctx.stroke();

  // Baris Info Tim & Skor
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('NAMA TIM / KELOMPOK:', 75, 198);

  ctx.font = 'bold 26px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(params.namaTim, 75, 230);

  // Stats Box (Kanan Atas Card)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.beginPath();
  roundRectPolyfill(ctx, width - 420, 180, 345, 55, 14);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText(`⭐ Total Bintang: ${params.totalBintang}/18`, width - 400, 205);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`🎖️ Badge: ${jumlahTerbuka}/${params.badges.length} Terbuka`, width - 400, 225);

  // 6. Grid Badge (5 Badge dalam 2 baris)
  // Baris 1: 3 badge (x: 75, 375, 675)
  // Baris 2: 2 badge (x: 160, 525)
  const badgeCardWidth = 270;
  const badgeCardHeight = 110;

  params.badges.forEach((b, idx) => {
    let bx = 75;
    let by = 260;

    if (idx < 3) {
      bx = 75 + idx * (badgeCardWidth + 20);
      by = 255;
    } else {
      bx = 160 + (idx - 3) * (badgeCardWidth + 90);
      by = 385;
    }

    const cardW = idx >= 3 ? badgeCardWidth + 70 : badgeCardWidth;

    // Card background
    if (b.terbuka) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    } else {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
    }
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRectPolyfill(ctx, bx, by, cardW, badgeCardHeight, 14);
    ctx.fill();
    ctx.stroke();

    // Icon Circle
    ctx.fillStyle = b.terbuka ? 'rgba(251, 191, 36, 0.25)' : 'rgba(51, 65, 85, 0.6)';
    ctx.strokeStyle = b.terbuka ? '#fbbf24' : '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx + 32, by + 40, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Emoji / Icon
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.terbuka ? b.ikon : '🔒', bx + 32, by + 41);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Badge Name
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = b.terbuka ? '#ffffff' : '#94a3b8';
    ctx.fillText(b.nama, bx + 64, by + 34);

    // Status & Kategori Tag
    ctx.font = 'bold 11px sans-serif';
    if (b.terbuka) {
      ctx.fillStyle = '#34d399';
      ctx.fillText(`✓ TERBUKA • ${b.kategori}`, bx + 64, by + 52);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.fillText(`TERKUNCI • ${b.kategori}`, bx + 64, by + 52);
    }

    // Deskripsi (1-2 baris singkat)
    ctx.font = '11px sans-serif';
    ctx.fillStyle = b.terbuka ? '#cbd5e1' : '#64748b';
    wrapText(ctx, b.deskripsi, bx + 14, by + 78, cardW - 28, 14, 2);
  });

  // 7. Watermark Footer
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('🤖 Verifikasi Otomatis Sistem Pembelajaran Logika ALGO • AI Studio Build', 50, 580);

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('Ekspedisi Kode', width - 150, 580);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Gagal mengkonversi canvas ke Blob'));
      }
    }, 'image/png');
  });
}

/**
 * Membuat Blob Gambar PNG Sertifikat Satu Badge Spesifik
 */
export async function buatGambarSatuBadge(params: ParameterSatuBadge): Promise<Blob> {
  const width = 1000;
  const height = 580;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Gagal mendapatkan konteks 2D canvas');
  }

  const { badge, namaTim, totalBintang = 0 } = params;

  // 1. Background Gradient Kosmik
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#030712');
  bgGrad.addColorStop(0.5, '#0d233a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Radial Glow Effects
  const glowGrad1 = ctx.createRadialGradient(230, 290, 30, 230, 290, 320);
  glowGrad1.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
  glowGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad1;
  ctx.beginPath();
  ctx.arc(230, 290, 320, 0, Math.PI * 2);
  ctx.fill();

  const glowGrad2 = ctx.createRadialGradient(780, 240, 20, 780, 240, 340);
  glowGrad2.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
  glowGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad2;
  ctx.beginPath();
  ctx.arc(780, 240, 340, 0, Math.PI * 2);
  ctx.fill();

  // 2. Bingkai Luar
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Corner Accents
  const corners = [
    [20, 20],
    [width - 20, 20],
    [20, height - 20],
    [width - 20, height - 20]
  ];
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3. Header Top Pills
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPolyfill(ctx, 50, 42, 420, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('🚀 EKSPEDISI KODE: STASIUN LOGIKA', 70, 66);

  // Status Badge
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  roundRectPolyfill(ctx, width - 340, 42, 290, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#34d399';
  ctx.fillText('BADGE RESMI TERVERIFIKASI ✅', width - 325, 66);

  // 4. Judul Sertifikat
  ctx.font = 'black 30px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('BUKTI PEROLEHAN BADGE LOGIKA', 50, 122);

  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Sertifikat Penghargaan Prestasi Logika & Pemrograman Robot ALGO', 50, 146);

  // 5. Card Container Utama
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRectPolyfill(ctx, 50, 168, width - 100, 345, 22);
  ctx.fill();
  ctx.stroke();

  // LEFT SIDE: Medallion Pedestal (x: 80 to 350)
  const medX = 215;
  const medY = 320;

  // Outer Golden Ring with Shadow
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 25;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(medX, medY, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Golden Ring
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(medX, medY, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Medallion Emoji
  ctx.font = '72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge.ikon, medX, medY);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Category Tag under Medallion
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPolyfill(ctx, medX - 95, medY + 100, 190, 32, 16);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText(`KATEGORI: ${badge.kategori.toUpperCase()}`, medX, medY + 121);
  ctx.textAlign = 'left';

  // RIGHT SIDE: Badge Details
  const rightX = 370;

  // Nama Badge
  ctx.font = 'black 32px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(badge.nama.toUpperCase(), rightX, 222);

  // Separator Line
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rightX, 238);
  ctx.lineTo(width - 80, 238);
  ctx.stroke();

  // Diberikan Kepada Tim
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('DIANUGERAHKAN KEPADA TIM:', rightX, 266);

  ctx.font = 'bold 26px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(namaTim, rightX, 298);

  // Deskripsi Tantangan
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('TANTANGAN YANG DISELESAIKAN:', rightX, 336);

  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#e2e8f0';
  wrapText(ctx, badge.deskripsi, rightX, 360, width - rightX - 85, 22, 2);

  // Status & Achievement Box
  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPolyfill(ctx, rightX, 420, width - rightX - 80, 65, 16);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#34d399';
  ctx.fillText('✓ STATUS: LULUS & RESMI DITERBITKAN', rightX + 20, 447);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`⭐ Total Bintang: ${totalBintang} Bintang Stasiun Terkumpul`, rightX + 20, 469);

  // 6. Watermark Footer
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('🤖 Verifikasi Otomatis Sistem Pembelajaran Logika ALGO • AI Studio Build', 50, 545);

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('Ekspedisi Kode', width - 150, 545);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Gagal mengkonversi canvas ke Blob'));
      }
    }, 'image/png');
  });
}

/**
 * Membagikan Gambar Seluruh Koleksi Badge Tim ke WhatsApp
 */
export async function bagikanKoleksiBadgeKeWhatsApp(
  params: ParameterKoleksiBadge
): Promise<{ sukses: boolean; mode: 'webshare' | 'whatsapp' | 'canceled'; pesan: string }> {
  try {
    const blob = await buatGambarKoleksiBadge(params);
    const namaCleanTim = (params.namaTim || 'Tim').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Badge_Koleksi_${namaCleanTim}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    const jumlahTerbuka = params.badges.filter((b) => b.terbuka).length;
    const badgesTerbuka = params.badges.filter((b) => b.terbuka);
    const badgeListText = badgesTerbuka
      .map((b) => `• ${b.ikon} *${b.nama}* (${b.kategori})`)
      .join('\n');

    const textCaption =
      `🚀 *EKSPEDISI KODE: STASIUN LOGIKA* 🚀\n` +
      `🎖️ *BUKTI PENCAPAIAN KOLEKSI BADGE*\n` +
      `👥 *Tim:* ${params.namaTim}\n` +
      `⭐ *Total Bintang:* ${params.totalBintang}/18 Bintang\n` +
      `🏆 *Badge Terbuka:* ${jumlahTerbuka}/${params.badges.length} Badge\n\n` +
      (badgeListText ? `*Daftar Badge Terbuka:*\n${badgeListText}\n\n` : '') +
      `Bukti resmi penyelesaian misi ekspedisi logika robot ALGO! 🎉`;

    // 1. Coba Web Share API (native share di mobile & desktop modern)
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          title: `Koleksi Badge - ${params.namaTim}`,
          text: textCaption,
          files: [file]
        });
        return { sukses: true, mode: 'webshare', pesan: 'Koleksi badge berhasil dibagikan! 🚀' };
      } catch (shareErr: any) {
        if (shareErr?.name === 'AbortError') {
          return { sukses: false, mode: 'canceled', pesan: 'Pembagian dibatalkan.' };
        }
        console.warn('Web Share API gagal, beralih ke fallback WhatsApp link:', shareErr);
      }
    }

    // 2. Fallback: Salin PNG ke Clipboard / Unduh
    let gambarTersalin = false;
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof window !== 'undefined' &&
      'ClipboardItem' in window &&
      window.isSecureContext
    ) {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        gambarTersalin = true;
      } catch (e) {
        console.warn('Gagal menyalin gambar badge ke clipboard:', e);
      }
    }

    if (!gambarTersalin) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textCaption)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    return {
      sukses: true,
      mode: 'whatsapp',
      pesan: gambarTersalin
        ? 'Membuka WhatsApp! Gambar bukti badge tersalin di clipboard, tinggal Tempel (Ctrl+V) di chat. 💬✨'
        : 'Membuka WhatsApp! Gambar bukti badge diunduh, silakan lampirkan gambar di chat WhatsApp. 📥💬'
    };
  } catch (error) {
    console.error('Gagal membagikan koleksi badge:', error);
    return { sukses: false, mode: 'canceled', pesan: 'Gagal membuat gambar bukti badge.' };
  }
}

/**
 * Membagikan Gambar Satu Badge Spesifik ke WhatsApp
 */
export async function bagikanSatuBadgeKeWhatsApp(
  params: ParameterSatuBadge
): Promise<{ sukses: boolean; mode: 'webshare' | 'whatsapp' | 'canceled'; pesan: string }> {
  try {
    const blob = await buatGambarSatuBadge(params);
    const namaCleanTim = (params.namaTim || 'Tim').replace(/[^a-zA-Z0-9_-]/g, '_');
    const namaCleanBadge = (params.badge.nama || 'Badge').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Badge_${namaCleanBadge}_${namaCleanTim}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    const textCaption =
      `🚀 *EKSPEDISI KODE: STASIUN LOGIKA* 🚀\n` +
      `🎖️ *BUKTI PEROLEHAN BADGE LOGIKA*\n` +
      `👥 *Tim:* ${params.namaTim}\n` +
      `🏅 *Badge:* ${params.badge.ikon} *${params.badge.nama}* (${params.badge.kategori})\n` +
      `📝 *Tantangan:* ${params.badge.deskripsi}\n` +
      `⭐ *Total Bintang:* ${params.totalBintang ?? 0} Bintang\n\n` +
      `Berhasil dituntaskan oleh Tim ${params.namaTim} sebagai bukti penyelesaian stasiun logika! 🎉`;

    // 1. Coba Web Share API
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          title: `Badge ${params.badge.nama} - ${params.namaTim}`,
          text: textCaption,
          files: [file]
        });
        return { sukses: true, mode: 'webshare', pesan: `Badge ${params.badge.nama} berhasil dibagikan! 🚀` };
      } catch (shareErr: any) {
        if (shareErr?.name === 'AbortError') {
          return { sukses: false, mode: 'canceled', pesan: 'Pembagian dibatalkan.' };
        }
        console.warn('Web Share API gagal, beralih ke fallback WhatsApp link:', shareErr);
      }
    }

    // 2. Fallback Clipboard / Download
    let gambarTersalin = false;
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof window !== 'undefined' &&
      'ClipboardItem' in window &&
      window.isSecureContext
    ) {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        gambarTersalin = true;
      } catch (e) {
        console.warn('Gagal menyalin gambar badge ke clipboard:', e);
      }
    }

    if (!gambarTersalin) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textCaption)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    return {
      sukses: true,
      mode: 'whatsapp',
      pesan: gambarTersalin
        ? `Membuka WhatsApp! Gambar badge ${params.badge.nama} tersalin di clipboard, tinggal Tempel (Ctrl+V). 💬✨`
        : `Membuka WhatsApp! Gambar badge ${params.badge.nama} diunduh, silakan lampirkan gambar di chat. 📥💬`
    };
  } catch (error) {
    console.error('Gagal membagikan badge:', error);
    return { sukses: false, mode: 'canceled', pesan: 'Gagal membuat gambar badge.' };
  }
}
