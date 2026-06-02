"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { AuthInput } from "@/components/auth/AuthInput";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    values,
    errors,
    touched,
    loading,
    setLoading,
    setErrors,
    getFieldProps,
    markTouched,
  } = useAuthForm({ email: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      Object.keys(values).forEach((k) => markTouched(k));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.data.email }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
            className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2
              size={40}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            Check Your Email
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            If an account exists for{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {values.email}
            </span>
            , we've sent a password reset link.
          </p>
          <Link
            href="/login"
            className="text-sm text-indigo-600 font-bold hover:underline"
          >
            ← Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <Link
        href="/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} /> Back to login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Reset Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-4xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="Email address"
              autoComplete="email"
              error={errors.email}
              touched={touched.email}
              required
              disabled={loading}
              {...getFieldProps("email")}
            />

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
