import ClassicTemplate from "@/components/templates/ClassicTemplate";
import BentoTemplate from "@/components/templates/BentoTemplate";
import React from "react";

export const TEMPLATES_REGISTRY: Record<string, any> = {
  classic: {
    id: "classic",
    name: "Classic Identity",
    category: "Social Card",
    description: "The gold standard stack. Exactly what you need.",
    component: ClassicTemplate,
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
  bento: {
    id: "bento",
    name: "Bento Grid",
    category: "Portfolio",
    description: "Modern asymmetrical grid layout.",
    component: BentoTemplate,
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