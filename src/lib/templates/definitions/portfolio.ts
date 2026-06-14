import type { ConfigTemplateDefinition } from "@/types/template";
import { THEME_PRESETS } from "@/lib/templates/themes";

export const PORTFOLIO_TEMPLATES: ConfigTemplateDefinition[] = [
  {
    id: "dev-portfolio",
    name: "Developer Portfolio",
    category: "Portfolio",
    pageType: "portfolio",
    description:
      "A structured portfolio for developers. Showcase projects, skills, and contact info.",
    tier: "free",
    tags: ["developer", "portfolio", "projects", "code", "tech"],
    isFeatured: true,
    isNew: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.dark,
    sections: [
      { type: "hero", variant: "split", visible: true, order: 1 },
      { type: "features", variant: "grid", visible: true, order: 2 },
      { type: "gallery", variant: "grid", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "cta", variant: "banner", visible: true, order: 5 },
      { type: "social", variant: "minimal", visible: true, order: 6 },
      { type: "footer", variant: "detailed", visible: true, order: 7 },
    ],
    defaultContent: {
      color: "#818cf8",
      theme_mode: "dark",
      title: "Dev Name",
      bio: "Fullstack developer building modern web applications with React, Next.js, and TypeScript.",
      avatar_url: "",
      hero: {
        tagline: "Available for freelance",
        title: "Building the Web, One Component at a Time",
        subtitle:
          "Fullstack developer specializing in React, Next.js, and cloud-native architectures.",
      },
      features: [
        { title: "Frontend", desc: "React, Next.js, TypeScript, Tailwind CSS" },
        {
          title: "Backend",
          desc: "Node.js, PostgreSQL, Supabase, REST & GraphQL",
        },
        { title: "DevOps", desc: "Docker, CI/CD, Vercel, AWS" },
      ],
      portfolio: [
        {
          title: "SaaS Dashboard",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
          category: "Web App",
          live_url: "https://example.com",
          code_url: "https://github.com",
        },
        {
          title: "E-Commerce Platform",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
          category: "Fullstack",
          live_url: "https://example.com",
          code_url: "https://github.com",
        },
        {
          title: "Mobile App",
          image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
          category: "React Native",
          live_url: "",
          code_url: "https://github.com",
        },
        {
          title: "CLI Tool",
          image:
            "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800",
          category: "Open Source",
          live_url: "",
          code_url: "https://github.com",
        },
      ],
      testimonial: {
        text: "One of the most talented developers I've worked with. Delivers clean, performant code on time.",
        name: "Alex Chen",
        role: "CTO at StartupX",
      },
      email: "hello@devname.com",
      social_links: [
        { id: "1", platform: "github", url: "https://github.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
        { id: "3", platform: "x", url: "https://x.com" },
      ],
      links: [
        { id: "1", label: "View Resume", url: "https://", icon: "layout" },
        { id: "2", label: "Get in Touch", url: "https://", icon: "mail" },
      ],
      footer_text: "© 2025 Dev Name. Built with Next.js.",
    },
  },

  {
    id: "designer-showcase",
    name: "Designer Showcase",
    category: "Portfolio",
    pageType: "portfolio",
    description:
      "Visual-first portfolio for designers. Let your work do the talking.",
    tier: "premium",
    tags: ["designer", "visual", "creative", "showcase", "gallery"],
    isNew: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.clean,
    sections: [
      { type: "hero", variant: "centered", visible: true, order: 1 },
      { type: "gallery", variant: "masonry", visible: true, order: 2 },
      { type: "about", variant: "simple", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "contact", variant: "inline", visible: true, order: 5 },
      { type: "footer", variant: "simple", visible: true, order: 6 },
    ],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "light",
      title: "Designer Name",
      bio: "Visual designer crafting brand identities, digital products, and memorable experiences.",
      avatar_url: "",
      hero: {
        tagline: "Design Portfolio",
        title: "Crafting Visual Stories",
        subtitle: "Brand identity, UI/UX, and digital product design.",
      },
      portfolio: [
        {
          title: "Brand Identity",
          image:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
          category: "Branding",
          live_url: "https://example.com",
          code_url: "",
        },
        {
          title: "Mobile App UI",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
          category: "UI/UX",
          live_url: "https://example.com",
          code_url: "",
        },
        {
          title: "Website Redesign",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
          category: "Web Design",
          live_url: "https://example.com",
          code_url: "",
        },
      ],
      testimonial: {
        text: "Incredible eye for detail. The brand identity exceeded our expectations.",
        name: "Maria Santos",
        role: "Founder at BrandCo",
      },
      email: "hello@designername.com",
      social_links: [
        { id: "1", platform: "dribbble", url: "https://dribbble.com" },
        { id: "2", platform: "behance", url: "https://behance.net" },
        { id: "3", platform: "instagram", url: "https://instagram.com" },
      ],
      footer_text: "© 2025 Designer Name",
    },
  },

  {
    id: "photographer-grid",
    name: "Photographer Grid",
    category: "Portfolio",
    pageType: "portfolio",
    description:
      "Grid-based gallery layout optimized for photography portfolios.",
    tier: "premium",
    tags: ["photographer", "gallery", "grid", "visual", "photos"],
    schemaVersion: 1,
    theme: {
      ...THEME_PRESETS.dark,
      spacing: "compact",
      radius: "sm",
    },
    sections: [
      { type: "hero", variant: "minimal", visible: true, order: 1 },
      { type: "gallery", variant: "grid", visible: true, order: 2 },
      { type: "contact", variant: "boxed", visible: true, order: 3 },
      { type: "social", variant: "minimal", visible: true, order: 4 },
      { type: "footer", variant: "minimal", visible: true, order: 5 },
    ],
    defaultContent: {
      color: "#a78bfa",
      theme_mode: "dark",
      title: "Photographer Name",
      bio: "Capturing moments that matter.",
      avatar_url: "",
      portfolio: [
        {
          title: "Urban Series",
          image:
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800",
          category: "Street",
          live_url: "",
          code_url: "",
        },
        {
          title: "Portrait Collection",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
          category: "Portrait",
          live_url: "",
          code_url: "",
        },
        {
          title: "Nature & Landscape",
          image:
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
          category: "Landscape",
          live_url: "",
          code_url: "",
        },
        {
          title: "Event Coverage",
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
          category: "Events",
          live_url: "",
          code_url: "",
        },
      ],
      email: "bookings@photographer.com",
      social_links: [
        { id: "1", platform: "instagram", url: "https://instagram.com" },
        { id: "2", platform: "pinterest", url: "https://pinterest.com" },
      ],
    },
  },

  {
    id: "freelancer-landing",
    name: "Freelancer Landing",
    category: "Portfolio",
    pageType: "portfolio",
    description:
      "Professional landing page for freelancers. Services, work, and CTA all in one.",
    tier: "free",
    tags: ["freelancer", "professional", "services", "landing"],
    isFeatured: true,
    schemaVersion: 1,
    theme: THEME_PRESETS.startup,
    sections: [
      { type: "hero", variant: "split", visible: true, order: 1 },
      { type: "features", variant: "list", visible: true, order: 2 },
      { type: "gallery", variant: "grid", visible: true, order: 3 },
      { type: "testimonials", variant: "single", visible: true, order: 4 },
      { type: "cta", variant: "card", visible: true, order: 5 },
      { type: "footer", variant: "detailed", visible: true, order: 6 },
    ],
    defaultContent: {
      color: "#3b82f6",
      theme_mode: "light",
      title: "Freelancer Name",
      bio: "Independent consultant helping startups build better products.",
      avatar_url: "",
      hero: {
        tagline: "Freelance Consultant",
        title: "I Help Startups Ship Faster",
        subtitle:
          "Product strategy, design, and development. From idea to launch.",
      },
      features: [
        {
          title: "Product Strategy",
          desc: "Define your roadmap and prioritize features that matter.",
        },
        {
          title: "UI/UX Design",
          desc: "User-centered design that converts visitors into customers.",
        },
        {
          title: "Development",
          desc: "Clean, scalable code built with modern technologies.",
        },
      ],
      portfolio: [
        {
          title: "FinTech App",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
          category: "Product",
          live_url: "https://example.com",
          code_url: "",
        },
        {
          title: "Health Platform",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
          category: "SaaS",
          live_url: "https://example.com",
          code_url: "",
        },
      ],
      testimonial: {
        text: "Helped us launch 3x faster than our initial timeline. Highly recommend.",
        name: "James Wilson",
        role: "Co-Founder at HealthTech",
      },
      email: "hello@freelancer.com",
      social_links: [
        { id: "1", platform: "linkedin", url: "https://linkedin.com" },
        { id: "2", platform: "x", url: "https://x.com" },
      ],
      links: [{ id: "1", label: "Book a Call", url: "https://", icon: "mail" }],
      footer_text: "© 2025 Freelancer Name. All rights reserved.",
    },
  },
];
