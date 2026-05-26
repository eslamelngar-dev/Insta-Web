"use client";

import { useCallback } from "react";
import { Inbox } from "lucide-react";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { LeadsFilters } from "@/components/leads/LeadsFilters";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { ExportButton } from "@/components/leads/ExportButton";
import { useLeads } from "@/hooks/leads/useLeads";
import { useLeadsFilters } from "@/hooks/leads/useLeadsFilters";
import { useLeadActions } from "@/hooks/leads/useLeadActions";
import type { LeadStatus } from "@/types/leads";

export default function LeadsPage() {
  const {
    filters,
    setStatus,
    setSearch,
    setDateFrom,
    setDateTo,
    resetFilters,
    hasActiveFilters,
  } = useLeadsFilters();
  const { leads, stats, isLoading, page, totalPages, total, setPage, refresh } =
    useLeads(filters);
  const { updateStatus, deleteLead, isUpdating, isDeleting } = useLeadActions();

  const handleStatusChange = useCallback(
    async (id: string, status: LeadStatus) => {
      await updateStatus(id, status);
      refresh();
    },
    [updateStatus, refresh],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await deleteLead(id);
      if (ok) refresh();
    },
    [deleteLead, refresh],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Inbox size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Leads
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Manage contacts from your site
            </p>
          </div>
        </div>
        <ExportButton filters={filters} total={total} />
      </div>

      <LeadsStats stats={stats} isLoading={isLoading} />

      <LeadsFilters
        search={filters.search}
        status={filters.status}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={resetFilters}
      />

      <LeadsTable
        leads={leads}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
}
