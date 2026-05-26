import { useCallback } from "react";
import type { FormField, FormConfig, SiteContent } from "@/types/editor";
import type { FieldPreset } from "@/constants/form-fields";
import { DEFAULT_FORM_CONFIG } from "@/constants/form-fields";

interface UseFormBuilderReturn {
  config: FormConfig;
  addField: (preset: FieldPreset) => void;
  addCustomField: (label: string, type: FormField["type"]) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  updateFormSettings: (updates: Partial<Omit<FormConfig, "fields">>) => void;
  toggleForm: (enabled: boolean) => void;
  resetForm: () => void;
}

function toFieldName(label: string) {
  const normalized = label
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || `field_${Date.now()}`;
}

export function useFormBuilder(
  content: SiteContent,
  updateContent: (updates: Partial<SiteContent>) => void,
): UseFormBuilderReturn {
  const config: FormConfig =
    content.form_config ?? (DEFAULT_FORM_CONFIG as FormConfig);

  const updateConfig = useCallback(
    (updates: Partial<FormConfig>) => {
      updateContent({
        form_config: {
          ...config,
          ...updates,
        },
      });
    },
    [config, updateContent],
  );

  const addField = useCallback(
    (preset: FieldPreset) => {
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: toFieldName(preset.label),
        type: preset.type,
        label: preset.label,
        placeholder: preset.placeholder,
        required: false,
        width: preset.width,
        options: preset.options,
      };

      updateConfig({
        fields: [...config.fields, newField],
      });
    },
    [config.fields, updateConfig],
  );

  const addCustomField = useCallback(
    (label: string, type: FormField["type"]) => {
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: toFieldName(label),
        type,
        label,
        placeholder: `Enter ${label.toLowerCase()}...`,
        required: false,
        width: "full",
      };

      updateConfig({
        fields: [...config.fields, newField],
      });
    },
    [config.fields, updateConfig],
  );

  const removeField = useCallback(
    (id: string) => {
      updateConfig({
        fields: config.fields.filter((field) => field.id !== id),
      });
    },
    [config.fields, updateConfig],
  );

  const updateField = useCallback(
    (id: string, updates: Partial<FormField>) => {
      updateConfig({
        fields: config.fields.map((field) =>
          field.id === id ? { ...field, ...updates } : field,
        ),
      });
    },
    [config.fields, updateConfig],
  );

  const reorderFields = useCallback(
    (fromIndex: number, toIndex: number) => {
      const nextFields = [...config.fields];
      const [moved] = nextFields.splice(fromIndex, 1);
      nextFields.splice(toIndex, 0, moved);

      updateConfig({
        fields: nextFields,
      });
    },
    [config.fields, updateConfig],
  );

  const updateFormSettings = useCallback(
    (updates: Partial<Omit<FormConfig, "fields">>) => {
      updateConfig(updates);
    },
    [updateConfig],
  );

  const toggleForm = useCallback(
    (enabled: boolean) => {
      updateConfig({ enabled });
    },
    [updateConfig],
  );

  const resetForm = useCallback(() => {
    updateContent({
      form_config: DEFAULT_FORM_CONFIG as FormConfig,
    });
  }, [updateContent]);

  return {
    config,
    addField,
    addCustomField,
    removeField,
    updateField,
    reorderFields,
    updateFormSettings,
    toggleForm,
    resetForm,
  };
}
