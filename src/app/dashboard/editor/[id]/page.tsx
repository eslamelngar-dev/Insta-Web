"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Save, Smartphone, Monitor, ChevronLeft, Camera, Plus, Trash2, Globe, Mail, Zap, ExternalLink, Code, Layout, MessageCircle, Play, Sun, Moon, Loader2, Image as ImageIcon, Link as LinkIcon, User, GripVertical, Image } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

function SortableBlockItem({ block, updateBentoBlock, deleteBlock, handleImageUpload, uploadingId }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button {...attributes} {...listeners} className="text-slate-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing"><GripVertical size={18}/></button>
          <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded">{block.type}</span>
        </div>
        <button onClick={() => deleteBlock(block.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
      </div>
      
      <div className="flex gap-2">
         <button onClick={() => updateBentoBlock(block.id, { colSpan: 1, rowSpan: 1 })} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${block.colSpan === 1 && block.rowSpan === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}>1x1</button>
         <button onClick={() => updateBentoBlock(block.id, { colSpan: 2, rowSpan: 1 })} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${block.colSpan === 2 && block.rowSpan === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}>2x1</button>
         <button onClick={() => updateBentoBlock(block.id, { colSpan: 2, rowSpan: 2 })} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${block.colSpan === 2 && block.rowSpan === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}>2x2</button>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-white/5">
        {block.type === 'profile' && (
          <>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                {uploadingId === block.id ? <Loader2 className="animate-spin text-indigo-500" size={16}/> : block.data.avatar_url ? <img src={block.data.avatar_url} className="w-full h-full object-cover"/> : <User size={16} className="text-slate-400"/>}
              </div>
              <label className="flex-1 py-3 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase text-slate-500 cursor-pointer hover:bg-slate-100 transition-all">
                Upload Avatar <input type="file" className="hidden" onChange={e => handleImageUpload(e, block.id)} accept="image/*" />
              </label>
            </div>
            <input value={block.data.title || ""} onChange={e => updateBentoBlock(block.id, { data: { ...block.data, title: e.target.value } })} placeholder="Title" className="w-full bg-transparent border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold uppercase outline-none" />
            <textarea value={block.data.bio || ""} onChange={e => updateBentoBlock(block.id, { data: { ...block.data, bio: e.target.value } })} placeholder="Bio" className="w-full bg-transparent border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none resize-none h-16" />
          </>
        )}

        {block.type === 'link' && (
          <>
            <input value={block.data.label || ""} onChange={e => updateBentoBlock(block.id, { data: { ...block.data, label: e.target.value } })} placeholder="Label" className="w-full bg-transparent border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold uppercase outline-none" />
            <input value={block.data.url || ""} onChange={e => updateBentoBlock(block.id, { data: { ...block.data, url: e.target.value } })} placeholder="URL" className="w-full bg-transparent border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none" />
          </>
        )}

        {block.type === 'image' && (
          <div className="flex flex-col gap-3">
            <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center">
                {uploadingId === block.id ? <Loader2 className="animate-spin text-indigo-500" size={24}/> : block.data.image_url ? <img src={block.data.image_url} className="w-full h-full object-cover"/> : <ImageIcon size={24} className="text-slate-400"/>}
            </div>
            <label className="w-full py-3 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase text-slate-500 cursor-pointer hover:bg-slate-100 transition-all">
                Upload Image <input type="file" className="hidden" onChange={e => handleImageUpload(e, block.id)} accept="image/*" />
            </label>
          </div>
        )}

        {block.type === 'social' && (
          <>
            <select value={block.data.platform || "github"} onChange={e => updateBentoBlock(block.id, { data: { ...block.data, platform: e.target.value } })} className="w-full bg-transparent border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none">
              {Object.keys(Icons).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={block.data.url || ""} onChange={e => updateBentoBlock(block.id, { data: { ...block.data, url: e.target.value } })} placeholder="Profile URL" className="w-full bg-transparent border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none" />
          </>
        )}
      </div>
    </div>
  );
}

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "classic";

  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  const [data, setData] = useState({
    username: "",
    template_id: "classic",
    content: {} as any
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (id === "new") {
      const defaultContent = TEMPLATES_REGISTRY[templateId]?.defaultContent || TEMPLATES_REGISTRY.classic.defaultContent;
      setData({ username: "", template_id: templateId, content: defaultContent });
    } else {
      const fetchSite = async () => {
        const { data: site } = await supabase.from("sites").select("*").eq("id", id).single();
        if (site) {
          setData({
            username: site.username || "",
            template_id: site.template_id || "classic",
            content: site.content && Object.keys(site.content).length > 0 ? site.content : {
              title: site.title, bio: site.bio, color: site.primary_color, theme_mode: site.theme_mode,
              avatar_url: site.avatar_url, social_links: site.social_links, links: site.links
            }
          });
        }
      };
      fetchSite();
    }
  }, [id, templateId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target?: string) => {
    try {
      setUploadingId(target || "avatar");
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from("avatars").upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      
      if (target === "cover") {
        updateContent({ cover_url: publicUrl });
      } else if (target && target !== "avatar") {
        updateBentoBlock(target, { data: { ...data.content.blocks.find((b: any) => b.id === target).data, image_url: publicUrl, avatar_url: publicUrl } });
      } else {
        updateContent({ avatar_url: publicUrl });
      }
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    
    const extractedTitle = data.content.title || (data.content.blocks?.find((b: any) => b.type === 'profile')?.data.title) || "Untitled Identity";
    const extractedBio = data.content.bio || (data.content.blocks?.find((b: any) => b.type === 'profile')?.data.bio) || "";

    const payload = {
      user_id: user.id,
      ...(id !== "new" && { id }),
      username: data.username.toLowerCase().trim() || `user_${Math.floor(Math.random() * 10000)}`,
      template_id: data.template_id,
      content: data.content,
      title: extractedTitle,
      bio: extractedBio,
      primary_color: data.content.color || "#6366f1",
      theme_mode: data.content.theme_mode || "light"
    };

    const { error } = await supabase.from("sites").upsert(payload);
    
    if (error) {
      toast.error(error.message);
    } else { 
      toast.success("Live Now!"); 
      router.push("/dashboard"); 
    }
    
    setLoading(false);
  };

  const updateContent = (updates: any) => setData({ ...data, content: { ...data.content, ...updates } });
  
  const updateBentoBlock = (blockId: string, updates: any) => {
    const newBlocks = data.content.blocks.map((b: any) => b.id === blockId ? { ...b, ...updates } : b);
    updateContent({ blocks: newBlocks });
  };

  const addBentoBlock = (type: string) => {
    const newBlock = { id: Date.now().toString(), type, colSpan: 1, rowSpan: 1, data: {} };
    if (type === 'profile') newBlock.data = { title: "New Profile", bio: "Bio here" };
    if (type === 'link') newBlock.data = { label: "New Link", url: "https://", icon: "link" };
    if (type === 'social') newBlock.data = { platform: "github", url: "https://" };
    if (type === 'image') newBlock.data = { image_url: "" };
    updateContent({ blocks: [...(data.content.blocks || []), newBlock] });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.content.blocks.findIndex((b: any) => b.id === active.id);
      const newIndex = data.content.blocks.findIndex((b: any) => b.id === over.id);
      updateContent({ blocks: arrayMove(data.content.blocks, oldIndex, newIndex) });
    }
  };

  const TemplateConfig = TEMPLATES_REGISTRY[data.template_id] || TEMPLATES_REGISTRY.classic;
  const ActiveTemplate = TemplateConfig.component;
  const activeFeatures = TemplateConfig.features || [];

  const renderStandardControls = () => (
    <>
      {activeFeatures.includes("cover") && (
        <section className="flex flex-col items-center">
          <div className="relative group w-full h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl transition-all">
            {uploadingId === "cover" ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800"><Loader2 className="animate-spin text-indigo-500" /></div>
            ) : data.content.cover_url ? (
              <img src={data.content.cover_url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-slate-400"><Image size={24} /><span className="text-[10px] font-black uppercase">Cover Image</span></div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
              <input type="file" className="hidden" onChange={e => handleImageUpload(e, "cover")} disabled={uploadingId !== null} accept="image/*" />
              <span className="text-[10px] font-black uppercase">Upload Cover</span>
            </label>
          </div>
        </section>
      )}

      {activeFeatures.includes("avatar") && (
        <section className="flex flex-col items-center">
          <div className="relative group w-32 h-32">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl transition-all">
              {uploadingId === "avatar" ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800"><Loader2 className="animate-spin text-indigo-500" /></div>
              ) : data.content.avatar_url ? (
                <img src={data.content.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300"><Camera size={32} /></div>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
              <input type="file" className="hidden" onChange={e => handleImageUpload(e, "avatar")} disabled={uploadingId !== null} accept="image/*" />
              <span className="text-[10px] font-black uppercase">Change Photo</span>
            </label>
          </div>
        </section>
      )}

      {activeFeatures.includes("tone") && (
        <section className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Tone</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl">
            <button onClick={() => updateContent({ theme_mode: "light" })} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${data.content.theme_mode === "light" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400"}`}><Sun size={14} /> Light</button>
            <button onClick={() => updateContent({ theme_mode: "dark" })} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${data.content.theme_mode === "dark" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400"}`}><Moon size={14} /> Dark</button>
          </div>
          <div className="flex items-center gap-4 px-2">
             <input type="color" value={data.content.color || "#6366f1"} onChange={(e) => updateContent({ color: e.target.value })} className="w-10 h-10 rounded-xl overflow-hidden border-none cursor-pointer bg-transparent" />
             <p className="text-[10px] font-black uppercase text-slate-400">Brand Color</p>
          </div>
        </section>
      )}

      {activeFeatures.includes("baseInfo") && (
        <section className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Base Info</label>
          <div className="space-y-3">
            <input value={data.content.title || ""} onChange={e => updateContent({ title: e.target.value })} placeholder="Full Name" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold uppercase outline-none" />
            <textarea value={data.content.bio || ""} onChange={e => updateContent({ bio: e.target.value })} placeholder="Biography" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm h-24 resize-none outline-none" />
          </div>
        </section>
      )}

      {activeFeatures.includes("social") && (
        <section className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Social Nodes</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(Icons).map(platform => {
              const Icon = Icons[platform];
              const isAdded = data.content.social_links?.some((s: any) => s.platform === platform);
              return (
                <button key={platform} onClick={() => {
                  if (isAdded) updateContent({ social_links: data.content.social_links.filter((s: any) => s.platform !== platform) });
                  else updateContent({ social_links: [...(data.content.social_links || []), { id: Date.now().toString(), platform, url: "" }] });
                }} className={`p-3 rounded-xl border transition-all ${isAdded ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-indigo-500'}`}><Icon /></button>
              )
            })}
          </div>
          {data.content.social_links?.map((s: any) => (
            <div key={s.id} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
              <span className="text-[10px] font-black uppercase text-indigo-500 w-12">{s.platform}</span>
              <input value={s.url || ""} onChange={e => {
                const nl = [...data.content.social_links]; const t = nl.find(x => x.id === s.id); if (t) t.url = e.target.value; updateContent({ social_links: nl });
              }} placeholder="https://..." className="bg-transparent text-xs w-full outline-none" />
            </div>
          ))}
        </section>
      )}

      {activeFeatures.includes("links") && (
        <section className="space-y-4 pb-20">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Nodes</label>
            <button onClick={() => updateContent({ links: [...(data.content.links || []), { id: Date.now().toString(), label: "New Button", url: "https://", icon: "link" }] })} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"><Plus size={20}/></button>
          </div>
          {data.content.links?.map((link: any, idx: number) => (
            <div key={link.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm group relative">
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <input value={link.label || ""} onChange={e => {
                    const nl = [...data.content.links]; nl[idx].label = e.target.value; updateContent({ links: nl });
                  }} className="w-full bg-transparent text-sm font-black outline-none tracking-tight uppercase" placeholder="Button Label" />
                  <input value={link.url || ""} onChange={e => {
                    const nl = [...data.content.links]; nl[idx].url = e.target.value; updateContent({ links: nl });
                  }} className="w-full bg-transparent text-[10px] text-slate-400 outline-none" placeholder="URL" />
                </div>
                <button onClick={() => updateContent({ links: data.content.links.filter((l: any) => l.id !== link.id) })} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-white/10">
                {Object.entries(ButtonIcons).map(([key, BIcon]) => (
                  <button key={key} onClick={() => {
                    const nl = [...data.content.links]; nl[idx].icon = key; updateContent({ links: nl });
                  }} className={`p-2.5 rounded-xl transition-all ${link.icon === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}><BIcon size={16}/></button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );

  const renderBentoControls = () => (
    <>
      <section className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Add Blocks</label>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => addBentoBlock('profile')} className="p-3 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-all"><User size={16}/> Profile</button>
          <button onClick={() => addBentoBlock('link')} className="p-3 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-all"><LinkIcon size={16}/> Link</button>
          <button onClick={() => addBentoBlock('image')} className="p-3 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-all"><ImageIcon size={16}/> Image</button>
          <button onClick={() => addBentoBlock('social')} className="p-3 flex flex-col items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-all"><Globe size={16}/> Social</button>
        </div>
      </section>

      <section className="space-y-4 pb-20">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Grid Blocks</label>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.content.blocks?.map((b: any) => b.id) || []} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {data.content.blocks?.map((block: any) => (
                <SortableBlockItem 
                  key={block.id} 
                  block={block} 
                  updateBentoBlock={updateBentoBlock} 
                  deleteBlock={(id: any) => updateContent({ blocks: data.content.blocks.filter((b: any) => b.id !== id) })}
                  handleImageUpload={handleImageUpload}
                  uploadingId={uploadingId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>
    </>
  );

  return (
    <div className="h-screen bg-white dark:bg-slate-950 flex overflow-hidden text-slate-900 dark:text-white transition-colors duration-500">
      <aside className="w-[450px] border-r border-slate-200 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900/50">
          <Link href="/dashboard" className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"><ChevronLeft size={20}/></Link>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Builder v8.2</span>
        </div>

        <div className="flex-1 p-8 space-y-12 overflow-y-auto custom-scroll pb-24">
          <section className="space-y-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Config</label>
              <input value={data.username || ""} onChange={e => setData({...data, username: e.target.value})} placeholder="Username (your url)" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm outline-none font-bold" />
            </div>
          </section>

          <div className="w-full h-px bg-slate-200 dark:bg-white/5" />

          {activeFeatures.length === 0 ? renderBentoControls() : renderStandardControls()}

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
          animate={{ width: isMobile ? 400 : "100%", height: isMobile ? 850 : "100%", borderRadius: isMobile ? "4.5rem" : "0px", scale: isMobile ? 0.8 : 1 }} 
          className={`shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-[12px] border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col items-center transition-colors duration-500`}
        >
          <div className="w-full h-full overflow-hidden" style={{ backgroundColor: data.content.theme_mode === "dark" ? "#0d1117" : `${data.content.color}05` }}>
            <ActiveTemplate site={{ ...data, content: data.content }} isDark={data.content.theme_mode === "dark"} Icons={Icons} BtnIcons={ButtonIcons} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}