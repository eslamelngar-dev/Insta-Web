import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { parseApiResponse } from "@/types/api";
import type { Lead, LeadsFilters, LeadsStats } from "@/types/leads";

interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseLeadsReturn {
  leads: Lead[];
  stats: LeadsStats;
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  refresh: () => void;
  updateLeadLocally: (id: string, updates: Partial<Lead>) => void;
  removeLeadLocally: (id: string) => void;
}

const DEFAULT_STATS: LeadsStats = {
  total: 0,
  new: 0,
  contacted: 0,
  qualified: 0,
  converted: 0,
  archived: 0,
  conversionRate: 0,
};

// Stats احنا بنحسبها من الـ leads اللي جايين
// بدل الـ double fetch نطلب كل الـ leads في أول request بـ limit كبير
// أو نحسبها server-side ونرجعها مع الـ response
function calcStats(leads: Lead[]): LeadsStats {
  const counts = {
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    archived: 0,
  };

  leads.forEach((l) => {
    if (l.status in counts) {
      counts[l.status as keyof typeof counts]++;
    }
  });

  const total = leads.length;
  return {
    total,
    ...counts,
    conversionRate:
      total > 0 ? Math.round((counts.converted / total) * 100) : 0,
  };
}

export function useLeads(filters: LeadsFilters): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  // Stats بتتحسب من الـ page المحملة
  // للـ stats الكاملة نحتاج endpoint منفصل في المستقبل
  const [stats, setStats] = useState<LeadsStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const updateLeadLocally = useCallback(
    (id: string, updates: Partial<Lead>) => {
      setLeads((prev) => {
        const updated = prev.map((l) =>
          l.id === id ? { ...l, ...updates } : l,
        );
        setStats(calcStats(updated));
        return updated;
      });
    },
    [],
  );

  const removeLeadLocally = useCallback((id: string) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      setStats(calcStats(updated));
      setTotal((t) => Math.max(0, t - 1));
      return updated;
    });
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    filters.status,
    filters.search,
    filters.siteId,
    filters.dateFrom,
    filters.dateTo,
  ]);

  useEffect(() => {
    let cancelled = false;

    const fetchLeads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "20");
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.siteId !== "all") params.set("site_id", filters.siteId);
        if (filters.search) params.set("search", filters.search);
        if (filters.dateFrom) params.set("date_from", filters.dateFrom);
        if (filters.dateTo) params.set("date_to", filters.dateTo);

        const res = await fetch(`/api/leads?${params.toString()}`);
        const result = await parseApiResponse<LeadsResponse>(res);

        if (cancelled) return;

        if (!result.ok) {
          setError(result.message);
          toast.error(result.message);
          return;
        }

        const { leads: fetchedLeads, pagination } = result.data;

        setLeads(fetchedLeads);
        setTotal(pagination.total);
        setTotalPages(pagination.pages);
        setStats(calcStats(fetchedLeads));
      } catch {
        if (!cancelled) {
          const msg = "Failed to load leads. Please try again.";
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchLeads();
    return () => {
      cancelled = true;
    };
  }, [filters, page, refreshKey]);

  return {
    leads,
    stats,
    isLoading,
    error,
    page,
    totalPages,
    total,
    setPage,
    refresh,
    updateLeadLocally,
    removeLeadLocally,
  };
}
