"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Globe, Mail, Zap, ExternalLink, Code, Layout, MessageCircle, Play } from "lucide-react";
import Link from "next/link";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";

const Icons: Record<string, React.FC<any>> = {
  x: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 4l11.733 16H20L8.267 4H4zM4 20l6.768-6.768m2.46-2.46L20 4" /></svg>,
  whatsapp: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 4.5z"/><path d="M15.54 12.85a1.5 1.5 0 0 0-1.5-1.5h-1a1.5 1.5 0 0 0-1.5 1.5v1a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5z"/></svg>,
  github: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-4.51-2-7-2" /></svg>,
  instagram: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>,
  linkedin: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>,
  facebook: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  youtube: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
};

const BtnIcons: Record<string, React.FC<any>> = { globe: Globe, mail: Mail, zap: Zap, link: ExternalLink, code: Code, layout: Layout, chat: MessageCircle, play: Play };

export default function TemplatesPage() {
  return (
    <div className="min-h-screen p-8 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full mb-4">
            <Sparkles size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Live Previews</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Select Your Identity</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-sm">
            What you see is exactly what you get. Choose a layout to start customizing.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {Object.values(TEMPLATES_REGISTRY).map((template) => {
            const TemplateComponent = template.component;
            const content = template.defaultContent || {};
            const isDark = content.theme_mode === "dark";

            return (
              <motion.div 
                key={template.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col group transition-all hover:border-indigo-500/30 shadow-xl shadow-slate-200/20 dark:shadow-none w-full mx-auto"
              >
                <div className="relative w-full h-[400px] overflow-hidden bg-slate-100 dark:bg-slate-950 flex justify-center pt-8 pointer-events-none select-none border-b border-slate-100 dark:border-white/5">
                  <div 
                    className="w-[390px] h-[844px] origin-top rounded-[3rem] overflow-hidden border-[12px] border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col shrink-0"
                    style={{ 
                      transform: 'scale(0.42)',
                      backgroundColor: isDark ? '#0d1117' : '#ffffff' 
                    }}
                  >
                    <div className="w-full h-full overflow-hidden">
                      <TemplateComponent 
                        site={{ content: content }} 
                        isDark={isDark} 
                        Icons={Icons} 
                        BtnIcons={BtnIcons} 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 relative z-10 bg-white dark:bg-slate-900/40 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg">
                         {template.category}
                       </span>
                    </div>
                    
                    <h3 className="text-xl font-black uppercase tracking-tight mb-2">{template.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-8">
                      {template.description}
                    </p>
                  </div>

                  <Link 
                    href={`/dashboard/editor/new?template=${template.id}`}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 pointer-events-auto mt-auto"
                  >
                    Use Template <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}