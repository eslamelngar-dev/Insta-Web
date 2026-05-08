import React from "react";
import { Globe, ExternalLink } from "lucide-react";

export default function ClassicTemplate({ site, Icons, BtnIcons }: any) {
  const content = site.content || site;
  const primaryColor = content.color || site.primary_color || "#6366f1";
  
  // الاعتماد كلياً على الداتا فقط وليس على الـ Global Theme
  const isTemplateDark = content.theme_mode === "dark";

  return (
    <div 
      className="w-full h-full overflow-y-auto custom-scroll p-8 md:p-12 flex flex-col items-center text-center transition-colors duration-500"
      style={{ backgroundColor: isTemplateDark ? "#0d1117" : "#ffffff" }}
    >
      <div 
        className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-6 md:mb-8 shadow-2xl overflow-hidden border-4 flex-shrink-0"
        style={{ 
          borderColor: isTemplateDark ? "#1f2937" : "#ffffff",
          backgroundColor: isTemplateDark ? "#111827" : "#f1f5f9"
        }}
      >
        {content.avatar_url ? (
          <img src={content.avatar_url} className="w-full h-full object-cover" alt="avatar" />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white text-3xl md:text-4xl font-black uppercase" 
            style={{ backgroundColor: primaryColor }}
          >
            {content.title?.charAt(0) || "U"}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 w-full">
        <h2 
          className="text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase shrink-0"
          style={{ color: isTemplateDark ? "#ffffff" : "#0f172a" }}
        >
          {content.title}
        </h2>
        <p 
          className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 shrink-0 opacity-70"
          style={{ color: isTemplateDark ? "#94a3b8" : "#64748b" }}
        >
          {content.bio}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12 flex-shrink-0">
        {content.social_links?.map((s: any) => {
          const Icon = Icons?.[s.platform] || Globe;
          return (
            <a 
              key={s.id} 
              href={s.url} 
              target="_blank" 
              rel="noreferrer" 
              className="p-4 md:p-6 rounded-[2rem] border shadow-lg transition-all hover:-translate-y-1 active:scale-95"
              style={{ 
                backgroundColor: isTemplateDark ? "#111827" : "#ffffff",
                borderColor: isTemplateDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                color: isTemplateDark ? "#ffffff" : "#0f172a"
              }}
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>

      <div className="w-full space-y-3 md:space-y-4 max-w-sm pb-20 flex-shrink-0">
        {content.links?.map((l: any) => {
          const BIcon = BtnIcons?.[l.icon] || ExternalLink;
          return (
            <a 
              key={l.id} 
              href={l.url} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[2rem] border-2 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] flex items-center justify-between transition-all hover:-translate-y-1 active:scale-[0.98]" 
              style={{ 
                borderColor: primaryColor, 
                color: isTemplateDark ? "#ffffff" : primaryColor, 
                backgroundColor: isTemplateDark ? `${primaryColor}15` : 'transparent' 
              }}
            >
              <div className="flex items-center gap-3 md:gap-4 truncate">
                <BIcon size={16} className="shrink-0" /> 
                <span className="truncate">{l.label}</span>
              </div>
              <ExternalLink size={14} className="opacity-30 shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
}