"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white font-sans overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-4xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center mx-auto mb-8">
          <Search size={32} className="text-slate-400" />
        </div>

        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
          Profile Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-medium">
          The link you followed might be broken, or the page may have been
          removed. The good news?{" "}
          <span className="text-indigo-500 font-bold">
            This username is still available.
          </span>
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
        >
          Claim this link <ArrowRight size={16} />
        </Link>

        <div className="mt-8">
          <Link
            href="/"
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
