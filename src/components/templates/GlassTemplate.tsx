// src/components/templates/GlassTemplate.tsx
"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Globe } from "lucide-react";
import {
  TemplateProps,
  SiteData,
  SiteContent,
  SocialLink,
  LinkItem,
} from "@/types";

export default function GlassTemplate({
  site,
  isDark,
  Icons,
  BtnIcons,
}: TemplateProps) {
  const siteData = site as SiteData;
  const content = (siteData.content || siteData) as unknown as SiteContent;
  const primaryColor = content.color || "#6366f1";
  const themeDark = content.theme_mode === "dark" || isDark;

  const textMain = themeDark ? "text-white" : "text-slate-900";
  const textMuted = themeDark ? "text-white/70" : "text-slate-700";
  const glassCard = themeDark
    ? "bg-black/30 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
    : "bg-white/40 border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]";

  return (
    <div className="w-full h-full relative overflow-y-auto custom-scroll flex flex-col items-center p-6 md:p-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {content.cover_url ? (
          <Image
            src={content.cover_url}
            alt="Cover"
            fill
            className="object-cover scale-110 blur-xl opacity-60 dark:opacity-40"
          />
        ) : (
          <div
            className="w-full h-full opacity-50 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${primaryColor}40, transparent 70%)`,
            }}
          ></div>
        )}
        <div
          className={`absolute inset-0 ${themeDark ? "bg-[#0f172a]/80" : "bg-slate-50/50"}`}
        ></div>
      </div>

      <div className="relative z-10 max-w-xl w-full flex flex-col items-center">
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 border-4 border-white/20 shadow-2xl">
          <div className="absolute inset-0 backdrop-blur-md z-0"></div>
          {content.avatar_url ? (
            <Image
              src={content.avatar_url}
              alt="Avatar"
              fill
              className="object-cover relative z-10"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl font-black relative z-10"
              style={{ backgroundColor: `${primaryColor}40`, color: textMain }}
            >
              {content.title?.charAt(0) || "G"}
            </div>
          )}
        </div>

        <h1
          className={`text-2xl md:text-4xl font-bold mb-3 tracking-tight text-center ${textMain}`}
        >
          {content.title}
        </h1>
        <p
          className={`text-sm md:text-base text-center max-w-md mb-8 ${textMuted}`}
        >
          {content.bio}
        </p>

        {content.social_links && content.social_links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {content.social_links.map((s: SocialLink) => {
              const Icon = Icons?.[s.platform] || Globe;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-4 rounded-2xl backdrop-blur-md border hover:-translate-y-1 hover:scale-105 transition-all duration-300 ${glassCard} ${textMain}`}
                >
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
        )}

        {content.links && content.links.length > 0 && (
          <div className="w-full space-y-4">
            {content.links.map((l: LinkItem) => {
              const BIcon = BtnIcons?.[l.icon] || ExternalLink;
              return (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full p-5 rounded-2xl backdrop-blur-md border flex items-center justify-between hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative ${glassCard} ${textMain}`}
                >
                  <div
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 rounded-xl bg-white/10 dark:bg-black/20">
                      <BIcon size={20} />
                    </div>
                    <span className="font-semibold tracking-wide">
                      {l.label}
                    </span>
                  </div>
                  <ExternalLink
                    size={18}
                    className="relative z-10 opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
