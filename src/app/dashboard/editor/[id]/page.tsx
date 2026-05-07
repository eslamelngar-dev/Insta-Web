"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Save, Smartphone, Monitor, ChevronLeft, Globe, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState({ 
    username: "", 
    title: "Eslam Elngar", 
    bio: "Web Architect & Developer", 
    color: "#6366f1",
    links: [] as { id: string, label: string, url: string }[]
  });

  useEffect(() => {
    if (id !== "new") {
      const fetchSite = async () => {
        const { data: site } = await supabase.from('sites').select('*').eq('id', id).single();
        if (site) {
          setData({ 
            username: site.username, 
            title: site.title, 
            bio: site.bio, 
            color: site.primary_color,
            links: site.links || [] 
          });
        }
      };
      fetchSite();
    }
  }, [id]);

  const addLink = () => {
    setData({ ...data, links: [...data.links, { id: Date.now().toString(), label: "New Link", url: "https://" }] });
  };

  const handleDeploy = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login first"); setLoading(false); return; }

    const payload = {
      user_id: user.id,
      username: data.username.toLowerCase().replace(/\s+/g, '-'),
      title: data.title,
      bio: data.bio,
      primary_color: data.color,
      links: data.links
    };

    const { error } = await supabase.from('sites').upsert(id === "new" ? payload : { id, ...payload });

    if (error) toast.error(error.message);
    else { toast.success("Site Live! 🚀"); router.push('/dashboard'); }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-white dark:bg-slate-950 flex overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
      <aside className="w-96 border-r border-slate-200 dark:border-white/5 flex flex-col z-10 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-xl">
        <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <Link href="/dashboard" className="hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-lg transition-colors"><ChevronLeft /></Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Editor Pro</span>
        </div>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scroll">
          <section className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity</label>
            <input value={data.username} onChange={e => setData({...data, username: e.target.value})} placeholder="URL Name" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" />
            <input value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm outline-none" />
            <textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm h-24 resize-none outline-none" />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Buttons & Links</label>
              <button onClick={addLink} className="p-1 hover:bg-indigo-500/10 text-indigo-500 rounded-md transition-all"><Plus size={20}/></button>
            </div>
            <div className="space-y-3">
              {data.links.map((link, idx) => (
                <div key={link.id} className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                  <input value={link.label} onChange={e => {
                    const newLinks = [...data.links];
                    newLinks[idx].label = e.target.value;
                    setData({...data, links: newLinks});
                  }} className="w-full bg-transparent font-bold text-sm outline-none" placeholder="Label" />
                  <div className="flex items-center gap-2">
                    <LinkIcon size={12} className="text-slate-400"/>
                    <input value={link.url} onChange={e => {
                      const newLinks = [...data.links];
                      newLinks[idx].url = e.target.value;
                      setData({...data, links: newLinks});
                    }} className="w-full bg-transparent text-xs text-slate-400 outline-none" placeholder="URL" />
                    <button onClick={() => setData({...data, links: data.links.filter(l => l.id !== link.id)})} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Brand Color</label>
            <div className="grid grid-cols-4 gap-3">
              {["#6366f1", "#4a5d23", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#0ea5e9", "#000000"].map(c => (
                <button key={c} onClick={() => setData({...data, color: c})} className={`h-10 rounded-lg transition-all ${data.color === c ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-slate-200 dark:border-white/5">
          <button onClick={handleDeploy} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            <Save size={18} /> {loading ? "Publishing..." : "Publish Site"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 flex flex-col items-center justify-center relative bg-slate-100 dark:bg-slate-900/50">
        <div className="absolute top-8 flex bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-white/5 shadow-sm">
          <button onClick={() => setIsMobile(false)} className={`p-2 rounded-lg ${!isMobile ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}><Monitor size={18} /></button>
          <button onClick={() => setIsMobile(true)} className={`p-2 rounded-lg ${isMobile ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}><Smartphone size={18} /></button>
        </div>

        <motion.div 
          animate={{ width: isMobile ? 375 : "100%", height: isMobile ? 667 : "100%", borderRadius: isMobile ? "3rem" : "0px" }}
          className="bg-white overflow-hidden shadow-2xl border-[8px] border-slate-200 dark:border-slate-800 transition-all duration-500"
        >
          <div className="h-full overflow-y-auto bg-white p-10 flex flex-col items-center text-center justify-center">
            <div className="w-20 h-20 rounded-3xl rotate-6 mb-8 shadow-xl" style={{ backgroundColor: data.color }} />
            <h1 className="text-3xl font-black mb-4 text-slate-900">{data.title}</h1>
            <p className="text-slate-500 text-sm mb-10 max-w-xs">{data.bio}</p>
            <div className="w-full space-y-3 max-w-xs">
              {data.links.map(l => (
                <div key={l.id} className="w-full py-3 rounded-xl border-2 font-bold text-sm" style={{ borderColor: data.color, color: data.color }}>{l.label}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}