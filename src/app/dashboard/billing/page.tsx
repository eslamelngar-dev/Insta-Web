"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "0",
    features: [
      "1 Website",
      "InstaWeb Subdomain",
      "Basic Templates",
      "Community Support",
    ],
    current: true,
  },
  {
    name: "Pro",
    price: "19",
    features: [
      "Unlimited Websites",
      "Custom Domain Support",
      "Premium Templates",
      "Priority Support",
      "Analytics Dashboard",
    ],
    current: false,
  },
];

export default function BillingPage() {
  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-5xl mx-auto text-slate-900 dark:text-white">
      <header className="mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          Billing & Plans
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Manage your subscription and payment methods
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ y: -5 }}
            className={`p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm ${
              plan.name === "Pro" ? "ring-2 ring-indigo-500/50" : ""
            }`}
          >
            {plan.name === "Pro" && (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-indigo-600 text-[10px] font-black uppercase px-3 py-1 text-white rounded-full">
                Recommended
              </div>
            )}
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
              {plan.name} Plan
            </p>
            <div className="flex items-baseline gap-1 mb-6 sm:mb-8">
              <span className="text-4xl sm:text-5xl font-black">
                ${plan.price}
              </span>
              <span className="text-slate-500 font-bold">/mo</span>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all ${
                plan.current
                  ? "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
              }`}
            >
              {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
