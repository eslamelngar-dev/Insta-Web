"use client";

import { useState } from "react";
import {
  GripVertical,
  Trash2,
  Plus,
  Settings2,
  ChevronDown,
  ChevronUp,
  Type,
  RotateCcw,
} from "lucide-react";
import { EditorSwitch } from "@/components/editor/shared/EditorSwitch";
import { useFormBuilder } from "@/hooks/editor/useFormBuilder";
import { FIELD_PRESETS } from "@/constants/form-fields";
import type { SiteContent, FormField } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  email: "Email",
  phone: "Phone",
  textarea: "Long Text",
  select: "Dropdown",
  date: "Date",
  url: "URL",
  number: "Number",
};

export function FormBuilderSection({ content, updateContent }: Props) {
  const {
    config,
    addField,
    addCustomField,
    removeField,
    updateField,
    reorderFields,
    updateFormSettings,
    toggleForm,
    resetForm,
  } = useFormBuilder(content, updateContent);

  const [showPresets, setShowPresets] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [customType, setCustomType] = useState<FormField["type"]>("text");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleAddCustom = () => {
    if (!customLabel.trim()) return;
    addCustomField(customLabel.trim(), customType);
    setCustomLabel("");
    setCustomType("text");
    setShowCustom(false);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.fields.length) return;
    reorderFields(index, newIndex);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    reorderFields(dragIndex, index);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const usedLabels = config.fields.map((f) => f.label);
  const availablePresets = FIELD_PRESETS.filter(
    (p) => !usedLabels.includes(p.label),
  );

  return (
    <section className="space-y-5 pb-40">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Contact Form
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
            Build your custom contact form
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: config.enabled ? "#6366f1" : "#94a3b8" }}
          >
            {config.enabled ? "On" : "Off"}
          </span>
          <EditorSwitch checked={config.enabled} onCheckedChange={toggleForm} />
        </div>
      </div>

      {config.enabled && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div
                className="w-1 h-4 rounded-full"
                style={{ backgroundColor: "#6366f1" }}
              />
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Form Settings
              </label>
            </div>

            <input
              value={config.title}
              onChange={(e) => updateFormSettings({ title: e.target.value })}
              placeholder="Form Title"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
            />

            <input
              value={config.description}
              onChange={(e) =>
                updateFormSettings({ description: e.target.value })
              }
              placeholder="Form Description"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={config.button_text}
                onChange={(e) =>
                  updateFormSettings({ button_text: e.target.value })
                }
                placeholder="Button Text"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
              />
              <input
                value={config.success_message}
                onChange={(e) =>
                  updateFormSettings({ success_message: e.target.value })
                }
                placeholder="Success Message"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: "#8b5cf6" }}
                />
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Fields ({config.fields.length})
                </label>
              </div>
              <button
                onClick={resetForm}
                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                style={{ color: "#94a3b8" }}
              >
                <RotateCcw size={10} />
                Reset
              </button>
            </div>

            {config.fields.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  No fields yet. Add some below.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {config.fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden transition-all"
                    style={{
                      opacity: dragIndex === index ? 0.5 : 1,
                    }}
                  >
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <GripVertical
                        size={14}
                        className="cursor-grab active:cursor-grabbing shrink-0"
                        style={{ color: "#94a3b8" }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {field.label}
                          </span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: "rgba(99,102,241,0.1)",
                              color: "#6366f1",
                            }}
                          >
                            {FIELD_TYPE_LABELS[field.type] || field.type}
                          </span>
                          {field.width === "half" && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: "rgba(34,197,94,0.1)",
                                color: "#22c55e",
                              }}
                            >
                              Half
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 mr-2">
                          <span
                            className="text-[9px] font-black uppercase"
                            style={{
                              color: field.required ? "#6366f1" : "#94a3b8",
                            }}
                          >
                            Req
                          </span>
                          <EditorSwitch
                            checked={field.required}
                            onCheckedChange={(v) =>
                              updateField(field.id, { required: v })
                            }
                          />
                        </div>

                        <button
                          onClick={() =>
                            setEditingFieldId(
                              editingFieldId === field.id ? null : field.id,
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                          style={{ color: "#94a3b8" }}
                        >
                          <Settings2 size={13} />
                        </button>

                        <button
                          onClick={() => moveField(index, "up")}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-20"
                          style={{ color: "#94a3b8" }}
                        >
                          <ChevronUp size={13} />
                        </button>

                        <button
                          onClick={() => moveField(index, "down")}
                          disabled={index === config.fields.length - 1}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-20"
                          style={{ color: "#94a3b8" }}
                        >
                          <ChevronDown size={13} />
                        </button>

                        <button
                          onClick={() => removeField(field.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          style={{ color: "#ef4444" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {editingFieldId === field.id && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-white/5 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={field.label}
                            onChange={(e) =>
                              updateField(field.id, {
                                label: e.target.value,
                              })
                            }
                            placeholder="Label"
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                          />
                          <input
                            value={field.placeholder}
                            onChange={(e) =>
                              updateField(field.id, {
                                placeholder: e.target.value,
                              })
                            }
                            placeholder="Placeholder"
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={field.width}
                            onChange={(e) =>
                              updateField(field.id, {
                                width: e.target.value as "full" | "half",
                              })
                            }
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-white outline-none flex-1"
                          >
                            <option value="full">Full Width</option>
                            <option value="half">Half Width</option>
                          </select>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              updateField(field.id, {
                                type: e.target.value as FormField["type"],
                              })
                            }
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-white outline-none flex-1"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="textarea">Long Text</option>
                            <option value="select">Dropdown</option>
                            <option value="date">Date</option>
                            <option value="url">URL</option>
                            <option value="number">Number</option>
                          </select>
                        </div>

                        {field.type === "select" && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Options (one per line)
                            </p>
                            <textarea
                              value={(field.options || [])
                                .map((o) => o.label)
                                .join("\n")}
                              onChange={(e) => {
                                const opts = e.target.value
                                  .split("\n")
                                  .filter((l) => l.trim())
                                  .map((l) => ({
                                    label: l.trim(),
                                    value: l
                                      .trim()
                                      .toLowerCase()
                                      .replace(/\s+/g, "_"),
                                  }));
                                updateField(field.id, { options: opts });
                              }}
                              rows={4}
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none"
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed transition-all"
              style={{
                borderColor: "rgba(99,102,241,0.3)",
                color: "#6366f1",
                backgroundColor: showPresets
                  ? "rgba(99,102,241,0.05)"
                  : "transparent",
              }}
            >
              <Plus size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Add Field
              </span>
            </button>

            {showPresets && (
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3 space-y-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Quick Add
                </p>
                <div className="flex flex-wrap gap-2">
                  {availablePresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        addField(preset);
                        setShowPresets(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <preset.icon size={14} style={{ color: preset.color }} />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-3">
                  <button
                    onClick={() => setShowCustom(!showCustom)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                    style={{ color: "#8b5cf6" }}
                  >
                    <Type size={12} />
                    Custom Field
                  </button>

                  {showCustom && (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        placeholder="Field name"
                        className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustom();
                        }}
                      />
                      <select
                        value={customType}
                        onChange={(e) =>
                          setCustomType(e.target.value as FormField["type"])
                        }
                        className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-2 text-[11px] text-slate-900 dark:text-white outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="textarea">Long Text</option>
                        <option value="select">Dropdown</option>
                        <option value="date">Date</option>
                        <option value="number">Number</option>
                      </select>
                      <button
                        onClick={handleAddCustom}
                        disabled={!customLabel.trim()}
                        className="px-3 py-2 rounded-lg text-white text-[10px] font-black disabled:opacity-40 transition-colors"
                        style={{ backgroundColor: "#6366f1" }}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{
              backgroundColor: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
              >
                <span className="text-sm">📬</span>
              </div>
              <div>
                <p
                  className="text-[11px] font-bold"
                  style={{ color: "#16a34a" }}
                >
                  Form submissions go to Leads
                </p>
                <p
                  className="text-[10px] mt-0.5 leading-relaxed"
                  style={{ color: "rgba(22,163,74,0.7)" }}
                >
                  All custom fields are saved. View them in Dashboard → Leads.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
