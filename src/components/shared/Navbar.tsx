"use client";

import React, { useEffect, useState } from "react";
import { Zap, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // لمنع مشاكل الـ Hydration في الأيقونة
  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase text-slate-900 dark:text-white">InstaWeb</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Features</Link>
          
          {/* زرار تبديل المود */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:scale-110 transition-all"
          >
            {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
          </button>

          <Link href="/login" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Login</Link>
          <Link href="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20">
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
}