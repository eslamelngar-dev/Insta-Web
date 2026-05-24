"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Globe,
  FileText,
} from "lucide-react";
import type { SaveStatus } from "@/types/editor";

interface Props {
  saveStatus: SaveStatus;
  isPublished: boolean;
}

export function EditorHeader({ saveStatus, isPublished }: Props) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900/50 shrink-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/dashboard/templates"
          className="p-2.5 sm:p-3 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-xl sm:rounded-2xl transition-all"
        >
          <ChevronLeft
            size={18}
            className="text-slate-600 dark:text-slate-300"
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-500">
            NEXUS EDITOR
          </span>
          <div className="flex items-center gap-2 mt-1">
            {saveStatus === "saving" && (
              <>
                <Loader2 size={10} className="animate-spin text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Saving...
                </span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 size={10} className="text-green-500" />
                <span className="text-[9px] font-bold text-green-500 uppercase">
                  Saved
                </span>
              </>
            )}
            {saveStatus === "unsaved" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-bold text-amber-500 uppercase">
                  Unsaved
                </span>
              </>
            )}
            {isPublished ? (
              <span className="ml-2 text-[8px] font-black uppercase bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Globe size={8} /> Live
              </span>
            ) : (
              <span className="ml-2 text-[8px] font-black uppercase bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <FileText size={8} /> Draft
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
