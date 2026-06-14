"use client";

import React from "react";
import { Quote } from "lucide-react";
import type { SectionProps, TestimonialsVariant } from "@/types/template";
import { getSpacingValue, getCardClasses } from "@/lib/templates/themes";

export function TestimonialsSection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const cardClasses = getCardClasses(theme);
  const v = variant as TestimonialsVariant;

  const testimonial = content.testimonial;
  if (!testimonial) return null;

  if (v === "grid") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-center"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            Testimonials
          </h2>
          <div
            className={`${cardClasses} ${spacing.inner} max-w-2xl mx-auto`}
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            }}
          >
            <Quote
              size={28}
              className="mb-4 opacity-30"
              style={{ color: theme.colors.primary }}
            />
            <p
              className="text-base md:text-lg leading-relaxed mb-6 italic"
              style={{ color: theme.colors.text, fontFamily: theme.font.body }}
            >
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: theme.colors.text }}
              >
                {testimonial.name}
              </p>
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full ${spacing.section} px-6`}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <Quote
          size={36}
          className="mx-auto mb-6 opacity-20"
          style={{ color: theme.colors.primary }}
        />
        <p
          className="text-lg md:text-2xl leading-relaxed mb-8 italic"
          style={{ color: theme.colors.text, fontFamily: theme.font.body }}
        >
          &ldquo;{testimonial.text}&rdquo;
        </p>
        <div>
          <p className="font-bold" style={{ color: theme.colors.text }}>
            {testimonial.name}
          </p>
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>
            {testimonial.role}
          </p>
        </div>
      </div>
    </section>
  );
}
