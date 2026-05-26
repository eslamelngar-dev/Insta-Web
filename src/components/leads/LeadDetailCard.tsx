"use client";

import {
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Calendar,
  Tag,
  ClipboardList,
} from "lucide-react";
import { LeadStatusBadge } from "./LeadStatusBadge";
import type { Lead, LeadStatus } from "@/types/leads";

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "#3b82f6" },
  { value: "contacted", label: "Contacted", color: "#eab308" },
  { value: "qualified", label: "Qualified", color: "#8b5cf6" },
  { value: "converted", label: "Converted", color: "#22c55e" },
  { value: "archived", label: "Archived", color: "#94a3b8" },
];

interface Props {
  lead: Lead;
  onStatusChange: (status: LeadStatus) => void;
  isUpdating: boolean;
}

export function LeadDetailCard({ lead, onStatusChange, isUpdating }: Props) {
  const fields = [
    {
      icon: Mail,
      label: "Email",
      value: lead.email,
      href: `mailto:${lead.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: lead.phone,
      href: lead.phone ? `tel:${lead.phone}` : undefined,
    },
    {
      icon: MessageSquare,
      label: "Message",
      value: lead.message,
      multiline: true,
    },
    { icon: Globe, label: "Source", value: lead.source },
    {
      icon: Calendar,
      label: "Received",
      value: new Date(lead.created_at).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  const metadata = lead.metadata as Record<string, string> | null;
  const hasMetadata = metadata && Object.keys(metadata).length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {lead.name || "Anonymous"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {lead.email}
            </p>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>

      <div className="p-6 space-y-5">
        {fields.map((field) => {
          if (!field.value) return null;
          return (
            <div key={field.label} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <field.icon
                  size={15}
                  className="text-slate-500 dark:text-slate-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                  {field.label}
                </p>
                {field.href ? (
                  <a
                    href={field.href}
                    className="text-sm font-medium hover:underline break-all"
                    style={{ color: "#6366f1" }}
                  >
                    {field.value}
                  </a>
                ) : (
                  <p
                    className={`text-sm text-slate-700 dark:text-slate-300 ${
                      field.multiline ? "leading-relaxed" : "font-medium"
                    }`}
                  >
                    {field.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {hasMetadata && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <ClipboardList
                size={15}
                className="text-slate-500 dark:text-slate-400"
              />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Custom Fields
              </p>
              <div className="space-y-2">
                {Object.entries(metadata!).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{
                      backgroundColor: "rgba(99,102,241,0.05)",
                      border: "1px solid rgba(99,102,241,0.12)",
                    }}
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#6366f1" }}
                    >
                      {key}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium text-right max-w-[60%] wrap-break-word">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <Tag size={15} className="text-slate-500 dark:text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isActive = lead.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onStatusChange(opt.value)}
                    disabled={isUpdating || isActive}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:cursor-default"
                    style={
                      isActive
                        ? {
                            backgroundColor: "#6366f1",
                            color: "#ffffff",
                            border: "1px solid #6366f1",
                            boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
                          }
                        : {
                            backgroundColor: "rgba(0,0,0,0.03)",
                            color: opt.color,
                            border: `1px solid ${opt.color}30`,
                            opacity: isUpdating ? 0.4 : 1,
                          }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: isActive ? "#ffffff" : opt.color,
                      }}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
