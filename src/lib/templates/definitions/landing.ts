import type { ConfigTemplateDefinition } from "@/types/template";
import { THEME_PRESETS } from "@/lib/templates/themes";

export const LANDING_TEMPLATES: ConfigTemplateDefinition[] = [
  {
    id: "startup-landing",
    name: "Startup Landing",
    category: "Business",
    pageType: "landing",
    description: "High-converting landing page for startups and SaaS products.",
    tier: "premium",
    tags: ["startup", "saas", "business", "conversion", "landing"],
    isFeatured: true,
    isNew: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.startup,
    sections: [
      { type: "hero", variant: "centered", visible: true, order: 1 },
      { type: "features", variant: "grid", visible: true, order: 2 },
      { type: "testimonials", variant: "single", visible: true, order: 3 },
      { type: "cta", variant: "banner", visible: true, order: 4 },
      { type: "footer", variant: "detailed", visible: true, order: 5 },
    ],
    defaultContent: {
      color: "#3b82f6",
      theme_mode: "light",
      title: "Product Name",
      bio: "The all-in-one platform for modern teams.",
      hero: {
        tagline: "Now in Public Beta",
        title: "Build Better Products, Faster",
        subtitle:
          "The all-in-one platform that helps modern teams collaborate, ship, and grow.",
      },
      features: [
        {
          title: "Lightning Fast",
          desc: "Built for speed. Every interaction feels instant.",
        },
        {
          title: "Team Ready",
          desc: "Real-time collaboration built into every feature.",
        },
        {
          title: "Secure by Default",
          desc: "Enterprise-grade security without the complexity.",
        },
      ],
      testimonial: {
        text: "This product changed how our entire team works. We shipped 2x more features last quarter.",
        name: "David Kim",
        role: "VP Engineering at ScaleCo",
      },
      email: "hello@product.com",
      social_links: [
        { id: "1", platform: "x", url: "https://x.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
        { id: "3", platform: "github", url: "https://github.com" },
      ],
      links: [
        { id: "1", label: "Get Started Free", url: "https://", icon: "zap" },
        { id: "2", label: "View Demo", url: "https://", icon: "play" },
      ],
      footer_text: "© 2025 Product Name. All rights reserved.",
    },
  },

  {
    id: "consultant-profile",
    name: "Consultant Profile",
    category: "Business",
    pageType: "landing",
    description:
      "Professional profile page for consultants, coaches, and advisors.",
    tier: "free",
    tags: ["consultant", "coach", "advisor", "professional", "services"],
    schemaVersion: 1,
    theme: THEME_PRESETS.editorial,
    sections: [
      { type: "hero", variant: "split", visible: true, order: 1 },
      { type: "about", variant: "simple", visible: true, order: 2 },
      { type: "features", variant: "list", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "contact", variant: "split", visible: true, order: 5 },
      { type: "footer", variant: "simple", visible: true, order: 6 },
    ],
    defaultContent: {
      color: "#18181b",
      theme_mode: "light",
      title: "Consultant Name",
      bio: "15+ years helping businesses scale through strategic consulting and leadership coaching.",
      avatar_url: "",
      hero: {
        tagline: "Business Consultant",
        title: "Strategic Guidance for Growing Businesses",
        subtitle:
          "15+ years helping companies scale through actionable strategy and leadership development.",
      },
      features: [
        {
          title: "Strategic Planning",
          desc: "Develop clear roadmaps aligned with your business goals.",
        },
        {
          title: "Team Leadership",
          desc: "Build high-performing teams that deliver results.",
        },
        {
          title: "Growth Strategy",
          desc: "Identify and capitalize on market opportunities.",
        },
      ],
      testimonial: {
        text: "Transformed our approach to business development. Revenue grew 40% in the first year.",
        name: "Patricia Moore",
        role: "CEO at GrowthCorp",
      },
      email: "contact@consultant.com",
      social_links: [
        { id: "1", platform: "linkedin", url: "https://linkedin.com" },
        { id: "2", platform: "x", url: "https://x.com" },
      ],
      links: [
        { id: "1", label: "Book a Session", url: "https://", icon: "mail" },
      ],
      footer_text: "© 2025 Consultant Name",
    },
  },

  {
    id: "agency-dark",
    name: "Agency Dark",
    category: "Business",
    pageType: "landing",
    description: "Bold dark landing page for creative agencies and studios.",
    tier: "premium",
    tags: ["agency", "studio", "dark", "bold", "creative"],
    isNew: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.dark,
    sections: [
      { type: "hero", variant: "centered", visible: true, order: 1 },
      { type: "features", variant: "alternating", visible: true, order: 2 },
      { type: "gallery", variant: "grid", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "cta", variant: "banner", visible: true, order: 5 },
      { type: "social", variant: "minimal", visible: true, order: 6 },
      { type: "footer", variant: "detailed", visible: true, order: 7 },
    ],
    defaultContent: {
      color: "#818cf8",
      theme_mode: "dark",
      title: "Studio Name",
      bio: "We build digital products that people love.",
      hero: {
        tagline: "Creative Agency",
        title: "We Build Digital Products That People Love",
        subtitle: "Strategy, design, and engineering for ambitious brands.",
      },
      features: [
        {
          title: "Brand Strategy",
          desc: "Defining your market position and brand voice.",
        },
        {
          title: "Product Design",
          desc: "From wireframes to pixel-perfect interfaces.",
        },
        {
          title: "Engineering",
          desc: "Scalable applications built with cutting-edge technology.",
        },
      ],
      portfolio: [
        {
          title: "Finance Platform",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
          category: "FinTech",
          live_url: "https://example.com",
          code_url: "",
        },
        {
          title: "Health App",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
          category: "HealthTech",
          live_url: "https://example.com",
          code_url: "",
        },
      ],
      testimonial: {
        text: "They took our vision and turned it into a product our users genuinely love.",
        name: "Robert Chen",
        role: "Founder at AppFlow",
      },
      email: "hello@studio.com",
      social_links: [
        { id: "1", platform: "x", url: "https://x.com" },
        { id: "2", platform: "instagram", url: "https://instagram.com" },
        { id: "3", platform: "dribbble", url: "https://dribbble.com" },
      ],
      links: [
        { id: "1", label: "Start a Project", url: "https://", icon: "zap" },
      ],
      footer_text: "© 2025 Studio Name. All rights reserved.",
    },
  },

  {
    id: "ocean-landing",
    name: "Ocean Landing",
    category: "Business",
    pageType: "landing",
    description:
      "Deep ocean-inspired landing page with glass effects and gradient buttons.",
    tier: "premium",
    tags: ["ocean", "glass", "gradient", "premium", "dark"],
    schemaVersion: 1,
    theme: THEME_PRESETS.ocean,
    sections: [
      { type: "hero", variant: "gradient", visible: true, order: 1 },
      { type: "features", variant: "grid", visible: true, order: 2 },
      { type: "testimonials", variant: "single", visible: true, order: 3 },
      { type: "cta", variant: "card", visible: true, order: 4 },
      { type: "footer", variant: "simple", visible: true, order: 5 },
    ],
    defaultContent: {
      color: "#0ea5e9",
      theme_mode: "dark",
      title: "Product Name",
      bio: "Dive into the future of productivity.",
      hero: {
        tagline: "Launching Soon",
        title: "Dive Into the Future of Productivity",
        subtitle: "A new way to manage your work, your team, and your life.",
      },
      features: [
        {
          title: "Smart Automation",
          desc: "Let AI handle the repetitive work.",
        },
        {
          title: "Team Sync",
          desc: "Stay aligned without the endless meetings.",
        },
        {
          title: "Deep Analytics",
          desc: "Understand your workflow like never before.",
        },
      ],
      testimonial: {
        text: "Finally, a tool that actually saves time instead of adding complexity.",
        name: "Lisa Park",
        role: "Product Lead at FlowTeam",
      },
      email: "hello@product.com",
      social_links: [
        { id: "1", platform: "x", url: "https://x.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
      ],
      links: [
        { id: "1", label: "Join Waitlist", url: "https://", icon: "zap" },
      ],
      footer_text: "© 2025 Product Name",
    },
  },

  {
    id: "luxury-brand",
    name: "Luxury Brand",
    category: "Business",
    pageType: "landing",
    description:
      "Elegant gold-on-black design for luxury brands and premium services.",
    tier: "premium",
    tags: ["luxury", "gold", "elegant", "premium", "brand"],
    schemaVersion: 1,
    theme: THEME_PRESETS.luxury,
    sections: [
      { type: "hero", variant: "centered", visible: true, order: 1 },
      { type: "about", variant: "simple", visible: true, order: 2 },
      { type: "features", variant: "list", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "contact", variant: "boxed", visible: true, order: 5 },
      { type: "footer", variant: "minimal", visible: true, order: 6 },
    ],
    defaultContent: {
      color: "#d4af37",
      theme_mode: "dark",
      title: "Brand Name",
      bio: "Timeless elegance. Uncompromising quality.",
      hero: {
        tagline: "Est. 2020",
        title: "Timeless Elegance",
        subtitle: "Where craftsmanship meets contemporary design.",
      },
      features: [
        {
          title: "Bespoke Design",
          desc: "Every piece tailored to perfection.",
        },
        {
          title: "Premium Materials",
          desc: "Only the finest sourced worldwide.",
        },
        {
          title: "White Glove Service",
          desc: "Personalized attention at every step.",
        },
      ],
      testimonial: {
        text: "An unparalleled experience from start to finish. True luxury.",
        name: "Catherine Laurent",
        role: "Private Client",
      },
      email: "concierge@brand.com",
      social_links: [
        { id: "1", platform: "instagram", url: "https://instagram.com" },
      ],
      footer_text: "© 2025 Brand Name. All rights reserved.",
    },
  },
];
