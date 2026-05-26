"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { FormConfig } from "@/types/editor";

interface Props {
  siteId: string;
  config: FormConfig;
  accentColor?: string;
  darkMode?: boolean;
}

export default function DynamicContactForm({
  siteId,
  config,
  accentColor = "#6366f1",
  darkMode = false,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (id: string, val: string) =>
    setValues((p) => ({ ...p, [id]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const nameField = config.fields.find(
        (f) => f.type === "text" && f.label.toLowerCase().includes("name"),
      );
      const emailField = config.fields.find((f) => f.type === "email");
      const phoneField = config.fields.find((f) => f.type === "phone");
      const messageField = config.fields.find((f) => f.type === "textarea");

      const metadata: Record<string, string> = {};
      config.fields.forEach((field) => {
        if (values[field.id]) metadata[field.label] = values[field.id];
      });

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteId,
          name: nameField ? values[nameField.id] || null : null,
          email: emailField ? values[emailField.id] || "" : "",
          phone: phoneField ? values[phoneField.id] || null : null,
          message: messageField ? values[messageField.id] || null : null,
          source: "custom_form",
          metadata,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setValues({});
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit");
    }
  };

  if (status === "success") {
    return (
      <div
        className="text-center py-12 px-6 rounded-2xl"
        style={{
          backgroundColor: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
          border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          <CheckCircle size={32} />
        </div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: darkMode ? "#fff" : "#0f172a" }}
        >
          {config.success_message || "Message Sent!"}
        </h3>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold underline"
          style={{ color: accentColor }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#ffffff";
  const inputBorder = darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const inputColor = darkMode ? "#ffffff" : "#0f172a";
  const phColor = darkMode ? "rgba(255,255,255,0.3)" : "#94a3b8";
  const labelColor = darkMode ? "rgba(255,255,255,0.4)" : "#64748b";

  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    transition: "border-color 200ms",
    backgroundColor: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputColor,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.fields.map((field) => {
          const full = field.width === "full";

          return (
            <div key={field.id} className={full ? "sm:col-span-2" : ""}>
              <label
                className="block mb-2"
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: labelColor,
                }}
              >
                {field.label}
                {field.required && (
                  <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                  rows={4}
                  style={{ ...baseStyle, resize: "none" }}
                />
              ) : field.type === "select" ? (
                <select
                  value={values[field.id] || ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                  style={{
                    ...baseStyle,
                    color: values[field.id] ? inputColor : phColor,
                  }}
                >
                  <option value="">{field.placeholder}</option>
                  {(field.options || []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    field.type === "phone"
                      ? "tel"
                      : field.type === "date"
                        ? "date"
                        : field.type
                  }
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                  style={baseStyle}
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl text-white text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: accentColor }}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            {config.button_text || "Send Message"}
          </>
        )}
      </button>
    </form>
  );
}
