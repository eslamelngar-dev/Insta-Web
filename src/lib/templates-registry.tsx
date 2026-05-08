import ClassicTemplate from "@/components/templates/ClassicTemplate";
import BentoTemplate from "@/components/templates/BentoTemplate";
import NotionTemplate from "@/components/templates/NotionTemplate";
import TerminalTemplate from "@/components/templates/TerminalTemplate";
import GlassTemplate from "@/components/templates/GlassTemplate";
import React from "react";

export const TEMPLATES_REGISTRY: Record<string, any> = {
  classic: {
    id: "classic",
    name: "Classic Identity",
    category: "Social Card",
    description: "The gold standard stack. Exactly what you need.",
    component: ClassicTemplate,
    features: ["avatar", "tone", "baseInfo", "social", "links"],
    defaultContent: {
      title: "Eslam Elngar",
      bio: "Senior UI/UX Architect & Developer.",
      color: "#6366f1",
      theme_mode: "light",
      avatar_url: "",
      social_links: [
        { id: "1", platform: "github", url: "https://github.com" },
        { id: "2", platform: "x", url: "https://x.com" }
      ],
      links: [
        { id: "l1", label: "VIEW MY PORTFOLIO", url: "#", icon: "layout" },
        { id: "l2", label: "LATEST CASE STUDY", url: "#", icon: "zap" }
      ]
    }
  },
  notion: {
    id: "notion",
    name: "Notion Document",
    category: "Landing Page",
    description: "Clean, document-style layout with a cover image.",
    component: NotionTemplate,
    features: ["cover", "avatar", "tone", "baseInfo", "social", "links"],
    defaultContent: {
      title: "Eslam Elngar",
      bio: "Frontend Developer specializing in React.js, Next.js, and modern UI architectures.",
      color: "#191919",
      theme_mode: "light",
      avatar_url: "",
      cover_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
      social_links: [
        { id: "1", platform: "linkedin", url: "https://linkedin.com" },
        { id: "2", platform: "github", url: "https://github.com" }
      ],
      links: [
        { id: "l1", label: "Read My Resume", url: "#", icon: "layout" },
        { id: "l2", label: "Book a Consultation", url: "#", icon: "mail" }
      ]
    }
  },
  glass: {
    id: "glass",
    name: "Glassmorphism",
    category: "Premium",
    description: "Modern frosted glass effect with blur aesthetics.",
    component: GlassTemplate,
    features: ["cover", "avatar", "tone", "baseInfo", "social", "links"],
    defaultContent: {
      title: "Creative Studio",
      bio: "Digital Art & Cinematic Experiences.",
      color: "#ec4899",
      theme_mode: "dark",
      avatar_url: "",
      cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      social_links: [
        { id: "1", platform: "instagram", url: "https://instagram.com" },
        { id: "2", platform: "youtube", url: "https://youtube.com" }
      ],
      links: [
        { id: "l1", label: "Watch Showreel", url: "#", icon: "play" },
        { id: "l2", label: "Get in touch", url: "#", icon: "mail" }
      ]
    }
  },
  terminal: {
    id: "terminal",
    name: "Developer CLI",
    category: "Tech",
    description: "For the coders. Command-line interface aesthetic.",
    component: TerminalTemplate,
    features: ["avatar", "tone", "baseInfo", "social", "links"],
    defaultContent: {
      title: "Dev_Eslam",
      bio: "Fullstack Engineer. Compiling coffee into code.",
      color: "#22c55e",
      theme_mode: "dark",
      avatar_url: "",
      social_links: [
        { id: "1", platform: "github", url: "https://github.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" }
      ],
      links: [
        { id: "l1", label: "./view_source_code.sh", url: "#", icon: "code" },
        { id: "l2", label: "npm run contact", url: "#", icon: "mail" }
      ]
    }
  },
  bento: {
    id: "bento",
    name: "Bento Grid",
    category: "Portfolio",
    description: "Modern asymmetrical grid layout.",
    component: BentoTemplate,
    features: [],
    defaultContent: {
      color: "#f43f5e",
      theme_mode: "dark",
      blocks: [
        { id: "b1", type: "profile", colSpan: 2, rowSpan: 2, data: { title: "Aura Studio", bio: "Visual Arts & Creative Direction.", avatar_url: "" } },
        { id: "b2", type: "link", colSpan: 1, rowSpan: 1, data: { label: "PORTFOLIO", url: "#", icon: "layout" } },
        { id: "b3", type: "social", colSpan: 1, rowSpan: 1, data: { platform: "instagram", url: "#" } },
        { id: "b4", type: "image", colSpan: 2, rowSpan: 2, data: { image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" } }
      ]
    }
  }
};