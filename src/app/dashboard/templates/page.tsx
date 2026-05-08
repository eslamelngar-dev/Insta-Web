"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Layout as LayoutIcon, Zap } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Identity",
    category: "Social Card",
    description: "The gold standard stack. Exactly what you need.",
    // النسخة المصغرة الحقيقية باستخدام SVG مباشر بدلاً من Lucide
    renderExactPreview: (color: string) => (
      <div className="w-full h-full flex flex-col items-center bg-white dark:bg-[#0d1117] p-4 pt-6 select-none" style={{ backgroundColor: `${color}05` }}>
        {/* الصورة */}
        <div className="w-14 h-14 rounded-full mb-2 bg-white dark:bg-slate-900 shadow-xl overflow-hidden border-2 border-white dark:border-slate-800 shrink-0">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="avatar" className="w-full h-full object-cover" />
        </div>
        
        {/* النصوص */}
        <h2 className="text-[12px] font-black uppercase mb-1 text-slate-900 dark:text-white tracking-tighter">Eslam Elngar</h2>
        <p className="text-[6px] font-black uppercase tracking-[0.2em] mb-4 text-slate-500 dark:text-slate-400 text-center px-4">
          Senior UI/UX Architect
        </p>

        {/* أيقونات السوشيال ميديا (SVGs مباشرة لمنع مشاكل المكتبات) */}
        <div className="flex justify-center gap-2 mb-4 shrink-0">
          <div className="p-2 rounded-xl border shadow-sm bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white flex items-center justify-center">
            {/* Github SVG */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-4.51-2-7-2" /></svg>
          </div>
          <div className="p-2 rounded-xl border shadow-sm bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white flex items-center justify-center">
            {/* X (Twitter) SVG */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16H20L8.267 4H4zM4 20l6.768-6.768m2.46-2.46L20 4" /></svg>
          </div>
        </div>

        {/* الأزرار */}
        <div className="w-full space-y-2 px-2 pb-4">
          <div className="w-full px-3 py-2.5 rounded-2xl border-2 font-black text-[6px] uppercase tracking-[0.2em] flex items-center justify-between" style={{ borderColor: color, color: color, backgroundColor: `${color}15` }}>
            <div className="flex items-center gap-2"><LayoutIcon size={10} strokeWidth={3} /> View Portfolio</div>
          </div>
          <div className="w-full px-3 py-2.5 rounded-2xl border-2 font-black text-[6px] uppercase tracking-[0.2em] flex items-center justify-between" style={{ borderColor: color, color: color, backgroundColor: `${color}15` }}>
            <div className="flex items-center gap-2"><Zap size={10} strokeWidth={3} /> Latest Case Study</div>
          </div>
        </div>
      </div>
    )
  }
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen p-8 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
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
          {TEMPLATES.map((template) => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col group transition-all hover:border-indigo-500/30 shadow-xl shadow-slate-200/20 dark:shadow-none w-full max-w-[320px] mx-auto"
            >
              {/* واجهة المعاينة الحقيقية */}
              <div className="aspect-[3/4] border-b border-slate-100 dark:border-white/5 relative overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-slate-200 dark:border-slate-800 shadow-2xl relative transition-transform duration-700 group-hover:scale-105">
                  {template.renderExactPreview("#6366f1")}
                </div>
              </div>

              {/* تفاصيل الكارت */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md">
                     {template.category}
                   </span>
                </div>
                
                <h3 className="text-lg font-black uppercase tracking-tight mb-1">{template.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                  {template.description}
                </p>

                <Link 
                  href={`/dashboard/editor/new?template=${template.id}`}
                  className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  Use Template <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
          
          {/* كارت Bento Grid (قريباً) */}
          <div className="bg-transparent rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 p-12 flex flex-col items-center justify-center text-center opacity-50 w-full max-w-[320px] mx-auto">
             <LayoutIcon size={32} className="text-slate-300 dark:text-slate-600 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Bento Grid Layout</p>
             <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mt-2 px-3 py-1 bg-indigo-500/10 rounded-full">Coming Soon</p>
          </div>
        </div>

      </div>
    </div>
  );
}