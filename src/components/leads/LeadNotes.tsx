"use client";

import { useState } from "react";
import { Send, Trash2, StickyNote } from "lucide-react";
import type { LeadNote } from "@/types/leads";

interface Props {
  notes: LeadNote[];
  isAddingNote: boolean;
  onAddNote: (content: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export function LeadNotes({
  notes,
  isAddingNote,
  onAddNote,
  onDeleteNote,
}: Props) {
  const [content, setContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onAddNote(content.trim());
    setContent("");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDeleteNote(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
        <StickyNote size={16} className="text-indigo-500" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
          Notes
        </h3>
        {notes.length > 0 && (
          <span className="ml-auto text-[10px] font-black bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="flex-1 px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500/50 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || isAddingNote}
            className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all self-end shadow-lg shadow-indigo-600/20"
          >
            <Send size={14} />
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-6">
            No notes yet
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                    {note.content}
                  </p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  {new Date(note.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
