"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Save, Smartphone, Monitor, ChevronLeft, Globe } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// لاحظ التغيير في السطر ده: خلينا الـ params عبارة عن Promise
export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  // هنا استخدمنا use() عشان نفك الـ params زي ما Next.js 15 بيطلب
  const { id } = use(params);
  
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ 
    username: "", 
    title: "Eslam Elngar", 
    bio: "Web Architect & Developer", 
    color: "#6366f1" 
  });

  // جلب البيانات لو كان الموقع موجود بالفعل
  useEffect(() => {
    if (id !== "new") {
      const fetchSite = async () => {
        const { data: site } = await supabase.from('sites').select('*').eq('id', id).single();
        if (site) {
          setData({ username: site.username, title: site.title, bio: site.bio, color: site.primary_color });
        }
      };
      fetchSite();
    }
  }, [id]);

  const handleDeploy = async () => {
    setLoading(true);
    // الحصول على الـ ID بتاع المستخدم اللي مسجل دخول
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!data.username) {
      alert("Please enter a username for your URL");
      setLoading(false);
      return;
    }

    // حفظ أو تحديث الموقع في قاعدة البيانات
    const payload = {
      user_id: user.id,
      username: data.username.toLowerCase().replace(/\s+/g, '-'),
      title: data.title,
      bio: data.bio,
      primary_color: data.color,
    };

    const { error } = await supabase.from('sites').upsert(
      id === "new" ? payload : { id, ...payload }
    );

    if (error) {
      alert(error.message);
    } else {
      alert("Site Deployed Successfully! 🚀");
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden text-white font-sans">
      <aside className="w-96 glass border-r-0 flex flex-col z-10">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard" className="hover:bg-white/10 p-2 rounded-lg transition-colors"><ChevronLeft /></Link>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Editor v1.0</span>
        </div>

        <div className="flex-1 p-8 space-y-10 custom-scroll overflow-y-auto">
          <section className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Site URL</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input value={data.username} onChange={e => setData({...data, username: e.target.value})} placeholder="your-name" className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-5 py-4 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <p className="text-xs text-slate-500">instaweb.com/<span className="text-white font-bold">{data.username || "your-name"}</span></p>
          </section>

          <section className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Content</label>
            <input value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-indigo-500 outline-none" />
            <textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-5 py-4 text-sm h-32 resize-none focus:border-indigo-500 outline-none" />
          </section>

          <section className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Brand Color</label>
            <div className="grid grid-cols-4 gap-3">
              {["#6366f1", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#0ea5e9", "#ffffff"].map(c => (
                <button key={c} onClick={() => setData({...data, color: c})} className={`h-12 rounded-xl transition-all active:scale-90 ${data.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-white/5">
          <button onClick={handleDeploy} disabled={loading} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50">
            <Save size={18} /> {loading ? "Deploying..." : "Deploy Site"}
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-slate-950 p-12 flex flex-col items-center justify-center relative">
        <div className="absolute top-8 flex bg-slate-900 rounded-xl p-1 border border-white/5">
          <button onClick={() => setIsMobile(false)} className={`p-2 rounded-lg transition-all ${!isMobile ? 'bg-white/10 text-white' : 'text-slate-500'}`}><Monitor size={18} /></button>
          <button onClick={() => setIsMobile(true)} className={`p-2 rounded-lg transition-all ${isMobile ? 'bg-white/10 text-white' : 'text-slate-500'}`}><Smartphone size={18} /></button>
        </div>

        <motion.div 
          animate={{ width: isMobile ? 375 : "100%", height: isMobile ? 667 : "100%" }}
          className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-900 transition-all duration-500"
        >
          <div className="h-full overflow-y-auto bg-white text-slate-950 p-10 md:p-20 flex flex-col items-center text-center justify-center min-h-full">
            <div className="w-24 h-24 rounded-3xl rotate-6 mb-10 shadow-xl transition-colors duration-300" style={{ backgroundColor: data.color }} />
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter transition-colors duration-300" style={{ color: data.color }}>{data.title}</h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">{data.bio}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}