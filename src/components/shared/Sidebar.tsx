"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Globe,
  Settings,
  CreditCard,
  LogOut,
  Zap,
  Moon,
  Sun,
  Layout,
  Menu,
  X,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "My Sites", href: "/dashboard" },
  { icon: Layout, label: "Templates", href: "/dashboard/templates" },
  { icon: Inbox, label: "Leads", href: "/dashboard/leads" },
  { icon: Globe, label: "Domains", href: "/dashboard/domains" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3">
          <Zap className="text-indigo-500 fill-indigo-500" size={24} />
          <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            INSTAWEB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors border border-slate-200 dark:border-white/5 shadow-sm bg-white dark:bg-slate-900"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun size={16} className="text-indigo-400" />
              ) : (
                <Moon size={16} className="text-slate-600" />
              ))}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors lg:hidden"
          >
            <X size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                active
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
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
            Current Tier
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Early Access Free
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="block w-full py-2.5 bg-indigo-600 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            Upgrade to Pro
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all text-xs font-black uppercase tracking-widest w-full text-left group disabled:opacity-50"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 lg:hidden">
        <div className="flex items-center gap-3">
          <Zap className="text-indigo-500 fill-indigo-500" size={20} />
          <span className="text-sm font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            INSTAWEB
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5"
        >
          <Menu size={20} className="text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 flex flex-col p-6 z-70 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
