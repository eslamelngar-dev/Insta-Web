import React from "react";
import { ExternalLink, Globe } from "lucide-react";

export default function TerminalTemplate({ site, Icons, BtnIcons }: any) {
  const content = site.content || site;
  const primaryColor = content.color || "#22c55e";
  
  return (
    <div className="w-full h-full p-2 md:p-8 overflow-y-auto custom-scroll font-mono bg-[#0a0a0a] text-slate-300 flex items-start md:items-center justify-center">
      <div className="w-full max-w-2xl border border-white/10 rounded-xl overflow-hidden bg-[#0d0d0d] shadow-2xl flex flex-col my-4">
        <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center gap-2 border-b border-white/10 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          <span className="ml-3 text-[10px] text-slate-500 truncate flex-1 tracking-tight">
            guest@{content.title?.replace(/\s+/g, '').toLowerCase() || 'user'}: ~
          </span>
        </div>

        <div className="p-4 md:p-8 space-y-5 md:space-y-8 overflow-y-auto">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="shrink-0">
              {content.avatar_url ? (
                <img src={content.avatar_url} className="w-16 h-16 md:w-24 md:h-24 rounded border border-white/20 object-cover shadow-lg" />
              ) : (
                <div className="w-16 h-16 md:w-24 md:h-24 rounded border border-white/20 flex items-center justify-center text-2xl font-bold" style={{ color: primaryColor }}>
                  {content.title?.charAt(0) || ">"}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span style={{ color: primaryColor }} className="text-sm md:text-base">$</span> 
                <span className="font-bold text-base md:text-xl truncate block">{content.title}</span>
              </div>
              <p className="text-[11px] md:text-sm leading-relaxed text-slate-400">
                <span style={{ color: primaryColor }} className="mr-1 inline-block">&gt;</span> 
                {content.bio}
              </p>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-white/10"></div>

          {content.social_links && content.social_links.length > 0 && (
            <div className="space-y-3">
              <div className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                Social Connections
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {content.social_links.map((s: any) => {
                  const Icon = Icons?.[s.platform] || Globe;
                  return (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all active:scale-95">
                      <Icon size={12} style={{ color: primaryColor }} />
                      <span className="text-[10px] md:text-xs">{s.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {content.links && content.links.length > 0 && (
            <div className="space-y-3">
              <div className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                Execute Scripts
              </div>
              <div className="grid grid-cols-1 gap-2 md:gap-3">
                {content.links.map((l: any) => {
                  const BIcon = BtnIcons?.[l.icon] || ExternalLink;
                  return (
                    <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-between p-3 md:p-4 rounded border border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all group active:scale-[0.99]">
                      <div className="flex items-center gap-3 truncate">
                        <BIcon size={14} style={{ color: primaryColor }} className="shrink-0" />
                        <span className="text-[11px] md:text-sm font-medium truncate">{l.label}</span>
                      </div>
                      <span className="text-[9px] md:text-[10px] ml-2 shrink-0 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>[RUN]</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="pt-2 flex items-center gap-2 animate-pulse opacity-50">
            <span style={{ color: primaryColor }} className="text-xs">$</span> 
            <div className="w-2 h-4 bg-white/70"></div>
          </div>
        </div>
      </div>
    </div>
  );
}