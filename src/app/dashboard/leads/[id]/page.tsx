"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { LeadDetailCard } from "@/components/leads/LeadDetailCard";
import { LeadNotes } from "@/components/leads/LeadNotes";
import { useLeadActions } from "@/hooks/leads/useLeadActions";
import type { Lead, LeadNote, LeadStatus } from "@/types/leads";

interface LeadWithNotes extends Lead {
  notes: LeadNote[];
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<LeadWithNotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    updateStatus,
    deleteLead,
    addNote,
    deleteNote,
    isUpdating,
    isDeleting,
    isAddingNote,
  } = useLeadActions();

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("Lead not found");
      const json = await res.json();
      setLead(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    const updated = await updateStatus(lead.id, status);
    if (updated)
      setLead((prev) => (prev ? { ...prev, status: updated.status } : prev));
  };

  const handleDelete = async () => {
    if (!lead) return;
    const ok = await deleteLead(lead.id);
    if (ok) router.push("/dashboard/leads");
  };

  const handleAddNote = async (content: string) => {
    if (!lead) return;
    const note = await addNote(lead.id, content);
    if (note)
      setLead((prev) =>
        prev ? { ...prev, notes: [note, ...prev.notes] } : prev,
      );
  };

  const handleDeleteNote = async (noteId: string) => {
    const ok = await deleteNote(noteId);
    if (ok)
      setLead((prev) =>
        prev
          ? { ...prev, notes: prev.notes.filter((n) => n.id !== noteId) }
          : prev,
      );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-sm font-bold text-slate-400">
          {error || "Lead not found"}
        </p>
        <Link
          href="/dashboard/leads"
          className="text-indigo-500 text-sm font-bold hover:underline"
        >
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/leads"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Leads
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 disabled:opacity-40 transition-all"
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            Delete Lead
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <LeadDetailCard
              lead={lead}
              onStatusChange={handleStatusChange}
              isUpdating={isUpdating}
            />
          </div>
          <div className="lg:col-span-2">
            <LeadNotes
              notes={lead.notes}
              isAddingNote={isAddingNote}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
