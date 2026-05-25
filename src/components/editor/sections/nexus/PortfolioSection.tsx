"use client";

import { Plus, Trash2 } from "lucide-react";
import { UploadCard } from "../../shared/UploadCard";
import type { SiteContent, PortfolioItem } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function PortfolioSection({
  content,
  updateContent,
  handleImageUpload,
  uploadingId,
  onOpenMediaLibrary,
  onMediaSelect,
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

            <UploadCard
              imageUrl={p.image}
              uploadingId={uploadingId}
              targetId={`portfolio-${i}`}
              label="Project Image"
              aspectRatio="aspect-video"
              rounded="rounded-xl sm:rounded-3xl"
              onFileUpload={handleImageUpload}
              onOpenLibrary={(target) =>
                onOpenMediaLibrary((url) => onMediaSelect(url, target))
              }
            />

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
