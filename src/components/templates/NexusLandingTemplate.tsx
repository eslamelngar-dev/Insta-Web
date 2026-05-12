// src/components/templates/NexusLandingTemplate.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, CheckCircle2, ArrowRight, Star } from "lucide-react";
import {
  TemplateProps,
  SiteData,
  SiteContent,
  Feature,
  PortfolioItem,
} from "@/types";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export default function NexusLandingTemplate({ site }: TemplateProps) {
  const siteData = site as SiteData;
  const content = (siteData.content || siteData) as unknown as SiteContent;
  const primaryColor = content.color || "#6366f1";
  const isTemplateDark = content.theme_mode === "dark";
  const show = content.sections_visibility || {};

  const bgClass = isTemplateDark
    ? "bg-[#050505] text-white"
    : "bg-white text-slate-900";
  const cardBg = isTemplateDark
    ? "bg-white/5 border-white/10"
    : "bg-slate-50 border-slate-200";

  const scrollToContact = () => {
    document
      .getElementById("nexus-contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`@container w-full h-full overflow-y-auto custom-scroll selection:bg-indigo-500/30 ${bgClass}`}
    >
      {show.hero !== false && (
        <section className="relative px-6 pt-20 pb-32 text-center overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 blur-[120px] pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-current opacity-50"
              style={{ color: primaryColor }}
            >
              {content.hero?.tagline || "Available for Projects"}
            </span>
            <h1 className="text-4xl @[768px]:text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
              {content.hero?.title || "Digital Experiences That Matter"}
            </h1>
            <p className="text-sm @[768px]:text-lg opacity-60 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              {content.hero?.subtitle ||
                "We build high-performance products that help you scale your business to the next level."}
            </p>
            <div className="flex flex-col @[480px]:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToContact}
                className="px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started Now
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {show.features !== false && (
        <section className="px-6 py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl @[768px]:text-4xl font-black uppercase tracking-tighter mb-4">
                Core Capabilities
              </h2>
              <div
                className="w-20 h-2"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
            <div className="grid grid-cols-1 @[768px]:grid-cols-3 gap-6">
              {(content.features || []).map((f: Feature, i: number) => (
                <div
                  key={i}
                  className={`p-8 rounded-[2.5rem] border ${cardBg} group hover:-translate-y-2 transition-all`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor,
                    }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">
                    {f.title || "Feature Title"}
                  </h3>
                  <p className="text-sm opacity-50 leading-relaxed">
                    {f.desc ||
                      "High-quality engineering focused on performance."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {show.portfolio !== false && (
        <section className="px-6 py-24 bg-current/2">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col @[768px]:flex-row @[768px]:items-end justify-between mb-16 gap-6">
              <h2 className="text-2xl @[768px]:text-5xl font-black uppercase tracking-tighter leading-none">
                Featured Projects
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">
                Total Projects: {content.portfolio?.length || 0}
              </p>
            </div>
            <div className="grid grid-cols-1 @[768px]:grid-cols-2 gap-8">
              {(content.portfolio || []).map((p: PortfolioItem, i: number) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-16/10 rounded-[3rem] overflow-hidden mb-6 border border-white/5 bg-slate-800">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title || "Project"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-4xl italic uppercase">
                        Project Preview
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                    {p.title || "Project Name"}
                  </h3>
                  <div className="flex items-center gap-4 opacity-40 text-[10px] font-black uppercase tracking-widest mb-4">
                    <span>{p.category || "Case Study"}</span>
                  </div>
                  {(p.live_url || p.code_url) && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {p.live_url && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 shadow-lg"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <ExternalLink size={12} />
                          View
                        </a>
                      )}
                      {p.code_url && (
                        <a
                          href={p.code_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg ${
                            isTemplateDark
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-slate-900 text-white hover:bg-slate-700"
                          }`}
                        >
                          <GithubIcon />
                          Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {show.testimonial !== false && (
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} fill={primaryColor} stroke="none" />
              ))}
            </div>
            <blockquote className="text-xl @[768px]:text-3xl font-bold italic mb-10 leading-snug">
              &ldquo;
              {content.testimonial?.text ||
                "Truly recommended for any scaling startup."}
              &rdquo;
            </blockquote>
            <div className="flex flex-col items-center">
              <p className="font-black uppercase tracking-widest text-xs">
                {content.testimonial?.name || "Client Name"}
              </p>
              <p className="text-[10px] opacity-40 uppercase font-bold mt-1">
                {content.testimonial?.role || "Position"}
              </p>
            </div>
          </div>
        </section>
      )}

      {show.contact !== false && (
        <footer
          id="nexus-contact"
          className="px-6 py-24 text-center border-t border-white/5"
        >
          <h2 className="text-3xl @[768px]:text-6xl font-black uppercase tracking-tighter mb-12">
            Ready to start?
          </h2>
          <a
            href={`mailto:${content.email || "#"}`}
            className="inline-flex items-center gap-4 group"
          >
            <span
              className="text-xl @[768px]:text-5xl font-black underline underline-offset-8 decoration-2 break-all"
              style={{ textDecorationColor: primaryColor }}
            >
              {content.email || "Contact Us"}
            </span>
            <div className="w-12 h-12 @[768px]:w-16 @[768px]:h-16 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <ArrowRight className="group-hover:-rotate-45 transition-transform" />
            </div>
          </a>
          {content.footer_text && (
            <p className="mt-16 text-[10px] font-bold uppercase tracking-widest opacity-30">
              {content.footer_text}
            </p>
          )}
        </footer>
      )}
    </div>
  );
}
