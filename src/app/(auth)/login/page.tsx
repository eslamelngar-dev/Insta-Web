"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">InstaWeb</h1>
          <p className="text-slate-500 mt-2">Log in to your account to continue</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <button type="button" className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
              <GithubIcon />
              Continue with GitHub
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-slate-950 px-4 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">OR</span>
            <div className="w-full h-[1px] bg-white/5"></div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link href="/register" className="text-indigo-400 font-bold hover:underline transition-all">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}