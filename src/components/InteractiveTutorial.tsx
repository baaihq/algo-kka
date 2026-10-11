import React, { useState } from 'react';
import { RobotAlgo, StatusAlgo } from './RobotAlgo';
import { simpanStatusTutorial } from '../services/storage';
import {
  HelpCircle,
  Play,
  Check,
  Split,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CelebrationConfetti } from './CelebrationConfetti';

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onSelesaiTutorial: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  isOpen,
  onClose,
  onSelesaiTutorial
}) => {
  const [langkahAktif, setLangkahAktif] = useState<number>(1);

  // --- State Interaktif Langkah 1 ---
  const [kartuSimulasiL1, setKartuSimulasiL1] = useState<'berlaku' | 'tidak_berlaku'>('berlaku');

  // --- State Interaktif Langkah 2 ---
  const [kartuSimulasiL2, setKartuSimulasiL2] = useState<'berlaku' | 'tidak_berlaku'>('berlaku');
  const [statusAlgoL2, setStatusAlgoL2] = useState<StatusAlgo>('idle');
  const [jejakL2, setJejakL2] = useState<string>('Tekan tombol "Simulasikan Eksekusi" untuk melihat reaksi ALGO.');

  // --- State Interaktif Langkah 3 ---
  const [nilaiSimulasiL3, setNilaiSimulasiL3] = useState<number>(80);
  const [statusAlgoL3, setStatusAlgoL3] = useState<StatusAlgo>('idle');
  const [pesanAlgoL3, setPesanAlgoL3] = useState<string | undefined>(undefined);
  const [jejakL3, setJejakL3] = useState<string>('Pilih nilai lalu klik "Jalankan Simulasi".');

  // --- State Interaktif Langkah 4 (Mini Tantangan) ---
  const [operatorMini, setOperatorMini] = useState<'>=' | '<=' | '=' | '>'>('>=');
  const [pesanMakaMini, setPesanMakaMini] = useState<string>('PANAS');
  const [pesanSelainMini, setPesanSelainMini] = useState<string>('NORMAL');
  const [hasilUjiMini, setHasilUjiMini] = useState<{
    diuji: boolean;
    lulus: boolean;
    pesan: string;
  }>({
    diuji: false,
    lulus: false,
    pesan: ''
  });

  if (!isOpen) return null;

  // Handler Simulasi Langkah 2
  const handleSimulasiL2 = () => {
    if (kartuSimulasiL2 === 'berlaku') {
      setStatusAlgoL2('izinkan');
      setJejakL2('Kondisi [kartu = "berlaku"] bernilai BENAR! → Blok MAKA dijalankan: "Izinkan Masuk" (Pintu Terbuka).');
    } else {
      setStatusAlgoL2('idle');
      setJejakL2('Kondisi [kartu = "tidak_berlaku"] bernilai SALAH! → Blok MAKA dilewati (ALGO diam).');
    }
  };

  // Handler Simulasi Langkah 3
  const handleSimulasiL3 = () => {
    if (nilaiSimulasiL3 >= 75) {
      setStatusAlgoL3('pesan');
      setPesanAlgoL3('LULUS');
      setJejakL3(`Nilai ${nilaiSimulasiL3} >= 75 adalah BENAR → Masuk cabang MAKA: Tampilkan "LULUS" 🎉`);
    } else {
      setStatusAlgoL3('pesan');
      setPesanAlgoL3('REMIDI');
      setJejakL3(`Nilai ${nilaiSimulasiL3} >= 75 adalah SALAH → Masuk cabang SELAIN ITU: Tampilkan "REMIDI" 📝`);
    }
  };

  // Handler Uji Mini Langkah 4
  const handleUjiMini = () => {
    const opCocok = operatorMini === '>=' || operatorMini === '>';
    const pesanMakaCocok = pesanMakaMini === 'PANAS';
    const pesanSelainCocok = pesanSelainMini === 'NORMAL';

    if (opCocok && pesanMakaCocok && pesanSelainCocok) {
      setHasilUjiMini({
        diuji: true,
        lulus: true,
        pesan: 'Hebat sekali! Kasus suhu 42°C (PANAS) dan suhu 25°C (NORMAL) berhasil dieksekusi dengan sempurna!'
      });
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7dd3fc', '#fde047', '#86efac', '#d8b4fe']
        });
      } catch (e) {}
    } else {
      let petunjukGagal = 'Belum tepat: ';
      if (!opCocok) petunjukGagal += 'Gunakan operator >= atau > untuk mendeteksi suhu tinggi. ';
      if (!pesanMakaCocok) petunjukGagal += 'Cabang MAKA harus menampilkan "PANAS". ';
      if (!pesanSelainCocok) petunjukGagal += 'Cabang SELAIN ITU harus menampilkan "NORMAL".';
      setHasilUjiMini({
        diuji: true,
        lulus: false,
        pesan: petunjukGagal
      });
    }
  };

  const handleSelesaikanTutorial = () => {
    simpanStatusTutorial(true);
    onSelesaiTutorial();
  };

  return (
    <>
      <CelebrationConfetti isActive={Boolean(isOpen && hasilUjiMini?.lulus)} durationMs={5000} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-sky-950/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header Modal Tutorial Pastel */}
        <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 dark:from-indigo-900 dark:via-blue-900 dark:to-indigo-950 p-4 text-white flex items-center justify-between border-b-2 border-indigo-300 dark:border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/30 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <BookOpen className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-amber-300 dark:bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Modul Interaktif
                </span>
                <span className="text-xs text-indigo-100 dark:text-indigo-200 font-bold font-mono">Kelas X • Koding &amp; KA</span>
              </div>
              <h2 className="text-base md:text-lg font-black tracking-wide font-fredoka">
                Akademi Logika: Percabangan JIKA-MAKA
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indikator Langkah */}
        <div className="bg-indigo-50/70 dark:bg-slate-800/80 px-4 py-2.5 border-b-2 border-indigo-100 dark:border-slate-700 flex items-center justify-between text-xs">
          {[
            { no: 1, label: 'Konsep' },
            { no: 2, label: 'JIKA-MAKA' },
            { no: 3, label: 'SELAIN ITU' },
            { no: 4, label: 'Praktik Mini' }
          ].map((step) => (
            <button
              key={step.no}
              type="button"
              onClick={() => setLangkahAktif(step.no)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                langkahAktif === step.no
                  ? 'bg-amber-400 text-slate-950 shadow-xs border border-amber-500 ring-2 ring-amber-300'
                  : langkahAktif > step.no
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-mono">
                {langkahAktif > step.no ? '✓' : step.no}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Isi Tutorial Sesuai Langkah Aktif */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* LANGKAH 1: KONSEP DASAR PERCABANGAN */}
          {langkahAktif === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200">
                <h3 className="text-sm md:text-base font-black text-sky-950 flex items-center gap-2 mb-2">
                  <Split className="w-5 h-5 text-sky-600" />
                  <span>Apa Itu Percabangan Logika?</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                  Dalam pemrograman, instruksi tidak selalu berjalan lurus. Robot seperti{' '}
                  <strong className="text-sky-700">ALGO</strong> harus bisa mengambil{' '}
                  <strong className="text-amber-700">keputusan berbeda</strong> berdasarkan kondisi yang diterima sensor stasiun.
                </p>
              </div>

              {/* Demonstrasi Interaktif Langkah 1 */}
              <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 space-y-3 shadow-xs">
                <div className="text-xs font-mono font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>Uji Coba Interaktif: Status Sensor Tamu</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-sky-50 p-3 rounded-2xl border border-sky-200">
                  <span className="text-xs font-bold text-slate-700">Pilih status kartu tamu:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setKartuSimulasiL1('berlaku')}
                      className={`min-h-[44px] px-4 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
                        kartuSimulasiL1 === 'berlaku'
                          ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      &quot;berlaku&quot;
                    </button>
                    <button
                      type="button"
                      onClick={() => setKartuSimulasiL1('tidak_berlaku')}
                      className={`min-h-[44px] px-4 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
                        kartuSimulasiL1 === 'tidak_berlaku'
                          ? 'bg-rose-500 text-white ring-2 ring-rose-300 shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      &quot;tidak berlaku&quot;
                    </button>
                  </div>
                </div>

                {/* Hasil Evaluasi Kondisi */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Kondisi [kartu = &quot;berlaku&quot;]:
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-3 py-1 rounded-lg ${
                      kartuSimulasiL1 === 'berlaku'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {kartuSimulasiL1 === 'berlaku' ? 'BENAR (True)' : 'SALAH (False)'}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-2xl text-xs text-amber-950 font-medium">
                💡 <strong>Prinsip:</strong> Jika kondisi bernilai <strong>BENAR</strong>, perintah di dalam blok akan dijalankan. Jika <strong>SALAH</strong>, perintah dilewati!
              </div>
            </div>
          )}

          {/* LANGKAH 2: JIKA... MAKA (SATU ARAH) */}
          {langkahAktif === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-sky-50 p-3.5 rounded-2xl border-2 border-sky-200 text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                <strong className="text-amber-800">Blok Huruf C (JIKA-MAKA)</strong> memiliki rongga di dalamnya. Blok perintah aksi yang diletakkan di dalam rongga hanya berjalan saat kondisi bernilai <strong className="text-emerald-700">BENAR</strong>.
              </div>

              {/* Tampilan Visual Blok C Interaktif */}
              <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 space-y-3 shadow-xs">
                <div className="w-full bg-amber-100 rounded-2xl border-2 border-amber-300 overflow-hidden shadow-xs">
                  {/* Header C-Block */}
                  <div className="p-3 bg-amber-100 text-amber-950 flex flex-wrap items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs font-mono">
                      JIKA
                    </span>
                    <div className="bg-white border-2 border-emerald-300 px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 text-emerald-950">
                      <span className="text-emerald-900">kartu</span>
                      <span className="text-amber-800 font-black">=</span>
                      <span className="text-amber-900">&quot;berlaku&quot;</span>
                    </div>
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs font-mono">
                      MAKA
                    </span>
                  </div>

                  {/* Rongga MAKA */}
                  <div className="bg-amber-50/70 border-l-8 border-amber-400 p-3 space-y-1.5">
                    <div className="bg-emerald-100 border-2 border-emerald-300 text-emerald-950 p-2 rounded-xl text-xs font-black flex items-center justify-between">
                      <span>🛡️ Izinkan Masuk</span>
                      <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-md text-emerald-900">
                        Aksi
                      </span>
                    </div>
                  </div>

                  {/* Penutup Blok C */}
                  <div className="h-2 bg-amber-200"></div>
                </div>

                {/* Simulator ALGO */}
                <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Uji kartu:</span>
                    <select
                      value={kartuSimulasiL2}
                      onChange={(e) =>
                        setKartuSimulasiL2(e.target.value as 'berlaku' | 'tidak_berlaku')
                      }
                      className="min-h-[44px] bg-white border-2 border-sky-300 text-slate-900 text-xs font-mono font-bold px-3 py-1.5 rounded-xl"
                    >
                      <option value="berlaku">&quot;berlaku&quot;</option>
                      <option value="tidak_berlaku">&quot;tidak berlaku&quot;</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulasiL2}
                    className="min-h-[44px] px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer border-2 border-sky-600 border-b-4 border-b-sky-700 active:border-b-0 active:translate-y-1 shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Simulasikan Eksekusi</span>
                  </button>
                </div>

                {/* Panggung Reaksi ALGO Mini */}
                <div className="bg-white p-3 rounded-2xl border border-sky-200 flex items-center gap-3">
                  <RobotAlgo status={statusAlgoL2} className="scale-75 -my-2 shrink-0" />
                  <p className="text-xs text-slate-700 italic font-medium">{jejakL2}</p>
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 3: SELAIN ITU (DUA ARAH) */}
          {langkahAktif === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-sky-50 p-3.5 rounded-2xl border-2 border-sky-200 text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                Bagaimana jika saat kondisi <strong className="text-rose-700">SALAH</strong> kita ingin robot melakukan aksi alternatif? Gunakan blok{' '}
                <strong className="text-amber-800">SELAIN ITU</strong>! Ini adalah konsep percabangan 2-arah.
              </div>

              {/* Tampilan Visual Blok C Dua Arah */}
              <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 space-y-3 shadow-xs">
                <div className="w-full bg-amber-100 rounded-2xl border-2 border-amber-300 overflow-hidden shadow-xs">
                  {/* Header C-Block */}
                  <div className="p-3 bg-amber-100 text-amber-950 flex flex-wrap items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs font-mono">
                      JIKA
                    </span>
                    <div className="bg-white border-2 border-emerald-300 px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 text-emerald-950">
                      <span className="text-emerald-900">nilai</span>
                      <span className="text-amber-800 font-black">&gt;=</span>
                      <span className="text-amber-900">75</span>
                    </div>
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs font-mono">
                      MAKA
                    </span>
                  </div>

                  {/* Rongga MAKA */}
                  <div className="bg-amber-50/70 border-l-8 border-amber-400 p-2.5">
                    <div className="bg-purple-100 border-2 border-purple-300 text-purple-950 p-2 rounded-xl text-xs font-black flex items-center gap-2">
                      <span>💬 Tampilkan Pesan: &quot;LULUS&quot;</span>
                    </div>
                  </div>

                  {/* Header SELAIN ITU */}
                  <div className="p-2.5 bg-amber-200 text-amber-950 font-black text-xs font-mono border-t border-amber-300">
                    SELAIN ITU (Kondisi SALAH)
                  </div>

                  {/* Rongga SELAIN ITU */}
                  <div className="bg-amber-50/70 border-l-8 border-rose-400 p-2.5">
                    <div className="bg-purple-100 border-2 border-purple-300 text-purple-950 p-2 rounded-xl text-xs font-black flex items-center gap-2">
                      <span>💬 Tampilkan Pesan: &quot;REMIDI&quot;</span>
                    </div>
                  </div>

                  <div className="h-2 bg-amber-200"></div>
                </div>

                {/* Kontrol Uji Simulasi Nilai */}
                <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Uji Nilai Ujian:</span>
                    <button
                      type="button"
                      onClick={() => setNilaiSimulasiL3(80)}
                      className={`min-h-[44px] px-3.5 rounded-xl text-xs font-black font-mono transition-colors ${
                        nilaiSimulasiL3 === 80
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      80 (&gt;= 75)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNilaiSimulasiL3(60)}
                      className={`min-h-[44px] px-3.5 rounded-xl text-xs font-black font-mono transition-colors ${
                        nilaiSimulasiL3 === 60
                          ? 'bg-rose-500 text-white'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      60 (&lt; 75)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulasiL3}
                    className="min-h-[44px] px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer border-2 border-emerald-600 border-b-4 border-b-emerald-700 active:border-b-0 active:translate-y-1 shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Jalankan Simulasi</span>
                  </button>
                </div>

                {/* Reaksi ALGO */}
                <div className="bg-white p-3 rounded-2xl border border-sky-200 flex items-center gap-3">
                  <RobotAlgo
                    status={statusAlgoL3}
                    pesanAktif={pesanAlgoL3}
                    className="scale-75 -my-2 shrink-0"
                  />
                  <p className="text-xs text-slate-700 italic font-medium">{jejakL3}</p>
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 4: PRAKTIK MINI TANTANGAN */}
          {langkahAktif === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300">
                <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Tantangan Kelulusan Pelatihan ALGO</span>
                </div>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                  Bantu ALGO memprogram sensor suhu stasiun!
                  <br />
                  <strong className="text-amber-800">Misi:</strong> Jika suhu mencapai <strong>35°C ke atas</strong>, tampilkan pesan <strong>&quot;PANAS&quot;</strong>. Selain itu, tampilkan pesan <strong>&quot;NORMAL&quot;</strong>.
                </p>
              </div>

              {/* Mini Editor Interaktif Siswa */}
              <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 space-y-3 shadow-xs">
                <div className="w-full bg-amber-100 rounded-2xl border-2 border-amber-300 overflow-hidden shadow-xs">
                  {/* Header C-Block Siswa */}
                  <div className="p-3 bg-amber-100 text-amber-950 flex flex-wrap items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs font-mono">
                      JIKA
                    </span>
                    <div className="bg-white border-2 border-emerald-300 px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
                      <span className="text-emerald-900">suhu</span>

                      {/* Dropdown Siswa Memilih Operator */}
                      <select
                        value={operatorMini}
                        onChange={(e) =>
                          setOperatorMini(e.target.value as '>=' | '<=' | '=' | '>')
                        }
                        className="min-h-[44px] bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-xs rounded-lg px-2 py-1"
                      >
                        <option value=">=">&gt;= (Lebih dari sama dengan)</option>
                        <option value=">">&gt; (Lebih dari)</option>
                        <option value="<=">&lt;= (Kurang dari sama dengan)</option>
                        <option value="=">= (Sama dengan)</option>
                      </select>

                      <span className="text-amber-900">35</span>
                    </div>
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs font-mono">
                      MAKA
                    </span>
                  </div>

                  {/* Rongga MAKA Siswa */}
                  <div className="bg-amber-50/70 border-l-8 border-amber-400 p-2.5">
                    <div className="bg-purple-100 border-2 border-purple-300 text-purple-950 p-2 rounded-xl text-xs font-black flex items-center justify-between gap-2">
                      <span>Tampilkan Pesan:</span>
                      <select
                        value={pesanMakaMini}
                        onChange={(e) => setPesanMakaMini(e.target.value)}
                        className="min-h-[44px] bg-white border border-purple-300 text-purple-900 font-mono font-bold text-xs rounded-lg px-2.5 py-1"
                      >
                        <option value="PANAS">&quot;PANAS&quot;</option>
                        <option value="NORMAL">&quot;NORMAL&quot;</option>
                        <option value="DINGIN">&quot;DINGIN&quot;</option>
                      </select>
                    </div>
                  </div>

                  {/* Header SELAIN ITU Siswa */}
                  <div className="p-2.5 bg-amber-200 text-amber-950 font-black text-xs font-mono border-t border-amber-300">
                    SELAIN ITU
                  </div>

                  {/* Rongga SELAIN ITU Siswa */}
                  <div className="bg-amber-50/70 border-l-8 border-rose-400 p-2.5">
                    <div className="bg-purple-100 border-2 border-purple-300 text-purple-950 p-2 rounded-xl text-xs font-black flex items-center justify-between gap-2">
                      <span>Tampilkan Pesan:</span>
                      <select
                        value={pesanSelainMini}
                        onChange={(e) => setPesanSelainMini(e.target.value)}
                        className="min-h-[44px] bg-white border border-purple-300 text-purple-900 font-mono font-bold text-xs rounded-lg px-2.5 py-1"
                      >
                        <option value="NORMAL">&quot;NORMAL&quot;</option>
                        <option value="PANAS">&quot;PANAS&quot;</option>
                        <option value="DINGIN">&quot;DINGIN&quot;</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-2 bg-amber-200"></div>
                </div>

                {/* Tombol Uji Mini */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleUjiMini}
                    className="min-h-[48px] px-6 py-2.5 bg-amber-400 hover:bg-amber-300 active:border-b-0 active:translate-y-1 text-slate-950 font-black text-sm rounded-2xl flex items-center gap-2 border-2 border-amber-500 border-b-4 border-b-amber-600 shadow-md cursor-pointer transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>🧪 Uji Logika Mini Tantangan</span>
                  </button>
                </div>

                {/* Hasil Uji Mini */}
                {hasilUjiMini.diuji && (
                  <div
                    className={`p-3.5 rounded-2xl border-2 text-xs transition-all ${
                      hasilUjiMini.lulus
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black mb-1">
                      {hasilUjiMini.lulus ? '🎉 LULUS PELATIHAN!' : '⚠️ BELUM TEPAT'}
                    </div>
                    <p className="leading-relaxed font-medium">{hasilUjiMini.pesan}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigasi Bawah */}
        <div className="p-4 bg-sky-50 dark:bg-slate-800/80 border-t-2 border-sky-100 dark:border-slate-700 flex items-center justify-between gap-3">
          {langkahAktif > 1 ? (
            <button
              type="button"
              onClick={() => setLangkahAktif((prev) => prev - 1)}
              className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 dark:border-slate-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            {langkahAktif < 4 ? (
              <button
                type="button"
                onClick={() => setLangkahAktif((prev) => prev + 1)}
                className="min-h-[44px] px-5 py-2 bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 text-slate-950 font-black text-xs md:text-sm rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer border-2 border-amber-500 border-b-4 border-b-amber-600 shadow-md"
              >
                <span>Lanjut ke Langkah {langkahAktif + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSelesaikanTutorial}
                className="min-h-[44px] px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:translate-y-0.5 text-white font-black text-xs md:text-sm rounded-2xl flex items-center gap-2 transition-all cursor-pointer border-2 border-emerald-600 border-b-4 border-b-emerald-700 shadow-md"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Selesai Tutorial &amp; Buka Level 1</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
