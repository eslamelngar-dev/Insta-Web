import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteRenderer from "@/components/SiteRenderer";
import { Block } from "@/types";

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

  if (!site || !site.is_published) {
    return {
      title: "Not Found | Instaweb",
      description: "This page does not exist or is not published yet.",
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

  if (!site || !site.is_published) {
    notFound();
  }

  return (
    <SiteRenderer site={site} templateId={site.template_id || "classic"} />
  );
}
