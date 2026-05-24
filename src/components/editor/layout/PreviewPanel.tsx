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
    <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute top-10 flex bg-white dark:bg-slate-900 rounded-4xl p-2 shadow-2xl border border-slate-100 dark:border-white/5 z-20">
        <button
          onClick={() => setIsMobile(false)}
          className={`flex items-center gap-2 px-6 py-3 rounded-3xl transition-all text-[10px] font-black uppercase ${
            !isMobile ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400"
          }`}
        >
          <Monitor size={18} /> Desktop
        </button>
        <button
          onClick={() => setIsMobile(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-3xl transition-all text-[10px] font-black uppercase ${
            isMobile ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400"
          }`}
        >
          <Smartphone size={18} /> Mobile
        </button>
      </div>

      <motion.div
        animate={{
          width: isMobile ? 420 : "100%",
          height: isMobile ? 880 : "100%",
          borderRadius: isMobile ? "4.5rem" : "0px",
          scale: isMobile ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="shadow-2xl border-16 border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col items-center bg-white dark:bg-slate-900"
      >
        <div className="w-full h-full overflow-hidden">
          <ActiveTemplate
            site={{ ...data, content: data.content }}
            isDark={data.content.theme_mode === "dark"}
            Icons={Icons}
            BtnIcons={ButtonIcons}
          />
        </div>
      </motion.div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
    </main>
  );
}
