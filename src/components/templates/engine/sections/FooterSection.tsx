"use client";

import React from "react";
import { Globe } from "lucide-react";
import type { SectionProps, FooterVariant } from "@/types/template";

export function FooterSection({
  content,
  theme,
  variant,
  Icons,
}: SectionProps) {
  const v = variant as FooterVariant;
  const footerText = content.footer_text || "© 2025 All rights reserved.";
  const socialLinks = content.social_links || [];

  if (v === "detailed") {
    return (
      <footer
        className="w-full py-12 px-6"
        style={{
          backgroundColor: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p
            className="text-sm font-bold"
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
            }}
          >
            {footerText}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => {
                const Icon = Icons?.[s.platform] || Globe;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: theme.colors.textMuted }}
                  >
                    <Icon width={18} height={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </footer>
    );
  }

  if (v === "minimal") {
    return (
      <footer className="w-full py-8 px-6 text-center">
        <p
          className="text-[10px] font-bold uppercase tracking-widest opacity-40"
          style={{ color: theme.colors.textMuted }}
        >
          {footerText}
        </p>
      </footer>
    );
  }

  return (
    <footer
      className="w-full py-10 px-6 text-center"
      style={{ borderTop: `1px solid ${theme.colors.border}` }}
    >
      <div className="max-w-3xl mx-auto">
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-4">
            {socialLinks.map((s) => {
              const Icon = Icons?.[s.platform] || Globe;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: theme.colors.textMuted }}
                >
                  <Icon width={16} height={16} />
                </a>
              );
            })}
          </div>
        )}
        <p
          className="text-xs"
          style={{ color: theme.colors.textMuted, fontFamily: theme.font.body }}
        >
          {footerText}
        </p>
      </div>
    </footer>
  );
}
