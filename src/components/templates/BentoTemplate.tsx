"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ExternalLink, Globe as GlobeIcon, MapPin, Music } from "lucide-react";
import Image from "next/image";
import createGlobe from "cobe";
import { TemplateProps, Block, SiteData, SiteContent } from "@/types";

// 🌍 1. مكون الكرة الأرضية التفاعلية (3D Globe)
function LocationGlobe({
  lat,
  lng,
  isDark,
}: {
  lat: number;
  lng: number;
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const globeOptions = {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0.15,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: isDark ? [0.1, 0.1, 0.1] : [0.95, 0.95, 0.95],
      markerColor: [0.38, 0.4, 0.95],
      glowColor: isDark ? [0.1, 0.1, 0.2] : [0.9, 0.9, 0.9],
      markers: [{ location: [lat, lng], size: 0.1 }],
      onRender: (state: { phi: number }) => {
        state.phi = phi;
        phi += 0.005;
      },
    };

    const globe = createGlobe(
      canvasRef.current,
      globeOptions as unknown as Parameters<typeof createGlobe>[1],
    );

    return () => globe.destroy();
  }, [lat, lng, isDark]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 mix-blend-luminosity">
      <canvas
        ref={canvasRef}
        style={{ width: "160%", height: "160%", contain: "layout paint size" }}
      />
    </div>
  );
}

// 🎵 2. دالة تحويل رابط سبوتيفاي لمشغل حقيقي
const getSpotifyEmbedUrl = (url?: string, isDark?: boolean) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    const theme = isDark ? "0" : "1";
    return `https://open.spotify.com/embed${u.pathname}?utm_source=generator&theme=${theme}`;
  } catch {
    return null;
  }
};

// 🌟 3. إعدادات الأنيميشن
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 200, damping: 20, mass: 0.8 },
  },
};

export default function BentoTemplate({
  site,
  Icons,
  BtnIcons,
}: TemplateProps) {
  const siteData = site as SiteData;
  const content = (siteData.content || siteData) as unknown as SiteContent;
  const primaryColor = content.color || siteData.primary_color || "#f43f5e";
  const isTemplateDark = content.theme_mode === "dark";

  const boxBg = isTemplateDark
    ? "bg-[#161b22] border-white/5"
    : "bg-white border-slate-200";
  const textColor = isTemplateDark ? "text-white" : "text-slate-900";
  const mutedText = isTemplateDark ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className="@container w-full h-full overflow-y-auto custom-scroll transition-colors duration-500 p-3 @[768px]:p-8"
      style={{ backgroundColor: isTemplateDark ? "#0d1117" : "#f8fafc" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto grid grid-cols-2 @[768px]:grid-cols-4 gap-3 @[768px]:gap-4 pb-24 auto-rows-min"
      >
        {content.blocks?.map((block: Block) => {
          const isWide = block.colSpan === 2;
          const isTall = block.rowSpan === 2;
          let spanClass = "";
          let aspectClass = "";

          if (isWide && isTall) {
            spanClass = "col-span-2 row-span-2";
            aspectClass = "aspect-square";
          } else if (isWide) {
            spanClass = "col-span-2 row-span-1";
            aspectClass = "aspect-[2/1]";
          } else if (isTall) {
            spanClass = "col-span-1 row-span-2";
            aspectClass = "aspect-[1/2]";
          } else {
            spanClass = "col-span-1 row-span-1";
            aspectClass = "aspect-square";
          }

          const baseClasses = `${spanClass} ${aspectClass} rounded-4xl border ${boxBg} relative overflow-hidden shadow-sm flex flex-col`;

          // 👤 1. Profile Block
          if (block.type === "profile") {
            return (
              <motion.div
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`${baseClasses} p-4 @[768px]:p-8 justify-center cursor-default`}
              >
                <div
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-[60px]"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div
                    className="mb-3 @[768px]:mb-4 relative w-14 h-14 @[768px]:w-24 @[768px]:h-24"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {block.data.avatar_url ? (
                      <Image
                        src={block.data.avatar_url}
                        alt={block.data.title || "Avatar"}
                        fill
                        className="rounded-2xl object-cover border-2 @[768px]:border-4 border-white dark:border-slate-800 shadow-xl"
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-2xl flex items-center justify-center text-xl @[768px]:text-3xl font-black text-white border-2 @[768px]:border-4 border-white dark:border-slate-800 shadow-xl"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {block.data.title?.charAt(0) || "U"}
                      </div>
                    )}
                  </motion.div>
                  <h2
                    className="text-xs @[768px]:text-2xl font-black uppercase tracking-tighter leading-tight line-clamp-2"
                    style={{ color: isTemplateDark ? "#fff" : "#000" }}
                  >
                    {block.data.title}
                  </h2>
                  <p
                    className={`text-[7px] @[768px]:text-[10px] font-bold uppercase tracking-widest mt-1 @[768px]:mt-2 opacity-70 line-clamp-2 w-full ${mutedText}`}
                  >
                    {block.data.bio}
                  </p>
                </div>
              </motion.div>
            );
          }

          // 🔗 2. Link Block
          if (block.type === "link") {
            const BIcon = BtnIcons?.[block.data.icon || ""] || ExternalLink;
            return (
              <motion.a
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                href={block.data.url}
                target="_blank"
                rel="noreferrer"
                className={`${baseClasses} p-4 @[768px]:p-6 justify-between group cursor-pointer`}
              >
                <div className="flex justify-between items-start">
                  <motion.div
                    whileHover={{ rotate: -10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`p-2 @[768px]:p-4 rounded-xl border ${
                      isTemplateDark
                        ? "border-white/10 bg-white/5"
                        : "border-slate-100 bg-slate-50"
                    } ${textColor}`}
                  >
                    <BIcon
                      size={24}
                      className="w-4 h-4 @[768px]:w-6 @[768px]:h-6"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="hidden @[768px]:block"
                  >
                    <ExternalLink size={14} className={mutedText} />
                  </motion.div>
                </div>
                <div className="mt-auto">
                  <h3
                    className={`text-[9px] @[768px]:text-base font-black uppercase tracking-tight leading-tight line-clamp-2 ${textColor}`}
                  >
                    {block.data.label}
                  </h3>
                  <p
                    className={`text-[7px] @[768px]:text-[9px] mt-1 font-bold uppercase tracking-wider opacity-40 truncate ${mutedText}`}
                  >
                    {block.data.url
                      ?.replace("https://", "")
                      ?.replace("http://", "")
                      ?.replace("www.", "")
                      ?.split("/")[0] || "Link"}
                  </p>
                </div>
              </motion.a>
            );
          }

          // 🖼️ 3. Image Block
          if (block.type === "image") {
            return (
              <motion.div
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`${baseClasses} bg-slate-100 dark:bg-slate-800 p-0 cursor-default group`}
              >
                {block.data.image_url ? (
                  <>
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Image
                        src={block.data.image_url}
                        alt="content"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest opacity-30 ${mutedText}`}
                    >
                      Image
                    </span>
                  </div>
                )}
              </motion.div>
            );
          }

          // 🌍 4. Social Block
          if (block.type === "social") {
            const Icon = Icons?.[block.data.platform || ""] || GlobeIcon;
            return (
              <motion.a
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                href={block.data.url}
                target="_blank"
                rel="noreferrer"
                className={`${baseClasses} items-center justify-center group cursor-pointer`}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-3 @[768px]:p-5 rounded-2xl border transition-colors ${
                    isTemplateDark
                      ? "border-white/10 bg-white/5 group-hover:bg-white/10"
                      : "border-slate-100 bg-slate-50 group-hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    size={32}
                    className={`w-5 h-5 @[768px]:w-8 @[768px]:h-8 ${textColor}`}
                  />
                </motion.div>
                <p
                  className={`text-[7px] @[768px]:text-[9px] font-black uppercase tracking-widest mt-2 @[768px]:mt-3 opacity-50 ${mutedText}`}
                >
                  {block.data.platform}
                </p>
              </motion.a>
            );
          }

          // 📈 5. Stats Block
          if (block.type === "stats") {
            return (
              <motion.div
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.02 }}
                className={`${baseClasses} p-4 @[768px]:p-6 justify-center items-center text-center`}
              >
                <h3
                  className={`text-4xl @[768px]:text-6xl font-black tracking-tighter ${textColor}`}
                  style={{ color: primaryColor }}
                >
                  {block.data.title || "0"}
                </h3>
                <p
                  className={`text-[8px] @[768px]:text-[11px] font-bold uppercase tracking-widest mt-1 @[768px]:mt-3 ${mutedText}`}
                >
                  {block.data.label || "Metric"}
                </p>
              </motion.div>
            );
          }

          // 📝 6. Text Block
          if (block.type === "text") {
            return (
              <motion.div
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.01 }}
                className={`${baseClasses} p-5 @[768px]:p-8 justify-center`}
              >
                {block.data.title && (
                  <h3
                    className={`text-[9px] @[768px]:text-xs font-black uppercase tracking-widest mb-2 @[768px]:mb-3 opacity-50 ${textColor}`}
                  >
                    {block.data.title}
                  </h3>
                )}
                <p
                  className={`text-sm @[768px]:text-lg font-medium leading-relaxed ${textColor}`}
                >
                  {block.data.bio || "Add your text or favorite quote here."}
                </p>
              </motion.div>
            );
          }

          // 📍 7. Location Block
          if (block.type === "location") {
            // ✅ الحل السحري لتخطي خطأ الـ TypeScript هنا
            const locData = block.data as {
              lat?: number;
              lng?: number;
              label?: string;
            };
            const lat = locData.lat ?? 29.95;
            const lng = locData.lng ?? 31.0;

            return (
              <motion.div
                key={block.id}
                variants={blockVariants}
                layout
                whileHover={{ scale: 1.02 }}
                className={`${baseClasses} p-4 @[768px]:p-6 justify-end overflow-hidden group`}
              >
                <LocationGlobe lat={lat} lng={lng} isDark={isTemplateDark} />
                <div className="absolute inset-0 opacity-20 dark:opacity-40 group-hover:opacity-30 transition-opacity bg-linear-to-t from-slate-900/80 to-transparent" />
                <div className="absolute top-4 right-4 @[768px]:top-6 @[768px]:right-6 p-2 rounded-full bg-slate-100 dark:bg-white/10 backdrop-blur-md">
                  <MapPin className={textColor} size={16} />
                </div>
                <div className="relative z-10 bg-white/10 dark:bg-black/20 backdrop-blur-md p-3 @[768px]:p-4 rounded-2xl border border-white/10">
                  <p
                    className={`text-[7px] @[768px]:text-[9px] font-bold uppercase tracking-widest ${mutedText} mb-0.5`}
                  >
                    Based In
                  </p>
                  <h3
                    className={`text-sm @[768px]:text-base font-black uppercase tracking-tight ${textColor} truncate`}
                  >
                    {block.data.label || "Earth"}
                  </h3>
                </div>
              </motion.div>
            );
          }

          // 🎧 8. Music Block
          if (block.type === "music") {
            const spotifyEmbedUrl = getSpotifyEmbedUrl(
              block.data.url,
              isTemplateDark,
            );

            if (spotifyEmbedUrl) {
              return (
                <motion.div
                  key={block.id}
                  variants={blockVariants}
                  layout
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`${baseClasses} p-0 overflow-hidden relative group`}
                  style={{
                    backgroundColor: isTemplateDark ? "#121212" : "#f8f8f8",
                  }}
                >
                  <iframe
                    src={spotifyEmbedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: "inherit" }}
                  />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={block.id}
                variants={blockVariants}
                layout
                className={`${baseClasses} p-4 @[768px]:p-6 flex flex-col justify-center items-center group cursor-default`}
              >
                <div className="p-4 rounded-full bg-green-500/10 mb-3">
                  <Music className="text-green-500" size={24} />
                </div>
                <h3
                  className={`text-xs @[768px]:text-sm font-black text-green-500`}
                >
                  Spotify Track
                </h3>
                <p
                  className={`text-[8px] @[768px]:text-[10px] font-bold uppercase mt-1 opacity-50 ${mutedText}`}
                >
                  Add link in editor
                </p>
              </motion.div>
            );
          }

          return null;
        })}
      </motion.div>
    </div>
  );
}
