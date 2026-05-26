import ClassicTemplate from "@/components/templates/ClassicTemplate";
import BentoTemplate from "@/components/templates/BentoTemplate";
import NexusLandingTemplate from "@/components/templates/NexusLandingTemplate";
import GlassTemplate from "@/components/templates/GlassTemplate";
import TerminalTemplate from "@/components/templates/TerminalTemplate";
import NotionTemplate from "@/components/templates/NotionTemplate";
import FormCraftTemplate from "@/components/templates/FormCraftTemplate";
import { TemplateConfig } from "@/types";

export const TEMPLATES_REGISTRY: Record<string, TemplateConfig> = {
  classic: {
    id: "classic",
    name: "Classic Identity",
    category: "Social Card",
    description:
      "The timeless profile link style. Clean, centered, and effective.",
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
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
      ],
      links: [
        { id: "1", label: "My Portfolio", url: "https://", icon: "globe" },
        { id: "2", label: "Read my Blog", url: "https://", icon: "zap" },
      ],
    },
  },

  bento: {
    id: "bento",
    name: "Bento Grid",
    category: "Bento",
    description:
      "An interactive grid-based layout inspired by Apple's design language.",
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
            title: "Eslam Elngar",
            bio: "Frontend Developer & UI Engineer",
            avatar_url:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop",
          },
        },
        {
          id: "b2",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "github", url: "#" },
        },
        {
          id: "b3",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "x", url: "#" },
        },
        {
          id: "b4",
          type: "image",
          colSpan: 2,
          rowSpan: 1,
          data: {
            image_url:
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&h=400&fit=crop",
          },
        },
        {
          id: "b5",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Portfolio", url: "#", icon: "layout" },
        },
        {
          id: "b6",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Resume", url: "#", icon: "code" },
        },
        {
          id: "b7",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "linkedin", url: "#" },
        },
        {
          id: "b8",
          type: "social",
          colSpan: 1,
          rowSpan: 1,
          data: { platform: "instagram", url: "#" },
        },
        {
          id: "b9",
          type: "image",
          colSpan: 2,
          rowSpan: 2,
          data: {
            image_url:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&h=800&fit=crop",
          },
        },
        {
          id: "b10",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Contact", url: "#", icon: "mail" },
        },
        {
          id: "b11",
          type: "link",
          colSpan: 1,
          rowSpan: 1,
          data: { label: "Projects", url: "#", icon: "zap" },
        },
      ],
    },
  },

  nexus: {
    id: "nexus",
    name: "Nexus Landing",
    category: "Portfolio",
    description:
      "High-end landing page with structured sections for businesses and agencies.",
    component: NexusLandingTemplate,
    features: [
      "tone",
      "hero",
      "features",
      "portfolio",
      "testimonial",
      "contact",
    ],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "dark",
      sections_visibility: {
        hero: true,
        features: true,
        portfolio: true,
        testimonial: true,
        contact: true,
      },
      hero: {
        tagline: "Currently open for new projects",
        title: "Digital Experiences That Matter",
        subtitle:
          "We build high-performance products that help you scale your business to the next level.",
      },
      features: [
        {
          title: "Visual Strategy",
          desc: "Crafting unique visual languages for modern brands.",
        },
        {
          title: "Web Performance",
          desc: "Fast, reliable, and SEO-optimized web architectures.",
        },
        {
          title: "Product Growth",
          desc: "Strategic thinking to scale your business products.",
        },
      ],
      portfolio: [
        {
          title: "Nexus Platform",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
          category: "SaaS Design",
          live_url: "https://example.com",
          code_url: "https://github.com",
        },
        {
          title: "E-Commerce OS",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
          category: "Development",
          live_url: "https://example.com",
          code_url: "",
        },
      ],
      testimonial: {
        text: "The attention to detail is something I haven't seen elsewhere. Highly recommended.",
        name: "Sarah Johnson",
        role: "CEO at TechFlow",
      },
      email: "hello@nexus.studio",
      footer_text: "© 2026 NEXUS CORE. ALL RIGHTS RESERVED.",
      social_links: [
        { id: "1", platform: "x", url: "https://x.com" },
        { id: "2", platform: "instagram", url: "https://instagram.com" },
      ],
    },
  },

  glass: {
    id: "glass",
    name: "Glassmorphism",
    category: "Social Card",
    description: "Modern frosted glass effect with blur aesthetics.",
    component: GlassTemplate,
    features: ["cover", "avatar", "tone", "baseInfo", "social", "links"],
    defaultContent: {
      title: "Creative Studio",
      bio: "Digital Art & Cinematic Experiences.",
      color: "#ec4899",
      theme_mode: "dark",
      avatar_url: "",
      cover_url:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      social_links: [
        { id: "1", platform: "instagram", url: "https://instagram.com" },
        { id: "2", platform: "youtube", url: "https://youtube.com" },
      ],
      links: [
        { id: "l1", label: "Watch Showreel", url: "#", icon: "play" },
        { id: "l2", label: "Get in touch", url: "#", icon: "mail" },
      ],
    },
  },

  terminal: {
    id: "terminal",
    name: "Developer CLI",
    category: "Social Card",
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
        { id: "2", platform: "linkedin", url: "https://linkedin.com" },
      ],
      links: [
        { id: "l1", label: "./view_source_code.sh", url: "#", icon: "code" },
        { id: "l2", label: "npm run contact", url: "#", icon: "mail" },
      ],
    },
  },

  notion: {
    id: "notion",
    name: "Notion Document",
    category: "Social Card",
    description: "Clean, document-style layout with a cover image.",
    component: NotionTemplate,
    features: ["cover", "avatar", "tone", "baseInfo", "social", "links"],
    defaultContent: {
      title: "Eslam Elngar",
      bio: "Frontend Developer specializing in React.js, Next.js, and modern UI architectures.",
      color: "#191919",
      theme_mode: "light",
      avatar_url: "",
      cover_url:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
      social_links: [
        { id: "1", platform: "linkedin", url: "https://linkedin.com" },
        { id: "2", platform: "github", url: "https://github.com" },
      ],
      links: [
        { id: "l1", label: "Read My Resume", url: "#", icon: "layout" },
        { id: "l2", label: "Book a Consultation", url: "#", icon: "mail" },
      ],
    },
  },

  formcraft: {
    id: "formcraft",
    name: "FormCraft",
    category: "Form",
    description:
      "A dedicated form page. Build custom contact forms with drag & drop fields.",
    component: FormCraftTemplate,
    features: ["tone", "avatar", "baseInfo"],
    defaultContent: {
      color: "#6366f1",
      theme_mode: "dark",
      title: "FormCraft",
      bio: "Open for new projects",
      avatar_url: "",
      email: "hello@formcraft.co",
      footer_text: "Powered by InstaWeb",
      form_config: {
        enabled: true,
        title: "Get in Touch",
        description:
          "Fill in the form below and we'll get back to you within 24 hours.",
        button_text: "Send Message",
        success_message: "Thank you! We'll be in touch soon.",
        fields: [
          {
            id: "field_name",
            name: "full_name",
            type: "text",
            label: "Full Name",
            placeholder: "John Doe",
            required: true,
            width: "half",
          },
          {
            id: "field_email",
            name: "email",
            type: "email",
            label: "Email",
            placeholder: "john@example.com",
            required: true,
            width: "half",
          },
          {
            id: "field_company",
            name: "company",
            type: "text",
            label: "Company",
            placeholder: "Company name",
            required: false,
            width: "half",
          },
          {
            id: "field_budget",
            name: "budget",
            type: "select",
            label: "Budget",
            placeholder: "Select budget range",
            required: false,
            width: "half",
            options: [
              { label: "Under $1,000", value: "under_1k" },
              { label: "$1,000 - $5,000", value: "1k_5k" },
              { label: "$5,000 - $10,000", value: "5k_10k" },
              { label: "$10,000+", value: "10k_plus" },
            ],
          },
          {
            id: "field_message",
            name: "message",
            type: "textarea",
            label: "Message",
            placeholder: "Tell us about your project...",
            required: true,
            width: "full",
          },
        ],
      },
    },
  },
};
