"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Layout, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('sites').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (data) setSites(data);
      }
      setLoading(false);
    };
    fetchSites();
  }, []);

  return (
    <div className="min-h-screen p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
            <p className="text-slate-500 mt-2">Manage your high-performance websites</p>
          </div>
          <Link href="/dashboard/editor/new" className="px-8 py-4 bg-indigo-600 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
            <Plus size={20} /> New Project
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-indigo-500">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : sites.length === 0 ? (
          <div className="glass p-12 rounded-[3rem] text-center border-dashed border-white/10">
            <Layout size={48} className="mx-auto text-slate-600 mb-6" />
            <h3 className="text-2xl font-bold mb-2">No sites yet</h3>
            <p className="text-slate-500 mb-8">Create your first stunning website in seconds.</p>
            <Link href="/dashboard/editor/new" className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm inline-flex items-center gap-2 hover:bg-slate-200 transition-all">
              Start Building
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site) => (
              <motion.div key={site.id} whileHover={{ y: -5 }} className="glass p-8 rounded-[2.5rem] group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: site.primary_color }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg" style={{ backgroundColor: `${site.primary_color}20`, color: site.primary_color }}>
                  <Layout size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2 truncate">{site.title}</h3>
                <p className="text-slate-500 text-sm mb-8 truncate">instaweb.com/{site.username}</p>
                <div className="flex gap-3">
                  <Link href={`/dashboard/editor/${site.id}`} className="flex-1 py-3 glass rounded-xl text-center text-xs font-bold hover:bg-white/10 transition-colors border border-white/5">
                    Edit Content
                  </Link>
                  <a href={`/${site.username}`} target="_blank" rel="noreferrer" className="p-3 glass rounded-xl hover:bg-white/10 transition-colors border border-white/5 text-slate-300">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}