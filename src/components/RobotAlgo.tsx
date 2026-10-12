import React from 'react';

export type StatusAlgo = 'idle' | 'berpikir' | 'izinkan' | 'tolak' | 'buka' | 'pesan' | 'sukses';

interface RobotAlgoProps {
  status: StatusAlgo;
  pesanAktif?: string;
  pesanList?: string[];
  className?: string;
}

export const RobotAlgo: React.FC<RobotAlgoProps> = ({
  status,
  pesanAktif,
  pesanList = [],
  className = ''
}) => {
  // Warna aksen pastel berdasarkan status ala MENARA BUG
  const warnaAksen = {
    idle: '#38bdf8', // sky pastel
    berpikir: '#f59e0b', // warm amber
    izinkan: '#10b981', // mint emerald
    tolak: '#f43f5e', // coral rose
    buka: '#06b6d4', // cyan pastel
    pesan: '#a855f7', // lavender
    sukses: '#eab308' // golden sun
  }[status];

  // Daftar pesan yang akan ditampilkan di balon kata (bisa 1 atau 2 pesan jika multikondisi terpenuhi)
  const pesanTampilList = pesanList && pesanList.length > 0
    ? pesanList
    : pesanAktif
    ? [pesanAktif]
    : [];

  const isAdaPesan = pesanTampilList.length > 0;
  const isPartikelAktif = status === 'izinkan' || status === 'buka' || status === 'sukses' || status === 'pesan';

  // Daftar partikel radial burst bertema pastel ceria
  const burstParticles = [
    { dx: '-45px', dy: '-65px', delay: '0s', size: 'w-3 h-3', color: 'bg-emerald-300' },
    { dx: '45px', dy: '-65px', delay: '0.1s', size: 'w-2.5 h-2.5', color: 'bg-sky-300' },
    { dx: '-65px', dy: '-25px', delay: '0.2s', size: 'w-3.5 h-3.5', color: 'bg-yellow-300' },
    { dx: '65px', dy: '-25px', delay: '0.15s', size: 'w-3 h-3', color: 'bg-pink-300' },
    { dx: '-50px', dy: '35px', delay: '0.3s', size: 'w-2 h-2', color: 'bg-amber-300' },
    { dx: '50px', dy: '35px', delay: '0.25s', size: 'w-3 h-3', color: 'bg-purple-300' },
    { dx: '0px', dy: '-75px', delay: '0.05s', size: 'w-3.5 h-3.5', color: 'bg-white' },
    { dx: '-30px', dy: '-80px', delay: '0.18s', size: 'w-2.5 h-2.5', color: 'bg-teal-200' },
    { dx: '30px', dy: '-80px', delay: '0.22s', size: 'w-2.5 h-2.5', color: 'bg-amber-200' },
  ];

  // Label status ramah bahasa Indonesia untuk tampilan murid
  const ambilLabelStatus = (s: StatusAlgo): string => {
    const map: Record<StatusAlgo, string> = {
      idle: 'SIAGA',
      berpikir: 'BERPIKIR',
      izinkan: 'IZINKAN',
      tolak: 'DITOLAK',
      buka: 'BUKA',
      pesan: 'PESAN',
      sukses: 'BERHASIL'
    };
    return map[s] || s.toUpperCase();
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Balon Kata Pesan Melayang (Mendukung 1 atau 2 Pesan Multikondisi Tanpa Menutupi ALGO) */}
      {(status === 'pesan' || isAdaPesan) && isAdaPesan && (
        <div className="absolute -top-14 z-30 flex flex-wrap items-center justify-center gap-1.5 anim-bubble-pop pointer-events-none max-w-[320px]">
          {pesanTampilList.map((psn, idx) => (
            <div
              key={idx}
              className={`relative font-mono text-xs md:text-sm font-black px-3 py-1 rounded-2xl shadow-md flex items-center gap-1.5 whitespace-nowrap border-2 ${
                idx === 0
                  ? 'bg-purple-100 border-purple-500 text-purple-950'
                  : 'bg-indigo-100 border-indigo-500 text-indigo-950'
              }`}
            >
              {pesanTampilList.length > 1 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold text-white ${
                  idx === 0 ? 'bg-purple-600' : 'bg-indigo-600'
                }`}>
                  #{idx + 1}
                </span>
              )}
              <span className="text-xs">💬</span>
              <span>&quot;{psn}&quot;</span>
              {/* Ekor balon kata */}
              <div
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-r-2 border-b-2 ${
                  idx === 0
                    ? 'bg-purple-100 border-purple-500'
                    : 'bg-indigo-100 border-indigo-500'
                }`}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Partikel & Sparkle Pastel Ceria saat Sukses / Aksi */}
      {isPartikelAktif && (
        <>
          {/* Cincin energi pastel */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-emerald-300/60 anim-energy-ring pointer-events-none z-0"
            style={{
              borderColor: status === 'sukses' ? '#fde047' : status === 'pesan' ? '#d8b4fe' : '#86efac'
            }}
          ></div>

          {/* Partikel Radial Burst Pastel */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            {burstParticles.map((p, idx) => (
              <div
                key={idx}
                className={`absolute rounded-full shadow-md border border-white/80 anim-particle-burst ${p.size} ${p.color}`}
                style={{
                  '--dx': p.dx,
                  '--dy': p.dy,
                  animationDelay: p.delay,
                  boxShadow: `0 0 8px ${p.color.includes('yellow') ? '#fef08a' : '#a7f3d0'}`
                } as React.CSSProperties}
              ></div>
            ))}
          </div>

          {/* Bintang-bintang Sparkle Twinkle */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute -top-1 left-1 text-amber-400 font-bold text-base md:text-lg anim-sparkle [animation-delay:0s]">
              ✨
            </div>
            <div className="absolute -top-1 right-1 text-sky-400 font-bold text-base md:text-lg anim-sparkle [animation-delay:0.3s]">
              ⭐
            </div>
            <div className="absolute bottom-3 left-1 text-emerald-400 font-bold text-sm anim-sparkle [animation-delay:0.6s]">
              ✨
            </div>
            <div className="absolute bottom-3 right-1 text-pink-400 font-bold text-sm anim-sparkle [animation-delay:0.2s]">
              ⭐
            </div>
          </div>
        </>
      )}

      {/* Wadah Robot ALGO Bulat Imut */}
      <div
        className={`relative w-28 h-28 md:w-32 md:h-32 transition-transform duration-300 anim-algo-float ${
          isPartikelAktif ? 'scale-105' : ''
        } ${status === 'tolak' ? 'anim-algo-shake' : ''}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bayangan Lantai Lembut */}
          <ellipse cx="80" cy="148" rx="42" ry="7" fill="#94a3b8" opacity="0.35" />

          {/* Antena Imut dengan Bola Pastel */}
          <path d="M80 34 L80 18" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
          <circle
            cx="80"
            cy="15"
            r="9"
            fill={warnaAksen}
            className={status === 'berpikir' ? 'animate-ping' : ''}
          />
          <circle cx="80" cy="15" r="7" fill={warnaAksen} />
          {/* Kilau bola antena */}
          <circle cx="77.5" cy="12.5" r="2.5" fill="#ffffff" opacity="0.9" />

          {/* Telinga Headphone Imut Kiri & Kanan */}
          <rect x="20" y="52" width="10" height="26" rx="5" fill="#cbd5e1" />
          <rect x="22" y="55" width="6" height="20" rx="3" fill="#94a3b8" />
          <rect x="130" y="52" width="10" height="26" rx="5" fill="#cbd5e1" />
          <rect x="132" y="55" width="6" height="20" rx="3" fill="#94a3b8" />

          {/* Kepala Bulat Besar Robot ALGO (Chubby Cute Head) */}
          <ellipse cx="80" cy="65" rx="54" ry="46" fill="#e2e8f0" />
          <ellipse cx="80" cy="63" rx="52" ry="45" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          {/* Kilau kepala atas */}
          <path
            d="M52 35 C60 27, 100 27, 108 35"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Visor Wajah Kaca Gelap Mengkilap */}
          <rect
            x="36"
            y="38"
            width="88"
            height="50"
            rx="22"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2.5"
          />
          {/* Pantulan Kilau Lengkung Visor */}
          <path
            d="M48 44 C62 40, 98 40, 112 44"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Pipi Merona / Blush Cheeks Imut (Kiri & Kanan) */}
          <ellipse cx="48" cy="74" rx="6" ry="3.5" fill="#fda4af" opacity="0.8" />
          <ellipse cx="112" cy="74" rx="6" ry="3.5" fill="#fda4af" opacity="0.8" />

          {/* EKSPRESI MATA & WAJAH ALGO */}
          {/* 1. IDLE: Mata Bulat Berbinar + Senyum Imut */}
          {status === 'idle' && (
            <g>
              <circle cx="62" cy="62" r="8.5" fill="#38bdf8" />
              <circle cx="64.5" cy="59.5" r="3.2" fill="#ffffff" />
              <circle cx="60" cy="65" r="1.5" fill="#ffffff" />
              <circle cx="98" cy="62" r="8.5" fill="#38bdf8" />
              <circle cx="100.5" cy="59.5" r="3.2" fill="#ffffff" />
              <circle cx="96" cy="65" r="1.5" fill="#ffffff" />
              <path d="M74 72 Q80 77 86 72" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 2. BERPIKIR: Mata Penasaran / Titik Berkedip */}
          {status === 'berpikir' && (
            <g>
              <ellipse cx="62" cy="62" rx="7.5" ry="5.5" fill="#f59e0b" />
              <circle cx="64" cy="60" r="2.5" fill="#ffffff" />
              <ellipse cx="98" cy="62" rx="7.5" ry="5.5" fill="#f59e0b" />
              <circle cx="100" cy="60" r="2.5" fill="#ffffff" />
              <path d="M56 52 L68 54" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M92 54 L104 52" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="80" cy="72" r="2.5" fill="#f59e0b" />
            </g>
          )}

          {/* 3. IZINKAN / BUKA / SUKSES: Mata Lengkung Bahagia (Happy Arcs) & Senyum Lebar */}
          {(status === 'izinkan' || status === 'buka' || status === 'sukses') && (
            <g>
              <path d="M54 65 Q62 50 70 65" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M90 65 Q98 50 106 65" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M72 71 Q80 81 88 71" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" fill="#047857" />
            </g>
          )}

          {/* 4. TOLAK: Mata Mengernyit Lucu (> <) */}
          {status === 'tolak' && (
            <g>
              <path d="M55 57 L65 64 L55 71" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M105 57 L95 64 L105 71" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="74" y1="73" x2="86" y2="73" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* 5. PESAN: Mata Bersinar Terpukau + Mulut Senang */}
          {status === 'pesan' && (
            <g>
              <circle cx="62" cy="62" r="8" fill="#c084fc" />
              <circle cx="64" cy="59" r="3" fill="#ffffff" />
              <circle cx="98" cy="62" r="8" fill="#c084fc" />
              <circle cx="100" cy="59" r="3" fill="#ffffff" />
              <ellipse cx="80" cy="73" rx="4" ry="3" fill="#c084fc" />
            </g>
          )}

          {/* Badan Bulat Imut (Chubby Body) */}
          <ellipse cx="80" cy="116" rx="34" ry="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />

          {/* Lambang Inti Energi di Perut (Energy Core Gem) */}
          <circle cx="80" cy="116" r="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="80" cy="116" r="7" fill={warnaAksen} className="animate-pulse" />
          <circle cx="78" cy="114" r="2" fill="#ffffff" opacity="0.9" />

          {/* Tangan Bulat Melayang Imut (Floating Hands) */}
          <circle cx="38" cy="116" r="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="37" cy="114" r="2.5" fill="#ffffff" />
          <circle cx="122" cy="116" r="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="121" cy="114" r="2.5" fill="#ffffff" />

          {/* Kaki Melayang Bulat Kecil (Hover Pod) */}
          <ellipse cx="68" cy="138" rx="8" ry="5" fill="#cbd5e1" />
          <ellipse cx="92" cy="138" rx="8" ry="5" fill="#cbd5e1" />
        </svg>

        {/* Badge Mini Status ALGO di Bawah (Pastel Chunky Style) */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 border-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase shadow-xs"
          style={{
            borderColor: warnaAksen,
            color: warnaAksen === '#eab308' ? '#b45309' : warnaAksen
          }}
        >
          ALGO: {ambilLabelStatus(status)}
        </div>
      </div>
    </div>
  );
};
