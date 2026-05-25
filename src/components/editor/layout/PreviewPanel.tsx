"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import { Icons, ButtonIcons } from "@/constants/icons";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import type { SiteData } from "@/types/editor";

interface Props {
  data: SiteData;
}

export function PreviewPanel({ data }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  const TemplateConfig =
    TEMPLATES_REGISTRY[data.template_id] ?? TEMPLATES_REGISTRY.classic;
  const ActiveTemplate = TemplateConfig.component;

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-950 relative overflow-hidden h-full">
      <div className="absolute top-6 flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full p-1.5 shadow-2xl border border-slate-200 dark:border-white/5 z-30">
        <button
          onClick={() => setIsMobile(false)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[10px] font-black uppercase tracking-wider ${
            !isMobile
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Monitor size={16} /> Desktop
        </button>
        <button
          onClick={() => setIsMobile(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[10px] font-black uppercase tracking-wider ${
            isMobile
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Smartphone size={16} /> Mobile
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{
          width: isMobile ? 420 : "100%",
          height: isMobile ? 880 : "100%",
          borderRadius: isMobile ? "4.5rem" : "0px",
          scale: isMobile ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col bg-white dark:bg-slate-900 z-10"
      >
        <div
          className={`w-full h-full overflow-y-auto ${
            isMobile ? "scrollbar-hide" : "custom-scroll"
          }`}
        >
          <ActiveTemplate
            site={{ ...data, content: data.content }}
            isDark={data.content.theme_mode === "dark"}
            Icons={Icons}
            BtnIcons={ButtonIcons}
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
    </main>
  );
}
