import { useState, useCallback } from "react";
import type { LeadsFilters, LeadStatus } from "@/types/leads";

const DEFAULT_FILTERS: LeadsFilters = {
  status: "all",
  search: "",
  dateFrom: "",
  dateTo: "",
  siteId: "all",
};

interface UseLeadsFiltersReturn {
  filters: LeadsFilters;
  setStatus: (status: LeadStatus | "all") => void;
  setSearch: (search: string) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setSiteId: (siteId: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useLeadsFilters(): UseLeadsFiltersReturn {
  const [filters, setFilters] = useState<LeadsFilters>(DEFAULT_FILTERS);

  const setStatus = useCallback((status: LeadStatus | "all") => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setDateFrom = useCallback((dateFrom: string) => {
    setFilters((prev) => ({ ...prev, dateFrom }));
  }, []);

  const setDateTo = useCallback((dateTo: string) => {
    setFilters((prev) => ({ ...prev, dateTo }));
  }, []);

  const setSiteId = useCallback((siteId: string) => {
    setFilters((prev) => ({ ...prev, siteId }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.search !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.siteId !== "all";

  return {
    filters,
    setStatus,
    setSearch,
    setDateFrom,
    setDateTo,
    setSiteId,
    resetFilters,
    hasActiveFilters,
  };
}
