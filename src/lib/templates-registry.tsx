import ClassicTemplate from "@/components/templates/ClassicTemplate";
import BentoTemplate from "@/components/templates/BentoTemplate";
import NexusLandingTemplate from "@/components/templates/NexusLandingTemplate";
import GlassTemplate from "@/components/templates/GlassTemplate";
import TerminalTemplate from "@/components/templates/TerminalTemplate";
import NotionTemplate from "@/components/templates/NotionTemplate";

/**
 * TEMPLATES_REGISTRY
 * الدليل الشامل والكامل لجميع القوالب المتاحة.
 * تأكد من أن أسماء ملفات الـ Components في مجلد templates تطابق الأسماء المستوردة هنا.
 */

export const TEMPLATES_REGISTRY: Record<string, any> = {
  // 1. القالب الكلاسيكي (Classic)
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

  // 2. قالب بينتو (Bento)
  bento: {
    id: "bento",
    name: "Bento Grid",
    category: "Modern",
    description: "An interactive grid-based layout inspired by Apple's design language.",
    component: BentoTemplate,
    features: ["tone"],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "dark",
      blocks: [
        {
          id: "b1",
          type: "profile",
          colSpan: 2,
          rowSpan: 2,
          data: {
            title: "Alex Morgan",
            bio: "Product Designer & Creative Developer",
            avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop"
          }
        },
        {
          id: "b2",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "github", url: "#" }
        },
        {
          id: "b3",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "x", url: "#" }
        },
        {
          id: "b4",
          type: "image",
          colSpan: 2,
          rowSpan: 1,
          data: {
            image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&h=400&fit=crop"
          }
        },
        {
          id: "b5",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Portfolio", url: "#", icon: "layout" }
        },
        {
          id: "b6",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Resume", url: "#", icon: "code" }
        },
        {
          id: "b7",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "linkedin", url: "#" }
        },
        {
          id: "b8",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "instagram", url: "#" }
        },
        {
          id: "b9",
          type: "image",
          colSpan: 2,
          rowSpan: 2,
          data: {
            image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&h=800&fit=crop"
          }
        },
        {
          id: "b10",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Contact", url: "#", icon: "mail" }
        },
        {
          id: "b11",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Projects", url: "#", icon: "zap" }
        }
      ]
    }
  },

  // 3. قالب نكسس (Nexus)
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
      sections_visibility: {
        hero: true,
        features: true,
        portfolio: true,
        testimonial: true,
        contact: true
      },
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
        { 
          title: "Nexus Platform", 
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
          category: "SaaS Design",
          live_url: "https://example.com",
          code_url: "https://github.com"
        },
        { 
          title: "E-Commerce OS", 
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
          category: "Development",
          live_url: "https://example.com",
          code_url: "" 
        }
      ],
      testimonial: {
        text: "The attention to detail is something I haven't seen elsewhere. Highly recommended.",
        name: "Sarah Johnson",
        role: "CEO at TechFlow"
      },
      email: "hello@nexus.studio",
      footer_text: "© 2026 NEXUS CORE. ALL RIGHTS RESERVED.",
      social_links: [
        { id: "1", platform: "x", url: "https://x.com" },
        { id: "2", platform: "instagram", url: "https://instagram.com" }
      ]
    }
  },

  // 4. قالب جلاس (Glass)
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

  // 5. قالب تيرمينال (Terminal)
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

  // 6. قالب نوشن (Notion Style)
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
};