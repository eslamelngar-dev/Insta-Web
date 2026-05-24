"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ContactFormProps {
  siteId: string;
  accentColor?: string;
  darkMode?: boolean;
  source?: string;
}

export default function ContactForm({
  siteId,
  accentColor = "#6366f1",
  darkMode = false,
  source = "contact_form",
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center py-12 px-6 rounded-2xl border ${
          darkMode
            ? "bg-white/5 border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <CheckCircle size={32} />
        </div>
        <h3
          className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Message Sent!
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold underline"
          style={{ color: accentColor }}
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle size={16} />
          {errorMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 ${
            darkMode
              ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/20"
              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
          }`}
          style={
            { "--tw-ring-color": `${accentColor}40` } as React.CSSProperties
          }
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 ${
            darkMode
              ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/20"
              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
          }`}
          style={
            { "--tw-ring-color": `${accentColor}40` } as React.CSSProperties
          }
          required
        />
      </div>

      <input
        type="tel"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 ${
          darkMode
            ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/20"
            : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
        }`}
        style={{ "--tw-ring-color": `${accentColor}40` } as React.CSSProperties}
      />

      <textarea
        placeholder="Your Message"
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 resize-none ${
          darkMode
            ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/20"
            : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
        }`}
        style={{ "--tw-ring-color": `${accentColor}40` } as React.CSSProperties}
        required
      />

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
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
