import type { LeadStatus } from "@/types/leads";

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> =
  {
    new: {
      label: "New",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    contacted: {
      label: "Contacted",
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    qualified: {
      label: "Qualified",
      className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    converted: {
      label: "Converted",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    archived: {
      label: "Archived",
      className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
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
      className={`inline-flex items-center font-black uppercase tracking-widest border rounded-full ${config.className} ${
        size === "sm" ? "text-[9px] px-2.5 py-1" : "text-[10px] px-3 py-1.5"
      }`}
    >
      <span
        className={`rounded-full mr-1.5 ${
          status === "new"
            ? "bg-blue-500"
            : status === "contacted"
              ? "bg-yellow-500"
              : status === "qualified"
                ? "bg-purple-500"
                : status === "converted"
                  ? "bg-green-500"
                  : "bg-slate-500"
        } ${size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"}`}
      />
      {config.label}
    </span>
  );
}
