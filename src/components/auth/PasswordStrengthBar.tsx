"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { usePasswordStrength } from "@/hooks/auth/usePasswordStrength";

interface PasswordStrengthBarProps {
  password: string;
  show: boolean;
}

export function PasswordStrengthBar({
  password,
  show,
}: PasswordStrengthBarProps) {
  const strength = usePasswordStrength(password);

  const requirements = [
    {
      key: "length",
      label: "At least 8 characters",
      met: strength.checks.length,
    },
    {
      key: "lowercase",
      label: "Lowercase letter",
      met: strength.checks.lowercase,
    },
    {
      key: "uppercase",
      label: "Uppercase letter",
      met: strength.checks.uppercase,
    },
    { key: "number", label: "One number", met: strength.checks.number },
  ];

  return (
    <AnimatePresence>
      {show && password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 overflow-hidden"
        >
          {/* Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    level <= Math.min(strength.score, 4)
                      ? strength.color
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
            {strength.label && (
              <span
                className={`text-[11px] font-bold min-w-18 text-right ${strength.textColor}`}
              >
                {strength.label}
              </span>
            )}
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-2 gap-1.5">
            {requirements.map((req) => (
              <div key={req.key} className="flex items-center gap-1.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    req.met
                      ? "bg-emerald-100 dark:bg-emerald-500/20"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {req.met ? (
                    <Check
                      size={10}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  ) : (
                    <X size={10} className="text-slate-400" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    req.met
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
