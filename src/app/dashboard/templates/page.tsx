"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, Globe, Mail, Zap, ExternalLink, 
  Code, Layout, MessageCircle, Play, Search, SlidersHorizontal 
} from "lucide-react";
import Link from "next/link";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";

// --- Icons Configuration ---
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

// الفئات الثابتة للمنصة
const PREDEFINED_CATEGORIES = [
  "All", 
  "Bento", 
  "Portfolio", 
  "Social Card", 
  "Creator", 
  "E-commerce", 
  "Business",
  "Event"
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return Object.values(TEMPLATES_REGISTRY).filter((template) => {
      const matchesCategory = 
        activeCategory === "All" || 
        template.category.toLowerCase() === activeCategory.toLowerCase();
        
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen p-6 md:p-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full mb-6 border border-indigo-100 dark:border-indigo-500/20">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Previews</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Select Your Identity
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg mx-auto">
              What you see is exactly what you get. Choose a layout to start customizing your digital presence.
            </p>
          </motion.div>
        </header>

        {/* --- Tool Bar --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white dark:bg-slate-900/50 p-2 md:p-4 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm"
        >
          {/* Categories Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-3 md:pb-0 px-2 scroll-smooth touch-pan-x snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="hidden md:flex items-center justify-center p-2 text-slate-400 border-r border-slate-200 dark:border-white/10 mr-1 shrink-0">
              <SlidersHorizontal size={18} />
            </div>
            {PREDEFINED_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all shrink-0 snap-start ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 shrink-0 px-2 md:px-0">
            <div className="absolute inset-y-0 left-4 md:left-2 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* --- Templates Grid --- */}
        {/* شلنا الـ layout من الـ div الأب عشان نمنع الحركات العشوائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredTemplates.length > 0 ? (
              // بنعمل Grouping للكروت جوه motion.div واحد عشان نعالجه ككتلة واحدة في الانيميشن
              <motion.div
                key={activeCategory + searchQuery} // الـ key ده مهم جداً عشان يخلي الـ AnimatePresence تشتغل صح
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
                className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredTemplates.map((template) => {
                  const TemplateComponent = template.component;
                  const content = template.defaultContent || {};
                  const isDark = content.theme_mode === "dark";

                  return (
                    <div 
                      key={template.id}
                      className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 w-full mx-auto relative"
                    >
                      {/* Live Preview Container */}
                      <div className="relative w-full h-[400px] overflow-hidden bg-slate-50 dark:bg-slate-950/50 flex justify-center pt-8 pointer-events-none select-none border-b border-slate-100 dark:border-white/5">
                        <div 
                          className="w-[390px] h-[844px] origin-top rounded-[3rem] overflow-hidden border-[12px] border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col shrink-0"
                          style={{ 
                            transform: 'scale(0.42)', // ثابت مبيتغيرش مع الـ Hover
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

                      {/* Template Info & Action */}
                      <div className="p-8 relative z-10 bg-white dark:bg-slate-900/40 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                             <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10">
                               {template.category}
                             </span>
                          </div>
                          
                          <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
                            {template.description}
                          </p>
                        </div>

                        <Link 
                          href={`/dashboard/editor/new?template=${template.id}`}
                          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-lg active:scale-95 pointer-events-auto mt-auto"
                        >
                          Use Template <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            ) : (
              /* --- Empty State --- */
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-6 border border-slate-200 dark:border-white/5">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No Templates Found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                  We couldn't find any templates matching "{searchQuery}" in {activeCategory}.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}