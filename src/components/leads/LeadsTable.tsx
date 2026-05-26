"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Trash2,
  ChevronRight,
  Mail,
  Phone,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { LeadStatusBadge } from "./LeadStatusBadge";
import type { Lead, LeadStatus } from "@/types/leads";

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "#3b82f6" },
  { value: "contacted", label: "Contacted", color: "#eab308" },
  { value: "qualified", label: "Qualified", color: "#8b5cf6" },
  { value: "converted", label: "Converted", color: "#22c55e" },
  { value: "archived", label: "Archived", color: "#94a3b8" },
];

function StatusDropdown({
  currentStatus,
  onChange,
  disabled,
}: {
  currentStatus: LeadStatus;
  onChange: (s: LeadStatus) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPos({
      top: spaceBelow < 230 ? rect.top - 230 : rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        btnRef.current &&
        !btnRef.current.contains(t) &&
        dropRef.current &&
        !dropRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => {
          if (!disabled) {
            updatePos();
            setOpen(!open);
          }
        }}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
      >
        <LeadStatusBadge status={currentStatus} size="sm" />
        <ChevronDown
          size={12}
          style={{
            color: "#94a3b8",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 200ms",
          }}
        />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            ref={dropRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
              width: 192,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {STATUS_OPTIONS.map((opt) => {
              const isActive = currentStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(99,102,241,0.08)"
                      : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: opt.color }}
                  />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {opt.label}
                  </span>
                  {isActive && (
                    <span
                      className="ml-auto text-xs"
                      style={{ color: "#6366f1" }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-slate-100 dark:border-white/5 animate-pulse bg-slate-50 dark:bg-white/2 last:border-0"
          />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Mail size={24} style={{ color: "#94a3b8" }} />
        </div>
        <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          No leads found
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Leads will appear here when visitors fill your contact form
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              {["Contact", "Message", "Status", "Date", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
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
                className="border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {lead.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail size={11} style={{ color: "#94a3b8" }} />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lead.email}
                    </p>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Phone size={11} style={{ color: "#94a3b8" }} />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lead.phone}
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 max-w-62.5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lead.message || (
                      <span className="italic" style={{ color: "#94a3b8" }}>
                        No message
                      </span>
                    )}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <StatusDropdown
                    currentStatus={lead.status}
                    onChange={(s) => onStatusChange(lead.id, s)}
                    disabled={isUpdating}
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">
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
                      className="p-2 rounded-xl transition-colors"
                      style={{
                        backgroundColor: "rgba(99,102,241,0.1)",
                        color: "#6366f1",
                        border: "1px solid rgba(99,102,241,0.2)",
                      }}
                    >
                      <ChevronRight size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      disabled={isDeleting && deletingId === lead.id}
                      className="p-2 rounded-xl transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.1)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.2)",
                      }}
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
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
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-black text-slate-900 dark:text-white px-3">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
