"use client";

import React from "react";
import { Mail, MapPin } from "lucide-react";
import type { SectionProps, ContactVariant } from "@/types/template";
import {
  getSpacingValue,
  getCardClasses,
  getButtonClasses,
} from "@/lib/templates/themes";

export function ContactSection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const cardClasses = getCardClasses(theme);
  const btnClasses = getButtonClasses(theme);
  const v = variant as ContactVariant;

  const email = content.email || "";

  if (v === "split") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2
              className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-4"
              style={{
                color: theme.colors.text,
                fontFamily: theme.font.heading,
              }}
            >
              Get in Touch
            </h2>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.font.body,
              }}
            >
              {content.bio || "We'd love to hear from you. Drop us a line."}
            </p>
            {email && (
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: theme.colors.primary }} />
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-bold hover:opacity-80 transition-colors"
                  style={{ color: theme.colors.text }}
                >
                  {email}
                </a>
              </div>
            )}
          </div>
          <div
            className={`${cardClasses} ${spacing.inner}`}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                readOnly
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                readOnly
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <textarea
                placeholder="Your Message"
                readOnly
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <button
                className={`${btnClasses} w-full`}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#ffffff",
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (v === "boxed") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div
          className={`max-w-xl mx-auto ${cardClasses} ${spacing.inner} text-center`}
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          }}
        >
          <h2
            className="text-2xl font-black tracking-tighter uppercase mb-6"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            Contact
          </h2>
          {email && (
            <a
              href={`mailto:${email}`}
              className={`${btnClasses} inline-flex items-center gap-2`}
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
              }}
            >
              <Mail size={16} /> {email}
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full ${spacing.section} px-6 text-center`}
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-6"
          style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
        >
          Contact
        </h2>
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-lg font-bold hover:opacity-80 transition-colors inline-flex items-center gap-2"
            style={{ color: theme.colors.primary }}
          >
            <Mail size={18} /> {email}
          </a>
        )}
      </div>
    </section>
  );
}
