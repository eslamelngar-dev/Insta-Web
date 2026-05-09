"use client";

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Smartphone, Monitor, ChevronLeft, Camera, Plus, Trash2,
  Globe, Mail, Zap, ExternalLink, Code, Layout, MessageCircle,
  Play, Sun, Moon, Loader2, Image as ImageIcon, Link as LinkIcon,
  User, GripVertical, Image, Star, CheckCircle2, ArrowRight, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Icons: Record<string, React.FC<any>> = {
  x: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
    </svg>
  ),
  whatsapp: (p: any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  ),
  github: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  instagram: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
    </svg>
  ),
  facebook: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  linkedin: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
};

const ButtonIcons: Record<string, React.FC<any>> = {
  globe: Globe,
  mail: Mail,
  zap: Zap,
  link: ExternalLink,
  code: Code,
  layout: Layout,
  chat: MessageCircle,
  play: Play
};

function SortableBlockItem({ block, updateBentoBlock, deleteBlock, handleImageUpload, uploadingId }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-5 shadow-sm group relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical size={20} />
          </button>
          <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">
            {block.type}
          </span>
        </div>
        <button
          onClick={() => deleteBlock(block.id)}
          className="text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["1x1", "2x1", "2x2"].map((size) => {
          const [cs, rs] = size.split("x").map(Number);
          return (
            <button
              key={size}
              onClick={() => updateBentoBlock(block.id, { colSpan: cs, rowSpan: rs })}
              className={`py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${
                block.colSpan === cs && block.rowSpan === rs
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-100 dark:border-white/5 text-slate-400"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
        {block.type === "profile" && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                {uploadingId === block.id ? (
                  <Loader2 className="animate-spin text-indigo-500" size={20} />
                ) : block.data.avatar_url ? (
                  <img
                    src={block.data.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-slate-300" />
                )}
              </div>
              <label className="flex-1 py-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-[10px] font-black uppercase text-slate-500 cursor-pointer hover:bg-indigo-50 transition-all">
                Change Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, block.id)}
                  accept="image/*"
                />
              </label>
            </div>
            <input
              value={block.data.title || ""}
              onChange={(e) =>
                updateBentoBlock(block.id, {
                  data: { ...block.data, title: e.target.value },
                })
              }
              placeholder="Full Name"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none"
            />
            <textarea
              value={block.data.bio || ""}
              onChange={(e) =>
                updateBentoBlock(block.id, {
                  data: { ...block.data, bio: e.target.value },
                })
              }
              placeholder="Bio"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none resize-none h-20"
            />
          </div>
        )}

        {block.type === "image" && (
          <div className="w-full aspect-video rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 overflow-hidden flex items-center justify-center relative group/img">
            {uploadingId === block.id ? (
              <Loader2 className="animate-spin text-indigo-500" size={24} />
            ) : block.data.image_url ? (
              <img
                src={block.data.image_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={32} className="text-slate-300" />
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-all">
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImageUpload(e, block.id)}
                accept="image/*"
              />
              <span className="text-white text-[10px] font-black uppercase">
                Replace
              </span>
            </label>
          </div>
        )}

        {block.type === "link" && (
          <div className="space-y-3">
            <input
              value={block.data.label || ""}
              onChange={(e) =>
                updateBentoBlock(block.id, {
                  data: { ...block.data, label: e.target.value },
                })
              }
              placeholder="Label"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none"
            />
            <input
              value={block.data.url || ""}
              onChange={(e) =>
                updateBentoBlock(block.id, {
                  data: { ...block.data, url: e.target.value },
                })
              }
              placeholder="URL"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none"
            />
          </div>
        )}

        {block.type === "social" && (
          <div className="space-y-3">
            <select
              value={block.data.platform || "github"}
              onChange={(e) =>
                updateBentoBlock(block.id, {
                  data: { ...block.data, platform: e.target.value },
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none"
            >
              {Object.keys(Icons).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              value={block.data.url || ""}
              onChange={(e) =>
                updateBentoBlock(block.id, {
                  data: { ...block.data, url: e.target.value },
                })
              }
              placeholder="Profile URL"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Editor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    content: {} as any,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const initEditor = async () => {
      if (id === "new") {
        const rawDefault =
          TEMPLATES_REGISTRY[templateId]?.defaultContent ||
          TEMPLATES_REGISTRY.classic.defaultContent;
        const freshCopy = JSON.parse(JSON.stringify(rawDefault));
        setData({
          username: "",
          template_id: templateId,
          content: freshCopy,
        });
      } else {
        const { data: site } = await supabase
          .from("sites")
          .select("*")
          .eq("id", id)
          .single();
        if (site) {
          setData({
            username: site.username || "",
            template_id: site.template_id || "classic",
            content: site.content || {},
          });
        }
      }
    };
    initEditor();
  }, [id, templateId]);

  const updateContent = (updates: any) =>
    setData((prev) => ({
      ...prev,
      content: { ...prev.content, ...updates },
    }));

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string
  ) => {
    try {
      setUploadingId(target || "avatar");
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);
      if (target?.startsWith("portfolio-")) {
        const index = parseInt(target.split("-")[1]);
        const newPortfolio = [...(data.content.portfolio || [])];
        newPortfolio[index].image = publicUrl;
        updateContent({ portfolio: newPortfolio });
      } else if (target === "cover") {
        updateContent({ cover_url: publicUrl });
      } else if (target === "avatar") {
        updateContent({ avatar_url: publicUrl });
      } else if (target && data.content.blocks) {
        const newBlocks = data.content.blocks.map((b: any) =>
          b.id === target
            ? {
                ...b,
                data: {
                  ...b.data,
                  image_url: publicUrl,
                  avatar_url: publicUrl,
                },
              }
            : b
        );
        updateContent({ blocks: newBlocks });
      }
      toast.success("Image Updated Successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const dbTitle =
      data.content.title ||
      data.content.hero?.title ||
      data.content.blocks?.find((b: any) => b.type === "profile")?.data
        .title ||
      "Untitled Identity";
    const payload = {
      user_id: user.id,
      ...(id !== "new" && { id }),
      username:
        data.username.toLowerCase().trim() || `user_${Date.now()}`,
      template_id: data.template_id,
      content: data.content,
      title: dbTitle,
      bio: data.content.bio || data.content.hero?.subtitle || "",
      primary_color: data.content.color || "#6366f1",
      theme_mode: data.content.theme_mode || "light",
    };
    const { error } = await supabase.from("sites").upsert(payload);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deployment Successful!");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const toggleSection = (sectionName: string) => {
    const current = data.content.sections_visibility || {};
    updateContent({
      sections_visibility: {
        ...current,
        [sectionName]:
          current[sectionName] === false ? true : false,
      },
    });
  };

  const updateBentoBlock = (blockId: string, updates: any) => {
    const newBlocks = data.content.blocks.map((b: any) =>
      b.id === blockId ? { ...b, ...updates } : b
    );
    updateContent({ blocks: newBlocks });
  };

  const addBentoBlock = (type: string) => {
    const defaults: Record<string, any> = {
      profile: { title: "New Profile", bio: "Bio here" },
      link: { label: "New Link", url: "https://", icon: "link" },
      social: { platform: "github", url: "https://" },
      image: { image_url: "" },
    };
    const newBlock = {
      id: Date.now().toString(),
      type,
      colSpan: 1,
      rowSpan: 1,
      data: defaults[type] || {},
    };
    updateContent({
      blocks: [...(data.content.blocks || []), newBlock],
    });
  };

  const deleteBentoBlock = (blockId: string) => {
    updateContent({
      blocks: data.content.blocks.filter(
        (b: any) => b.id !== blockId
      ),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = data.content.blocks.findIndex(
        (b: any) => b.id === active.id
      );
      const newIdx = data.content.blocks.findIndex(
        (b: any) => b.id === over.id
      );
      updateContent({
        blocks: arrayMove(data.content.blocks, oldIdx, newIdx),
      });
    }
  };

  const updatePortfolio = (
    index: number,
    field: string,
    value: string
  ) => {
    const newPortfolio = [...(data.content.portfolio || [])];
    newPortfolio[index] = {
      ...newPortfolio[index],
      [field]: value,
    };
    updateContent({ portfolio: newPortfolio });
  };

  const TemplateConfig =
    TEMPLATES_REGISTRY[data.template_id] ||
    TEMPLATES_REGISTRY.classic;
  const ActiveTemplate = TemplateConfig.component;
  const activeFeatures = TemplateConfig.features || [];

  const renderStandardControls = () => (
    <div className="space-y-12 pb-32">
      {activeFeatures.includes("cover") && (
        <section className="relative group w-full h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl">
          {uploadingId === "cover" ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-500" />
            </div>
          ) : data.content.cover_url ? (
            <img
              src={data.content.cover_url}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] font-black uppercase gap-2">
              <Image size={24} /> Cover Image
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "cover")}
              accept="image/*"
            />
            <span className="font-black text-xs uppercase">
              Upload Cover
            </span>
          </label>
        </section>
      )}

      {activeFeatures.includes("avatar") && (
        <section className="flex justify-center">
          <div className="relative group w-36 h-36 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl bg-slate-100">
            {uploadingId === "avatar" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader2
                  className="animate-spin text-indigo-500"
                  size={32}
                />
              </div>
            ) : data.content.avatar_url ? (
              <img
                src={data.content.avatar_url}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <Camera
                size={40}
                className="text-slate-300 absolute inset-0 m-auto"
              />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "avatar")}
                accept="image/*"
              />
              <span className="font-black text-xs uppercase tracking-tighter">
                Replace Photo
              </span>
            </label>
          </div>
        </section>
      )}

      {activeFeatures.includes("baseInfo") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Base Identity
            </label>
          </div>
          <div className="space-y-4">
            <input
              value={data.content.title || ""}
              onChange={(e) =>
                updateContent({ title: e.target.value })
              }
              placeholder="Full Name"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[1.2rem] px-5 py-4 text-sm font-bold shadow-sm outline-none focus:border-indigo-500"
            />
            <textarea
              value={data.content.bio || ""}
              onChange={(e) =>
                updateContent({ bio: e.target.value })
              }
              placeholder="Biography"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[1.2rem] px-5 py-4 text-sm h-32 outline-none resize-none shadow-sm focus:border-indigo-500"
            />
          </div>
        </section>
      )}

      {activeFeatures.includes("social") && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Social Presence
            </label>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Object.keys(Icons).map((p) => {
              const exists = data.content.social_links?.some(
                (s: any) => s.platform === p
              );
              return (
                <button
                  key={p}
                  onClick={() => {
                    if (exists) {
                      updateContent({
                        social_links:
                          data.content.social_links.filter(
                            (s: any) => s.platform !== p
                          ),
                      });
                    } else {
                      updateContent({
                        social_links: [
                          ...(data.content.social_links || []),
                          {
                            id: Date.now().toString(),
                            platform: p,
                            url: "",
                          },
                        ],
                      });
                    }
                  }}
                  className={`p-4 rounded-2xl border flex items-center justify-center transition-all ${
                    exists
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 hover:border-indigo-500"
                  }`}
                >
                  {React.createElement(Icons[p])}
                </button>
              );
            })}
          </div>
          <div className="space-y-3">
            {data.content.social_links?.map((s: any) => (
              <div
                key={s.id}
                className="flex items-center gap-3 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm"
              >
                <span className="text-[9px] font-black uppercase text-indigo-500 w-16">
                  {s.platform}
                </span>
                <input
                  value={s.url}
                  onChange={(e) => {
                    const nl = [...data.content.social_links];
                    nl.find(
                      (x: any) => x.id === s.id
                    ).url = e.target.value;
                    updateContent({ social_links: nl });
                  }}
                  placeholder={`Your ${s.platform} URL`}
                  className="bg-transparent text-xs w-full outline-none"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeFeatures.includes("links") && (
        <section className="space-y-6 pb-20">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Custom Links
              </label>
            </div>
            <button
              onClick={() =>
                updateContent({
                  links: [
                    ...(data.content.links || []),
                    {
                      id: Date.now().toString(),
                      label: "New Button",
                      url: "https://",
                      icon: "link",
                    },
                  ],
                })
              }
              className="p-2 bg-indigo-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={18} />
            </button>
          </div>
          {data.content.links?.map(
            (link: any, idx: number) => (
              <div
                key={link.id}
                className="p-6 rounded-[2rem] border bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 space-y-3 group shadow-sm"
              >
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      value={link.label}
                      onChange={(e) => {
                        const nl = [
                          ...data.content.links,
                        ];
                        nl[idx].label =
                          e.target.value;
                        updateContent({
                          links: nl,
                        });
                      }}
                      className="w-full bg-transparent font-black uppercase text-xs outline-none focus:text-indigo-500"
                      placeholder="Label"
                    />
                    <input
                      value={link.url}
                      onChange={(e) => {
                        const nl = [
                          ...data.content.links,
                        ];
                        nl[idx].url =
                          e.target.value;
                        updateContent({
                          links: nl,
                        });
                      }}
                      className="w-full bg-transparent text-[10px] opacity-50 outline-none"
                      placeholder="URL"
                    />
                  </div>
                  <button
                    onClick={() =>
                      updateContent({
                        links: data.content.links.filter(
                          (l: any) =>
                            l.id !== link.id
                        ),
                      })
                    }
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );

  const renderBentoControls = () => (
    <div className="space-y-10 pb-32">
      <div className="grid grid-cols-2 gap-3">
        {["profile", "link", "image", "social"].map((t) => (
          <button
            key={t}
            onClick={() => addBentoBlock(t)}
            className="p-4 flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase hover:text-indigo-500 hover:border-indigo-500 transition-all shadow-sm"
          >
            <Plus size={16} /> {t}
          </button>
        ))}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={
            data.content.blocks?.map(
              (b: any) => b.id
            ) || []
          }
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {data.content.blocks?.map((block: any) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                updateBentoBlock={updateBentoBlock}
                deleteBlock={deleteBentoBlock}
                handleImageUpload={handleImageUpload}
                uploadingId={uploadingId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  const renderNexusControls = () => (
    <div className="space-y-12 pb-32">
      <section className="space-y-6 bg-indigo-50/50 dark:bg-indigo-500/5 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
        <div className="flex items-center gap-2">
          <Layout size={18} className="text-indigo-500" />
          <label className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Section Visibility
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            "hero",
            "features",
            "portfolio",
            "testimonial",
            "contact",
          ].map((s) => (
            <button
              key={s}
              onClick={() => toggleSection(s)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-[10px] font-black uppercase ${
                data.content.sections_visibility?.[s] !==
                false
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-400"
              }`}
            >
              {s}
              {data.content.sections_visibility?.[s] !==
              false ? (
                <Eye size={16} />
              ) : (
                <EyeOff size={16} />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hero Config
          </label>
        </div>
        <div className="space-y-4">
          <input
            value={data.content.hero?.tagline || ""}
            onChange={(e) =>
              updateContent({
                hero: {
                  ...data.content.hero,
                  tagline: e.target.value,
                },
              })
            }
            placeholder="Tagline (e.g. Open to Work)"
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-xs font-bold outline-none"
          />
          <input
            value={data.content.hero?.title || ""}
            onChange={(e) =>
              updateContent({
                hero: {
                  ...data.content.hero,
                  title: e.target.value,
                },
              })
            }
            placeholder="Main Headline"
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
          />
          <textarea
            value={data.content.hero?.subtitle || ""}
            onChange={(e) =>
              updateContent({
                hero: {
                  ...data.content.hero,
                  subtitle: e.target.value,
                },
              })
            }
            placeholder="Sub-heading description..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-xs h-24 outline-none resize-none"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Core Features
            </label>
          </div>
          <button
            onClick={() =>
              updateContent({
                features: [
                  ...(data.content.features || []),
                  {
                    title: "New Feature",
                    desc: "Feature desc...",
                  },
                ],
              })
            }
            className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {data.content.features?.map(
            (f: any, i: number) => (
              <div
                key={i}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl space-y-3 relative group shadow-sm"
              >
                <button
                  onClick={() =>
                    updateContent({
                      features:
                        data.content.features.filter(
                          (_: any, idx: number) =>
                            idx !== i
                        ),
                    })
                  }
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
                <input
                  value={f.title}
                  onChange={(e) => {
                    const nf = [
                      ...data.content.features,
                    ];
                    nf[i].title = e.target.value;
                    updateContent({ features: nf });
                  }}
                  className="w-full bg-transparent font-black text-xs uppercase outline-none focus:text-indigo-500"
                  placeholder="Title"
                />
                <textarea
                  value={f.desc}
                  onChange={(e) => {
                    const nf = [
                      ...data.content.features,
                    ];
                    nf[i].desc = e.target.value;
                    updateContent({ features: nf });
                  }}
                  className="w-full bg-transparent text-[10px] opacity-60 outline-none h-16 resize-none"
                  placeholder="Description"
                />
              </div>
            )
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Portfolio Showcase
            </label>
          </div>
          <button
            onClick={() =>
              updateContent({
                portfolio: [
                  ...(data.content.portfolio || []),
                  {
                    title: "New Project",
                    image: "",
                    category: "Dev",
                    live_url: "",
                    code_url: "",
                  },
                ],
              })
            }
            className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-6">
          {data.content.portfolio?.map(
            (p: any, i: number) => (
              <div
                key={i}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] space-y-4 relative group shadow-sm"
              >
                <button
                  onClick={() =>
                    updateContent({
                      portfolio:
                        data.content.portfolio.filter(
                          (_: any, idx: number) =>
                            idx !== i
                        ),
                    })
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl"
                >
                  <Trash2 size={14} />
                </button>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                  {uploadingId ===
                  `portfolio-${i}` ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
                      <Loader2
                        className="animate-spin text-indigo-500"
                        size={24}
                      />
                    </div>
                  ) : p.image ? (
                    <img
                      src={p.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon
                      className="absolute inset-0 m-auto text-slate-200"
                      size={32}
                    />
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(
                          e,
                          `portfolio-${i}`
                        )
                      }
                      accept="image/*"
                    />
                    <span className="text-white text-[10px] font-black uppercase">
                      Replace Image
                    </span>
                  </label>
                </div>
                <input
                  value={p.title}
                  onChange={(e) =>
                    updatePortfolio(
                      i,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent font-black text-sm uppercase outline-none focus:text-indigo-500"
                  placeholder="Project Name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 ml-1 uppercase">
                      Live URL
                    </p>
                    <input
                      value={p.live_url || ""}
                      onChange={(e) =>
                        updatePortfolio(
                          i,
                          "live_url",
                          e.target.value
                        )
                      }
                      placeholder="https://myproject.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2.5 text-[10px] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 ml-1 uppercase">
                      Code URL
                    </p>
                    <input
                      value={p.code_url || ""}
                      onChange={(e) =>
                        updatePortfolio(
                          i,
                          "code_url",
                          e.target.value
                        )
                      }
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2.5 text-[10px] outline-none"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Featured Quote
          </label>
        </div>
        <div className="space-y-4">
          <textarea
            value={
              data.content.testimonial?.text || ""
            }
            onChange={(e) =>
              updateContent({
                testimonial: {
                  ...data.content.testimonial,
                  text: e.target.value,
                },
              })
            }
            placeholder="The Quote..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-xs h-24 outline-none italic shadow-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={
                data.content.testimonial?.name || ""
              }
              onChange={(e) =>
                updateContent({
                  testimonial: {
                    ...data.content.testimonial,
                    name: e.target.value,
                  },
                })
              }
              placeholder="Person Name"
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none shadow-sm"
            />
            <input
              value={
                data.content.testimonial?.role || ""
              }
              onChange={(e) =>
                updateContent({
                  testimonial: {
                    ...data.content.testimonial,
                    role: e.target.value,
                  },
                })
              }
              placeholder="Role/Company"
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6 pb-20">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Contact Hub
          </label>
        </div>
        <input
          value={data.content.email || ""}
          onChange={(e) =>
            updateContent({ email: e.target.value })
          }
          placeholder="Business Email"
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-xs font-bold outline-none shadow-sm"
        />
        <input
          value={data.content.footer_text || ""}
          onChange={(e) =>
            updateContent({
              footer_text: e.target.value,
            })
          }
          placeholder="Footer Copyright Text"
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-xs outline-none shadow-sm"
        />
      </section>
    </div>
  );

  return (
    <div className="h-screen bg-white dark:bg-slate-950 flex overflow-hidden text-slate-900 dark:text-white transition-colors duration-500 font-sans">
      <aside className="w-[480px] border-r border-slate-100 dark:border-white/5 flex flex-col bg-slate-50/30 dark:bg-slate-900/30 backdrop-blur-3xl overflow-hidden shadow-2xl z-30">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-2xl transition-all"
            >
              <ChevronLeft
                size={20}
                className="text-slate-600 dark:text-slate-300"
              />
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">
                NEXUS EDITOR
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Version 10.3 Platinum
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-10 space-y-12 overflow-y-auto custom-scroll">
          <section className="space-y-8">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Identity Settings
              </label>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-slate-400 ml-2">
                  URL USERNAME
                </p>
                <input
                  value={data.username}
                  onChange={(e) =>
                    setData({
                      ...data,
                      username: e.target.value,
                    })
                  }
                  placeholder="yourname"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-black outline-none shadow-sm transition-all focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-slate-400 ml-2">
                  THEME MODE
                </p>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[1.5rem] shadow-sm">
                  <button
                    onClick={() =>
                      updateContent({
                        theme_mode: "light",
                      })
                    }
                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      data.content.theme_mode ===
                      "light"
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                        : "text-slate-400"
                    }`}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button
                    onClick={() =>
                      updateContent({
                        theme_mode: "dark",
                      })
                    }
                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      data.content.theme_mode ===
                      "dark"
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                        : "text-slate-400"
                    }`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-slate-400 ml-2">
                  ACCENT COLOR
                </p>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <input
                    type="color"
                    value={
                      data.content.color || "#6366f1"
                    }
                    onChange={(e) =>
                      updateContent({
                        color: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer bg-transparent border-none p-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {data.content.color ||
                        "#6366F1"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      Accent Branding
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

          {data.template_id === "bento"
            ? renderBentoControls()
            : data.template_id === "nexus"
            ? renderNexusControls()
            : renderStandardControls()}
        </div>

        <div className="p-10 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={handleDeploy}
            disabled={loading}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all active:scale-95 disabled:opacity-50 hover:bg-indigo-700"
          >
            {loading ? (
              <Loader2
                className="animate-spin mx-auto"
                size={24}
              />
            ) : (
              "DEPLOY YOUR IDENTITY"
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
        <div className="absolute top-10 flex bg-white dark:bg-slate-900 rounded-[2rem] p-2 shadow-2xl border border-slate-100 dark:border-white/5 z-20">
          <button
            onClick={() => setIsMobile(false)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] transition-all text-[10px] font-black uppercase ${
              !isMobile
                ? "bg-indigo-600 text-white shadow-xl"
                : "text-slate-400"
            }`}
          >
            <Monitor size={18} /> Desktop
          </button>
          <button
            onClick={() => setIsMobile(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] transition-all text-[10px] font-black uppercase ${
              isMobile
                ? "bg-indigo-600 text-white shadow-xl"
                : "text-slate-400"
            }`}
          >
            <Smartphone size={18} /> Mobile
          </button>
        </div>

        <motion.div
          animate={{
            width: isMobile ? 420 : "100%",
            height: isMobile ? 880 : "100%",
            borderRadius: isMobile
              ? "4.5rem"
              : "0px",
            scale: isMobile ? 0.85 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="shadow-2xl border-[16px] border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col items-center bg-white dark:bg-slate-900 transition-all duration-700"
        >
          <div className="w-full h-full overflow-hidden">
            <ActiveTemplate
              site={{
                ...data,
                content: data.content,
              }}
              isDark={
                data.content.theme_mode === "dark"
              }
              Icons={Icons}
              BtnIcons={ButtonIcons}
            />
          </div>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      </main>
    </div>
  );
}