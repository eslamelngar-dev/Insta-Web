"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Code } from "lucide-react";
import type { SectionProps, GalleryVariant } from "@/types/template";
import {
  getSpacingValue,
  getCardClasses,
  getRadiusValue,
} from "@/lib/templates/themes";

export function GallerySection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const cardClasses = getCardClasses(theme);
  const radius = getRadiusValue(theme.radius);
  const v = variant as GalleryVariant;

  const portfolio = content.portfolio || [];
  if (portfolio.length === 0) return null;

  if (v === "masonry") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-center"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            Portfolio
          </h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {portfolio.map((item, i) => (
              <div
                key={i}
                className={`${cardClasses} overflow-hidden break-inside-avoid`}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={spacing.inner}>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: theme.colors.primary }}
                  >
                    {item.category}
                  </span>
                  <h3
                    className="text-lg font-bold mt-1"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.font.heading,
                    }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex gap-3 mt-3">
                    {item.live_url && (
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: theme.colors.textMuted }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {item.code_url && (
                      <a
                        href={item.code_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: theme.colors.textMuted }}
                      >
                        <Code size={16} />
                      </a>
                    )}
                  </div>
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
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-center"
          style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
        >
          Portfolio
        </h2>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.element}`}>
          {portfolio.map((item, i) => (
            <div
              key={i}
              className={`${cardClasses} overflow-hidden group transition-all hover:-translate-y-1`}
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }}
            >
              <div
                className={`relative aspect-video overflow-hidden ${radius}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className={spacing.inner}>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: theme.colors.primary }}
                >
                  {item.category}
                </span>
                <h3
                  className="text-lg font-bold mt-1 mb-2"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.font.heading,
                  }}
                >
                  {item.title}
                </h3>
                <div className="flex gap-3">
                  {item.live_url && (
                    <a
                      href={item.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold flex items-center gap-1 transition-colors hover:opacity-80"
                      style={{ color: theme.colors.primary }}
                    >
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                  {item.code_url && (
                    <a
                      href={item.code_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold flex items-center gap-1 transition-colors hover:opacity-80"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <Code size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
