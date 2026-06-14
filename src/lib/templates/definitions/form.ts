import type { ConfigTemplateDefinition } from "@/types/template";
import { THEME_PRESETS } from "@/lib/templates/themes";

export const FORM_TEMPLATES: ConfigTemplateDefinition[] = [
  {
    id: "contact-simple",
    name: "Simple Contact",
    category: "Form",
    pageType: "form",
    description:
      "A straightforward contact page with your info and a clean form.",
    tier: "free",
    tags: ["contact", "form", "simple", "clean"],
    isNew: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.clean,
    sections: [
      { type: "hero", variant: "profile", visible: true, order: 1 },
      { type: "contact", variant: "split", visible: true, order: 2 },
      { type: "social", variant: "minimal", visible: true, order: 3 },
      { type: "footer", variant: "minimal", visible: true, order: 4 },
    ],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "light",
      title: "Your Name",
      bio: "I'd love to hear from you. Send me a message and I'll get back within 24 hours.",
      avatar_url: "",
      email: "hello@yourname.com",
      social_links: [
        { id: "1", platform: "linkedin", url: "https://linkedin.com" },
        { id: "2", platform: "x", url: "https://x.com" },
      ],
      footer_text: "Made with InstaWeb",
    },
  },

  {
    id: "lead-capture",
    name: "Lead Capture",
    category: "Form",
    pageType: "form",
    description:
      "High-conversion lead capture page with compelling CTA and form.",
    tier: "premium",
    tags: ["lead", "capture", "conversion", "marketing", "form"],
    isFeatured: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.startup,
    sections: [
      { type: "hero", variant: "centered", visible: true, order: 1 },
      { type: "features", variant: "grid", visible: true, order: 2 },
      { type: "contact", variant: "boxed", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "footer", variant: "minimal", visible: true, order: 5 },
    ],
    defaultContent: {
      color: "#3b82f6",
      theme_mode: "light",
      title: "Product Name",
      bio: "Join 10,000+ professionals who trust us.",
      hero: {
        tagline: "Free Download",
        title: "Get the Ultimate Guide to Growth",
        subtitle:
          "Learn the strategies that top companies use to 10x their revenue.",
      },
      features: [
        {
          title: "Actionable Insights",
          desc: "No fluff. Just proven strategies you can implement today.",
        },
        {
          title: "Case Studies",
          desc: "Real examples from companies that achieved 10x growth.",
        },
        {
          title: "Templates Included",
          desc: "Ready-to-use templates to get started immediately.",
        },
      ],
      testimonial: {
        text: "This guide completely changed our approach to growth. Must read.",
        name: "Sarah Mitchell",
        role: "Marketing Director at GrowthLab",
      },
      email: "team@product.com",
      social_links: [
        { id: "1", platform: "x", url: "https://x.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
      ],
      footer_text: "© 2025 Product Name",
    },
  },

  {
    id: "dark-contact",
    name: "Dark Contact",
    category: "Form",
    pageType: "form",
    description: "Moody dark contact page with a professional split layout.",
    tier: "free",
    tags: ["dark", "contact", "form", "professional", "split"],
    schemaVersion: 1,
    theme: THEME_PRESETS.midnight,
    sections: [
      { type: "hero", variant: "minimal", visible: true, order: 1 },
      { type: "contact", variant: "split", visible: true, order: 2 },
      { type: "social", variant: "minimal", visible: true, order: 3 },
      { type: "footer", variant: "minimal", visible: true, order: 4 },
    ],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "dark",
      title: "Your Name",
      bio: "Let's discuss your next project.",
      avatar_url: "",
      email: "hello@yourname.com",
      social_links: [
        { id: "1", platform: "github", url: "https://github.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
      ],
    },
  },
];
