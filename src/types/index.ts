import React from "react";

export type PlanType = "free" | "pro" | "business";

export interface UserProfile {
  id: string;
  email: string;
  plan: PlanType;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface BlockData {
  title?: string;
  bio?: string;
  avatar_url?: string;
  image_url?: string;
  label?: string;
  url?: string;
  icon?: string;
  platform?: string;
}

export interface Block {
  id: string;
  type: "profile" | "link" | "image" | "social" | string;
  colSpan: number;
  rowSpan: number;
  data: BlockData;
}

export interface HeroConfig {
  tagline?: string;
  title?: string;
  subtitle?: string;
}

export interface Feature {
  title: string;
  desc: string;
}

export interface PortfolioItem {
  title: string;
  image: string;
  category: string;
  live_url: string;
  code_url: string;
}

export interface Testimonial {
  text: string;
  name: string;
  role: string;
}

export interface SiteContent {
  title?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  color?: string;
  theme_mode?: string;
  social_links?: SocialLink[];
  links?: LinkItem[];
  blocks?: Block[];
  features?: Feature[];
  portfolio?: PortfolioItem[];
  testimonial?: Testimonial;
  hero?: HeroConfig;
  email?: string;
  footer_text?: string;
  sections_visibility?: Record<string, boolean>;
}

export interface SiteData {
  id?: string;
  user_id?: string;
  username: string;
  title: string;
  bio: string;
  primary_color?: string;
  template_id: string;
  profile_image?: string;
  content: SiteContent;
  is_published?: boolean;
}

export interface TemplateProps {
  site: Partial<SiteData> | { content: SiteContent };
  isDark?: boolean;
  Icons?: Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;
  BtnIcons?: Record<string, React.FC<React.ComponentProps<"svg">>>;
}

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.FC<TemplateProps>;
  features: string[];
  defaultContent: SiteContent;
}
