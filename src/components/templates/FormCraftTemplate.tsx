"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Send } from "lucide-react";
import { TemplateProps, SiteData, SiteContent } from "@/types";
import type { FormConfig } from "@/types/editor";
import DynamicContactForm from "@/components/DynamicContactForm";
import { DEFAULT_FORM_CONFIG } from "@/constants/form-fields";

const PREVIEW_ID = "preview-mode";

export default function FormCraftTemplate({ site }: TemplateProps) {
  const siteData = site as SiteData;
  const content = (siteData.content || siteData) as unknown as SiteContent;
  const primaryColor = content.color || "#6366f1";
  const isTemplateDark = content.theme_mode === "dark";
  const isPreview = !siteData.id || siteData.id === PREVIEW_ID;
  const formConfig: FormConfig =
    (content as { form_config?: FormConfig }).form_config ||
    DEFAULT_FORM_CONFIG;

  const bgColor = isTemplateDark ? "#050505" : "#fafafa";
  const cardBg = isTemplateDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isTemplateDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.06)";
  const textPrimary = isTemplateDark ? "#ffffff" : "#0f172a";
  const textSecondary = isTemplateDark ? "rgba(255,255,255,0.5)" : "#64748b";
  const textMuted = isTemplateDark ? "rgba(255,255,255,0.25)" : "#94a3b8";

  return (
    <div
      className="@container w-full h-full overflow-y-auto custom-scroll"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-full flex flex-col">
        <nav
          className="sticky top-0 z-20 px-6 py-4 backdrop-blur-xl"
          style={{
            backgroundColor: isTemplateDark
              ? "rgba(5,5,5,0.8)"
              : "rgba(250,250,250,0.8)",
            borderBottom: `1px solid ${cardBorder}`,
          }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {content.avatar_url ? (
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <Image
                    src={content.avatar_url}
                    alt={content.title || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: primaryColor }}
                >
                  {content.title?.charAt(0) || "F"}
                </div>
              )}
              <span
                className="text-sm font-black tracking-tight"
                style={{ color: textPrimary }}
              >
                {content.title || "FormCraft"}
              </span>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#22c55e" }}
            />
          </div>
        </nav>

        <main className="flex-1 px-6 py-12 @[768px]:py-20">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 @[768px]:mb-14"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}25`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: primaryColor }}
                />
                {content.bio || "Open for submissions"}
              </div>

              <h1
                className="text-3xl @[480px]:text-4xl @[768px]:text-5xl font-black tracking-tighter mb-4 leading-[0.95]"
                style={{ color: textPrimary }}
              >
                {formConfig.title || "Get in Touch"}
              </h1>

              <p
                className="text-sm @[768px]:text-base max-w-md mx-auto leading-relaxed"
                style={{ color: textSecondary }}
              >
                {formConfig.description ||
                  "Fill in the form below and we'll get back to you."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-3xl @[768px]:rounded-[2.5rem] p-6 @[768px]:p-10"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: isTemplateDark
                  ? "0 25px 80px rgba(0,0,0,0.4)"
                  : "0 25px 80px rgba(0,0,0,0.06)",
              }}
            >
              {formConfig.enabled ? (
                isPreview ? (
                  <PreviewFormFields
                    config={formConfig}
                    color={primaryColor}
                    dark={isTemplateDark}
                    textMuted={textMuted}
                    cardBorder={cardBorder}
                  />
                ) : (
                  <DynamicContactForm
                    siteId={siteData.id!}
                    config={formConfig}
                    accentColor={primaryColor}
                    darkMode={isTemplateDark}
                  />
                )
              ) : (
                <div className="text-center py-16">
                  <p
                    className="text-sm font-medium"
                    style={{ color: textMuted }}
                  >
                    Form is currently disabled
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <footer
          className="px-6 py-8"
          style={{ borderTop: `1px solid ${cardBorder}` }}
        >
          <div className="max-w-2xl mx-auto flex flex-col @[480px]:flex-row items-center justify-between gap-4">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: textMuted }}
            >
              {content.footer_text || "Powered by InstaWeb"}
            </p>
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="text-[10px] font-bold uppercase tracking-widest hover:underline"
                style={{ color: primaryColor }}
              >
                {content.email}
              </a>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function PreviewFormFields({
  config,
  color,
  dark,
  textMuted,
  cardBorder,
}: {
  config: FormConfig;
  color: string;
  dark: boolean;
  textMuted: string;
  cardBorder: string;
}) {
  const fieldBg = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";

  return (
    <div className="space-y-4 select-none">
      <div
        className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
        style={{
          backgroundColor: `${color}10`,
          border: `1px solid ${color}25`,
          color: color,
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
        Preview — Form works on published site
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.fields.map((field) => (
          <div
            key={field.id}
            className={field.width === "full" ? "sm:col-span-2" : ""}
          >
            <label
              className="block text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: textMuted }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              )}
            </label>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: fieldBg,
                border: `1px solid ${cardBorder}`,
                color: textMuted,
                minHeight: field.type === "textarea" ? 120 : undefined,
              }}
            >
              {field.placeholder}
            </div>
          </div>
        ))}
      </div>

      <div
        className="w-full py-4 rounded-xl text-white text-sm font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2.5 cursor-default shadow-xl"
        style={{ backgroundColor: color, opacity: 0.7 }}
      >
        <Send size={15} />
        {config.button_text || "Send Message"}
      </div>
    </div>
  );
}
