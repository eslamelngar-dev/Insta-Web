"use client";

import React from "react";
import type { SectionProps, CTAVariant } from "@/types/template";
import {
  getSpacingValue,
  getRadiusValue,
  getButtonClasses,
  getCardClasses,
} from "@/lib/templates/themes";

export function CTASection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const radius = getRadiusValue(theme.radius);
  const btnClasses = getButtonClasses(theme);
  const cardClasses = getCardClasses(theme);
  const v = variant as CTAVariant;

  const email = content.email || "";
  const firstLink = content.links?.[0];

  if (v === "card") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div
          className={`max-w-2xl mx-auto ${cardClasses} ${spacing.inner} text-center`}
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
        >
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-4"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            Let&apos;s Work Together
          </h2>
          <p
            className="text-sm mb-8 max-w-md mx-auto"
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
            }}
          >
            {content.bio || "Ready to start your next project? Get in touch."}
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className={btnClasses}
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
              Get in Touch
            </a>
          )}
        </div>
      </section>
    );
  }

  if (v === "minimal") {
    return (
      <section
        className={`w-full py-12 px-6 text-center`}
        style={{ backgroundColor: theme.colors.background }}
      >
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-lg font-bold transition-colors hover:opacity-80"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.font.heading,
            }}
          >
            {email}
          </a>
        )}
      </section>
    );
  }

  return (
    <section
      className={`w-full ${spacing.section} px-6`}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-white"
          style={{ fontFamily: theme.font.heading }}
        >
          Let&apos;s Work Together
        </h2>
        <p
          className="text-white/80 text-sm mb-8 max-w-md mx-auto"
          style={{ fontFamily: theme.font.body }}
        >
          {content.bio || "Ready to start your next project?"}
        </p>
        {email ? (
          <a
            href={`mailto:${email}`}
            className={`${btnClasses} bg-white hover:bg-white/90`}
            style={{ color: theme.colors.primary, borderColor: "white" }}
          >
            Get in Touch
          </a>
        ) : firstLink ? (
          <a
            href={firstLink.url}
            target="_blank"
            rel="noreferrer"
            className={`${btnClasses} bg-white hover:bg-white/90`}
            style={{ color: theme.colors.primary, borderColor: "white" }}
          >
            {firstLink.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
