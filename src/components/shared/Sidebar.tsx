"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, Globe, Settings, CreditCard, LogOut, Zap, Moon, Sun, Layout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "My Sites", href: "/dashboard" },
  { icon: Layout, label: "Templates", href: "/dashboard/templates" }, // القسم الجديد
  { icon: Globe, label: "Domains", href: "/dashboard/domains" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <aside className="w-72 h-screen border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 flex flex-col p-6 sticky top-0 transition-colors duration-300 z-50">
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3">
          <Zap className="text-indigo-500 fill-indigo-500" size={24} />
          <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase">INSTAWEB</span>
        </div>
        
        {/* زر تبديل المود */}
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors border border-slate-200 dark:border-white/5 shadow-sm bg-white dark:bg-slate-900"
        >
          {mounted && (theme === "dark" ? <Sun size={16} className="text-indigo-400"/> : <Moon size={16} className="text-slate-600"/>)}
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                isActive 
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1" 
                : "text-slate-500 dark:text-slate-400 hover:bg-indigo-500/5 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        {/* بطاقة الخطة الحالية */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-5 rounded-[1.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
          
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Current Tier</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Early Access Free</p>
          </div>
          
          <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            Upgrade to Pro
          </button>
        </div>
        
        {/* زر تسجيل الخروج */}
        <button className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all text-xs font-black uppercase tracking-widest w-full text-left group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}