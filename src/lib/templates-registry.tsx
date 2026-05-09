import ClassicTemplate from "@/components/templates/ClassicTemplate";
import BentoTemplate from "@/components/templates/BentoTemplate";
import NexusLandingTemplate from "@/components/templates/NexusLandingTemplate";

// ملاحظة: تأكد من وجود ملفات القوالب دي في components/templates
// لو لسه معملتش Glass أو Terminal ممكن تخليهم يشاوروا على Classic مؤقتاً

export const TEMPLATES_REGISTRY: Record<string, any> = {
  classic: {
    id: "classic",
    name: "Classic Identity",
    category: "Minimal",
    description: "The timeless profile link style. Clean, centered, and effective.",
    component: ClassicTemplate,
    features: ["tone", "avatar", "baseInfo", "social", "links"],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "light",
      title: "Eslam Elngar",
      bio: "Frontend Developer | React & Next.js Expert",
      avatar_url: "",
      social_links: [
        { id: "1", platform: "github", url: "https://github.com" },
        { id: "2", platform: "linkedin", url: "https://linkedin.com" }
      ],
      links: [
        { id: "1", label: "My Portfolio", url: "https://", icon: "globe" },
        { id: "2", label: "Read my Blog", url: "https://", icon: "zap" }
      ]
    }
  },

  bento: {
    id: "bento",
    name: "Bento Grid",
    category: "Modern",
    description: "An interactive grid-based layout inspired by Apple's design language.",
    component: BentoTemplate,
    features: ["tone"], // Bento بيعتمد على الـ Blocks أكتر من الـ Standard Features
    defaultContent: {
      color: "#f43f5e",
      theme_mode: "dark",
      blocks: [
        { 
          id: "1", 
          type: "profile", 
          colSpan: 2, 
          rowSpan: 2, 
          data: { title: "Your Name", bio: "Visual Designer & Developer", avatar_url: "" } 
        },
        { 
          id: "2", 
          type: "social", 
          colSpan: 1, 
          rowSpan: 1, 
          data: { platform: "github", url: "https://github.com" } 
        },
        { 
          id: "3", 
          type: "link", 
          colSpan: 1, 
          rowSpan: 1, 
          data: { label: "Project", url: "https://", icon: "link" } 
        }
      ]
    }
  },

  nexus: {
    id: "nexus",
    name: "Nexus Landing",
    category: "Professional",
    description: "High-end landing page with structured sections for businesses and agencies.",
    component: NexusLandingTemplate,
    features: ["tone", "hero", "features", "portfolio", "testimonial", "contact"],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "dark",
      hero: {
        tagline: "Currently open for new projects",
        title: "Digital Experiences That Matter",
        subtitle: "We build high-performance products that help you scale your business to the next level."
      },
      features: [
        { title: "Visual Strategy", desc: "Crafting unique visual languages for modern brands." },
        { title: "Web Performance", desc: "Fast, reliable, and SEO-optimized web architectures." },
        { title: "Product Growth", desc: "Strategic thinking to scale your business products." }
      ],
      portfolio: [
        { title: "Nexus Platform", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800" },
        { title: "E-Commerce OS", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800" }
      ],
      testimonial: {
        text: "The attention to detail is something I haven't seen elsewhere. Highly recommended.",
        name: "Sarah Johnson",
        role: "CEO at TechFlow",
        avatar: ""
      },
      email: "hello@nexus.studio",
      social_links: [
        { id: "1", platform: "x", url: "#" },
        { id: "2", platform: "instagram", url: "#" }
      ]
    }
  }
};