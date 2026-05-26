import { useState, useEffect, useCallback } from "react";
import type { Lead, LeadsFilters, LeadsStats } from "@/types/leads";

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

export function useLeads(filters: LeadsFilters): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
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
        const leadsData: Lead[] = json.data || [];

        setLeads(leadsData);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.pages || 1);

        const statsRes = await fetch("/api/leads?limit=1000");
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          const allLeads: Lead[] = statsJson.data || [];
          const converted = allLeads.filter(
            (l) => l.status === "converted",
          ).length;
          setStats({
            total: statsJson.pagination?.total || 0,
            new: allLeads.filter((l) => l.status === "new").length,
            contacted: allLeads.filter((l) => l.status === "contacted").length,
            qualified: allLeads.filter((l) => l.status === "qualified").length,
            converted,
            archived: allLeads.filter((l) => l.status === "archived").length,
            conversionRate:
              allLeads.length > 0
                ? Math.round((converted / allLeads.length) * 100)
                : 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
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
  };
}
