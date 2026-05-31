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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  deleteSiteAction,
  togglePublishAction,
  updateSiteSettingsAction,
} from "@/app/actions/site";
import { resolveEffectivePlan, normalizePlan } from "@/lib/plans";
import DomainManager from "@/components/domains/DomainManager";

interface Site {
  id: string;
  title: string;
  username: string;
  is_published: boolean;
  account_id: string;
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
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const effectiveUsernameStatus =
    !username || username.trim() === "" ? "idle" : usernameStatus;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    const fetchSiteAndAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: membership } = await supabase
        .from("account_members")
        .select("account_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!membership) {
        router.push("/dashboard");
        return;
      }

      const [siteResult, accountResult] = await Promise.all([
        supabase
          .from("sites")
          .select("id, title, username, is_published, account_id")
          .eq("id", siteId)
          .eq("account_id", membership.account_id)
          .single(),
        supabase
          .from("accounts")
          .select("plan, trial_ends_at")
          .eq("id", membership.account_id)
          .single(),
      ]);

      if (siteResult.error || !siteResult.data) {
        toast.error("Site not found");
        router.push("/dashboard");
        return;
      }

      if (accountResult.data) {
        const effectivePlan = resolveEffectivePlan(
          normalizePlan(accountResult.data.plan),
          accountResult.data.trial_ends_at,
        );
        setIsPro(effectivePlan !== "free");
      }

      setSite(siteResult.data);
      setTitle(siteResult.data.title);
      setUsername(siteResult.data.username);
      setLoading(false);
    };

    fetchSiteAndAccount();
  }, [siteId, router]);

  useEffect(() => {
    if (!username || username.trim() === "") {
      setUsernameStatus("idle");
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus("checking");
      const cleanUsername = username.toLowerCase().trim();

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
        "analytics",
        "leads",
        "domains",
      ];

      if (reservedWords.includes(cleanUsername)) {
        setUsernameStatus("taken");
        return;
      }

      const { data: existingSite } = await supabase
        .from("sites")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", siteId)
        .maybeSingle();

      setUsernameStatus(existingSite ? "taken" : "available");
    }, 500);

    return () => clearTimeout(timer);
  }, [username, siteId]);

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!site) return;

    if (effectiveUsernameStatus === "taken") {
      toast.error("Please choose an available username.");
      return;
    }

    if (effectiveUsernameStatus === "checking") {
      toast.error("Please wait while we check username availability.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateSiteSettingsAction(site.id, {
        title,
        username,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Settings updated successfully");
      setSite({
        ...site,
        title: result.data.title,
        username: result.data.username,
      });
      setUsername(result.data.username);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!site) return;

    setTogglingPublish(true);

    try {
      const newStatus = !site.is_published;
      const result = await togglePublishAction(site.id, newStatus);

      if (!result.success) {
        if (result.code === "UPGRADE_REQUIRED") {
          setIsUpgradeModalOpen(true);
        } else {
          toast.error(result.error);
        }
        return;
      }

      setSite({ ...site, is_published: result.data.is_published });
      toast.success(
        result.data.is_published
          ? "Site published and is now live."
          : "Site taken offline.",
      );
    } finally {
      setTogglingPublish(false);
    }
  };

  const handleDelete = async () => {
    if (!site || confirmName !== site.title) return;

    setIsDeleting(true);

    try {
      const result = await deleteSiteAction(site.id);

      if (!result.success) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      toast.success("Site and all associated files deleted successfully");
      router.push("/dashboard");
    } catch {
      toast.error("An unexpected error occurred");
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
          {/* General Settings */}
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
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-slate-400 ml-2 uppercase tracking-widest">
                  Site Title
                </p>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold shadow-sm outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-slate-400 ml-2 uppercase tracking-widest">
                    URL USERNAME
                  </p>
                  {effectiveUsernameStatus === "checking" && (
                    <Loader2
                      size={12}
                      className="animate-spin text-indigo-500"
                    />
                  )}
                  {effectiveUsernameStatus === "available" && (
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">
                      AVAILABLE
                    </span>
                  )}
                  {effectiveUsernameStatus === "taken" && (
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
                      TAKEN
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.replace(/\s+/g, "-").toLowerCase(),
                      )
                    }
                    placeholder="yourname"
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-black outline-none shadow-sm transition-all focus:ring-2 ${
                      effectiveUsernameStatus === "taken"
                        ? "border-red-500 focus:ring-red-500/20 text-red-500"
                        : effectiveUsernameStatus === "available"
                          ? "border-green-500 focus:ring-green-500/20"
                          : "border-slate-100 dark:border-white/5 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    required
                  />
                  {effectiveUsernameStatus === "taken" && (
                    <AlertCircle
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                    />
                  )}
                  {effectiveUsernameStatus === "available" && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    effectiveUsernameStatus === "taken" ||
                    effectiveUsernameStatus === "checking"
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20"
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

          {/* Visibility */}
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
                <p className="font-bold text-sm mb-1 flex items-center">
                  Current Status:{" "}
                  {site.is_published ? (
                    <span className="text-green-500 uppercase tracking-widest text-[10px] ml-2 font-black bg-green-500/10 px-2 py-1 rounded-md">
                      Live
                    </span>
                  ) : (
                    <span className="text-slate-500 uppercase tracking-widest text-[10px] ml-2 font-black bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md">
                      Offline (Draft)
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {site.is_published
                    ? "Your site is publicly accessible via its URL."
                    : "Your site is hidden from the public."}
                </p>
              </div>

              <button
                onClick={handleTogglePublish}
                disabled={togglingPublish}
                className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  site.is_published
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                    : "bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/20"
                }`}
              >
                {togglingPublish ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Power size={14} />
                )}
                {site.is_published ? "Take Offline" : "Publish Site"}
              </button>
            </div>
          </section>

          {/* Custom Domain */}
          <DomainManager siteId={siteId} isPro={isPro} />

          {/* Danger Zone */}
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

      {/* Upgrade Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
                Pro Feature
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base font-medium leading-relaxed">
                Taking a site offline after publishing requires the{" "}
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

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
