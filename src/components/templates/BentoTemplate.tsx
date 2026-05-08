import React from "react";
import { ExternalLink, Globe } from "lucide-react";

export default function BentoTemplate({ site, isDark, Icons, BtnIcons }: any) {
  const content = site.content || site;
  const primaryColor = content.color || site.primary_color || "#f43f5e";
  const themeDark = content.theme_mode === "dark" || isDark;
  
  const boxBg = themeDark ? "bg-[#161b22] border-white/5" : "bg-white border-slate-200";
  const textColor = themeDark ? "text-white" : "text-slate-900";
  const mutedText = themeDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto custom-scroll">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-20 auto-rows-[160px]">
        {content.blocks?.map((block: any) => {
          const colSpan = block.colSpan === 2 ? 'col-span-2' : 'col-span-1';
          const rowSpan = block.rowSpan === 2 ? 'row-span-2' : 'row-span-1';

          if (block.type === 'profile') {
            return (
              <div key={block.id} className={`${colSpan} ${rowSpan} rounded-3xl border ${boxBg} p-6 md:p-8 flex flex-col justify-center relative overflow-hidden shadow-sm`}>
                <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: primaryColor }} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  {block.data.avatar_url ? (
                    <img src={block.data.avatar_url} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl mb-4 object-cover border-4 border-white dark:border-slate-800 shadow-xl" />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl mb-4 flex items-center justify-center text-3xl font-black text-white border-4 border-white dark:border-slate-800 shadow-xl" style={{ backgroundColor: primaryColor }}>
                      {block.data.title?.charAt(0) || "U"}
                    </div>
                  )}
                  <h2 className={`text-xl md:text-3xl font-black uppercase tracking-tighter ${textColor}`}>{block.data.title}</h2>
                  <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-2 ${mutedText}`}>{block.data.bio}</p>
                </div>
              </div>
            );
          }

          if (block.type === 'link') {
            const BIcon = BtnIcons?.[block.data.icon] || ExternalLink;
            return (
              <a key={block.id} href={block.data.url} target="_blank" rel="noreferrer" className={`${colSpan} ${rowSpan} rounded-3xl border ${boxBg} p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm group`}>
                <div className="flex justify-between items-start">
                   <div className={`p-3 md:p-4 rounded-xl border ${themeDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'} ${textColor}`}>
                      <BIcon size={24} />
                   </div>
                   <ExternalLink size={16} className={`${mutedText} opacity-30 group-hover:opacity-100 transition-opacity`} />
                </div>
                <h3 className={`text-sm md:text-lg font-black uppercase tracking-tight ${textColor}`}>{block.data.label}</h3>
              </a>
            );
          }

          if (block.type === 'image') {
            return (
              <div key={block.id} className={`${colSpan} ${rowSpan} rounded-3xl overflow-hidden relative group shadow-sm bg-slate-100 dark:bg-slate-800`}>
                {block.data.image_url && (
                  <img src={block.data.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
            );
          }

          if (block.type === 'social') {
            const Icon = Icons?.[block.data.platform] || Globe;
            return (
              <a key={block.id} href={block.data.url} target="_blank" rel="noreferrer" className={`${colSpan} ${rowSpan} rounded-3xl border ${boxBg} flex items-center justify-center hover:scale-105 transition-transform shadow-sm`}>
                 <Icon size={36} className={textColor} />
              </a>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}