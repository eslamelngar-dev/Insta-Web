import { Globe, ExternalLink, ChevronRight } from "lucide-react";

export default function ClassicTemplate({ site, isDark, Icons, BtnIcons }: any) {
  const activeSocials = site.social_links?.filter((s: any) => s.url).slice(0, 3) || [];

  return (
    <div className="max-w-md w-full text-center mt-12 md:mt-24">
      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl mx-auto mb-8 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
        {site.avatar_url ? (
          <img src={site.avatar_url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black" style={{ backgroundColor: site.primary_color }}>
            {site.title?.charAt(0)}
          </div>
        )}
      </div>

      <h1 className={`text-4xl font-black mb-3 tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{site.title}</h1>
      <p className={`font-medium mb-12 px-4 leading-relaxed text-sm max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{site.bio}</p>

      <div className="flex justify-center gap-6 mb-16">
        {activeSocials.map((social: any) => {
          const Icon = Icons[social.platform] || Globe;
          return (
            <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className={`p-5 rounded-[2rem] shadow-xl border transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
              <Icon />
            </a>
          );
        })}
      </div>

      <div className="space-y-4 w-full px-2">
        {site.links?.map((link: any) => {
          const BIcon = BtnIcons[link.icon] || ExternalLink;
          return (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full px-8 py-5 rounded-[2.5rem] font-black shadow-2xl transition-all hover:scale-[1.03] active:scale-95 text-[10px] uppercase tracking-[0.2em] text-white" style={{ backgroundColor: site.primary_color }}>
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-white/10 rounded-xl"><BIcon size={18} /></div>
                 {link.label}
              </div>
              <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
            </a>
          );
        })}
      </div>
    </div>
  );
}