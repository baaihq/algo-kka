import React from 'react';
import { BlokProgram, BlokAksi, OperatorPerbandingan } from '../types/game';
import { BlockItem } from './BlockItem';
import { Play, SquareCode, Layers } from 'lucide-react';

interface ProgramAreaProps {
  program: BlokProgram[];
  pesanTersedia: string[];
  highlightedBlockId?: string;
  onUpdateOperator: (blockId: string, operator: OperatorPerbandingan) => void;
  onUpdateTipeAksi?: (blockId: string, tipeAksi: BlokAksi['tipeAksi']) => void;
  onUpdatePesanNilai: (blockId: string, nilai: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onAddNestedAction: (jikaId: string, branch: 'maka' | 'selainItu', tipeAksi: BlokAksi['tipeAksi']) => void;
  onDeleteNestedAction: (jikaId: string, branch: 'maka' | 'selainItu', actionId: string) => void;
  onUpdateNestedTipeAksi?: (jikaId: string, branch: 'maka' | 'selainItu', actionId: string, tipeAksi: BlokAksi['tipeAksi']) => void;
  onUpdateNestedPesan: (jikaId: string, branch: 'maka' | 'selainItu', actionId: string, nilai: string) => void;
  onReorderBlocks: (fromIndex: number, toIndex: number) => void;
}

export const ProgramArea: React.FC<ProgramAreaProps> = ({
  program,
  pesanTersedia,
  highlightedBlockId,
  onUpdateOperator,
  onUpdateTipeAksi,
  onUpdatePesanNilai,
  onDeleteBlock,
  onMoveBlock,
  onAddNestedAction,
  onDeleteNestedAction,
  onUpdateNestedTipeAksi,
  onUpdateNestedPesan,
  onReorderBlocks
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    const idx = program.findIndex((b) => b.id === id);
    if (idx !== -1) {
      setDraggedIndex(idx);
      e.dataTransfer.setData('text/plain', String(idx));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorderBlocks(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/95 dark:bg-slate-900/95 rounded-3xl border-2 border-sky-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[280px] transition-colors">
      {/* Header Info Area Program */}
      <div className="bg-sky-50 dark:bg-slate-800/80 px-4 py-2.5 border-b-2 border-sky-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 font-mono font-black tracking-wide text-sky-900 dark:text-sky-300">
          <SquareCode className="w-4 h-4 text-amber-500" />
          <span>AREA KODING ROBOT ALGO</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold">
          <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{program.length} Blok Tersusun</span>
        </div>
      </div>

      {/* Konten Bingkai Program (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2.5 flex flex-col">
        {/* Bingkai Tetap: MULAI (Chunky Mint Pastel) */}
        <div className="w-full bg-emerald-100 border-2 border-emerald-300 border-b-4 border-b-emerald-400 text-emerald-950 font-mono font-black text-xs md:text-sm tracking-widest py-2 px-4 rounded-2xl shadow-xs flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>▶ MULAI</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-sans uppercase font-black tracking-wider">
            Titik Masuk
          </span>
        </div>

        {/* Zona Tengah: Susunan Blok */}
        {program.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-sky-200 dark:border-slate-700 rounded-2xl my-2 bg-sky-50/50 dark:bg-slate-800/30">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 flex items-center justify-center text-sky-500 dark:text-sky-400 mb-2 shadow-xs">
              <Play className="w-6 h-6 ml-0.5 fill-sky-200 dark:fill-sky-900 text-sky-500 dark:text-sky-400" />
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 mb-1">
              Program Belum Memiliki Perintah
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Ketuk tombol pada <span className="text-amber-800 dark:text-amber-400 font-black">Palet Blok Perintah</span> di bawah untuk mulai memprogram robot ALGO.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 my-1">
            {program.map((block, idx) => (
              <BlockItem
                key={block.id}
                block={block}
                index={idx}
                totalBlocks={program.length}
                pesanTersedia={pesanTersedia}
                isHighlighted={highlightedBlockId === block.id}
                onUpdateOperator={onUpdateOperator}
                onUpdateTipeAksi={onUpdateTipeAksi}
                onUpdatePesanNilai={onUpdatePesanNilai}
                onDeleteBlock={onDeleteBlock}
                onMoveBlock={onMoveBlock}
                onAddNestedAction={onAddNestedAction}
                onDeleteNestedAction={onDeleteNestedAction}
                onUpdateNestedTipeAksi={onUpdateNestedTipeAksi}
                onUpdateNestedPesan={onUpdateNestedPesan}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}

        {/* Bingkai Tetap: SELESAI (Chunky Coral Pastel) */}
        <div className="w-full bg-rose-100 border-2 border-rose-300 border-b-4 border-b-rose-400 text-rose-950 font-mono font-black text-xs md:text-sm tracking-widest py-2 px-4 rounded-2xl shadow-xs flex items-center justify-between select-none mt-auto">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>⏹ SELESAI</span>
          </div>
          <span className="text-[10px] text-rose-800 font-sans uppercase font-black tracking-wider">
            Titik Keluar
          </span>
        </div>
      </div>
    </div>
  );
};
