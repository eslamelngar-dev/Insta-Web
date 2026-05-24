"use client";

import { useState } from "react";
import { Pencil, Eye } from "lucide-react";
import { EditorSidebar } from "./EditorSidebar";
import { Icons, ButtonIcons } from "@/constants/icons";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import type { SiteData, SiteContent, SaveStatus, UsernameStatus } from "@/types/editor";

interface Props {
  data: SiteData;
  saveStatus: SaveStatus;
  usernameStatus: UsernameStatus;
  loading: boolean;
  uploadingId: string | null;
  onUsernameChange: (val: string) => void;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target?: string) => void;
  onSaveClick: () => void;
}

export function MobileEditor(props: Props) {
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const TemplateConfig = TEMPLATES_REGISTRY[props.data.template_id] ?? TEMPLATES_REGISTRY.classic;
  const ActiveTemplate = TemplateConfig.component;

  return (
    <div className="h-screen bg-white dark:bg-slate-950 flex flex-col lg:hidden overflow-hidden text-slate-900 dark:text-white transition-colors duration-500 font-sans">
      <div className="flex-1 overflow-hidden relative">
        {mobileTab === "edit" ? (
          <div className="h-full flex flex-col overflow-hidden bg-slate-50/30 dark:bg-slate-900/30">
            <EditorSidebar {...props} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-4">
            <div className="w-full h-full rounded-4xl border-8 border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
              <div className="w-full h-full overflow-auto">
                <ActiveTemplate
                  site={{ ...props.data, content: props.data.content }}
                  isDark={props.data.content.theme_mode === "dark"}
                  Icons={Icons}
                  BtnIcons={ButtonIcons}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 flex border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900">
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
            mobileTab === "edit" ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" : "text-slate-400"
          }`}
        >
          <Pencil size={16} /> Edit
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
            mobileTab === "preview" ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" : "text-slate-400"
          }`}
        >
          <Eye size={16} /> Preview
        </button>
      </div>
    </div>
  );
}