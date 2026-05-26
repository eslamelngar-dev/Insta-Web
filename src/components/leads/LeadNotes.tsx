"use client";

import { useState } from "react";
import { Send, Trash2, StickyNote, Loader2 } from "lucide-react";
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
        <StickyNote size={16} className="text-indigo-500" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
          Notes
        </h3>
        {notes.length > 0 && (
          <span className="ml-auto text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-0.5 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a note..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || isAddingNote}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
          >
            {isAddingNote ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Send size={13} />
                Add Note
              </>
            )}
          </button>
        </form>

        {notes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-3">
              <StickyNote
                size={18}
                className="text-slate-300 dark:text-slate-600"
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              No notes yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                    {note.content}
                  </p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 shrink-0"
                  >
                    {deletingId === note.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2.5 font-medium">
                  {new Date(note.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {" · "}
                  {new Date(note.created_at).toLocaleTimeString("en-US", {
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
