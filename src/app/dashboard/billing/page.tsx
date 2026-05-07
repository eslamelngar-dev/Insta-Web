"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Zap, ShieldCheck } from "lucide-react";

const PLANS = [
  { name: "Free", price: "0", features: ["1 Website", "InstaWeb Subdomain", "Basic Templates", "Community Support"], current: true },
  { name: "Pro", price: "19", features: ["Unlimited Websites", "Custom Domain Support", "Premium Templates", "Priority Support", "Analytics Dashboard"], current: false }
];

export default function BillingPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-black tracking-tight">Billing & Plans</h2>
        <p className="text-slate-500 mt-2">Manage your subscription and payment methods</p>
      </header>

      <div className="grid grid-cols-2 gap-8">
        {PLANS.map((plan) => (
          <motion.div 
            key={plan.name}
            whileHover={{ y: -5 }}
            className={`glass p-10 rounded-[3rem] relative overflow-hidden ${plan.name === 'Pro' ? 'border-indigo-500/30 ring-1 ring-indigo-500/20' : ''}`}
          >
            {plan.name === 'Pro' && (
              <div className="absolute top-6 right-6 bg-indigo-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">Recommended</div>
            )}
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{plan.name} Plan</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black">${plan.price}</span>
              <span className="text-slate-500 font-bold">/mo</span>
            </div>
            <ul className="space-y-4 mb-10">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${plan.current ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-white/5' : 'bg-white text-slate-950 hover:bg-slate-200 shadow-xl'}`}>
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 glass p-8 rounded-[2.5rem] flex items-center justify-between border-dashed border-white/10 bg-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="font-bold">Payment Method</p>
            <p className="text-xs text-slate-500 mt-1">No payment method on file</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black transition-all border border-white/5">
          Add Method
        </button>
      </div>
    </div>
  );
}