"use client";

import { useState } from "react";
import { Trash2, ChevronRight, Mail, Phone, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LeadStatusBadge } from "./LeadStatusBadge";
import type { Lead, LeadStatus } from "@/types/leads";

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "archived",
];

interface Props {
  leads: Lead[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function LeadsTable({
  leads,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
  onStatusChange,
  onDelete,
  isUpdating,
  isDeleting,
}: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-slate-100 dark:border-white/5 animate-pulse bg-slate-50 dark:bg-white/5 last:border-0"
          />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          No leads found
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Leads will appear here when visitors fill your contact form
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              {["Contact", "Message", "Status", "Date", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {lead.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail size={11} className="text-slate-400" />
                      <p className="text-xs text-slate-400">{lead.email}</p>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-slate-400" />
                        <p className="text-xs text-slate-400">{lead.phone}</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 max-w-[250px]">
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lead.message || (
                      <span className="italic opacity-40">No message</span>
                    )}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      onStatusChange(lead.id, e.target.value as LeadStatus)
                    }
                    disabled={isUpdating}
                    className="text-[10px] font-black uppercase tracking-widest bg-transparent border-0 outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <LeadStatusBadge status={lead.status} size="sm" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">
                    {new Date(lead.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      disabled={isDeleting && deletingId === lead.id}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-white/5">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {leads.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {total}
            </span>{" "}
            leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-black text-slate-900 dark:text-white px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
