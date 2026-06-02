"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordStrengthBar } from "@/components/auth/PasswordStrengthBar";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

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
  } = useAuthForm({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let mounted = true;

    const setupRecoverySession = async () => {
      try {
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : "";

        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (type === "recovery" && accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            if (mounted) {
              setLinkError(
                "This password reset link is invalid or has expired.",
              );
            }
            return;
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search,
          );

          if (mounted) {
            setSessionReady(true);
            setLinkError(null);
          }

          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (mounted) {
            setSessionReady(true);
            setLinkError(null);
          }
          return;
        }

        if (mounted) {
          setLinkError("This password reset link is invalid or has expired.");
        }
      } catch {
        if (mounted) {
          setLinkError("This password reset link is invalid or has expired.");
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (
        (event === "PASSWORD_RECOVERY" ||
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED") &&
        session
      ) {
        setSessionReady(true);
        setLinkError(null);
      }
    });

    setupRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionReady) {
      setGeneralError(
        "Your reset session is missing or expired. Please request a new link.",
      );
      return;
    }

    const result = resetPasswordSchema.safeParse(values);

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
      const { error } = await supabase.auth.updateUser({
        password: result.data.password,
      });

      if (error) {
        setGeneralError(
          "Unable to reset your password. Please request a new reset link.",
        );
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Password updated successfully!");

      setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 1500);
    } catch {
      setGeneralError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
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
              size={48}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </motion.div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            Password Updated
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Redirecting you now...
          </p>
        </motion.div>
      </div>
    );
  }

  if (linkError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle size={42} className="text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            Invalid Reset Link
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            {linkError}
          </p>

          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-500 transition-all"
          >
            Request a New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20">
            <Zap className="text-white fill-white" size={32} />
          </div>

          <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-300">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm font-bold">
              Verifying your reset link...
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
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
            New Password
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Choose a strong password for your account
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-4xl shadow-sm">
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium mb-6"
            >
              {generalError}
            </motion.div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-3">
              <AuthInput
                icon={Lock}
                type="password"
                placeholder="New password"
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

            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              required
              disabled={loading}
              {...getFieldProps("confirmPassword")}
            />

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
