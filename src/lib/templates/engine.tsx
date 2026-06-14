import React from "react";
import type { TemplateConfig, TemplateProps } from "@/types";
import type { ConfigTemplateDefinition } from "@/types/template";
import ConfigRenderer from "@/components/templates/engine/ConfigRenderer";

export function buildConfigTemplateComponent(
  definition: ConfigTemplateDefinition,
): React.FC<TemplateProps> {
  const ConfigTemplateComponent: React.FC<TemplateProps> = (props) => {
    return <ConfigRenderer definition={definition} {...props} />;
  };

  ConfigTemplateComponent.displayName = `ConfigTemplate_${definition.id}`;

  return ConfigTemplateComponent;
}

export function buildConfigTemplates(
  definitions: ConfigTemplateDefinition[],
): Record<string, TemplateConfig> {
  const result: Record<string, TemplateConfig> = {};

  for (const def of definitions) {
    const editorFeatures: string[] = [];

    for (const section of def.sections) {
      if (!section.visible) continue;
      switch (section.type) {
        case "hero":
          editorFeatures.push("tone", "baseInfo");
          break;
        case "about":
          editorFeatures.push("baseInfo");
          break;
        case "links":
          editorFeatures.push("links");
          break;
        case "social":
          editorFeatures.push("social");
          break;
        case "features":
          editorFeatures.push("features");
          break;
        case "testimonials":
          editorFeatures.push("testimonial");
          break;
        case "gallery":
          editorFeatures.push("portfolio");
          break;
        case "contact":
          editorFeatures.push("contact");
          break;
      }
    }

    const uniqueFeatures = [...new Set(editorFeatures)];

    result[def.id] = {
      id: def.id,
      name: def.name,
      category: def.category,
      description: def.description,
      component: buildConfigTemplateComponent(def),
      features: uniqueFeatures,
      defaultContent: def.defaultContent,
      kind: "config",
      pageType: def.pageType,
      tier: def.tier,
      tags: def.tags,
      isNew: def.isNew,
      isFeatured: def.isFeatured,
      thumbnail: def.thumbnail,
      schemaVersion: def.schemaVersion,
    };
  }

  return result;
}
