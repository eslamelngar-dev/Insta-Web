import { useState, useCallback } from "react";
import type {
  Lead,
  LeadNote,
  LeadStatus,
  UpdateLeadPayload,
} from "@/types/leads";

interface UseLeadActionsReturn {
  isUpdating: boolean;
  isDeleting: boolean;
  isAddingNote: boolean;
  updateLead: (id: string, payload: UpdateLeadPayload) => Promise<Lead | null>;
  updateStatus: (id: string, status: LeadStatus) => Promise<Lead | null>;
  deleteLead: (id: string) => Promise<boolean>;
  addNote: (leadId: string, content: string) => Promise<LeadNote | null>;
  deleteNote: (noteId: string) => Promise<boolean>;
}

export function useLeadActions(): UseLeadActionsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const updateLead = useCallback(
    async (id: string, payload: UpdateLeadPayload): Promise<Lead | null> => {
      setIsUpdating(true);
      try {
        const res = await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
      } catch {
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const updateStatus = useCallback(
    async (id: string, status: LeadStatus): Promise<Lead | null> => {
      return updateLead(id, { status });
    },
    [updateLead],
  );

  const deleteLead = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const addNote = useCallback(
    async (leadId: string, content: string): Promise<LeadNote | null> => {
      setIsAddingNote(true);
      try {
        const res = await fetch(`/api/leads/${leadId}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
      } catch {
        return null;
      } finally {
        setIsAddingNote(false);
      }
    },
    [],
  );

  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/leads/notes/${noteId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    isUpdating,
    isDeleting,
    isAddingNote,
    updateLead,
    updateStatus,
    deleteLead,
    addNote,
    deleteNote,
  };
}
