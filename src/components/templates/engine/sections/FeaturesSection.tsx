"use client";

import React from "react";
import type { SectionProps, FeaturesVariant } from "@/types/template";
import { getSpacingValue, getCardClasses } from "@/lib/templates/themes";

export function FeaturesSection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const cardClasses = getCardClasses(theme);
  const v = variant as FeaturesVariant;

  const features = content.features || [];
  if (features.length === 0) return null;

  if (v === "list") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-center"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            What We Do
          </h2>
          <div className="space-y-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex gap-4 items-start"
                style={{
                  borderBottom: `1px solid ${theme.colors.border}`,
                  paddingBottom: "1.5rem",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{
                    backgroundColor: `${theme.colors.primary}15`,
                    color: theme.colors.primary,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
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

  if (v === "alternating") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-12 text-center"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            What We Do
          </h2>
          <div className="space-y-16">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-full md:w-1/2 aspect-video ${cardClasses}`}
                  style={{
                    backgroundColor: `${theme.colors.primary}${(10 + i * 5).toString(16).padStart(2, "0")}`,
                  }}
                />
                <div className="w-full md:w-1/2">
                  <h3
                    className="text-xl font-bold mb-3"
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
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-center"
          style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
        >
          What We Do
        </h2>
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
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black mb-4"
                style={{
                  backgroundColor: `${theme.colors.primary}15`,
                  color: theme.colors.primary,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
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
