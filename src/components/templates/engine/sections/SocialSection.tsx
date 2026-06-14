"use client";

import React from "react";
import { Globe } from "lucide-react";
import type { SectionProps, SocialVariant } from "@/types/template";
import {
  getSpacingValue,
  getRadiusValue,
  getCardClasses,
} from "@/lib/templates/themes";

export function SocialSection({
  content,
  theme,
  variant,
  Icons,
}: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const radius = getRadiusValue(theme.radius);
  const cardClasses = getCardClasses(theme);
  const v = variant as SocialVariant;

  const socialLinks = content.social_links || [];
  if (socialLinks.length === 0) return null;

  if (v === "cards") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {socialLinks.map((s) => {
            const Icon = Icons?.[s.platform] || Globe;
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`${cardClasses} ${spacing.inner} flex flex-col items-center gap-3 transition-all hover:-translate-y-1`}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <div style={{ color: theme.colors.primary }}>
                  <Icon width={24} height={24} />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest capitalize"
                  style={{ color: theme.colors.textMuted }}
                >
                  {s.platform}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    );
  }

  if (v === "minimal") {
    return (
      <section
        className={`w-full py-8 px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-md mx-auto flex justify-center gap-6">
          {socialLinks.map((s) => {
            const Icon = Icons?.[s.platform] || Globe;
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="transition-all hover:-translate-y-1 hover:opacity-80"
                style={{ color: theme.colors.textMuted }}
              >
                <Icon width={20} height={20} />
              </a>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full ${spacing.section} px-6`}
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-md mx-auto flex flex-wrap justify-center gap-3">
        {socialLinks.map((s) => {
          const Icon = Icons?.[s.platform] || Globe;
          return (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className={`p-4 ${radius} border transition-all hover:-translate-y-1`}
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }}
            >
              <Icon width={20} height={20} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
