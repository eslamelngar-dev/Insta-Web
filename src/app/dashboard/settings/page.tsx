"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User, Shield, Save, Loader2, Building2, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { updateAccountSettingsAction } from "@/app/actions/account";

type MembershipRole = "owner" | "admin" | "editor" | "viewer";

interface SettingsData {
  fullName: string;
  email: string;
  accountName: string;
  role: MembershipRole;
}

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [role, setRole] = useState<MembershipRole>("viewer");

  const [initialData, setInitialData] = useState<SettingsData | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canManageWorkspace = role === "owner" || role === "admin";

  useEffect(() => {
    const fetchSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const { data: membership } = await supabase
        .from("account_members")
        .select("account_id, role")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!membership) {
        router.push("/dashboard");
        return;
      }

      const { data: account } = await supabase
        .from("accounts")
        .select("name")
        .eq("id", membership.account_id)
        .single();

      const nextData: SettingsData = {
        fullName: profile?.full_name ?? "",
        email: user.email ?? "",
        accountName: account?.name ?? "",
        role: membership.role as MembershipRole,
      };

      setFullName(nextData.fullName);
      setEmail(nextData.email);
      setAccountName(nextData.accountName);
      setRole(nextData.role);
      setInitialData(nextData);
      setLoading(false);
    };

    fetchSettings();
  }, [router]);

  const hasChanges = useMemo(() => {
    if (!initialData) return false;
    return (
      fullName.trim() !== initialData.fullName ||
      accountName.trim() !== initialData.accountName
    );
  }, [fullName, accountName, initialData]);

  const handleSave = async () => {
    if (!initialData) return;

    setSaving(true);

    try {
      const result = await updateAccountSettingsAction({
        fullName,
        accountName,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const nextData: SettingsData = {
        fullName: result.data.fullName,
        email,
        accountName: result.data.accountName,
        role,
      };

      setFullName(result.data.fullName);
      setAccountName(result.data.accountName);
      setInitialData(nextData);

      toast.success("Account settings updated successfully.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const password = newPassword.trim();
    const confirmation = confirmPassword.trim();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
      toast.success("Password updated successfully.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-4xl mx-auto text-slate-900 dark:text-white transition-colors duration-300">
      <header className="mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">
          Account Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">
          Manage your profile, workspace identity, and security preferences
        </p>
      </header>

      <div className="space-y-6 md:space-y-8">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <User size={20} className="text-indigo-600" />
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <Building2 size={20} className="text-indigo-600" />
            Workspace Settings
          </h3>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={!canManageWorkspace}
              className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm outline-none transition-all ${
                canManageWorkspace
                  ? "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 focus:border-indigo-500 text-slate-900 dark:text-white"
                  : "bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              }`}
              placeholder="Workspace name"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
              Current role: <span className="font-black uppercase">{role}</span>
              {!canManageWorkspace &&
                " · Only owners and admins can update the workspace name."}
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <Shield size={20} className="text-indigo-600" />
            Security
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-4 sm:px-5 py-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Password
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Update your password to keep your account secure.
              </p>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90"
            >
              Change Password
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8 md:mt-12 flex justify-center sm:justify-end">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-4xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => {
              if (!changingPassword) {
                setShowPasswordModal(false);
                setNewPassword("");
                setConfirmPassword("");
              }
            }}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10">
            <button
              onClick={() => {
                if (!changingPassword) {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                }
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-5">
              <Lock size={24} />
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight mb-2">
              Change Password
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Choose a new password for your account.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  placeholder="Repeat your new password"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  if (!changingPassword) {
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }
                }}
                disabled={changingPassword}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Lock size={14} />
                )}
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
