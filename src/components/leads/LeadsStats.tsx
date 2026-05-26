"use client";

import { Users, Star, TrendingUp, Archive } from "lucide-react";
import type { LeadsStats as LeadsStatsType } from "@/types/leads";

interface Props {
  stats: LeadsStatsType;
  isLoading: boolean;
}

const STAT_CARDS = (stats: LeadsStatsType) => [
  {
    label: "Total Leads",
    value: stats.total,
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    label: "New",
    value: stats.new,
    icon: Star,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Qualified",
    value: stats.qualified,
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    label: "Conversion Rate",
    value: `${stats.conversionRate}%`,
    icon: Archive,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export function LeadsStats({ stats, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS(stats).map((card) => (
        <div
          key={card.label}
          className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 flex flex-col gap-3 shadow-sm`}
        >
          <div
            className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}
          >
            <card.icon size={18} className={card.color} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {card.value}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
