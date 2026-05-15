"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Globe,
  Power,
  Trash2,
  Lock,
  AlertTriangle,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Site {
  id: string;
  title: string;
  username: string;
  is_published: boolean;
}

export default function SiteSettings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const siteId = resolvedParams.id;

  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("free");

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    const fetchSiteAndUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (profileData && profileData.plan) {
        setUserPlan(profileData.plan);
      }

      const { data: siteData, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", siteId)
        .eq("user_id", user.id)
        .single();

      if (error || !siteData) {
        toast.error("Site not found");
        router.push("/dashboard");
        return;
      }

      setSite(siteData);
      setTitle(siteData.title);
      setUsername(siteData.username);
      setLoading(false);
    };

    fetchSiteAndUser();
  }, [siteId, router]);

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!site) return;
    setSaving(true);

    try {
      if (title.trim().length < 2) {
        throw new Error("Site title must be at least 2 characters long.");
      }

      const cleanUsername = username.toLowerCase().trim();

      if (cleanUsername.length < 3 || cleanUsername.length > 30) {
        throw new Error("Username must be between 3 and 30 characters.");
      }

      const usernameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
      if (!usernameRegex.test(cleanUsername)) {
        throw new Error(
          "Username can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.",
        );
      }

      const reservedWords = [
        "admin",
        "dashboard",
        "api",
        "login",
        "register",
        "settings",
        "billing",
        "templates",
        "editor",
        "support",
        "help",
        "root",
        "instaweb",
        "www",
        "app",
        "auth",
        "home",
      ];

      if (reservedWords.includes(cleanUsername)) {
        throw new Error("This username is reserved and cannot be used.");
      }

      if (cleanUsername !== site.username) {
        const { data: existingSite } = await supabase
          .from("sites")
          .select("id")
          .eq("username", cleanUsername)
          .single();

        if (existingSite) {
          throw new Error("This username is already taken by another user.");
        }
      }

      const { error } = await supabase
        .from("sites")
        .update({ title, username: cleanUsername })
        .eq("id", site.id);

      if (error) {
        if (error.code === "23505") {
          throw new Error("This username is already taken.");
        }
        throw error;
      }

      toast.success("Settings updated successfully");
      setSite({ ...site, title, username: cleanUsername });
      setUsername(cleanUsername);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!site) return;

    if (site.is_published && userPlan !== "pro" && userPlan !== "business") {
      setIsUpgradeModalOpen(true);
      return;
    }

    const newStatus = !site.is_published;

    setSite({ ...site, is_published: newStatus });

    try {
      const { error } = await supabase
        .from("sites")
        .update({ is_published: newStatus })
        .eq("id", site.id);

      if (error) throw error;
      toast.success(
        newStatus ? "Site published and is now live." : "Site taken offline.",
      );
    } catch (error: unknown) {
      setSite({ ...site, is_published: !newStatus });
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleDelete = async () => {
    if (!site || confirmName !== site.title) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("sites").delete().eq("id", site.id);
      if (error) throw error;
      toast.success("Site deleted successfully");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-indigo-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!site) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <SettingsIcon className="text-indigo-500" size={28} />
              Site Settings
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              {site.title}
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight mb-1">
                General
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Update your site&apos;s basic information.
              </p>
            </div>

            <form onSubmit={handleUpdateGeneral} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Site Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Username (URL)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold">
                    instaweb.me/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-r-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight mb-1 flex items-center gap-2">
                <Globe size={20} className="text-blue-500" />
                Visibility
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Manage whether your site is accessible to the public.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
              <div>
                <p className="font-bold text-sm mb-1">
                  Current Status:{" "}
                  {site.is_published ? (
                    <span className="text-green-500 uppercase tracking-widest text-[10px] ml-2">
                      Live
                    </span>
                  ) : (
                    <span className="text-slate-500 uppercase tracking-widest text-[10px] ml-2">
                      Offline (Draft)
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {site.is_published
                    ? "Your site is publicly accessible via its URL."
                    : "Your site is hidden from the public."}
                </p>
              </div>

              <button
                onClick={handleTogglePublish}
                className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  site.is_published
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                    : "bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/20"
                }`}
              >
                <Power size={14} />
                {site.is_published ? "Take Offline" : "Publish Site"}
              </button>
            </div>
          </section>

          <section className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-3xl p-6 sm:p-8">
            <div className="mb-6 border-b border-red-200 dark:border-red-500/20 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight mb-1 text-red-600 flex items-center gap-2">
                <AlertTriangle size={20} />
                Danger Zone
              </h2>
              <p className="text-sm text-red-500/80 font-medium">
                Irreversible and destructive actions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Delete Site
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Permanently remove this site and all its data.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="shrink-0 flex items-center gap-2 px-5 py-3 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-200 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20"
              >
                <Trash2 size={14} />
                Delete Site
              </button>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-indigo-500/20 text-center"
            >
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6 shadow-inner shadow-indigo-500/20">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
                Pro Feature
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base font-medium leading-relaxed">
                Taking a site offline (Maintenance Mode) after it has been
                published is available exclusively on the{" "}
                <span className="font-bold text-indigo-500">Pro Plan</span>.
              </p>
              <Link
                href="/dashboard/billing"
                className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 hover:-translate-y-1"
              >
                Upgrade to Pro
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-red-500 mb-6 sm:mb-8 animate-pulse">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight uppercase">
                Dangerous Action
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 font-medium leading-relaxed text-sm sm:text-base">
                You are about to delete{" "}
                <span className="text-slate-900 dark:text-white font-black underline decoration-red-500">
                  &quot;{site?.title}&quot;
                </span>
                . This action cannot be undone.
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Type{" "}
                  <span className="text-red-500">
                    &quot;{site?.title}&quot;
                  </span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold text-red-500 focus:border-red-500 outline-none transition-all shadow-inner"
                  placeholder="Verify site title"
                />
              </div>
              <button
                onClick={handleDelete}
                disabled={confirmName !== site?.title || isDeleting}
                className="w-full py-4 sm:py-5 bg-red-600 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-4xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                {isDeleting ? "Wiping Data..." : "Confirm Termination"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
