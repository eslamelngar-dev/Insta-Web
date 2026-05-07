"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowLeft } from "lucide-react"; // شلنا Github من هنا
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// تعريف أيقونة GitHub يدوياً لضمان عدم حدوث خطأ في المكتبة
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-4.51-2-7-2" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to manage your sites.</p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm space-y-6">
          <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:opacity-90 transition-all">
            <GithubIcon />
            Continue with GitHub
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5"></div>
            <span className="absolute bg-white dark:bg-slate-950 px-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">Or email</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white" 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
              />
            </div>

            <button disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link href="/register" className="text-indigo-600 font-bold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}