"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Layers, Globe, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-500">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-8 uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" />
              The Future of Link-in-Bio
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 bg-clip-text text-transparent leading-[0.95]">
              CRAFT YOUR <br className="hidden md:block" /> DIGITAL IDENTITY.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Join thousands of creators building high-end personal websites in seconds. No code, just pure professional presence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 group">
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Layers size={20} />
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-24 relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur-3xl opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                </div>
                <div className="px-4 py-1 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] text-slate-400 font-mono tracking-tighter">
                  instaweb.com/eslam-elngar
                </div>
              </div>
              <div className="aspect-video bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <img 
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop" 
                alt="Editor Preview" 
                className="w-full object-cover aspect-video opacity-90 group-hover:opacity-100 transition-opacity"
              />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}