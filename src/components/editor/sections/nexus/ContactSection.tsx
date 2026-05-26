"use client";

import { Mail, FileText, MessageSquare } from "lucide-react";
import { EditorSwitch } from "@/components/editor/shared/EditorSwitch";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function ContactSection({ content, updateContent }: Props) {
  const visibility = content.sections_visibility || {};
  const isFormEnabled = visibility.contact !== false;

  const toggleForm = (value: boolean) => {
    updateContent({
      sections_visibility: {
        ...visibility,
        contact: value,
      },
    });
  };

  return (
    <section className="space-y-5 pb-40">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Contact Form
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
            Show or hide the form on your live page
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              isFormEnabled
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {isFormEnabled ? "On" : "Off"}
          </span>
          <EditorSwitch checked={isFormEnabled} onCheckedChange={toggleForm} />
        </div>
      </div>

      {isFormEnabled ? (
        <>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed px-1">
            Visitors can send you messages through a contact form. All
            submissions appear in your Leads dashboard.
          </p>

          <div className="space-y-3">
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                value={content.email ?? ""}
                onChange={(e) => updateContent({ email: e.target.value })}
                placeholder="Business Email"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl pl-10 pr-4 py-3 sm:py-4 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none shadow-sm focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="relative">
              <FileText
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                value={content.footer_text ?? ""}
                onChange={(e) => updateContent({ footer_text: e.target.value })}
                placeholder="Footer Copyright Text"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl pl-10 pr-4 py-3 sm:py-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none shadow-sm focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageSquare
                  size={14}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  Form Active on Published Site
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80 mt-0.5 leading-relaxed">
                  Go to Dashboard → Leads to view and manage all submissions.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0">
              <MessageSquare
                size={14}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Contact Form Disabled
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5 leading-relaxed">
                Toggle it on to show a contact form on your site so visitors can
                reach you.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
