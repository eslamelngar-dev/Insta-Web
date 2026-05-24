"use client";

import { Undo2, Redo2 } from "lucide-react";

interface Props {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function UndoRedoBar({ canUndo, canRedo, onUndo, onRedo }: Props) {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-1 shadow-sm">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-indigo-50 enabled:dark:hover:bg-indigo-500/10 enabled:hover:text-indigo-600 enabled:active:scale-95 text-slate-500 group"
        title="Undo (Ctrl+Z)"
      >
        <Undo2
          size={14}
          className="group-enabled:group-hover:-rotate-12 transition-transform"
        />
        <span className="hidden sm:inline">Undo</span>
      </button>

      <div className="w-px h-5 bg-slate-100 dark:bg-white/5" />

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-indigo-50 enabled:dark:hover:bg-indigo-500/10 enabled:hover:text-indigo-600 enabled:active:scale-95 text-slate-500 group"
        title="Redo (Ctrl+Shift+Z)"
      >
        <span className="hidden sm:inline">Redo</span>
        <Redo2
          size={14}
          className="group-enabled:group-hover:rotate-12 transition-transform"
        />
      </button>
    </div>
  );
}
