"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">SiteFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
            <Link href="#templates" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Templates</Link>
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

  );
}