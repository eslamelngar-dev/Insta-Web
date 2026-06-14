"use client";

import React, { useEffect, useRef } from "react";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import { Icons, ButtonIcons } from "@/constants/icons";
import { SiteData } from "@/types";

interface SiteRendererProps {
  site: SiteData;
  templateId: string;
}

export default function SiteRenderer({ site, templateId }: SiteRendererProps) {
  const content = site.content || (site as unknown as SiteData["content"]);
  const isDark = content?.theme_mode === "dark";
  const hasTracked = useRef(false);

  const templateConfig =
    TEMPLATES_REGISTRY[templateId] ?? TEMPLATES_REGISTRY.classic;
  const TemplateComponent = templateConfig.component;

  useEffect(() => {
    if (hasTracked.current) return;

    const trackVisit = async () => {
      if (typeof window === "undefined") return;
      if (window.location.pathname.startsWith("/dashboard")) return;
      if (!site.id) return;

      hasTracked.current = true;

      try {
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem("visitor_id", visitorId);
        }

        const ua = navigator.userAgent;
        let device = "Desktop";
        if (/mobile/i.test(ua)) device = "Mobile";
        else if (/tablet/i.test(ua)) device = "Tablet";

        const referrer = document.referrer
          ? new URL(document.referrer).hostname
          : "Direct";

        await fetch("/api/analytics/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            site_id: site.id,
            visitor_id: visitorId,
            device,
            referrer,
          }),
        });
      } catch {}
    };

    trackVisit();
  }, [site.id]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center transition-all duration-700 ${
        isDark ? "dark bg-[#0d1117]" : "bg-slate-50"
      }`}
      style={{ backgroundColor: isDark ? "#0d1117" : "#f8fafc" }}
    >
      <TemplateComponent
        site={site}
        isDark={isDark}
        Icons={Icons}
        BtnIcons={ButtonIcons}
      />
      <footer
        className={`mt-32 opacity-20 font-black text-[10px] tracking-[0.6em] uppercase pb-12 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Powered by InstaWeb
      </footer>
    </div>
  );
}
