"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Save, Smartphone, Monitor, ChevronLeft, Camera, Plus, Trash2, Globe, Mail, Zap, ExternalLink, Code, Layout, MessageCircle, Play, Sun, Moon, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const STARTER_CONTENT: Record<string, any> = {
  classic: {
    title: "Eslam Elngar",
    bio: "Senior UI/UX Architect & Developer. Building the future of the web with React.",
    color: "#6366f1",
    theme_mode: "light",
    social_links: [
      { id: "s1", platform: "github", url: "https://github.com" },
      { id: "s2", platform: "x", url: "https://x.com" }
    ],
    links: [
      { id: "l1", label: "VIEW MY PORTFOLIO", url: "#", icon: "layout" },
      { id: "l2", label: "LATEST CASE STUDY", url: "#", icon: "zap" }
    ]
  },
  bento: {
    title: "Aura Studio",
    bio: "Visual Arts & Creative Direction. Exploring tech and art.",
    color: "#f43f5e",
    theme_mode: "dark",
    social_links: [
      { id: "s1", platform: "instagram", url: "https://instagram.com" }
    ],
    links: [
      { id: "l1", label: "COLLECTIBLES", url: "#", icon: "globe" }
    ]
  }
};

const Icons: Record<string, React.FC<any>> = {
  x: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 4l11.733 16H20L8.267 4H4zM4 20l6.768-6.768m2.46-2.46L20 4" /></svg>,
  whatsapp: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 4.5z"/><path d="M15.54 12.85a1.5 1.5 0 0 0-1.5-1.5h-1a1.5 1.5 0 0 0-1.5 1.5v1a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5z"/></svg>,
  github: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-4.51-2-7-2" /></svg>,
  instagram: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>,
  linkedin: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>,
  facebook: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  youtube: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
};

const ButtonIcons: Record<string, React.FC<any>> = { globe: Globe, mail: Mail, zap: Zap, link: ExternalLink, code: Code, layout: Layout, chat: MessageCircle, play: Play };

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "classic";

  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({
    username: "", title: "", bio: "", color: "#6366f1", avatar_url: "", theme_mode: "light", template_id: "classic", links: [] as any[], social_links: [] as any[]
  });

  useEffect(() => {
    if (id === "new") {
      const starter = STARTER_CONTENT[templateId] || STARTER_CONTENT.classic;
      setData(prev => ({ ...prev, ...starter, template_id: templateId }));
    } else {
      const fetchSite = async () => {
        const { data: site } = await supabase.from("sites").select("*").eq("id", id).single();
        if (site) {
          setData({
            username: site.username || "",
            title: site.title || "",
            bio: site.bio || "",
            color: site.primary_color || "#6366f1",
            avatar_url: site.avatar_url || "",
            theme_mode: site.theme_mode || "light",
            template_id: site.template_id || "classic",
            links: site.links || [],
            social_links: site.social_links || []
          });
        }
      };
      fetchSite();
    }
  }, [id, templateId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setData({ ...data, avatar_url: publicUrl });
      toast.success("Profile visual updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const payload = {
      user_id: user.id,
      ...(id !== "new" && { id }),
      username: data.username.toLowerCase().trim(),
      title: data.title,
      bio: data.bio,
      primary_color: data.color,
      avatar_url: data.avatar_url,
      theme_mode: data.theme_mode,
      template_id: data.template_id,
      links: data.links,
      social_links: data.social_links
    };

    const { error } = await supabase.from("sites").upsert(payload);
    if (error) toast.error(error.message); else { toast.success("Live Now!"); router.push("/dashboard"); }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-white dark:bg-slate-950 flex overflow-hidden text-slate-900 dark:text-white transition-colors duration-500">
      <aside className="w-[450px] border-r border-slate-200 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900/50">
          <Link href="/dashboard" className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"><ChevronLeft size={20}/></Link>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Editor v6.8</span>
        </div>

        <div className="flex-1 p-8 space-y-12 overflow-y-auto custom-scroll pb-24">
          <section className="flex flex-col items-center">
            <div className="relative group w-32 h-32">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl transition-all">
                {uploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800"><Loader2 className="animate-spin text-indigo-500" /></div>
                ) : data.avatar_url ? (
                  <img src={data.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Camera size={32} /></div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                <span className="text-[10px] font-black uppercase">Change Photo</span>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Tone</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl">
              <button onClick={() => setData({...data, theme_mode: "light"})} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${data.theme_mode === "light" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400"}`}>
                <Sun size={14} /> Light
              </button>
              <button onClick={() => setData({...data, theme_mode: "dark"})} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${data.theme_mode === "dark" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400"}`}>
                <Moon size={14} /> Dark
              </button>
            </div>
            <div className="flex items-center gap-4 px-2">
               <input type="color" value={data.color || "#6366f1"} onChange={(e) => setData({...data, color: e.target.value})} className="w-10 h-10 rounded-xl overflow-hidden border-none cursor-pointer bg-transparent" />
               <p className="text-[10px] font-black uppercase text-slate-400">Brand Color</p>
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Base Info</label>
            <div className="space-y-3">
              <input value={data.username || ""} onChange={e => setData({...data, username: e.target.value})} placeholder="username" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm outline-none" />
              <input value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} placeholder="Full Name" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold uppercase outline-none" />
              <textarea value={data.bio || ""} onChange={e => setData({...data, bio: e.target.value})} placeholder="Biography" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm h-24 resize-none outline-none" />
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Social Nodes (Max 3)</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(Icons).map(platform => {
                const Icon = Icons[platform];
                const isAdded = data.social_links.some(s => s.platform === platform);
                return (
                  <button key={platform} onClick={() => {
                    if (isAdded) setData({...data, social_links: data.social_links.filter(s => s.platform !== platform)});
                    else if (data.social_links.length < 3) setData({...data, social_links: [...data.social_links, { id: Date.now().toString(), platform, url: "" }]});
                  }} className={`p-3 rounded-xl border transition-all ${isAdded ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-indigo-500'}`}><Icon /></button>
                )
              })}
            </div>
            {data.social_links.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <span className="text-[10px] font-black uppercase text-indigo-500 w-12">{s.platform}</span>
                <input value={s.url || ""} onChange={e => {
                  const nl = [...data.social_links]; const t = nl.find(x => x.id === s.id); if (t) t.url = e.target.value; setData({...data, social_links: nl});
                }} placeholder="https://..." className="bg-transparent text-xs w-full outline-none" />
              </div>
            ))}
          </section>

          <section className="space-y-4 pb-20">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Nodes</label>
              <button onClick={() => setData({...data, links: [...data.links, { id: Date.now().toString(), label: "New Button", url: "https://", icon: "link" }]})} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"><Plus size={20}/></button>
            </div>
            {data.links.map((link, idx) => (
              <div key={link.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm group relative">
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <input value={link.label || ""} onChange={e => {
                      const nl = [...data.links]; nl[idx].label = e.target.value; setData({...data, links: nl});
                    }} className="w-full bg-transparent text-sm font-black outline-none tracking-tight uppercase" placeholder="Button Label" />
                    <input value={link.url || ""} onChange={e => {
                      const nl = [...data.links]; nl[idx].url = e.target.value; setData({...data, links: nl});
                    }} className="w-full bg-transparent text-[10px] text-slate-400 outline-none" placeholder="URL" />
                  </div>
                  <button onClick={() => setData({...data, links: data.links.filter(l => l.id !== link.id)})} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-white/10">
                  {Object.entries(ButtonIcons).map(([key, BIcon]) => (
                    <button key={key} onClick={() => {
                      const nl = [...data.links]; nl[idx].icon = key; setData({...data, links: nl});
                    }} className={`p-2.5 rounded-xl transition-all ${link.icon === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}><BIcon size={16}/></button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="p-8 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 z-20">
          <button onClick={handleDeploy} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-all active:scale-95">
            {loading ? "SYNCING..." : "DEPLOY CHANGES"}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-all duration-700">
        <div className="absolute top-8 flex bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-2xl border border-slate-200 dark:border-white/5 z-20">
          <button onClick={() => setIsMobile(false)} className={`p-3 rounded-xl transition-all ${!isMobile ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}><Monitor size={20} /></button>
          <button onClick={() => setIsMobile(true)} className={`p-3 rounded-xl transition-all ${isMobile ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}><Smartphone size={20} /></button>
        </div>

        <motion.div 
          animate={{ 
            width: isMobile ? 400 : "100%", 
            height: isMobile ? 850 : "100%", 
            borderRadius: isMobile ? "4.5rem" : "0px",
            scale: isMobile ? 0.8 : 1 
          }} 
          className={`shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-[12px] border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col items-center transition-colors duration-500 ${data.theme_mode === "dark" ? "bg-[#0d1117]" : "bg-white"}`}
        >
          <div className="w-full h-full overflow-y-auto custom-scroll p-12 flex flex-col items-center text-center" style={{ backgroundColor: data.theme_mode === "dark" ? "#0d1117" : `${data.color}05` }}>
            <div className="w-32 h-32 rounded-full mb-8 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 flex-shrink-0">
              {data.avatar_url ? (
                <img src={data.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black uppercase" style={{ backgroundColor: data.color }}>
                  {data.title?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 w-full">
              <h2 className={`text-4xl font-black mb-2 tracking-tighter uppercase shrink-0 ${data.theme_mode === "dark" ? "text-white" : "text-slate-900"}`}>{data.title || "Identity Name"}</h2>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-12 shrink-0 ${data.theme_mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>{data.bio || "Brief Headline"}</p>
            </div>

            <div className="flex justify-center gap-4 mb-12 flex-shrink-0">
              {data.social_links.filter(s => s.url).slice(0, 3).map(s => {
                const Icon = Icons[s.platform] || Globe;
                return <div key={s.id} className={`p-6 rounded-[2.5rem] border shadow-lg ${data.theme_mode === "dark" ? "bg-slate-900 border-white/5 text-white" : "bg-white border-slate-100 text-slate-900"}`}><Icon size={24} /></div>
              })}
            </div>

            <div className="w-full space-y-4 max-w-sm pb-20">
              {data.links.map(l => {
                const BIcon = ButtonIcons[l.icon] || ExternalLink;
                return (
                  <div key={l.id} className="w-full px-8 py-5 rounded-[2.5rem] border-2 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-between" style={{ borderColor: data.color, color: data.theme_mode === "dark" ? "white" : data.color, backgroundColor: data.theme_mode === "dark" ? `${data.color}20` : 'transparent' }}>
                    <div className="flex items-center gap-4"><BIcon size={18} /> {l.label}</div>
                    <ExternalLink size={14} className="opacity-30" />
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}