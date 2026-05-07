"use client";

import React from "react";
import { LayoutDashboard, Globe, Settings, CreditCard, LogOut, Zap, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "My Sites", href: "/dashboard" },
  { icon: Globe, label: "Domains", href: "/dashboard/domains" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen border-r border-white/5 bg-slate-950 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <Zap className="text-indigo-500 fill-indigo-500" size={24} />
        <span className="text-lg font-black tracking-tighter text-white">INSTAWEB</span>
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
                : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="glass p-4 rounded-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Plan</p>
          <p className="text-xs font-bold text-white mb-3">Free Tier</p>
          <button className="w-full py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-500/20 transition-all">
            Upgrade Pro
          </button>
        </div>
        
        <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold w-full">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}