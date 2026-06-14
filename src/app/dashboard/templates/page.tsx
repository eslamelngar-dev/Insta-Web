"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import { Icons, ButtonIcons } from "@/constants/icons";

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePageType, setActivePageType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(
      Object.values(TEMPLATES_REGISTRY).map((t) => t.category),
    );
    return ["All", ...Array.from(cats).sort()];
  }, []);

  const pageTypes = useMemo(() => {
    const types = new Set(
      Object.values(TEMPLATES_REGISTRY).map((t) => t.pageType),
    );
    return ["All", ...Array.from(types).sort()];
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const hasActiveFilters =
    activeCategory !== "All" ||
    activePageType !== "All" ||
    normalizedSearch.length > 0;

  const filteredTemplates = useMemo(() => {
    return Object.values(TEMPLATES_REGISTRY).filter((template) => {
      const matchesCategory =
        activeCategory === "All" ||
        template.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesPageType =
        activePageType === "All" || template.pageType === activePageType;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        template.name.toLowerCase().includes(normalizedSearch) ||
        template.description.toLowerCase().includes(normalizedSearch) ||
        template.category.toLowerCase().includes(normalizedSearch) ||
        template.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        );

      return matchesCategory && matchesPageType && matchesSearch;
    });
  }, [activeCategory, activePageType, normalizedSearch]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActivePageType("All");
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-100 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full mb-4 sm:mb-6 border border-indigo-100 dark:border-indigo-500/20">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Live Previews
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-3 sm:mb-4 bg-linear-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent px-2">
              Select Your Identity
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium max-w-lg mx-auto px-4">
              What you see is exactly what you get. Choose a layout to start
              customizing your digital presence.
            </p>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-16 lg:top-6 z-20 mb-8 md:mb-12"
        >
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl md:rounded-4xl border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="md:hidden space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                      <SlidersHorizontal size={16} />
                    </div>
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={activePageType}
                      onChange={(e) => setActivePageType(e.target.value)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 pr-10 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      {pageTypes.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt === "All"
                            ? "All Types"
                            : pt.charAt(0).toUpperCase() + pt.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="hidden md:flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="flex flex-col gap-3 w-full xl:flex-1">
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex items-center justify-center p-2 text-slate-400 border-r border-slate-200 dark:border-white/10 pr-3 shrink-0">
                      <SlidersHorizontal size={18} />
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 lg:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all shrink-0 ${
                          activeCategory === cat
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                            : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-1 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {pageTypes.map((pt) => (
                      <button
                        key={pt}
                        onClick={() => setActivePageType(pt)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all shrink-0 ${
                          activePageType === pt
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                            : "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {pt === "All" ? "All Types" : pt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto">
                  <div className="relative w-full xl:w-80">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
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
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <X size={14} /> Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  {filteredTemplates.length} Template
                  {filteredTemplates.length !== 1 ? "s" : ""} Found
                </p>
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    {activeCategory !== "All" && (
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                        {activeCategory}
                      </span>
                    )}
                    {activePageType !== "All" && (
                      <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-500/20">
                        {activePageType}
                      </span>
                    )}
                    {normalizedSearch && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 max-w-full truncate">
                        {searchQuery}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 min-h-100">
          <AnimatePresence mode="wait">
            {filteredTemplates.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${activePageType}-${normalizedSearch}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              >
                {filteredTemplates.map((template) => {
                  const TemplateComponent = template.component;
                  const content = template.defaultContent ?? {};
                  const isDark = content.theme_mode === "dark";

                  return (
                    <div
                      key={template.id}
                      className="bg-white dark:bg-slate-900/40 rounded-2xl sm:rounded-4xl md:rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 w-full mx-auto relative"
                    >
                      <div className="relative w-full h-75 sm:h-87.5 md:h-100 overflow-hidden bg-slate-50 dark:bg-slate-950/50 flex justify-center pt-6 sm:pt-8 pointer-events-none select-none border-b border-slate-100 dark:border-white/5">
                        <div
                          className="w-97.5 h-211 origin-top rounded-[3rem] overflow-hidden border-12 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col shrink-0 scale-[0.33] sm:scale-[0.37] lg:scale-[0.42]"
                          style={{
                            backgroundColor: isDark ? "#0d1117" : "#ffffff",
                          }}
                        >
                          <div className="w-full h-full overflow-hidden">
                            <TemplateComponent
                              site={{ content }}
                              isDark={isDark}
                              Icons={Icons}
                              BtnIcons={ButtonIcons}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 md:p-8 relative z-10 bg-white dark:bg-slate-900/40 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10">
                              {template.category}
                            </span>
                            <div className="flex items-center gap-2">
                              {template.isNew && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                                  New
                                </span>
                              )}
                              {template.tier === "premium" && (
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/10">
                                  <Crown size={10} /> Pro
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {template.name}
                          </h3>

                          <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-6 sm:mb-8 leading-relaxed">
                            {template.description}
                          </p>
                        </div>

                        <Link
                          href={`/dashboard/editor/new?template=${template.id}`}
                          className="w-full py-3 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg sm:rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-lg active:scale-95 pointer-events-auto mt-auto"
                        >
                          Use Template <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-6 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-4 sm:mb-6 border border-slate-200 dark:border-white/5">
                  <Search size={28} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">
                  No Templates Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                  We couldn&apos;t find any templates matching your filters.
                </p>
                <button
                  onClick={clearFilters}
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
