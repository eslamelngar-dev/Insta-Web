"use client";

import { Users, Star, TrendingUp, Archive } from "lucide-react";
import type { LeadsStats as LeadsStatsType } from "@/types/leads";

interface Props {
  stats: LeadsStatsType;
  isLoading: boolean;
}

export function LeadsStats({ stats, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/10"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: Users,
      iconColor: "#6366f1",
      iconBg: "rgba(99,102,241,0.12)",
      borderColor: "rgba(99,102,241,0.25)",
    },
    {
      label: "New",
      value: stats.new,
      icon: Star,
      iconColor: "#3b82f6",
      iconBg: "rgba(59,130,246,0.12)",
      borderColor: "rgba(59,130,246,0.25)",
    },
    {
      label: "Qualified",
      value: stats.qualified,
      icon: TrendingUp,
      iconColor: "#8b5cf6",
      iconBg: "rgba(139,92,246,0.12)",
      borderColor: "rgba(139,92,246,0.25)",
    },
    {
      label: "Conversion",
      value: `${stats.conversionRate}%`,
      icon: Archive,
      iconColor: "#22c55e",
      iconBg: "rgba(34,197,94,0.12)",
      borderColor: "rgba(34,197,94,0.25)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col gap-3 shadow-sm"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: card.iconBg,
              border: `1px solid ${card.borderColor}`,
            }}
          >
            <card.icon size={18} style={{ color: card.iconColor }} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {card.value}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
