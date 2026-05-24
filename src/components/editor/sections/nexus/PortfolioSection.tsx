"use client";

import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import { Loader2 } from "lucide-react";
import type { SiteContent, PortfolioItem } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
}

export function PortfolioSection({
  content,
  updateContent,
  handleImageUpload,
  uploadingId,
}: Props) {
  const updatePortfolio = (
    index: number,
    field: keyof PortfolioItem,
    value: string,
  ) => {
    const newPortfolio = [...(content.portfolio ?? [])];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    updateContent({ portfolio: newPortfolio });
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Portfolio Showcase
          </label>
        </div>
        <button
          onClick={() =>
            updateContent({
              portfolio: [
                ...(content.portfolio ?? []),
                {
                  title: "New Project",
                  image: "",
                  category: "Dev",
                  live_url: "",
                  code_url: "",
                },
              ],
            })
          }
          className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {(content.portfolio ?? []).map((p, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-4xl space-y-3 sm:space-y-4 relative group shadow-sm"
          >
            <button
              onClick={() =>
                updateContent({
                  portfolio: (content.portfolio ?? []).filter(
                    (_, idx) => idx !== i,
                  ),
                })
              }
              className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl"
            >
              <Trash2 size={14} />
            </button>
            <div className="relative aspect-video rounded-xl sm:rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
              {uploadingId === `portfolio-${i}` ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
                  <Loader2 className="animate-spin text-indigo-500" size={24} />
                </div>
              ) : p.image ? (
                <NextImage
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <ImageIcon
                  className="absolute inset-0 m-auto text-slate-200"
                  size={32}
                />
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, `portfolio-${i}`)}
                  accept="image/*"
                />
                <span className="text-white text-[10px] font-black uppercase">
                  Replace Image
                </span>
              </label>
            </div>
            <input
              value={p.title}
              onChange={(e) => updatePortfolio(i, "title", e.target.value)}
              className="w-full bg-transparent font-black text-sm uppercase outline-none focus:text-indigo-500"
              placeholder="Project Name"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 ml-1 uppercase">
                  Live URL
                </p>
                <input
                  value={p.live_url}
                  onChange={(e) =>
                    updatePortfolio(i, "live_url", e.target.value)
                  }
                  placeholder="https://myproject.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2.5 text-[10px] outline-none"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 ml-1 uppercase">
                  Code URL
                </p>
                <input
                  value={p.code_url}
                  onChange={(e) =>
                    updatePortfolio(i, "code_url", e.target.value)
                  }
                  placeholder="https://github.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2.5 text-[10px] outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
