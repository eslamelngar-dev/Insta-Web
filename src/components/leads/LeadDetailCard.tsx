"use client";

import { Mail, Phone, MessageSquare, Globe, Calendar, Tag } from "lucide-react";
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {lead.name || "Anonymous"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{lead.email}</p>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>

      <div className="p-6 space-y-5">
        {fields.map((field) => {
          if (!field.value) return null;
          return (
            <div key={field.label} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                <field.icon size={15} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  {field.label}
                </p>
                {field.href ? (
                  <a
                    href={field.href}
                    className="text-sm font-medium text-indigo-500 hover:underline break-all"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p
                    className={`text-sm text-slate-700 dark:text-slate-300 ${field.multiline ? "leading-relaxed" : "font-medium"}`}
                  >
                    {field.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
            <Tag size={15} className="text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  disabled={isUpdating || lead.status === s}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 ${
                    lead.status === s
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
