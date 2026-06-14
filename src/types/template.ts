import type { PageType, TemplateTier, SiteContent } from "@/types";

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  };
  radius: "none" | "sm" | "md" | "lg" | "xl" | "full";
  spacing: "compact" | "normal" | "spacious";
  shadow: "none" | "sm" | "md" | "lg";
  font: {
    heading: string;
    body: string;
  };
  buttonStyle: "solid" | "outline" | "ghost" | "gradient";
  cardStyle: "flat" | "elevated" | "bordered" | "glass";
  mode: "light" | "dark";
}

export type SectionType =
  | "hero"
  | "about"
  | "links"
  | "social"
  | "features"
  | "testimonials"
  | "gallery"
  | "cta"
  | "contact"
  | "footer";

export type HeroVariant =
  | "centered"
  | "split"
  | "profile"
  | "minimal"
  | "gradient";

export type AboutVariant = "simple" | "cards" | "timeline";

export type LinksVariant = "list" | "grid" | "cards";

export type SocialVariant = "icons" | "cards" | "minimal";

export type FeaturesVariant = "grid" | "list" | "alternating";

export type TestimonialsVariant = "single" | "carousel" | "grid";

export type GalleryVariant = "grid" | "masonry" | "slider";

export type CTAVariant = "banner" | "card" | "minimal";

export type ContactVariant = "inline" | "split" | "boxed";

export type FooterVariant = "simple" | "detailed" | "minimal";

export type SectionVariant =
  | HeroVariant
  | AboutVariant
  | LinksVariant
  | SocialVariant
  | FeaturesVariant
  | TestimonialsVariant
  | GalleryVariant
  | CTAVariant
  | ContactVariant
  | FooterVariant;

export interface SectionDefinition {
  type: SectionType;
  variant: SectionVariant;
  visible: boolean;
  order: number;
}

export interface ConfigTemplateDefinition {
  id: string;
  name: string;
  category: string;
  pageType: PageType;
  description: string;
  tier: TemplateTier;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  thumbnail?: string;
  theme: ThemeTokens;
  sections: SectionDefinition[];
  defaultContent: SiteContent;
  schemaVersion: number;
}

export interface SectionProps {
  content: SiteContent;
  theme: ThemeTokens;
  variant: SectionVariant;
  Icons?: Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;
  BtnIcons?: Record<string, React.FC<React.ComponentProps<"svg">>>;
}
