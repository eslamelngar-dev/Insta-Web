// src/components/templates/NotionTemplate.tsx
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

export default function NotionTemplate({
  site,
  isDark,
  Icons,
  BtnIcons,
}: TemplateProps) {
  const siteData = site as SiteData;
  const content = (siteData.content || siteData) as unknown as SiteContent;
  const themeDark = content.theme_mode === "dark" || isDark;
  const primaryColor = content.color || "#000000";

  const bgClass = themeDark
    ? "bg-[#191919] text-white"
    : "bg-white text-[#37352f]";
  const borderClass = themeDark ? "border-white/10" : "border-slate-200";
  const mutedText = themeDark ? "text-slate-400" : "text-slate-500";
  const hoverClass = themeDark ? "hover:bg-white/5" : "hover:bg-slate-50";

  return (
    <div
      className={`w-full h-full overflow-y-auto custom-scroll font-sans ${bgClass}`}
    >
      <div className="w-full h-40 md:h-56 bg-slate-200 dark:bg-slate-800 relative">
        {content.cover_url && (
          <Image
            src={content.cover_url}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-20">
        <div className="relative -mt-12 mb-6">
          <div
            className={`relative w-24 h-24 rounded-2xl overflow-hidden border-4 flex items-center justify-center text-4xl font-bold shrink-0 shadow-sm ${themeDark ? "border-[#191919] bg-slate-800 text-white" : "border-white bg-slate-100 text-slate-800"}`}
          >
            {content.avatar_url ? (
              <Image
                src={content.avatar_url}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <span style={{ color: primaryColor }}>
                {content.title?.charAt(0) || "U"}
              </span>
            )}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
          {content.title}
        </h1>
        <p
          className={`text-sm md:text-base mb-8 leading-relaxed max-w-2xl ${mutedText}`}
        >
          {content.bio}
        </p>

        {content.social_links && content.social_links.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {content.social_links.map((s: SocialLink) => {
              const Icon = Icons?.[s.platform] || Globe;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2.5 rounded-lg border transition-all shadow-sm ${borderClass} ${hoverClass}`}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        )}

        {content.links && content.links.length > 0 && (
          <div className="space-y-3">
            {content.links.map((l: LinkItem) => {
              const BIcon = BtnIcons?.[l.icon] || ExternalLink;
              return (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group shadow-sm ${borderClass} ${hoverClass}`}
                >
                  <div className="flex items-center gap-3">
                    <BIcon
                      size={20}
                      className={mutedText}
                      style={{ color: primaryColor }}
                    />
                    <span className="font-medium">{l.label}</span>
                  </div>
                  <ExternalLink
                    size={16}
                    className={`opacity-0 group-hover:opacity-50 transition-opacity ${mutedText}`}
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
