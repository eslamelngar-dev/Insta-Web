import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { LeadsFilters } from "@/types/leads";

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
};

function getDownloadFilename(contentDisposition: string | null) {
  if (!contentDisposition) {
    return `leads-${Date.now()}.csv`;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (basicMatch?.[1]) {
    return basicMatch[1];
  }

  return `leads-${Date.now()}.csv`;
}

export function useLeadsExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(
    async (filters: LeadsFilters) => {
      if (isExporting) return false;

      setIsExporting(true);

      try {
        const params = new URLSearchParams();

        if (filters.siteId && filters.siteId !== "all") {
          params.set("site_id", filters.siteId);
        }

        if (filters.status && filters.status !== "all") {
          params.set("status", filters.status);
        }

        const res = await fetch(`/api/leads/export?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const contentType = res.headers.get("content-type") ?? "";

          if (contentType.includes("application/json")) {
            const payload = (await res.json()) as ApiErrorResponse;
            throw new Error(payload.error?.message || "Export failed");
          }

          throw new Error("Export failed");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = getDownloadFilename(
          res.headers.get("content-disposition"),
        );

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Export completed successfully.");
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Export failed";
        toast.error(message);
        return false;
      } finally {
        setIsExporting(false);
      }
    },
    [isExporting],
  );

  return {
    exportCSV,
    isExporting,
  };
}
