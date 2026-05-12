"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Layout,
  ExternalLink,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Site {
  id: string;
  title: string;
  username: string;
  primary_color: string;
  created_at: string;
  is_published: boolean;
}

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSites = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("sites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setSites(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSites();
  }, [fetchSites]);

  const openDeleteModal = (site: Site) => {
    setSiteToDelete(site);
    setIsDeleteModalOpen(true);
    setConfirmName("");
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSiteToDelete(null);
    setConfirmName("");
  };

  const handleDelete = async () => {
    if (!siteToDelete || confirmName !== siteToDelete.title) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", siteToDelete.id);
      if (error) throw error;
      setSites(sites.filter((s) => s.id !== siteToDelete.id));
      toast.success("Project terminated successfully");
      closeDeleteModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 gap-4 sm:gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase">
              Dashboard
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">
              Operational Nodes
            </p>
          </div>
          <Link
            href="/dashboard/templates"
            className="w-full sm:w-auto text-center px-6 sm:px-10 py-4 sm:py-5 bg-indigo-600 text-white rounded-2xl sm:rounded-4xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:-translate-y-1"
          >
            <Plus size={18} className="inline mr-2" />
            New Deployment
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh] text-indigo-500">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : sites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full relative group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl md:rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl md:rounded-[3rem] overflow-hidden z-10 shadow-sm">
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 dark:opacity-40 animate-pulse" />
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-full flex items-center justify-center relative shadow-xl">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Layers size={28} strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/10 text-amber-500">
                    <Sparkles size={12} />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white uppercase">
                System Standby
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8 md:mb-10 text-sm md:text-base leading-relaxed font-medium px-2">
                No active operational nodes detected in your sector. Initialize
                a new deployment template to establish your digital
                infrastructure.
              </p>
              <Link
                href="/dashboard/templates"
                className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl hover:shadow-indigo-500/25 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 dark:via-black/10 to-transparent skew-x-12" />
                Initialize First Node
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <AnimatePresence>
              {sites.map((site) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: site.primary_color || "#4f46e5",
                    }}
                  />
                  <div className="flex justify-between items-start mb-6 sm:mb-8 md:mb-10">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner"
                      style={{
                        backgroundColor: `${site.primary_color || "#4f46e5"}10`,
                        color: site.primary_color || "#4f46e5",
                      }}
                    >
                      <Layout size={28} />
                    </div>

                    {/* ✨ إضافة البادج وحذف زر المسح بجانبه */}
                    <div className="flex items-center gap-2">
                      {site.is_published ? (
                        <span className="px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                          Live
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest">
                          Draft
                        </span>
                      )}
                      <button
                        onClick={() => openDeleteModal(site)}
                        className="p-2 sm:p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black mb-2 truncate tracking-tight uppercase">
                    {site.title}
                  </h3>
                  <p className="text-slate-400 text-[10px] mb-6 sm:mb-8 md:mb-10 font-bold uppercase tracking-widest truncate">
                    instaweb.me/{site.username}
                  </p>

                  <div className="flex gap-3 sm:gap-4">
                    <Link
                      href={`/dashboard/editor/${site.id}`}
                      className="flex-1 py-3 sm:py-4 bg-slate-50 dark:bg-white/5 rounded-xl sm:rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:hover:bg-indigo-600 transition-all border border-slate-100 dark:border-white/5"
                    >
                      Edit Node
                    </Link>

                    {/* ✨ لو الموقع مسودة، زر الزيارة هيكون معطل */}
                    {site.is_published ? (
                      <a
                        href={`/${site.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 sm:p-4 bg-slate-50 dark:bg-white/5 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-100 dark:border-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white group/link"
                      >
                        <ExternalLink
                          size={18}
                          className="group-hover/link:scale-110 transition-transform"
                        />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="p-3 sm:p-4 bg-slate-50 dark:bg-white/5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                        title="Publish this site to view it"
                      >
                        <ExternalLink size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] md:rounded-[3.5rem] p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10"
            >
              <button
                onClick={closeDeleteModal}
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
                  &quot;{siteToDelete?.title}&quot;
                </span>
                . This will purge all associated data. This action cannot be
                undone.
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Type{" "}
                  <span className="text-red-500">
                    &quot;{siteToDelete?.title}&quot;
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
                disabled={confirmName !== siteToDelete?.title || isDeleting}
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
