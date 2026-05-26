import { useState, useEffect, useCallback } from "react";
import type { Lead, LeadsFilters, LeadsStats, LeadStatus } from "@/types/leads";

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

function calcStats(allLeads: Lead[]): LeadsStats {
  const total = allLeads.length;
  const counts = {
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    archived: 0,
  };
  allLeads.forEach((l) => {
    if (counts[l.status as keyof typeof counts] !== undefined) {
      counts[l.status as keyof typeof counts]++;
    }
  });
  return {
    total,
    ...counts,
    conversionRate:
      total > 0 ? Math.round((counts.converted / total) * 100) : 0,
  };
}

export function useLeads(filters: LeadsFilters): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadsStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const updateLeadLocally = useCallback(
    (id: string, updates: Partial<Lead>) => {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      );
      setAllLeads((prev) => {
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
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setAllLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      setStats(calcStats(updated));
      setTotal(updated.length);
      return updated;
    });
  }, []);

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
        if (!res.ok) throw new Error("Failed to fetch leads");

        const json = await res.json();
        if (cancelled) return;

        setLeads(json.data || []);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.pages || 1);

        const allRes = await fetch("/api/leads?limit=1000");
        if (allRes.ok) {
          const allJson = await allRes.json();
          if (cancelled) return;
          const all = allJson.data || [];
          setAllLeads(all);
          setStats(calcStats(all));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
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
