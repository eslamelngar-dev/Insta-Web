"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AuthInputProps {
  icon: LucideIcon;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}

export function AuthInput({
  icon: Icon,
  type: initialType,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  autoComplete,
  disabled,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = initialType === "password";
  const inputType = isPassword && showPassword ? "text" : initialType;
  const showError = Boolean(error && touched);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Icon
          size={18}
          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
            showError ? "text-red-400" : "text-slate-400"
          }`}
        />

        <input
          type={inputType}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            w-full bg-slate-50 dark:bg-slate-900/50
            border rounded-xl text-sm outline-none
            transition-all duration-200
            text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isPassword ? "pl-12 pr-12" : "pl-12 pr-5"} py-4
            ${
              showError
                ? "border-red-300 dark:border-red-500/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                : "border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showError && (
          <motion.div
            key={error}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 px-1 overflow-hidden"
          >
            <AlertCircle size={12} className="text-red-500 shrink-0" />
            <span className="text-[11px] text-red-500 font-medium leading-none">
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
