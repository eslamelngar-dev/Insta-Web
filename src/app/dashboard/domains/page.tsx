// src/app/dashboard/domains/page.tsx
"use client";

import { motion } from "framer-motion";
import { Globe, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DomainsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <div className="relative mx-auto mb-8">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
            <Globe size={40} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center border-4 border-slate-50 dark:border-slate-950">
            <Sparkles size={16} className="text-amber-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
          Coming Soon
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 max-w-md mx-auto">
          A dedicated domain management dashboard is on the way. You'll be able
          to view, manage, and monitor all your custom domains in one place.
        </p>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            In the meantime
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            You can manage custom domains from each site's settings page. Go to{" "}
            <span className="font-bold">My Sites → Settings</span> for any site
            to add or verify a domain.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
        >
          Back to Dashboard
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}
