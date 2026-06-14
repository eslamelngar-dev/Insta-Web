"use client";

import React from "react";
import Image from "next/image";
import type { SectionProps } from "@/types/template";
import type { HeroVariant } from "@/types/template";
import {
  getSpacingValue,
  getRadiusValue,
  getButtonClasses,
} from "@/lib/templates/themes";

export function HeroSection({ content, theme, variant }: SectionProps) {
  const spacing = getSpacingValue(theme.spacing);
  const radius = getRadiusValue(theme.radius);
  const btnClasses = getButtonClasses(theme);
  const v = variant as HeroVariant;

  const title = content.hero?.title || content.title || "Welcome";
  const subtitle = content.hero?.subtitle || content.bio || "";
  const tagline = content.hero?.tagline || "";
  const avatarUrl = content.avatar_url || "";

  if (v === "centered") {
    return (
      <section
        className={`w-full ${spacing.section} px-6 flex flex-col items-center text-center`}
        style={{ backgroundColor: theme.colors.background }}
      >
        {tagline && (
          <span
            className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 px-4 py-2 rounded-full border"
            style={{
              color: theme.colors.primary,
              borderColor: `${theme.colors.primary}30`,
              backgroundColor: `${theme.colors.primary}10`,
            }}
          >
            {tagline}
          </span>
        )}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase max-w-4xl mb-6"
          style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
            }}
          >
            {subtitle}
          </p>
        )}
        {content.links && content.links.length > 0 && (
          <div className={`flex flex-wrap justify-center ${spacing.element}`}>
            {content.links.slice(0, 2).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
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
                {link.label}
              </a>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (v === "split") {
    return (
      <section
        className={`w-full ${spacing.section} px-6`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            {tagline && (
              <span
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block px-4 py-2 rounded-full border"
                style={{
                  color: theme.colors.primary,
                  borderColor: `${theme.colors.primary}30`,
                  backgroundColor: `${theme.colors.primary}10`,
                }}
              >
                {tagline}
              </span>
            )}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-6"
              style={{
                color: theme.colors.text,
                fontFamily: theme.font.heading,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-base md:text-lg mb-8 leading-relaxed"
                style={{
                  color: theme.colors.textMuted,
                  fontFamily: theme.font.body,
                }}
              >
                {subtitle}
              </p>
            )}
            {content.links && content.links.length > 0 && (
              <div className={`flex flex-wrap ${spacing.element}`}>
                {content.links.slice(0, 2).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
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
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div
            className={`aspect-square ${radius} overflow-hidden`}
            style={{ backgroundColor: theme.colors.surface }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-6xl font-black uppercase"
                style={{
                  backgroundColor: `${theme.colors.primary}15`,
                  color: theme.colors.primary,
                }}
              >
                {title.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (v === "profile") {
    return (
      <section
        className={`w-full ${spacing.section} px-6 flex flex-col items-center text-center`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div
          className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-8 border-4 shadow-xl"
          style={{
            borderColor: theme.colors.surface,
            backgroundColor: theme.colors.surface,
          }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={title}
              width={144}
              height={144}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl font-black uppercase"
              style={{
                backgroundColor: theme.colors.primary,
                color: "#ffffff",
              }}
            >
              {title.charAt(0)}
            </div>
          )}
        </div>
        <h1
          className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3"
          style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm max-w-md mb-8 leading-relaxed"
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
            }}
          >
            {subtitle}
          </p>
        )}
      </section>
    );
  }

  if (v === "gradient") {
    return (
      <section
        className={`w-full ${spacing.section} px-6 flex flex-col items-center text-center relative overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20, ${theme.colors.accent}20)`,
          backgroundColor: theme.colors.background,
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${theme.colors.primary}30, transparent 50%), radial-gradient(circle at 70% 50%, ${theme.colors.secondary}30, transparent 50%)`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          {tagline && (
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 px-4 py-2 rounded-full border backdrop-blur-sm"
              style={{
                color: theme.colors.primary,
                borderColor: `${theme.colors.primary}40`,
                backgroundColor: `${theme.colors.primary}15`,
              }}
            >
              {tagline}
            </span>
          )}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase max-w-4xl mb-6"
            style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.font.body,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full ${spacing.section} px-6 flex flex-col items-center text-center`}
      style={{ backgroundColor: theme.colors.background }}
    >
      <h1
        className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4"
        style={{ color: theme.colors.text, fontFamily: theme.font.heading }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-base max-w-xl mb-8"
          style={{
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
          }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}
