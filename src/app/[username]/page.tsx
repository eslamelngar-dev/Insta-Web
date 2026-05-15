import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteRenderer from "@/components/SiteRenderer";
import { Block } from "@/types";
import { AlertTriangle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("username", username)
    .single();

  if (!site) {
    return {
      title: "Not Found | Instaweb",
      description: "This page does not exist.",
    };
  }

  if (!site.is_published) {
    return {
      title: "Site Offline | Instaweb",
      description: "This site is currently offline or under maintenance.",
    };
  }

  const content = site.content || {};

  const title = site.title || content.hero?.title || `${username} - Instaweb`;
  const description =
    site.bio ||
    content.hero?.subtitle ||
    "Check out my personalized digital hub.";

  let ogImage = content.cover_url || content.avatar_url;

  if (!ogImage && content.blocks) {
    const imageBlock = content.blocks.find(
      (b: Block) => b.type === "image" || b.type === "profile",
    );
    if (imageBlock && imageBlock.data) {
      ogImage = imageBlock.data.image_url || imageBlock.data.avatar_url;
    }
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://instaweb.me/${username}`,
      siteName: "Instaweb",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function UserSite({ params }: Props) {
  const { username } = await params;

  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("username", username)
    .single();

  if (!site) {
    notFound();
  }

  if (!site.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-2xl shadow-indigo-500/20">
            <AlertTriangle size={40} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Site Offline
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            This digital node is currently unpublished or undergoing
            maintenance. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SiteRenderer site={site} templateId={site.template_id || "classic"} />
  );
}
