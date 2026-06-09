export type PlanType = "free" | "pro" | "business";

export interface UserProfile {
  id: string;
  email: string;
  plan: PlanType;
  created_at: string;
}

export type {
  BlockData,
  Block,
  SocialLink,
  LinkItem,
  Feature,
  PortfolioItem,
  Testimonial,
  HeroConfig,
  FormFieldType,
  FormFieldOption,
  FormField,
  FormConfig,
  SiteContent,
  SiteData,
  BentoBlockType,
  SaveToDatabaseFn,
  SaveStatus,
  UsernameStatus,
  MobileTab,
  MediaFile,
  TemplateProps,
  TemplateConfig,
} from "@/types/editor";
