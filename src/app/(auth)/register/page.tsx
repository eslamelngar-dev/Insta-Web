"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema } from "@/lib/validations/auth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { AuthInput } from "@/components/auth/AuthInput";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Divider } from "@/components/auth/Divider";
import { PasswordStrengthBar } from "@/components/auth/PasswordStrengthBar";

export default function RegisterPage() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  const {
    values,
    errors,
    touched,
    loading,
    generalError,
    setLoading,
    setGeneralError,
    setErrors,
    getFieldProps,
    markTouched,
  } = useAuthForm({ fullName: "", email: "", password: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(values);
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
    setGeneralError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: { full_name: result.data.fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setGeneralError(
            "An account with this email already exists. Try signing in.",
          );
        } else {
          setGeneralError(error.message);
        }
        setLoading(false);
        return;
      }

      // الإيميل موجود بالفعل
      if (data.user?.identities?.length === 0) {
        setGeneralError(
          "An account with this email already exists. Try signing in.",
        );
        setLoading(false);
        return;
      }

      // Email confirmation مفعّل
      if (data.user && !data.session) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

      toast.success("Welcome aboard! 🎉");
      router.push("/onboarding");
      router.refresh();
    } catch {
      setGeneralError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Email Sent Screen ──────────────────────────────────────────
  if (emailSent) {
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
            We sent a confirmation link to{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {values.email}
            </span>
            . Click it to activate your account.
          </p>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4 text-left">
            {[
              "Open the email from InstaWeb",
              "Click the confirmation link",
              "Start building your site!",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-xs text-slate-400">
              Didn't receive it? Check your spam folder.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="text-sm text-indigo-600 font-bold hover:underline"
            >
              ← Try a different email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Register Form ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
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
            Join InstaWeb
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Start your 14-day Pro trial — no card needed
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-4xl shadow-sm space-y-6">
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium"
            >
              {generalError}
            </motion.div>
          )}

          <OAuthButtons mode="register" />
          <Divider />

          <form onSubmit={handleRegister} className="space-y-4">
            <AuthInput
              icon={User}
              type="text"
              placeholder="Full name"
              autoComplete="name"
              error={errors.fullName}
              touched={touched.fullName}
              required
              disabled={loading}
              {...getFieldProps("fullName")}
            />

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

            <div className="space-y-3">
              <AuthInput
                icon={Lock}
                type="password"
                placeholder="Create password"
                autoComplete="new-password"
                error={errors.password}
                touched={touched.password}
                required
                disabled={loading}
                {...getFieldProps("password")}
              />
              <PasswordStrengthBar
                password={values.password}
                show={touched.password || values.password.length > 0}
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-indigo-600 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
