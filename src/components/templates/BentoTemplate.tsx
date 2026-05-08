import React from "react";
import { ExternalLink, Globe } from "lucide-react";

export default function BentoTemplate({ site, Icons, BtnIcons }: any) {
  const content = site.content || site;
  const primaryColor = content.color || site.primary_color || "#f43f5e";
  const isTemplateDark = content.theme_mode === "dark";
  
  const boxBg = isTemplateDark ? "bg-[#161b22] border-white/5" : "bg-white border-slate-200";
  const textColor = isTemplateDark ? "text-white" : "text-slate-900";
  const mutedText = isTemplateDark ? "text-slate-400" : "text-slate-500";

  return (
    <div 
      className="w-full h-full overflow-y-auto custom-scroll transition-colors duration-500 p-3 md:p-8"
      style={{ backgroundColor: isTemplateDark ? "#0d1117" : "#f8fafc" }}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-24 auto-rows-min">
        {content.blocks?.map((block: any) => {
          
          // تحديد الـ Span والـ Aspect Ratio بشكل ديناميكي لمنع الـ Squishing
          const isWide = block.colSpan === 2;
          const isTall = block.rowSpan === 2;
          
          let spanClass = "";
          let aspectClass = "";

          if (isWide && isTall) {
            spanClass = "col-span-2 row-span-2";
            aspectClass = "aspect-square"; // 2x2 يفضل مربع كبير
          } else if (isWide) {
            spanClass = "col-span-2 row-span-1";
            aspectClass = "aspect-[2/1]"; // 2x1 يفضل مستطيل عرضي
          } else if (isTall) {
            spanClass = "col-span-1 row-span-2";
            aspectClass = "aspect-[1/2]"; // 1x2 يفضل مستطيل طولي
          } else {
            spanClass = "col-span-1 row-span-1";
            aspectClass = "aspect-square"; // 1x1 يفضل مربع صغير
          }

          const baseClasses = `${spanClass} ${aspectClass} rounded-[2rem] border ${boxBg} relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] flex flex-col`;

          if (block.type === 'profile') {
            return (
              <div key={block.id} className={`${baseClasses} p-6 md:p-8 justify-center`}>
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-[60px]" style={{ backgroundColor: primaryColor }} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-3 md:mb-4">
                    {block.data.avatar_url ? (
                      <img src={block.data.avatar_url} className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover border-2 md:border-4 border-white dark:border-slate-800 shadow-xl" />
                    ) : (
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black text-white border-2 md:border-4 border-white dark:border-slate-800 shadow-xl" style={{ backgroundColor: primaryColor }}>
                        {block.data.title?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <h2 className="text-sm md:text-2xl font-black uppercase tracking-tighter leading-tight line-clamp-2" style={{ color: isTemplateDark ? "#fff" : "#000" }}>{block.data.title}</h2>
                  <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1 md:mt-2 opacity-70 truncate w-full ${mutedText}`}>{block.data.bio}</p>
                </div>
              </div>
            );
          }

          if (block.type === 'link') {
            const BIcon = BtnIcons?.[block.data.icon] || ExternalLink;
            return (
              <a key={block.id} href={block.data.url} target="_blank" rel="noreferrer" className={`${baseClasses} p-5 md:p-6 justify-between group`}>
                <div className="flex justify-between items-start">
                   <div className={`p-2.5 md:p-4 rounded-xl border ${isTemplateDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'} ${textColor}`}>
                      <BIcon size={20} className="md:w-6 md:h-6" />
                   </div>
                   <ExternalLink size={14} className={`${mutedText} opacity-0 group-hover:opacity-100 transition-opacity hidden md:block`} />
                </div>
                <h3 className={`text-[10px] md:text-base font-black uppercase tracking-tight leading-tight ${textColor}`}>{block.data.label}</h3>
              </a>
            );
          }

          if (block.type === 'image') {
            return (
              <div key={block.id} className={`${baseClasses} bg-slate-100 dark:bg-slate-800 p-0`}>
                {block.data.image_url && (
                  <img src={block.data.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="content" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
            );
          }

          if (block.type === 'social') {
            const Icon = Icons?.[block.data.platform] || Globe;
            return (
              <a key={block.id} href={block.data.url} target="_blank" rel="noreferrer" className={`${baseClasses} items-center justify-center`}>
                 <Icon size={isWide ? 32 : 24} className={`md:w-10 md:h-10 ${textColor}`} />
              </a>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}