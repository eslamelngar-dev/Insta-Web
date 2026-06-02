import type { FormFieldType } from "@/types/editor";

export interface FieldPreset {
  type: FormFieldType;
  label: string;
  iconName: string;
  color: string;
  placeholder: string;
  width: "full" | "half";
  options?: { label: string; value: string }[];
}

export const FIELD_PRESETS: FieldPreset[] = [
  {
    type: "text",
    label: "Full Name",
    iconName: "User",
    color: "#6366f1",
    placeholder: "John Doe",
    width: "half",
  },
  {
    type: "email",
    label: "Email",
    iconName: "Mail",
    color: "#3b82f6",
    placeholder: "john@example.com",
    width: "half",
  },
  {
    type: "phone",
    label: "Phone",
    iconName: "Smartphone",
    color: "#22c55e",
    placeholder: "+1 234 567 890",
    width: "half",
  },
  {
    type: "textarea",
    label: "Message",
    iconName: "MessageSquare",
    color: "#8b5cf6",
    placeholder: "Your message...",
    width: "full",
  },
  {
    type: "select",
    label: "Country",
    iconName: "Globe",
    color: "#f59e0b",
    placeholder: "Select country",
    width: "half",
    options: [
      { label: "United States", value: "us" },
      { label: "United Kingdom", value: "uk" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
      { label: "Egypt", value: "eg" },
      { label: "Saudi Arabia", value: "sa" },
      { label: "UAE", value: "ae" },
      { label: "Other", value: "other" },
    ],
  },
  {
    type: "date",
    label: "Date of Birth",
    iconName: "Cake",
    color: "#ec4899",
    placeholder: "Select date",
    width: "half",
  },
  {
    type: "text",
    label: "Company",
    iconName: "Building2",
    color: "#14b8a6",
    placeholder: "Company name",
    width: "half",
  },
  {
    type: "url",
    label: "Website",
    iconName: "Link",
    color: "#6366f1",
    placeholder: "https://example.com",
    width: "half",
  },
  {
    type: "select",
    label: "Budget",
    iconName: "DollarSign",
    color: "#22c55e",
    placeholder: "Select budget range",
    width: "half",
    options: [
      { label: "Under $1,000", value: "under_1k" },
      { label: "$1,000 - $5,000", value: "1k_5k" },
      { label: "$5,000 - $10,000", value: "5k_10k" },
      { label: "$10,000 - $25,000", value: "10k_25k" },
      { label: "$25,000+", value: "25k_plus" },
    ],
  },
  {
    type: "select",
    label: "How did you find us?",
    iconName: "SearchCheck",
    color: "#f97316",
    placeholder: "Select source",
    width: "full",
    options: [
      { label: "Google Search", value: "google" },
      { label: "Social Media", value: "social" },
      { label: "Referral", value: "referral" },
      { label: "Other", value: "other" },
    ],
  },
  {
    type: "number",
    label: "Team Size",
    iconName: "Users",
    color: "#8b5cf6",
    placeholder: "Number of people",
    width: "half",
  },
  {
    type: "text",
    label: "Job Title",
    iconName: "Briefcase",
    color: "#14b8a6",
    placeholder: "e.g. CEO, Developer",
    width: "half",
  },
];

export const DEFAULT_FORM_CONFIG = {
  enabled: true,
  title: "Get in Touch",
  description: "Fill in the form below and we'll get back to you shortly.",
  button_text: "Send Message",
  success_message: "Thank you! We'll get back to you soon.",
  fields: [
    {
      id: "field_name",
      name: "full_name",
      type: "text" as const,
      label: "Full Name",
      placeholder: "John Doe",
      required: true,
      width: "half" as const,
    },
    {
      id: "field_email",
      name: "email",
      type: "email" as const,
      label: "Email",
      placeholder: "john@example.com",
      required: true,
      width: "half" as const,
    },
    {
      id: "field_message",
      name: "message",
      type: "textarea" as const,
      label: "Message",
      placeholder: "Your message...",
      required: true,
      width: "full" as const,
    },
  ],
};
