import React from "react";
import { Globe, ExternalLink } from "lucide-react";

export default function ClassicTemplate({ site, isDark, Icons, BtnIcons }: any) {
  const content = site.content || site;
  const primaryColor = content.color || site.primary_color || "#6366f1";
  const themeDark = content.theme_mode === "dark" || isDark;

  return (
    <div className="w-full h-full overflow-y-auto custom-scroll p-12 flex flex-col items-center text-center">
      <div className="w-32 h-32 rounded-full mb-8 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 flex-shrink-0">
        {content.avatar_url ? (
          <img src={content.avatar_url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black uppercase" style={{ backgroundColor: primaryColor }}>
            {content.title?.charAt(0) || "U"}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 w-full">
        <h2 className={`text-4xl font-black mb-2 tracking-tighter uppercase shrink-0 ${themeDark ? "text-white" : "text-slate-900"}`}>
          {content.title}
        </h2>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-12 shrink-0 ${themeDark ? "text-slate-400" : "text-slate-500"}`}>
          {content.bio}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12 flex-shrink-0">
        {content.social_links?.map((s: any) => {
          const Icon = Icons?.[s.platform] || Globe;
          return (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`p-6 rounded-[2.5rem] border shadow-lg transition-transform hover:-translate-y-1 ${themeDark ? "bg-slate-900 border-white/5 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
              <Icon size={24} />
            </a>
          );
        })}
      </div>

      <div className="w-full space-y-4 max-w-sm pb-20 flex-shrink-0">
        {content.links?.map((l: any) => {
          const BIcon = BtnIcons?.[l.icon] || ExternalLink;
          return (
            <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="w-full px-8 py-5 rounded-[2.5rem] border-2 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-between transition-transform hover:-translate-y-1" style={{ borderColor: primaryColor, color: themeDark ? "white" : primaryColor, backgroundColor: themeDark ? `${primaryColor}20` : 'transparent' }}>
              <div className="flex items-center gap-4"><BIcon size={18} /> {l.label}</div>
              <ExternalLink size={14} className="opacity-30" />
            </a>
          );
        })}
      </div>
    </div>
  );
}