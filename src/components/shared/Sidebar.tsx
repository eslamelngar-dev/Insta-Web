"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, Globe, Settings, CreditCard, LogOut, Zap, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "My Sites", href: "/dashboard" },
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
    <aside className="w-72 h-screen border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 flex flex-col p-6 sticky top-0 transition-colors duration-300">
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3">
          <Zap className="text-indigo-500 fill-indigo-500" size={24} />
          <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase">INSTAWEB</span>
        </div>
        {/* تبديل المود من داخل الـ Sidebar */}
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
        >
          {mounted && (theme === "dark" ? <Sun size={16} className="text-slate-400"/> : <Moon size={16} className="text-slate-600"/>)}
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
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-500 hover:bg-indigo-500/5 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Plan</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">Free Tier</p>
          <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-500 transition-all">
            Upgrade Pro
          </button>
        </div>
        
        <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold w-full text-left">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}