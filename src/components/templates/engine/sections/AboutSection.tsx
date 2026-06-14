"use client";

import React from "react";
import type { SectionProps, AboutVariant } from "@/types/template";
import { getSpacingValue, getCardClasses } from "@/lib/templates/themes";

export function AboutSection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const cardClasses = getCardClasses(theme);
  const v = variant as AboutVariant;

  const bio = content.bio || "";
  const title = content.title || "";
  const features = content.features || [];

  if (!bio && features.length === 0) return null;

  if (v === "cards" && features.length > 0) {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-8 text-center"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            About
          </h2>
          {bio && (
            <p
              className="text-center max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.font.body,
              }}
            >
              {bio}
            </p>
          )}
          <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing.element}`}>
            {features.map((feature, i) => (
              <div
                key={i}
                className={`${cardClasses} ${spacing.inner}`}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <h3
                  className="text-lg font-bold mb-2"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.font.heading,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: theme.colors.textMuted,
                    fontFamily: theme.font.body,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (v === "timeline" && features.length > 0) {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-12 text-center"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            About
          </h2>
          <div className="space-y-8 relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-px"
              style={{ backgroundColor: theme.colors.border }}
            />
            {features.map((feature, i) => (
              <div key={i} className="flex gap-6 relative">
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-black z-10"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: "#ffffff",
                  }}
                >
                  {i + 1}
                </div>
                <div className="pb-2">
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.font.heading,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: theme.colors.textMuted,
                      fontFamily: theme.font.body,
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full ${spacing.section} px-6`}
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-6"
          style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
        >
          About {title}
        </h2>
        {bio && (
          <p
            className="text-base leading-relaxed"
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
            }}
          >
            {bio}
          </p>
        )}
      </div>
    </section>
  );
}
