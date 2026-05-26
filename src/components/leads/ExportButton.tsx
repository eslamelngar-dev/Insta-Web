"use client";

import { Download, Loader2 } from "lucide-react";
import type { LeadsFilters } from "@/types/leads";
import { useLeadsExport } from "@/hooks/leads/useLeadsExport";

interface Props {
  filters: LeadsFilters;
  total: number;
}

export function ExportButton({ filters, total }: Props) {
  const { isExporting, exportCSV } = useLeadsExport();

  return (
    <button
      onClick={() => exportCSV(filters)}
      disabled={isExporting || total === 0}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 transition-all shadow-sm"
    >
      {isExporting ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Download size={13} />
      )}
      Export CSV
    </button>
  );
}
