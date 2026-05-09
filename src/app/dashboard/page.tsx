"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Layout,
  ExternalLink,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Dashboard() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [siteToDelete, setSiteToDelete] =
    useState<any>(null);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
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
  };

  const openDeleteModal = (site: any) => {
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
    if (
      !siteToDelete ||
      confirmName !== siteToDelete.title
    )
      return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", siteToDelete.id);

      if (error) throw error;

      setSites(
        sites.filter(
          (s) => s.id !== siteToDelete.id
        )
      );
      toast.success(
        "Project terminated successfully"
      );
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen p-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase">
              Dashboard
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">
              Operational Nodes
            </p>
          </div>
          <Link
            href="/dashboard/templates"
            className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            <Plus
              size={18}
              className="inline mr-2"
            />{" "}
            New Deployment
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-indigo-500">
            <Loader2
              className="animate-spin"
              size={40}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {sites.map((site) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm group relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1.5"
                    style={{
                      backgroundColor:
                        site.primary_color,
                    }}
                  />

                  <div className="flex justify-between items-start mb-10">
                    <div
                      className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner"
                      style={{
                        backgroundColor: `${site.primary_color}10`,
                        color:
                          site.primary_color,
                      }}
                    >
                      <Layout size={32} />
                    </div>
                    <button
                      onClick={() =>
                        openDeleteModal(site)
                      }
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black mb-2 truncate tracking-tight uppercase">
                    {site.title}
                  </h3>
                  <p className="text-slate-400 text-[10px] mb-10 font-bold uppercase tracking-widest">
                    instaweb.me/{site.username}
                  </p>

                  <div className="flex gap-4">
                    <Link
                      href={`/dashboard/editor/${site.id}`}
                      className="flex-1 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-100 dark:border-white/5"
                    >
                      Edit Node
                    </Link>
                    <a
                      href={`/${site.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-100 dark:border-white/5 text-slate-400"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl border border-white/10"
            >
              <button
                onClick={closeDeleteModal}
                className="absolute top-8 right-8 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8">
                <AlertTriangle size={40} />
              </div>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
                Dangerous Action
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                You are about to delete{" "}
                <span className="text-slate-900 dark:text-white font-black underline decoration-red-500">
                  &quot;{siteToDelete?.title}
                  &quot;
                </span>
                . This will purge all associated
                data. This action cannot be undone.
              </p>

              <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Type{" "}
                  <span className="text-red-500">
                    &quot;{siteToDelete?.title}
                    &quot;
                  </span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={confirmName}
                  onChange={(e) =>
                    setConfirmName(
                      e.target.value
                    )
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-red-500 focus:border-red-500 outline-none transition-all shadow-inner"
                  placeholder="Verify site title"
                />
              </div>

              <button
                onClick={handleDelete}
                disabled={
                  confirmName !==
                    siteToDelete?.title ||
                  isDeleting
                }
                className="w-full py-5 bg-red-600 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                {isDeleting
                  ? "Wiping Data..."
                  : "Confirm Termination"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}