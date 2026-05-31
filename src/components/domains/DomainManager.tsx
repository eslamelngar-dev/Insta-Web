"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  X,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface DomainInfo {
  custom_domain: string | null;
  domain_status: "none" | "pending" | "verified" | "failed";
  domain_verification_token: string | null;
  domain_verified_at: string | null;
}

interface DomainManagerProps {
  siteId: string;
  isPro: boolean;
}

export default function DomainManager({ siteId, isPro }: DomainManagerProps) {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const fetchDomainInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/domains?siteId=${siteId}`);
      const data = await res.json();
      if (data.success) {
        setDomainInfo(data.data);
        if (
          data.data.domain_status === "pending" ||
          data.data.domain_status === "failed"
        ) {
          setShowInstructions(true);
        }
      }
    } catch {
      toast.error("Failed to load domain info");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchDomainInfo();
  }, [fetchDomainInfo]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, domain: newDomain.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to add domain");
        return;
      }

      toast.success("Domain added! Now configure your DNS.");
      setNewDomain("");
      setShowInstructions(true);
      await fetchDomainInfo();
    } finally {
      setIsAdding(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      if (data.data.verified) {
        toast.success("Domain verified successfully! 🎉");
        setShowInstructions(false);
        await fetchDomainInfo();
      } else {
        toast.error(
          data.data.message || "Verification failed. Check DNS settings.",
        );
        await fetchDomainInfo();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const res = await fetch("/api/domains", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      toast.success("Domain removed");
      setShowInstructions(false);
      await fetchDomainInfo();
    } finally {
      setIsRemoving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-indigo-500" size={24} />
      </div>
    );
  }

  const hasDomain =
    domainInfo?.custom_domain && domainInfo.domain_status !== "none";
  const isVerified = domainInfo?.domain_status === "verified";
  const isPending =
    domainInfo?.domain_status === "pending" ||
    domainInfo?.domain_status === "failed";

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
        <h2 className="text-xl font-black uppercase tracking-tight mb-1 flex items-center gap-2">
          <Globe size={20} className="text-indigo-500" />
          Custom Domain
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Connect your own domain to this site.
        </p>
      </div>

      {/* Not Pro */}
      {!isPro && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Lock size={18} className="text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Pro Feature
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Custom domains are available on Pro and Business plans.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Pro - No Domain Yet */}
      {isPro && !hasDomain && (
        <form onSubmit={handleAddDomain} className="space-y-4">
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-slate-400 ml-2 uppercase tracking-widest">
              Domain Name
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newDomain}
                onChange={(e) =>
                  setNewDomain(e.target.value.toLowerCase().trim())
                }
                placeholder="example.com"
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                disabled={isAdding}
              />
              <button
                type="submit"
                disabled={isAdding || !newDomain.trim()}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
              >
                {isAdding ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                Add
              </button>
            </div>
            <p className="text-[10px] text-slate-400 ml-2 font-medium">
              Enter your domain without www (e.g.{" "}
              <span className="font-bold">example.com</span>)
            </p>
          </div>
        </form>
      )}

      {/* Pro - Has Domain */}
      {isPro && hasDomain && domainInfo && (
        <div className="space-y-4">
          {/* Domain Status Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              {/* Status Icon */}
              {isVerified && (
                <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              )}
              {isPending && domainInfo.domain_status === "pending" && (
                <Clock size={20} className="text-yellow-500 shrink-0" />
              )}
              {domainInfo.domain_status === "failed" && (
                <AlertCircle size={20} className="text-red-500 shrink-0" />
              )}

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-sm">
                    {domainInfo.custom_domain}
                  </p>
                  {isVerified && (
                    <a
                      href={`https://${domainInfo.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-1">
                  {isVerified && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">
                      Verified ✓
                    </span>
                  )}
                  {domainInfo.domain_status === "pending" && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md">
                      Pending Verification
                    </span>
                  )}
                  {domainInfo.domain_status === "failed" && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">
                      Verification Failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPending && (
                <>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    <Info size={12} />
                    DNS Guide
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <RefreshCw size={12} />
                    )}
                    Verify
                  </button>
                </>
              )}
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-200 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20"
              >
                {isRemoving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Remove
              </button>
            </div>
          </div>

          {/* DNS Instructions */}
          <AnimatePresence>
            {showInstructions && domainInfo.domain_verification_token && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm uppercase tracking-wider">
                      DNS Configuration
                    </h3>
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Add these records in your domain registrar's DNS settings.
                    Changes can take up to{" "}
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      48 hours
                    </span>{" "}
                    to propagate.
                  </p>

                  {/* Record 1: TXT Verification */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">
                      Step 1 — Verification (TXT Record)
                    </p>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-white/5">
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-widest text-slate-400">
                              Type
                            </th>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-widest text-slate-400">
                              Name
                            </th>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-widest text-slate-400">
                              Value
                            </th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-3 py-3 font-black text-indigo-500">
                              TXT
                            </td>
                            <td className="px-3 py-3 font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all">
                              _instaweb-verify.{domainInfo.custom_domain}
                            </td>
                            <td className="px-3 py-3 font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all">
                              {domainInfo.domain_verification_token}
                            </td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    domainInfo.domain_verification_token!,
                                  )
                                }
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              >
                                <Copy size={12} />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Record 2: CNAME */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">
                      Step 2 — Routing (CNAME Record)
                    </p>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-white/5">
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-widest text-slate-400">
                              Type
                            </th>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-widest text-slate-400">
                              Name
                            </th>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-widest text-slate-400">
                              Value
                            </th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-3 py-3 font-black text-indigo-500">
                              CNAME
                            </td>
                            <td className="px-3 py-3 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                              {domainInfo.custom_domain}
                            </td>
                            <td className="px-3 py-3 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                              cname.instaweb.me
                            </td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() =>
                                  copyToClipboard("cname.instaweb.me")
                                }
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              >
                                <Copy size={12} />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium ml-1">
                      TTL: 300 seconds (or "Automatic")
                    </p>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                  >
                    {isVerifying ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Check Verification Status
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
