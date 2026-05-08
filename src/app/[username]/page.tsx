import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Globe, Mail, Zap, ExternalLink, Code, Layout, MessageCircle, Play, ChevronRight } from "lucide-react";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Icons: Record<string, React.FC<any>> = {
  x: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M4 4l11.733 16H20L8.267 4H4zM4 20l6.768-6.768m2.46-2.46L20 4" /></svg>,
  whatsapp: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 4.5z"/><path d="M15.54 12.85a1.5 1.5 0 0 0-1.5-1.5h-1a1.5 1.5 0 0 0-1.5 1.5v1a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5z"/></svg>,
  github: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-4.51-2-7-2" /></svg>,
  instagram: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>,
  facebook: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  linkedin: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>,
  youtube: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
};

const BtnIcons: Record<string, React.FC<any>> = { globe: Globe, mail: Mail, zap: Zap, link: ExternalLink, code: Code, layout: Layout, chat: MessageCircle, play: Play };

export default async function UserSite({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { data: site } = await supabase.from("sites").select("*").eq("username", username).single();

  if (!site) notFound();

  const isDark = site.theme_mode === "dark";
  const activeSocials = site.social_links?.filter((s: any) => s.url).slice(0, 3) || [];

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center transition-all duration-700 ${isDark ? 'dark bg-[#0d1117]' : 'bg-white'}`} style={{ backgroundColor: isDark ? '#0d1117' : '#ffffff' }}>
      <div className="max-w-md w-full text-center mt-12 md:mt-24">
        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl mx-auto mb-8 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
          {site.avatar_url ? <img src={site.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black" style={{ backgroundColor: site.primary_color }}>{site.title?.charAt(0)}</div>}
        </div>
        <h1 className={`text-4xl font-black mb-3 tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{site.title}</h1>
        <p className={`font-medium mb-12 px-4 leading-relaxed text-sm max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{site.bio}</p>
        <div className="flex justify-center gap-6 mb-16">
          {activeSocials.map((social: any) => {
            const Icon = Icons[social.platform] || Globe;
            return <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className={`p-5 rounded-[2rem] shadow-xl border transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'}`}><Icon /></a>
          })}
        </div>
        <div className="space-y-4 w-full px-2">
          {site.links?.map((link: any) => {
            const BIcon = BtnIcons[link.icon] || ExternalLink;
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full px-8 py-5 rounded-[2.5rem] font-black shadow-2xl transition-all hover:scale-[1.03] active:scale-95 text-[10px] uppercase tracking-[0.2em] text-white" style={{ backgroundColor: site.primary_color }}>
                <div className="flex items-center gap-4"><div className="p-2 bg-white/10 rounded-xl"><BIcon size={18} /></div>{link.label}</div>
                <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
              </a>
            )
          })}
        </div>
        <footer className={`mt-32 opacity-20 font-black text-[10px] tracking-[0.6em] uppercase pb-12 ${isDark ? 'text-white' : 'text-slate-900'}`}>Powered by InstaWeb</footer>
      </div>
    </div>
  );
}