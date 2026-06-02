"use client";

import { useMemo } from "react";

export interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  textColor: string;
  checks: PasswordChecks;
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    const checks: PasswordChecks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    const levels = [
      { label: "", color: "", textColor: "" },
      { label: "Very Weak", color: "bg-red-500", textColor: "text-red-500" },
      { label: "Weak", color: "bg-orange-500", textColor: "text-orange-500" },
      { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-600" },
      {
        label: "Strong",
        color: "bg-emerald-500",
        textColor: "text-emerald-600",
      },
      {
        label: "Very Strong",
        color: "bg-emerald-600",
        textColor: "text-emerald-700",
      },
    ];

    const level = levels[Math.min(score, 5)];

    return {
      score,
      label: level.label,
      color: level.color,
      textColor: level.textColor,
      checks,
    };
  }, [password]);
}
