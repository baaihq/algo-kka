import { ParameterRingkasanSkorLevel, buatTeksRingkasanSkorLevel, salinKeClipboard } from './clipboard';

/**
 * Menggambar bintang 5 sudut pada canvas
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fillColor: string,
  strokeColor?: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/**
 * Membuat Blob Gambar PNG Kartu Skor Level yang futuristik & menarik
 */
export async function buatGambarSkorLevel(params: ParameterRingkasanSkorLevel): Promise<Blob> {
  const width = 1000;
  const height = 580;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Gagal mendapatkan konteks 2D canvas');
  }

  // 1. Background Gradient Kosmik
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#040d21');
  bgGrad.addColorStop(0.5, '#091e3a');
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
  const glowGrad = ctx.createRadialGradient(200, 150, 20, 200, 150, 350);
  glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(200, 150, 350, 0, Math.PI * 2);
  ctx.fill();

  const glowGrad2 = ctx.createRadialGradient(800, 400, 20, 800, 400, 350);
  glowGrad2.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
  glowGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad2;
  ctx.beginPath();
  ctx.arc(800, 400, 350, 0, Math.PI * 2);
  ctx.fill();

  // 2. Bingkai Luar (Outer Frame)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Corner Accents
  const corners = [
    [20, 20],
    [width - 20, 20],
    [20, height - 20],
    [width - 20, height - 20]
  ];
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3. Header Badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(50, 45, 420, 40, 20);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('🚀 EKSPEDISI KODE: STASIUN LOGIKA', 70, 71);

  // Status Badge (Top Right)
  const isPass = params.semuaLulus;
  ctx.fillStyle = isPass ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
  ctx.strokeStyle = isPass ? '#10b981' : '#f43f5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(width - 320, 45, 270, 40, 20);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = isPass ? '#34d399' : '#fb7185';
  ctx.fillText(isPass ? 'STATUS: LULUS 100% ✅' : 'STATUS: DALAM PROSES ⚠️', width - 300, 71);

  // 4. Judul Sertifikat / Kartu
  ctx.font = 'black 32px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('LAPORAN PERFORMA STASIUN', 50, 135);

  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Catatan Hasil Evaluasi Program Robot ALGO', 50, 162);

  // 5. Main Card Container (Inner Glassmorphism Box)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(50, 185, width - 100, 310, 24);
  ctx.fill();
  ctx.stroke();

  // Left Section: Team Name & Station Info
  // Nama Tim Box
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('NAMA TIM / KELOMPOK:', 80, 225);

  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(params.namaTim, 80, 260);

  // Stasiun Info
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('STASIUN TUGAS:', 80, 305);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(params.namaLevel, 80, 335);

  if (params.skenario) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    const skenarioText = `Skenario: ${params.skenario}${params.varianId ? ` (Varian #${params.varianId})` : ''}`;
    ctx.fillText(skenarioText, 80, 365);
  }

  // Kasus Uji & Petunjuk Info
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.beginPath();
  ctx.roundRect(80, 395, 420, 70, 16);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#34d399';
  ctx.fillText(`🧪 Kasus Uji: ${params.kasusLulus}/${params.totalKasus} Kasus Selesai`, 100, 425);

  const bantuanText =
    (params.totalPetunjukTerbuka ?? 0) === 0
      ? '🧠 Tanpa Bantuan Petunjuk (Murni)'
      : `💡 Petunjuk Terbuka: ${params.totalPetunjukTerbuka} Petunjuk`;
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(bantuanText, 100, 448);

  // Right Section: Bintang & Score Badge
  const rightX = 580;

  // Bintang Box Background
  ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.beginPath();
  ctx.roundRect(rightX, 215, 340, 250, 20);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText('PENCAPAIAN BINTANG', rightX + 170, 248);

  // Draw 3 Stars
  const bintangCount = params.bintang ?? 3;
  const starPositions = [rightX + 70, rightX + 170, rightX + 270];

  starPositions.forEach((sx, idx) => {
    const isEarned = idx + 1 <= bintangCount;
    const starColor = isEarned ? '#fbbf24' : '#334155';
    const strokeCol = isEarned ? '#f59e0b' : '#1e293b';

    // Glow if earned
    if (isEarned) {
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
    } else {
      ctx.shadowBlur = 0;
    }

    drawStar(ctx, sx, 310, 5, 32, 14, starColor, strokeCol);
    ctx.shadowBlur = 0; // reset
  });

  // Star Text Rating
  ctx.font = 'black 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`${bintangCount} / 3 BINTANG`, rightX + 170, 382);

  const ratingLabel =
    bintangCount === 3
      ? 'PERFORMA SEMPURNA! ⭐⭐⭐'
      : bintangCount === 2
      ? 'SANGAT BAIK! ⭐⭐'
      : 'BERHASIL LULUS! ⭐';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText(ratingLabel, rightX + 170, 412);

  ctx.textAlign = 'left'; // reset alignment

  // 6. Watermark Footer
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('🤖 Verifikasi Otomatis Sistem Pembelajaran Logika ALGO • AI Studio Build', 50, 525);

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Ekspedisi Kode', width - 150, 525);

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
 * Menyalin Gambar Skor ke Clipboard jika didukung, atau Mengunduh file PNG secara otomatis sebagai fallback.
 */
export async function salinAtauUnduhGambarSkor(
  params: ParameterRingkasanSkorLevel
): Promise<{ sukses: boolean; mode: 'clipboard' | 'download' }> {
  try {
    const blob = await buatGambarSkorLevel(params);

    // 1. Coba salin gambar PNG ke Clipboard via ClipboardItem API
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
        return { sukses: true, mode: 'clipboard' };
      } catch (errClipboard) {
        console.warn('Gagal menyalin gambar langsung ke clipboard, menggunakan fallback unduh:', errClipboard);
      }
    }

    // 2. Fallback: Unduh file PNG & salin teks ringkasan ke clipboard
    const namaCleanTim = (params.namaTim || 'Tim').replace(/[^a-zA-Z0-9_-]/g, '_');
    const namaCleanLevel = (params.namaLevel || 'Level').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Skor_${namaCleanLevel}_${namaCleanTim}.png`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Salin juga versi teks sebagai bonus
    const teks = buatTeksRingkasanSkorLevel(params);
    await salinKeClipboard(teks);

    return { sukses: true, mode: 'download' };
  } catch (error) {
    console.error('Gagal membuat atau menyalin gambar skor:', error);
    // Fallback terakhir: Salin teks ringkasan saja
    const teks = buatTeksRingkasanSkorLevel(params);
    const teksSukses = await salinKeClipboard(teks);
    return { sukses: teksSukses, mode: 'download' };
  }
}

/**
 * Membagikan Gambar Skor ke WhatsApp secara langsung (atau via Web Share API jika mendukung file PNG)
 */
export async function bagikanSkorKeWhatsApp(
  params: ParameterRingkasanSkorLevel
): Promise<{ sukses: boolean; mode: 'webshare' | 'whatsapp' | 'canceled'; pesan: string }> {
  try {
    const blob = await buatGambarSkorLevel(params);
    const namaCleanLevel = (params.namaLevel || 'Level').replace(/[^a-zA-Z0-9_-]/g, '_');
    const namaCleanTim = (params.namaTim || 'Tim').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Skor_${namaCleanLevel}_${namaCleanTim}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    const bintangStr = '⭐'.repeat(params.bintang || 3);
    const textCaption = `🚀 *EKSPEDISI KODE: STASIUN LOGIKA* 🚀\n` +
      `👥 *Tim:* ${params.namaTim}\n` +
      `🛰️ *Stasiun:* ${params.namaLevel}\n` +
      `🏆 *Bintang:* ${bintangStr} (${params.bintang || 3}/3)\n\n` +
      `Program ALGO berhasil menyelesaikan stasiun logika ini! 🎉`;

    // 1. Coba Web Share API (native share dialog di Android/iOS/Desktop)
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          title: `Skor ${params.namaLevel} - ${params.namaTim}`,
          text: textCaption,
          files: [file]
        });
        return { sukses: true, mode: 'webshare', pesan: 'Skor berhasil dibagikan! 🚀' };
      } catch (shareErr: any) {
        if (shareErr?.name === 'AbortError') {
          return { sukses: false, mode: 'canceled', pesan: 'Pembagian dibatalkan.' };
        }
        console.warn('Web Share API gagal, beralih ke WhatsApp Web link:', shareErr);
      }
    }

    // 2. Fallback: Salin gambar PNG ke clipboard (atau unduh jika tidak didukung), lalu buka WhatsApp
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
        console.warn('Gagal menyalin gambar ke clipboard:', e);
      }
    }

    if (!gambarTersalin) {
      // Unduh gambar PNG secara otomatis
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // Buka WhatsApp Web / App dengan pesan caption
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textCaption)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    return {
      sukses: true,
      mode: 'whatsapp',
      pesan: gambarTersalin
        ? 'Membuka WhatsApp! Gambar skor tersalin di clipboard, tinggal Tempel (Ctrl+V) di chat. 💬✨'
        : 'Membuka WhatsApp! Gambar skor diunduh, silakan lampirkan gambar di chat WhatsApp. 📥💬'
    };
  } catch (error) {
    console.error('Gagal membagikan ke WhatsApp:', error);
    return { sukses: false, mode: 'canceled', pesan: 'Gagal membuat gambar skor.' };
  }
}
