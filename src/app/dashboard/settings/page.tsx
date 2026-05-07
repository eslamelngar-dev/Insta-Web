"use client";

import React from "react";
import { User, Shield, Bell, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-12 max-w-4xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-black tracking-tight">Account Settings</h2>
        <p className="text-slate-500 mt-2">Manage your personal information and security</p>
      </header>

      <div className="space-y-8">
        <section className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <User size={20} className="text-indigo-500" /> Profile Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Full Name</label>
              <input type="text" defaultValue="Eslam Elngar" className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Email Address</label>
              <input type="email" defaultValue="eslam@example.com" className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>
        </section>

        <section className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Shield size={20} className="text-indigo-500" /> Security
          </h3>
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black transition-all border border-white/5">
            Change Password
          </button>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5">
          <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-3">
            <Trash2 size={20} /> Danger Zone
          </h3>
          <p className="text-sm text-red-500/60 mb-6 font-medium">Permanently delete your account and all your websites.</p>
          <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-black transition-all border border-red-500/20">
            Delete Account
          </button>
        </section>
      </div>

      <div className="mt-12 flex justify-end">
        <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}