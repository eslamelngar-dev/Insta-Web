"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import type { LeadStatus } from "@/types/leads";

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "archived", label: "Archived" },
];

interface Props {
  search: string;
  status: LeadStatus | "all";
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: LeadStatus | "all") => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onReset: () => void;
}

export function LeadsFilters({
  search,
  status,
  dateFrom,
  dateTo,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-50 relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={13}
            className="text-slate-400 dark:text-slate-500"
          />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Status
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                status === opt.value
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                  : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-colors scheme-light dark:scheme-dark"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-colors scheme-light dark:scheme-dark"
          />
        </div>
      </div>
    </div>
  );
}
