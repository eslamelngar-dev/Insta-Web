import { useState, useCallback } from "react";
import type { LeadsFilters } from "@/types/leads";

interface UseLeadsExportReturn {
  isExporting: boolean;
  exportCSV: (filters: LeadsFilters) => Promise<void>;
}

export function useLeadsExport(): UseLeadsExportReturn {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(async (filters: LeadsFilters) => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filters.siteId !== "all") params.set("site_id", filters.siteId);
      if (filters.status !== "all") params.set("status", filters.status);

      const res = await fetch(`/api/leads/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { isExporting, exportCSV };
}
