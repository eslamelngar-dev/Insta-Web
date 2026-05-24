interface EditorTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function EditorTextarea({
  label,
  className = "",
  ...props
}: EditorTextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-[9px] font-bold text-slate-400 ml-2 uppercase">
          {label}
        </p>
      )}
      <textarea
        className={`w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm outline-none resize-none shadow-sm focus:border-indigo-500 ${className}`}
        {...props}
      />
    </div>
  );
}