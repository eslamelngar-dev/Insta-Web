"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Layers, MousePointer2, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
<Navbar />
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Next Generation Website Builder
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-[0.9]">
              IMAGINE. BUILD. <br /> DEPLOY.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Create a high-end professional presence in minutes. Pick a premium template, inject your data, and go live instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all group">
                Create Your Site
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 border border-white/10 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Layers size={20} />
                Explore Templates
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-32 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative border border-white/10 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="px-4 py-1 bg-slate-950 rounded-lg border border-white/5 text-[10px] text-slate-500 font-mono">
                  siteflow.io/creative-studio
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop" 
                alt="Editor Preview" 
                className="w-full object-cover aspect-video opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}