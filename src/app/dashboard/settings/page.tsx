"use client";

import React from "react";
import { User, Shield, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-4xl mx-auto text-slate-900 dark:text-white transition-colors duration-300">
      <header className="mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">
          Account Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">
          Manage your personal identity and security protocols
        </p>
      </header>

      <div className="space-y-6 md:space-y-8">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <User size={20} className="text-indigo-600" /> Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Eslam Elngar"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="eslam@example.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <Shield size={20} className="text-indigo-600" /> Security
          </h3>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/5">
            Reset Password
          </button>
        </section>

        <section className="p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-500 mb-2 flex items-center gap-3 uppercase tracking-tighter">
            <Trash2 size={20} /> Danger Zone
          </h3>
          <p className="text-xs sm:text-sm text-red-600/70 dark:text-red-400/60 mb-4 sm:mb-6 font-medium">
            This action is irreversible. All data will be purged from our
            servers.
          </p>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white hover:bg-red-700 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
            Terminate Account
          </button>
        </section>
      </div>

      <div className="mt-8 md:mt-12 flex justify-center sm:justify-end">
        <button className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-indigo-600 text-white rounded-xl sm:rounded-4xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}