interface SectionHeaderProps {
  label: string;
  onAdd?: () => void;
}

export function SectionHeader({ label, onAdd }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
