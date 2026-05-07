"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // استدعاء الداتابيز
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // لو التسجيل نجح، وديه على لوحة التحكم
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase">Create Account</h1>
        </div>

        <div className="glass p-8 rounded-[2.5rem]">
          {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm text-white focus:border-indigo-500 outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm text-white focus:border-indigo-500 outline-none" 
                />
              </div>
            </div>

            <button disabled={loading} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all mt-4 disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}