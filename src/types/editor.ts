export interface BlockData {
  title?: string;
  bio?: string;
  avatar_url?: string;
  image_url?: string;
  label?: string;
  url?: string;
  icon?: string;
  platform?: string;
  lat?: number;
  lng?: number;
}

export interface Block {
  id: string;
  type: string;
  colSpan: number;
  rowSpan: number;
  data: BlockData;
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

export interface Hero {
  tagline?: string;
  title?: string;
  subtitle?: string;
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
  hero?: Hero;
  email?: string;
  footer_text?: string;
  sections_visibility?: Record<string, boolean>;
}

export interface SiteData {
  username: string;
  title: string;
  bio: string;
  template_id: string;
  content: SiteContent;
  is_published: boolean;
}

export interface BentoBlockType {
  type: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  desc: string;
  color: string;
  bg: string;
  glowColor: string;
  defaultColSpan: number;
  defaultRowSpan: number;
}

export type SaveToDatabaseFn = (
  showToast?: boolean,
  publishMode?: "draft" | "publish",
) => Promise<void>;

export type SaveStatus = "saved" | "saving" | "unsaved";
export type UsernameStatus = "idle" | "checking" | "available" | "taken";
export type MobileTab = "edit" | "preview";

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}
