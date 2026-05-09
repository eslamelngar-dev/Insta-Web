"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const blockVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 0.8,
    },
  },
};

export default function BentoTemplate({ site, Icons, BtnIcons }: any) {
  const content = site.content || site;
  const primaryColor = content.color || site.primary_color || "#f43f5e";
  const isTemplateDark = content.theme_mode === "dark";

  const boxBg = isTemplateDark
    ? "bg-[#161b22] border-white/5"
    : "bg-white border-slate-200";
  const textColor = isTemplateDark ? "text-white" : "text-slate-900";
  const mutedText = isTemplateDark ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className="@container w-full h-full overflow-y-auto custom-scroll transition-colors duration-500 p-3 @[768px]:p-8"
      style={{
        backgroundColor: isTemplateDark ? "#0d1117" : "#f8fafc",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto grid grid-cols-2 @[768px]:grid-cols-4 gap-3 @[768px]:gap-4 pb-24 auto-rows-min"
      >
        {content.blocks?.map((block: any) => {
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

          const baseClasses = `${spanClass} ${aspectClass} rounded-[2rem] border ${boxBg} relative overflow-hidden shadow-sm flex flex-col`;

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
                    className="mb-3 @[768px]:mb-4"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {block.data.avatar_url ? (
                      <img
                        src={block.data.avatar_url}
                        className="w-14 h-14 @[768px]:w-24 @[768px]:h-24 rounded-2xl object-cover border-2 @[768px]:border-4 border-white dark:border-slate-800 shadow-xl"
                        alt={block.data.title}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 @[768px]:w-24 @[768px]:h-24 rounded-2xl flex items-center justify-center text-xl @[768px]:text-3xl font-black text-white border-2 @[768px]:border-4 border-white dark:border-slate-800 shadow-xl"
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

          if (block.type === "link") {
            const BIcon = BtnIcons?.[block.data.icon] || ExternalLink;
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
                    <BIcon className="w-4 h-4 @[768px]:w-6 @[768px]:h-6" />
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
                    <motion.img
                      src={block.data.image_url}
                      className="w-full h-full object-cover"
                      alt="content"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
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

          if (block.type === "social") {
            const Icon = Icons?.[block.data.platform] || Globe;
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

          return null;
        })}
      </motion.div>
    </div>
  );
}