import { useState, useCallback } from "react";
import { toast } from "sonner";
import { parseApiResponse } from "@/types/api";
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
  deleteNote: (leadId: string, noteId: string) => Promise<boolean>;
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

        const result = await parseApiResponse<Lead>(res);

        if (!result.ok) {
          toast.error(result.message);
          return null;
        }

        return result.data;
      } catch {
        toast.error("Connection error. Please check your internet.");
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const updateStatus = useCallback(
    async (id: string, status: LeadStatus): Promise<Lead | null> => {
      const result = await updateLead(id, { status });
      if (result) {
        toast.success(`Lead marked as ${status}.`);
      }
      return result;
    },
    [updateLead],
  );

  const deleteLead = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      const result = await parseApiResponse<{ deleted: boolean }>(res);

      if (!result.ok) {
        toast.error(result.message);
        return false;
      }

      toast.success("Lead deleted.");
      return true;
    } catch {
      toast.error("Connection error. Please check your internet.");
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

        const result = await parseApiResponse<LeadNote>(res);

        if (!result.ok) {
          toast.error(result.message);
          return null;
        }

        return result.data;
      } catch {
        toast.error("Failed to add note. Please try again.");
        return null;
      } finally {
        setIsAddingNote(false);
      }
    },
    [],
  );

  // ← هنا صلحنا الـ URL الغلط
  const deleteNote = useCallback(
    async (leadId: string, noteId: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/leads/${leadId}/notes/${noteId}`, {
          method: "DELETE",
        });

        const result = await parseApiResponse<{ deleted: boolean }>(res);

        if (!result.ok) {
          toast.error(result.message);
          return false;
        }

        return true;
      } catch {
        toast.error("Failed to delete note. Please try again.");
        return false;
      }
    },
    [],
  );

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
