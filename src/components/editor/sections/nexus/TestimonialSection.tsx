"use client";

import type { SiteContent, Testimonial } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function TestimonialSection({ content, updateContent }: Props) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Featured Quote
        </label>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <textarea
          value={content.testimonial?.text ?? ""}
          onChange={(e) =>
            updateContent({
              testimonial: {
                ...content.testimonial,
                text: e.target.value,
              } as Testimonial,
            })
          }
          placeholder="The Quote..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs h-24 outline-none italic shadow-sm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={content.testimonial?.name ?? ""}
            onChange={(e) =>
              updateContent({
                testimonial: {
                  ...content.testimonial,
                  name: e.target.value,
                } as Testimonial,
              })
            }
            placeholder="Person Name"
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none shadow-sm"
          />
          <input
            value={content.testimonial?.role ?? ""}
            onChange={(e) =>
              updateContent({
                testimonial: {
                  ...content.testimonial,
                  role: e.target.value,
                } as Testimonial,
              })
            }
            placeholder="Role/Company"
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
