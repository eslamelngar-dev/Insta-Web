"use client";

import React, { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validations/auth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { AuthInput } from "@/components/auth/AuthInput";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Divider } from "@/components/auth/Divider";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const errorParam = searchParams.get("error");

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
  } = useAuthForm({ email: "", password: "" });

  useEffect(() => {
    if (errorParam) {
      toast.error(errorParam);
    }
  }, [errorParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(values);

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
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setGeneralError("Invalid email or password.");
        } else if (error.message.includes("Email not confirmed")) {
          setGeneralError("Please verify your email before continuing.");
        } else {
          setGeneralError("Unable to sign in right now. Please try again.");
        }
        setLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setGeneralError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

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
            Welcome Back
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Log in to manage your sites
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

          <OAuthButtons mode="login" redirectToPath={redirectTo} />

          <Divider />

          <form onSubmit={handleLogin} className="space-y-4">
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

            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              error={errors.password}
              touched={touched.password}
              required
              disabled={loading}
              {...getFieldProps("password")}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 font-bold hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm font-bold">Loading...</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
