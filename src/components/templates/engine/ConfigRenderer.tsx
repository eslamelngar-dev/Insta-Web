"use client";

import React from "react";
import type {
  ConfigTemplateDefinition,
  SectionType,
  SectionVariant,
} from "@/types/template";
import type { SiteContent, TemplateProps } from "@/types";
import {
  HeroSection,
  AboutSection,
  LinksSection,
  SocialSection,
  FeaturesSection,
  TestimonialsSection,
  GallerySection,
  CTASection,
  ContactSection,
  FooterSection,
} from "./sections";

const SECTION_COMPONENTS: Record<SectionType, React.FC<any>> = {
  hero: HeroSection,
  about: AboutSection,
  links: LinksSection,
  social: SocialSection,
  features: FeaturesSection,
  testimonials: TestimonialsSection,
  gallery: GallerySection,
  cta: CTASection,
  contact: ContactSection,
  footer: FooterSection,
};

interface ConfigRendererProps extends TemplateProps {
  definition: ConfigTemplateDefinition;
}

export default function ConfigRenderer({
  definition,
  site,
  Icons,
  BtnIcons,
}: ConfigRendererProps) {
  const content: SiteContent =
    (site as any).content || (site as SiteContent) || {};

  const visibleSections = definition.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        backgroundColor: definition.theme.colors.background,
        fontFamily: definition.theme.font.body,
      }}
    >
      {visibleSections.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[section.type];
        if (!SectionComponent) return null;

        return (
          <SectionComponent
            key={`${section.type}-${section.order}`}
            content={content}
            theme={definition.theme}
            variant={section.variant}
            Icons={Icons}
            BtnIcons={BtnIcons}
          />
        );
      })}
    </div>
  );
}
