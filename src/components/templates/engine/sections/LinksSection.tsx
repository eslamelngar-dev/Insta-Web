"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import type { SectionProps, LinksVariant } from "@/types/template";
import {
  getSpacingValue,
  getRadiusValue,
  getCardClasses,
  getButtonClasses,
} from "@/lib/templates/themes";

export function LinksSection({
  content,
  theme,
  variant,
  BtnIcons,
}: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const radius = getRadiusValue(theme.radius);
  const cardClasses = getCardClasses(theme);
  const btnClasses = getButtonClasses(theme);
  const v = variant as LinksVariant;

  const links = content.links || [];
  if (links.length === 0) return null;

  if (v === "grid") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links.map((link) => {
              const Icon = BtnIcons?.[link.icon] || ExternalLink;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${cardClasses} ${spacing.inner} flex items-center gap-4 transition-all hover:-translate-y-1`}
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  }}
                >
                  <div
                    className={`w-10 h-10 ${radius} flex items-center justify-center shrink-0`}
                    style={{
                      backgroundColor: `${theme.colors.primary}15`,
                      color: theme.colors.primary,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className="font-bold text-sm truncate"
                    style={{ fontFamily: theme.font.body }}
                  >
                    {link.label}
                  </span>
                  <ExternalLink
                    size={14}
                    className="ml-auto shrink-0 opacity-30"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (v === "cards") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const Icon = BtnIcons?.[link.icon] || ExternalLink;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`${cardClasses} ${spacing.inner} flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1`}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${theme.colors.primary}15`,
                    color: theme.colors.primary,
                  }}
                >
                  <Icon size={22} />
                </div>
                <span
                  className="font-bold text-sm"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.font.body,
                  }}
                >
                  {link.label}
                </span>
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
      <div className="max-w-md mx-auto space-y-3">
        {links.map((link) => {
          const Icon = BtnIcons?.[link.icon] || ExternalLink;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`${btnClasses} w-full flex items-center justify-between`}
              style={{
                backgroundColor:
                  theme.buttonStyle === "solid"
                    ? theme.colors.primary
                    : "transparent",
                borderColor: theme.colors.primary,
                color:
                  theme.buttonStyle === "solid"
                    ? "#ffffff"
                    : theme.colors.primary,
                backgroundImage:
                  theme.buttonStyle === "gradient"
                    ? `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`
                    : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{link.label}</span>
              </div>
              <ExternalLink size={14} className="opacity-40" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
