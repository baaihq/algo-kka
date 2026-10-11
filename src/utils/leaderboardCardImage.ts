import { LeaderboardEntry } from '../types/game';

export interface ParameterLeaderboardShare {
  currentTeamName: string;
  entries: LeaderboardEntry[];
  totalBintang?: number;
}

/**
 * Helper menggambar bintang emas di canvas
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
 * Helper rounded rectangle dengan fallback
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
 * Membuat kartu sertifikat gambar PNG Papan Peringkat (Leaderboard)
 */
export async function buatGambarLeaderboard(
  params: ParameterLeaderboardShare
): Promise<Blob> {
  const width = 1000;
  const height = 660;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context tidak tersedia');
  }

  // 1. Background Luar Angkasa / Stasiun Kosmis
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.4, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Ornamen Grid & Lingkaran Cahaya Lembut
  const radialGlow = ctx.createRadialGradient(250, 120, 10, 250, 120, 380);
  radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
  radialGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  const radialGlow2 = ctx.createRadialGradient(850, 480, 10, 850, 480, 400);
  radialGlow2.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
  radialGlow2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = radialGlow2;
  ctx.fillRect(0, 0, width, height);

  // Bintang Kerlip di Background
  const starCoords = [
    [80, 90], [920, 110], [150, 450], [890, 360], [420, 70], [670, 80],
    [110, 560], [850, 580], [740, 240], [260, 310]
  ];
  starCoords.forEach(([sx, sy], idx) => {
    drawStar(ctx, sx, sy, 4, idx % 2 === 0 ? 5 : 3, 2, 'rgba(253, 224, 71, 0.7)');
  });

  // 2. Bingkai Kartu Utama
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRectPolyfill(ctx, 35, 35, width - 70, height - 70, 28);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRectPolyfill(ctx, 42, 42, width - 84, height - 84, 24);
  ctx.stroke();

  // 3. Header Sertifikat Leaderboard
  // Badge Kurikulum
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  roundRectPolyfill(ctx, 60, 58, 320, 26, 13);
  ctx.fill();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.fillText('🏆 KODING & KA • KELAS X SMA • PAPAN PERINGKAT', 72, 75);

  // Judul Besar
  ctx.font = '900 28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PAPAN PERINGKAT EKSPEDISI KODE', 60, 118);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Stasiun Logika ALGO: Percabangan JIKA–MAKA–SELAIN ITU', 60, 140);

  // Status Tim Pengguna (Pojok Kanan Atas)
  const currentEntryIndex = params.entries.findIndex(
    (e) =>
      e.isCurrentTeam ||
      e.namaTim.trim().toLowerCase() === params.currentTeamName.trim().toLowerCase()
  );
  const currentRank = currentEntryIndex !== -1 ? currentEntryIndex + 1 : '-';
  const currentStars = currentEntryIndex !== -1 ? params.entries[currentEntryIndex].bintang : (params.totalBintang ?? 0);

  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  roundRectPolyfill(ctx, width - 360, 58, 300, 84, 18);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText('TIM PENJELAJAH ANDA:', width - 344, 82);

  ctx.font = '900 17px sans-serif';
  ctx.fillStyle = '#ffffff';
  const displayTimName = params.currentTeamName.length > 20
    ? params.currentTeamName.slice(0, 19) + '…'
    : params.currentTeamName;
  ctx.fillText(displayTimName, width - 344, 107);

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`Peringkat #${currentRank} • ⭐ ${currentStars} Bintang`, width - 344, 128);

  // 4. Daftar Top 5 Tabel Leaderboard
  const tableTop = 162;
  const tableLeft = 60;
  const tableWidth = width - 120;
  const rowHeight = 76;

  // Header Kolom Tabel
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.beginPath();
  roundRectPolyfill(ctx, tableLeft, tableTop, tableWidth, 32, 10);
  ctx.fill();

  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('PERINGKAT', tableLeft + 20, tableTop + 20);
  ctx.fillText('NAMA TIM / PESERTA DIDIK', tableLeft + 140, tableTop + 20);
  ctx.fillText('LENCANA BADGE', tableLeft + 520, tableTop + 20);
  ctx.fillText('TOTAL SKOR BINTANG', tableLeft + 720, tableTop + 20);

  const topEntries = params.entries.slice(0, 5);

  if (topEntries.length === 0) {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.beginPath();
    roundRectPolyfill(ctx, tableLeft, tableTop + 45, tableWidth, 200, 18);
    ctx.fill();

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada data peringkat tim yang tersimpan.', width / 2, tableTop + 140);
    ctx.textAlign = 'left';
  } else {
    topEntries.forEach((entry, idx) => {
      const rowY = tableTop + 40 + idx * (rowHeight + 6);
      const isMe =
        entry.isCurrentTeam ||
        entry.namaTim.trim().toLowerCase() === params.currentTeamName.trim().toLowerCase();

      // Card Baris Tim
      ctx.fillStyle = isMe ? 'rgba(245, 158, 11, 0.16)' : 'rgba(30, 41, 59, 0.7)';
      ctx.strokeStyle = isMe ? '#f59e0b' : 'rgba(71, 85, 105, 0.5)';
      ctx.lineWidth = isMe ? 2.5 : 1;
      ctx.beginPath();
      roundRectPolyfill(ctx, tableLeft, rowY, tableWidth, rowHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Medali & Ranking
      const rankNum = idx + 1;
      let medalBg = '#334155';
      let medalText = `#${rankNum}`;
      if (rankNum === 1) {
        medalBg = '#f59e0b';
        medalText = '🥇';
      } else if (rankNum === 2) {
        medalBg = '#94a3b8';
        medalText = '🥈';
      } else if (rankNum === 3) {
        medalBg = '#d97706';
        medalText = '🥉';
      }

      ctx.fillStyle = medalBg;
      ctx.beginPath();
      roundRectPolyfill(ctx, tableLeft + 15, rowY + 14, 48, 48, 14);
      ctx.fill();

      ctx.font = rankNum <= 3 ? '24px sans-serif' : '900 16px sans-serif';
      ctx.fillStyle = rankNum <= 3 ? '#ffffff' : '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(medalText, tableLeft + 39, rowY + (rankNum <= 3 ? 47 : 44));
      ctx.textAlign = 'left';

      // Nama Tim
      ctx.font = '900 16px sans-serif';
      ctx.fillStyle = isMe ? '#fef08a' : '#ffffff';
      const nama = entry.namaTim.length > 28 ? entry.namaTim.slice(0, 27) + '…' : entry.namaTim;
      ctx.fillText(nama, tableLeft + 140, rowY + 36);

      // Sub-keterangan status
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = isMe ? '#fbbf24' : '#94a3b8';
      ctx.fillText(
        isMe ? '⭐ Tim Anda • Penjelajah Stasiun Logika' : `Peringkat #${rankNum} Ekspedisi`,
        tableLeft + 140,
        rowY + 54
      );

      // Badge Count Pill
      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      roundRectPolyfill(ctx, tableLeft + 520, rowY + 22, 130, 32, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#e9d5ff';
      ctx.fillText(`🎖️ ${entry.badgeCount} Badge`, tableLeft + 535, rowY + 43);

      // Skor Bintang Pill
      ctx.fillStyle = isMe ? 'rgba(245, 158, 11, 0.3)' : 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = isMe ? '#f59e0b' : '#eab308';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      roundRectPolyfill(ctx, tableLeft + 720, rowY + 18, 140, 40, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '900 16px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`⭐ ${entry.bintang} Bintang`, tableLeft + 735, rowY + 44);
    });
  }

  // 5. Footer Watermark & Tanggal
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('🤖 Verifikasi Otomatis Ekspedisi Kode • Robot ALGO Stasiun Logika', 60, height - 48);

  const tgl = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  ctx.textAlign = 'right';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`Sertifikat Peringkat • ${tgl}`, width - 60, height - 48);
  ctx.textAlign = 'left';

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
 * Membagikan Gambar Leaderboard ke WhatsApp secara langsung atau via Web Share API
 */
export async function bagikanLeaderboardKeWhatsApp(
  params: ParameterLeaderboardShare
): Promise<{ sukses: boolean; mode: 'webshare' | 'whatsapp' | 'canceled'; pesan: string }> {
  try {
    const blob = await buatGambarLeaderboard(params);
    const cleanTim = (params.currentTeamName || 'Tim').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Leaderboard_StasiunLogika_${cleanTim}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    const currentEntryIndex = params.entries.findIndex(
      (e) =>
        e.isCurrentTeam ||
        e.namaTim.trim().toLowerCase() === params.currentTeamName.trim().toLowerCase()
    );
    const rank = currentEntryIndex !== -1 ? currentEntryIndex + 1 : '-';
    const stars = currentEntryIndex !== -1 ? params.entries[currentEntryIndex].bintang : (params.totalBintang ?? 0);
    const badges = currentEntryIndex !== -1 ? params.entries[currentEntryIndex].badgeCount : 0;

    // Susun caption teks untuk WhatsApp
    let topListText = '';
    params.entries.slice(0, 5).forEach((e, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
      topListText += `\n${medal} *${e.namaTim}* — ${e.bintang} ⭐ (${e.badgeCount} Badge)`;
    });

    const textCaption =
      `🏆 *PAPAN PERINGKAT RESMI (LEADERBOARD)* 🏆\n` +
      `🚀 *EKSPEDISI KODE: STASIUN LOGIKA ALGO*\n\n` +
      `👥 *Tim Kami:* ${params.currentTeamName}\n` +
      `📊 *Peringkat:* #${rank} (${stars} ⭐ • ${badges} Badge Terbuka)\n\n` +
      `🏅 *TOP 5 KELAS X:*${topListText}\n\n` +
      `Yuk selesaikan misi stasiun logika robot ALGO bersama timmu! 🎉`;

    // 1. Coba Web Share API (native share dialog di Android / iOS / Desktop)
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          title: `Leaderboard Ekspedisi Kode - ${params.currentTeamName}`,
          text: textCaption,
          files: [file]
        });
        return { sukses: true, mode: 'webshare', pesan: 'Papan peringkat berhasil dibagikan! 🏆' };
      } catch (shareErr: any) {
        if (shareErr?.name === 'AbortError') {
          return { sukses: false, mode: 'canceled', pesan: 'Pembagian dibatalkan.' };
        }
        console.warn('Web Share API gagal, beralih ke WhatsApp link fallback:', shareErr);
      }
    }

    // 2. Fallback: Salin gambar ke clipboard jika didukung, atau unduh PNG
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
        console.warn('Gagal menyalin gambar leaderboard ke clipboard:', e);
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

    // Buka WhatsApp dengan caption
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textCaption)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    return {
      sukses: true,
      mode: 'whatsapp',
      pesan: gambarTersalin
        ? 'Membuka WhatsApp! Gambar peringkat tersalin di clipboard, tinggal Tempel (Ctrl+V) di chat. 💬✨'
        : 'Membuka WhatsApp! Gambar peringkat diunduh, silakan lampirkan gambar di chat WhatsApp. 📥💬'
    };
  } catch (error) {
    console.error('Gagal membagikan leaderboard:', error);
    return { sukses: false, mode: 'canceled', pesan: 'Gagal membuat gambar peringkat.' };
  }
}
