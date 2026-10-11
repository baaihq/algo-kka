import React from 'react';
import { BlokProgram, BlokAksi, BlokJika, OperatorPerbandingan } from '../types/game';
import { Trash2, ChevronUp, ChevronDown, MoveVertical, ShieldCheck, DoorOpen, MessageSquare, ShieldAlert } from 'lucide-react';

interface BlockItemProps {
  block: BlokProgram;
  index: number;
  totalBlocks: number;
  pesanTersedia?: string[];
  isHighlighted?: boolean;
  onUpdateOperator?: (blockId: string, operator: OperatorPerbandingan) => void;
  onUpdateTipeAksi?: (blockId: string, tipeAksi: BlokAksi['tipeAksi']) => void;
  onUpdatePesanNilai?: (blockId: string, nilai: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock?: (index: number, direction: 'up' | 'down') => void;
  onAddNestedAction?: (jikaId: string, branch: 'maka' | 'selainItu', tipeAksi: BlokAksi['tipeAksi']) => void;
  onDeleteNestedAction?: (jikaId: string, branch: 'maka' | 'selainItu', actionId: string) => void;
  onUpdateNestedTipeAksi?: (jikaId: string, branch: 'maka' | 'selainItu', actionId: string, tipeAksi: BlokAksi['tipeAksi']) => void;
  onUpdateNestedPesan?: (jikaId: string, branch: 'maka' | 'selainItu', actionId: string, nilai: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetIndex: number) => void;
}

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  index,
  totalBlocks,
  pesanTersedia = [],
  isHighlighted = false,
  onUpdateOperator,
  onUpdateTipeAksi,
  onUpdatePesanNilai,
  onDeleteBlock,
  onMoveBlock,
  onAddNestedAction,
  onDeleteNestedAction,
  onUpdateNestedTipeAksi,
  onUpdateNestedPesan,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  // Render Blok Aksi Mandiri
  if (block.tipe === 'aksi') {
    const stylingAksi = ambilGayaAksi(block.tipeAksi);
    const aksiBelumDipilih = !block.tipeAksi;
    const pesanBelumDipilih = block.tipeAksi === 'pesan' && (!block.nilai || block.nilai.trim() === '');

    return (
      <div
        draggable
        onDragStart={(e) => onDragStart && onDragStart(e, block.id)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop && onDrop(e, index)}
        className={`relative group w-full rounded-2xl shadow-xs border-2 border-b-4 transition-all p-3 min-h-[52px] flex flex-wrap items-center justify-between gap-2 select-none ${stylingAksi} ${
          isHighlighted
            ? 'ring-4 ring-amber-400 border-amber-500 scale-[1.02] shadow-md'
            : ''
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="cursor-grab active:cursor-grabbing text-slate-400 p-1 rounded hover:bg-black/5 touch-none">
            <MoveVertical className="w-4 h-4" />
          </div>
          {renderIkonAksi(block.tipeAksi)}

          {/* Pemilih Tipe Aksi: Izinkan Masuk / Tolak Masuk / Buka Gerbang / Tampilkan Pesan */}
          <select
            value={block.tipeAksi || ''}
            onChange={(e) => onUpdateTipeAksi && onUpdateTipeAksi(block.id, e.target.value as BlokAksi['tipeAksi'])}
            className={`min-h-[40px] px-3 py-1 font-mono font-black text-xs md:text-sm rounded-xl cursor-pointer shadow-xs transition-all ${
              aksiBelumDipilih
                ? 'bg-amber-100 border-2 border-dashed border-amber-600 text-amber-950 ring-2 ring-amber-400 animate-pulse'
                : 'bg-white/95 border-2 border-slate-300 text-slate-900'
            }`}
            title="Pilih jenis aksi perintah"
          >
            <option value="">-- Pilih Aksi (Izinkan / Tolak / Buka / Pesan) --</option>
            <option value="izinkan">Izinkan Masuk</option>
            <option value="tolak">Tolak Masuk</option>
            <option value="buka">Buka Gerbang</option>
            <option value="pesan">Tampilkan Pesan</option>
          </select>

          {/* Jika aksi adalah pesan, tampilkan pemilih pesan (default kosong jika belum dipilih) */}
          {block.tipeAksi === 'pesan' && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-xs text-purple-700 font-bold">:</span>
              <select
                value={block.nilai || ''}
                onChange={(e) => onUpdatePesanNilai && onUpdatePesanNilai(block.id, e.target.value)}
                className={`min-h-[40px] px-3 py-1 font-mono font-black text-xs md:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer shadow-xs transition-all ${
                  pesanBelumDipilih
                    ? 'bg-purple-100 border-2 border-dashed border-purple-500 text-purple-900 ring-2 ring-purple-300 animate-pulse'
                    : 'bg-white border-2 border-purple-300 text-purple-900'
                }`}
                title="Pilih teks pesan"
              >
                <option value="">-- Pilih Pesan --</option>
                {pesanTersedia.map((p) => (
                  <option key={p} value={p}>
                    &quot;{p}&quot;
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Kontrol Kanan: Urutan & Hapus */}
        <div className="flex items-center gap-1">
          {onMoveBlock && (
            <div className="flex items-center bg-white/80 border border-slate-300 rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onMoveBlock(index, 'up')}
                disabled={index === 0}
                className="min-h-[38px] min-w-[34px] flex items-center justify-center p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
                title="Pindah ke Atas"
                aria-label="Pindah blok ke atas"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onMoveBlock(index, 'down')}
                disabled={index === totalBlocks - 1}
                className="min-h-[38px] min-w-[34px] flex items-center justify-center p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
                title="Pindah ke Bawah"
                aria-label="Pindah blok ke bawah"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => onDeleteBlock(block.id)}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center bg-rose-100 hover:bg-rose-200 border-2 border-rose-300 text-rose-800 rounded-xl p-1.5 transition-colors shadow-2xs ml-1 cursor-pointer"
            title="Hapus Blok"
            aria-label="Hapus blok"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render Blok Percabangan Struktur "JIKA ... MAKA" (Bentuk Huruf C Chunky Pastel)
  const jikaBlock = block as BlokJika;
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, block.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop && onDrop(e, index)}
      className={`w-full bg-amber-50/80 rounded-3xl shadow-sm border-2 border-amber-300 transition-all overflow-hidden text-amber-950 ${
        isHighlighted
          ? 'ring-4 ring-amber-400 border-amber-500 scale-[1.01] shadow-md'
          : ''
      }`}
    >
      {/* 1. Header C-Block: "JIKA [Kondisi] MAKA" */}
      <div className="p-3 bg-amber-100 border-b-2 border-amber-300 flex flex-wrap items-center gap-2">
        <div className="shrink-0 order-1 cursor-grab active:cursor-grabbing text-amber-700/80 p-1 rounded hover:bg-amber-200 touch-none">
          <MoveVertical className="w-4 h-4" />
        </div>

        <span className="shrink-0 order-2 font-black text-xs md:text-sm tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl shadow-xs">
          JIKA
        </span>

        {/* Kontrol Kanan Atas/Bawah & Hapus JIKA */}
        <div className="order-3 ml-auto shrink-0 sm:order-4 sm:ml-0 flex items-center gap-1">
          {onMoveBlock && (
            <div className="flex items-center bg-white/90 border border-amber-300 rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onMoveBlock(index, 'up')}
                disabled={index === 0}
                className="min-h-[38px] min-w-[34px] flex items-center justify-center p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
                title="Pindah ke Atas"
                aria-label="Pindah blok ke atas"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onMoveBlock(index, 'down')}
                disabled={index === totalBlocks - 1}
                className="min-h-[38px] min-w-[34px] flex items-center justify-center p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
                title="Pindah ke Bawah"
                aria-label="Pindah blok ke bawah"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => onDeleteBlock(jikaBlock.id)}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center bg-rose-100 hover:bg-rose-200 border-2 border-rose-300 text-rose-800 rounded-xl p-1.5 transition-colors ml-1 cursor-pointer shadow-2xs"
            title="Hapus Blok Percabangan"
            aria-label="Hapus blok percabangan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chip Kondisi + Badge MAKA */}
        <div className="order-4 w-full sm:order-3 sm:w-auto flex flex-wrap items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 bg-white border-2 border-emerald-300 text-emerald-950 px-2.5 py-1 rounded-xl shadow-xs text-xs md:text-sm font-mono font-bold">
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-300">
              {jikaBlock.kondisi.namaData}
            </span>

            {/* Pemilih Operator */}
            <select
              value={jikaBlock.kondisi.operator}
              onChange={(e) =>
                onUpdateOperator &&
                onUpdateOperator(jikaBlock.id, e.target.value as OperatorPerbandingan)
              }
              className="min-h-[38px] min-w-[50px] px-2 py-0.5 bg-amber-100 border-2 border-amber-300 text-amber-950 font-mono font-black text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer text-center"
              title="Pilih operator perbandingan"
            >
              <option value="=">=</option>
              <option value="!=">!=</option>
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
            </select>

            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-300">
              {String(jikaBlock.kondisi.pembanding)}
            </span>
          </div>

          <span className="font-black text-xs md:text-sm tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl shadow-xs">
            MAKA
          </span>
        </div>
      </div>

      {/* 2. Rongga C: Cabang BENAR (MAKA) */}
      <div className="bg-amber-50/60 border-l-8 border-amber-400 pl-3 pr-3 py-2.5 space-y-2">
        <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Aksi saat BENAR:
        </div>

        {jikaBlock.makaAksi.length === 0 ? (
          <div className="p-3 border-2 border-dashed border-amber-300 rounded-2xl text-center text-amber-800 text-xs bg-amber-50 flex flex-wrap items-center justify-between gap-2">
            <span>Rongga kosong. Letakkan blok aksi di sini atau ketuk palet.</span>
            {onAddNestedAction && (
              <button
                type="button"
                onClick={() => onAddNestedAction(jikaBlock.id, 'maka', '' as any)}
                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 text-emerald-900 rounded-xl text-xs font-black cursor-pointer transition-all shadow-2xs"
                title="Pasang aksi ke cabang BENAR"
              >
                + Pasang Aksi
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {jikaBlock.makaAksi.map((aksi) => {
              const pesanBelumDipilih = aksi.tipeAksi === 'pesan' && (!aksi.nilai || aksi.nilai.trim() === '');

              return (
                <div
                  key={aksi.id}
                  className={`rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-xs border-2 border-b-4 ${ambilGayaAksi(aksi.tipeAksi)}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderIkonAksi(aksi.tipeAksi)}

                    {/* Pemilih Tipe Aksi Manual: Izinkan / Tolak / Buka / Pesan */}
                    <select
                      value={aksi.tipeAksi || ''}
                      onChange={(e) =>
                        onUpdateNestedTipeAksi &&
                        onUpdateNestedTipeAksi(jikaBlock.id, 'maka', aksi.id, e.target.value as BlokAksi['tipeAksi'])
                      }
                      className={`min-h-[38px] px-2.5 py-1 font-mono font-black text-xs md:text-sm rounded-xl cursor-pointer shadow-xs transition-all ${
                        !aksi.tipeAksi
                          ? 'bg-amber-100 border-2 border-dashed border-amber-600 text-amber-950 ring-2 ring-amber-400 animate-pulse'
                          : 'bg-white border-2 border-slate-300 text-slate-900'
                      }`}
                      title="Pilih jenis aksi perintah stasiun"
                    >
                      <option value="">-- Pilih Aksi (Izinkan / Tolak / Buka / Pesan) --</option>
                      <option value="izinkan">Izinkan Masuk</option>
                      <option value="tolak">Tolak Masuk</option>
                      <option value="buka">Buka Gerbang</option>
                      <option value="pesan">Tampilkan Pesan</option>
                    </select>

                    {aksi.tipeAksi === 'pesan' && (
                      <select
                        value={aksi.nilai || ''}
                        onChange={(e) =>
                          onUpdateNestedPesan &&
                          onUpdateNestedPesan(jikaBlock.id, 'maka', aksi.id, e.target.value)
                        }
                        className={`min-h-[38px] px-2.5 py-1 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs ${
                          pesanBelumDipilih
                            ? 'bg-purple-100 border-2 border-dashed border-purple-500 text-purple-900 ring-2 ring-purple-300 animate-pulse'
                            : 'bg-white border-2 border-purple-300 text-purple-900'
                        }`}
                        title="Pilih teks pesan aksi"
                      >
                        <option value="">-- Pilih Pesan --</option>
                        {pesanTersedia.map((p) => (
                          <option key={p} value={p}>
                            &quot;{p}&quot;
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteNestedAction &&
                      onDeleteNestedAction(jikaBlock.id, 'maka', aksi.id)
                    }
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center text-rose-700 hover:bg-rose-100 rounded-xl p-1.5 transition-colors cursor-pointer"
                    title="Hapus aksi dari rongga MAKA"
                    aria-label="Hapus aksi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Cabang SELAIN ITU jika aktif */}
      {jikaBlock.punyaSelainItu && (
        <>
          <div className="bg-amber-100 px-3 py-2 border-t-2 border-b-2 border-amber-300 text-amber-950 flex items-center justify-between">
            <span className="font-black text-xs md:text-sm tracking-wider bg-rose-400 text-white px-2.5 py-1 rounded-xl shadow-xs">
              SELAIN ITU
            </span>
            <span className="text-xs text-amber-800 font-bold">
              (Jika kondisi SALAH)
            </span>
          </div>

          <div className="bg-amber-50/60 border-l-8 border-rose-400 pl-3 pr-3 py-2.5 space-y-2">
            <div className="text-[11px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Aksi saat SALAH:
            </div>

            {jikaBlock.selainItuAksi.length === 0 ? (
              <div className="p-3 border-2 border-dashed border-amber-300 rounded-2xl text-center text-amber-800 text-xs bg-amber-50 flex flex-wrap items-center justify-between gap-2">
                <span>Rongga kosong. Letakkan blok aksi di sini atau ketuk palet.</span>
                {onAddNestedAction && (
                  <button
                    type="button"
                    onClick={() => onAddNestedAction(jikaBlock.id, 'selainItu', '' as any)}
                    className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 border-2 border-rose-300 text-rose-900 rounded-xl text-xs font-black cursor-pointer transition-all shadow-2xs"
                    title="Pasang aksi ke cabang SALAH"
                  >
                    + Pasang Aksi
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {jikaBlock.selainItuAksi.map((aksi) => {
                  const pesanBelumDipilih = aksi.tipeAksi === 'pesan' && (!aksi.nilai || aksi.nilai.trim() === '');

                  return (
                    <div
                      key={aksi.id}
                      className={`rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-xs border-2 border-b-4 ${ambilGayaAksi(aksi.tipeAksi)}`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        {renderIkonAksi(aksi.tipeAksi)}

                        {/* Pemilih Tipe Aksi Manual: Izinkan / Tolak / Buka / Pesan */}
                        <select
                          value={aksi.tipeAksi || ''}
                          onChange={(e) =>
                            onUpdateNestedTipeAksi &&
                            onUpdateNestedTipeAksi(jikaBlock.id, 'selainItu', aksi.id, e.target.value as BlokAksi['tipeAksi'])
                          }
                          className={`min-h-[38px] px-2.5 py-1 font-mono font-black text-xs md:text-sm rounded-xl cursor-pointer shadow-xs transition-all ${
                            !aksi.tipeAksi
                              ? 'bg-amber-100 border-2 border-dashed border-amber-600 text-amber-950 ring-2 ring-amber-400 animate-pulse'
                              : 'bg-white border-2 border-slate-300 text-slate-900'
                          }`}
                          title="Pilih jenis aksi perintah stasiun"
                        >
                          <option value="">-- Pilih Aksi (Izinkan / Tolak / Buka / Pesan) --</option>
                          <option value="izinkan">Izinkan Masuk</option>
                          <option value="tolak">Tolak Masuk</option>
                          <option value="buka">Buka Gerbang</option>
                          <option value="pesan">Tampilkan Pesan</option>
                        </select>

                        {aksi.tipeAksi === 'pesan' && (
                          <select
                            value={aksi.nilai || ''}
                            onChange={(e) =>
                              onUpdateNestedPesan &&
                              onUpdateNestedPesan(jikaBlock.id, 'selainItu', aksi.id, e.target.value)
                            }
                            className={`min-h-[38px] px-2.5 py-1 font-mono font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
                              pesanBelumDipilih
                                ? 'bg-purple-100 border-2 border-dashed border-purple-500 text-purple-900 ring-2 ring-purple-300 animate-pulse'
                                : 'bg-white border-2 border-purple-300 text-purple-900'
                            }`}
                            title="Pilih teks pesan aksi"
                          >
                            <option value="">-- Pilih Pesan --</option>
                            {pesanTersedia.map((p) => (
                              <option key={p} value={p}>
                                &quot;{p}&quot;
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteNestedAction &&
                          onDeleteNestedAction(jikaBlock.id, 'selainItu', aksi.id)
                        }
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-rose-700 hover:bg-rose-100 rounded-xl p-1.5 transition-colors cursor-pointer"
                        title="Hapus aksi dari rongga SELAIN ITU"
                        aria-label="Hapus aksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* 4. Footer Penutup Blok C */}
      <div className="h-3 bg-amber-200 border-t-2 border-amber-300 rounded-b-3xl"></div>
    </div>
  );
};

function formatNamaAksi(tipe?: BlokAksi['tipeAksi']): string {
  switch (tipe) {
    case 'izinkan':
      return 'Izinkan Masuk';
    case 'tolak':
      return 'Tolak Masuk';
    case 'buka':
      return 'Buka Gerbang';
    case 'pesan':
      return 'Tampilkan Pesan';
    case 'alarm':
      return 'Bunyikan Alarm';
    default:
      return '-- Belum Dipilih --';
  }
}

function renderIkonAksi(tipe?: BlokAksi['tipeAksi']) {
  switch (tipe) {
    case 'izinkan':
      return <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />;
    case 'tolak':
      return <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />;
    case 'buka':
      return <DoorOpen className="w-5 h-5 text-sky-600 shrink-0" />;
    case 'pesan':
      return <MessageSquare className="w-5 h-5 text-purple-600 shrink-0" />;
    case 'alarm':
      return <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />;
    default:
      return <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />;
  }
}

function ambilGayaAksi(tipe?: BlokAksi['tipeAksi']): string {
  switch (tipe) {
    case 'izinkan':
      return 'bg-emerald-100 text-emerald-950 border-emerald-300 border-b-emerald-400';
    case 'buka':
      return 'bg-sky-100 text-sky-950 border-sky-300 border-b-sky-400';
    case 'tolak':
      return 'bg-rose-100 text-rose-950 border-rose-300 border-b-rose-400';
    case 'pesan':
      return 'bg-purple-100 text-purple-950 border-purple-300 border-b-purple-400';
    case 'alarm':
      return 'bg-amber-100 text-amber-950 border-amber-300 border-b-amber-400';
    default:
      return 'bg-amber-100 text-amber-950 border-amber-300 border-b-amber-400';
  }
}
