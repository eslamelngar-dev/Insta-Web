import type { LeadStatus } from "@/types/leads";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  new: {
    label: "New",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    dot: "#3b82f6",
  },
  contacted: {
    label: "Contacted",
    color: "#eab308",
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.25)",
    dot: "#eab308",
  },
  qualified: {
    label: "Qualified",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
    dot: "#8b5cf6",
  },
  converted: {
    label: "Converted",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    dot: "#22c55e",
  },
  archived: {
    label: "Archived",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.25)",
    dot: "#94a3b8",
  },
};

interface Props {
  status: LeadStatus;
  size?: "sm" | "md";
}

export function LeadStatusBadge({ status, size = "md" }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-2 font-black uppercase tracking-widest rounded-full ${
        size === "sm" ? "text-[9px] px-2.5 py-1" : "text-[10px] px-3 py-1.5"
      }`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        className={`rounded-full shrink-0 ${
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        }`}
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}
