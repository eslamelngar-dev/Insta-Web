"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  User,
  AtSign,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usernameSchema } from "@/lib/validations/auth";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      const name =
        user.user_metadata?.full_name || user.user_metadata?.name || "";
      setFullName(name);
      if (name) {
        const suggested = name
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_-]/g, "")
          .slice(0, 20);
        setUsername(suggested);
      }
    });
  }, [router]);

  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    const result = usernameSchema.safeParse(value);
    if (!result.success) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");

    const [{ data: site }, { data: profile }] = await Promise.all([
      supabase
        .from("sites")
        .select("username")
        .eq("username", value)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("username")
        .eq("username", value)
        .maybeSingle(),
    ]);

    setUsernameStatus(site || profile ? "taken" : "available");
  }, []);

  useEffect(() => {
    if (debouncedUsername) checkUsername(debouncedUsername);
  }, [debouncedUsername, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== "available" || !fullName.trim()) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      await supabase.auth.updateUser({
        data: { full_name: fullName, username },
      });

      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, full_name: fullName, username },
          { onConflict: "id" },
        );

      if (error) {
        toast.error("Failed to save profile. Please try again.");
        setLoading(false);
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const statusConfig = {
    idle: null,
    checking: {
      icon: <Loader2 size={16} className="animate-spin text-slate-400" />,
      text: "Checking...",
      color: "text-slate-400",
    },
    available: {
      icon: <CheckCircle2 size={16} className="text-emerald-500" />,
      text: "Username is available!",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    taken: {
      icon: <XCircle size={16} className="text-red-500" />,
      text: "This username is already taken",
      color: "text-red-500",
    },
    invalid: {
      icon: <XCircle size={16} className="text-red-500" />,
      text: "Letters, numbers, _ and - only (min 3)",
      color: "text-red-500",
    },
  };

  const statusInfo = statusConfig[usernameStatus];

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2
              size={48}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            You're all set!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Taking you to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.1,
            }}
            className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20"
          >
            <Zap className="text-white fill-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            One Last Step
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Set up your profile to get started
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-indigo-600" />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-4xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                Display Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-5 py-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                Username
              </label>
              <div className="relative">
                <AtSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  required
                  placeholder="your_username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/\s/g, "_"),
                    )
                  }
                  disabled={loading}
                  className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-xl pl-12 pr-12 py-4 text-sm outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50 ${
                    usernameStatus === "available"
                      ? "border-emerald-300 dark:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                      : usernameStatus === "taken" ||
                          usernameStatus === "invalid"
                        ? "border-red-300 dark:border-red-500/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                        : "border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {statusInfo?.icon}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {statusInfo && (
                  <motion.div
                    key={usernameStatus}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center gap-1.5 px-1 ${statusInfo.color}`}
                  >
                    <span className="text-[11px] font-medium">
                      {statusInfo.text}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {username && usernameStatus === "available" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-slate-400 px-1"
                >
                  Your site:{" "}
                  <span className="font-bold text-indigo-600">
                    instaweb.me/{username}
                  </span>
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{
                scale: loading || usernameStatus !== "available" ? 1 : 1.01,
              }}
              whileTap={{
                scale: loading || usernameStatus !== "available" ? 1 : 0.98,
              }}
              disabled={
                loading || usernameStatus !== "available" || !fullName.trim()
              }
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Setting up...
                </>
              ) : (
                <>
                  Complete Setup <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">
          You can change this later in your settings
        </p>
      </motion.div>
    </div>
  );
}
