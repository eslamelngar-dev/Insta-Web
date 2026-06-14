import type { ThemeTokens } from "@/types/template";

export const THEME_PRESETS: Record<string, ThemeTokens> = {
  clean: {
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
    },
    radius: "xl",
    spacing: "normal",
    shadow: "sm",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "bordered",
    mode: "light",
  },

  dark: {
    colors: {
      primary: "#818cf8",
      secondary: "#a78bfa",
      accent: "#22d3ee",
      background: "#0d1117",
      surface: "#161b22",
      text: "#f0f6fc",
      textMuted: "#8b949e",
      border: "#21262d",
    },
    radius: "xl",
    spacing: "normal",
    shadow: "md",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "elevated",
    mode: "dark",
  },

  glass: {
    colors: {
      primary: "#ec4899",
      secondary: "#f472b6",
      accent: "#a855f7",
      background: "#0f0a1a",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#ffffff",
      textMuted: "#a1a1aa",
      border: "rgba(255, 255, 255, 0.1)",
    },
    radius: "xl",
    spacing: "spacious",
    shadow: "lg",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "outline",
    cardStyle: "glass",
    mode: "dark",
  },

  luxury: {
    colors: {
      primary: "#d4af37",
      secondary: "#b8860b",
      accent: "#ffd700",
      background: "#0a0a0a",
      surface: "#141414",
      text: "#fafafa",
      textMuted: "#a3a3a3",
      border: "#262626",
    },
    radius: "sm",
    spacing: "spacious",
    shadow: "lg",
    font: {
      heading: "Georgia, 'Times New Roman', serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "outline",
    cardStyle: "bordered",
    mode: "dark",
  },

  startup: {
    colors: {
      primary: "#3b82f6",
      secondary: "#2563eb",
      accent: "#10b981",
      background: "#ffffff",
      surface: "#f1f5f9",
      text: "#1e293b",
      textMuted: "#475569",
      border: "#e2e8f0",
    },
    radius: "lg",
    spacing: "normal",
    shadow: "md",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "elevated",
    mode: "light",
  },

  editorial: {
    colors: {
      primary: "#18181b",
      secondary: "#3f3f46",
      accent: "#ef4444",
      background: "#fafaf9",
      surface: "#f5f5f4",
      text: "#1c1917",
      textMuted: "#78716c",
      border: "#e7e5e4",
    },
    radius: "none",
    spacing: "spacious",
    shadow: "none",
    font: {
      heading: "Georgia, 'Times New Roman', serif",
      body: "Georgia, 'Times New Roman', serif",
    },
    buttonStyle: "outline",
    cardStyle: "flat",
    mode: "light",
  },

  neon: {
    colors: {
      primary: "#00ff88",
      secondary: "#00cc6a",
      accent: "#ff00ff",
      background: "#0a0a0a",
      surface: "#111111",
      text: "#00ff88",
      textMuted: "#00cc6a80",
      border: "#00ff8820",
    },
    radius: "md",
    spacing: "normal",
    shadow: "lg",
    font: {
      heading: "'Courier New', monospace",
      body: "'Courier New', monospace",
    },
    buttonStyle: "outline",
    cardStyle: "bordered",
    mode: "dark",
  },

  earthy: {
    colors: {
      primary: "#92400e",
      secondary: "#78350f",
      accent: "#059669",
      background: "#fffbeb",
      surface: "#fef3c7",
      text: "#451a03",
      textMuted: "#92400e",
      border: "#fde68a",
    },
    radius: "lg",
    spacing: "spacious",
    shadow: "sm",
    font: {
      heading: "Georgia, 'Times New Roman', serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "flat",
    mode: "light",
  },

  mono: {
    colors: {
      primary: "#525252",
      secondary: "#404040",
      accent: "#737373",
      background: "#fafafa",
      surface: "#f5f5f5",
      text: "#171717",
      textMuted: "#737373",
      border: "#e5e5e5",
    },
    radius: "md",
    spacing: "normal",
    shadow: "sm",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "outline",
    cardStyle: "bordered",
    mode: "light",
  },

  ocean: {
    colors: {
      primary: "#0ea5e9",
      secondary: "#0284c7",
      accent: "#06b6d4",
      background: "#0c1222",
      surface: "#131d30",
      text: "#e0f2fe",
      textMuted: "#7dd3fc",
      border: "#1e3a5f",
    },
    radius: "xl",
    spacing: "normal",
    shadow: "md",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "gradient",
    cardStyle: "glass",
    mode: "dark",
  },

  sunset: {
    colors: {
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#f43f5e",
      background: "#1a0a00",
      surface: "#2d1508",
      text: "#fff7ed",
      textMuted: "#fdba74",
      border: "#431407",
    },
    radius: "xl",
    spacing: "spacious",
    shadow: "lg",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "gradient",
    cardStyle: "elevated",
    mode: "dark",
  },

  forest: {
    colors: {
      primary: "#16a34a",
      secondary: "#15803d",
      accent: "#84cc16",
      background: "#052e16",
      surface: "#0a3d1f",
      text: "#f0fdf4",
      textMuted: "#86efac",
      border: "#14532d",
    },
    radius: "lg",
    spacing: "normal",
    shadow: "md",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "bordered",
    mode: "dark",
  },

  arctic: {
    colors: {
      primary: "#7c3aed",
      secondary: "#6d28d9",
      accent: "#a78bfa",
      background: "#f5f3ff",
      surface: "#ede9fe",
      text: "#1e1b4b",
      textMuted: "#6b7280",
      border: "#ddd6fe",
    },
    radius: "xl",
    spacing: "spacious",
    shadow: "sm",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "elevated",
    mode: "light",
  },

  brutalist: {
    colors: {
      primary: "#000000",
      secondary: "#1a1a1a",
      accent: "#ff0000",
      background: "#ffffff",
      surface: "#f0f0f0",
      text: "#000000",
      textMuted: "#666666",
      border: "#000000",
    },
    radius: "none",
    spacing: "compact",
    shadow: "none",
    font: {
      heading: "'Courier New', monospace",
      body: "'Courier New', monospace",
    },
    buttonStyle: "outline",
    cardStyle: "bordered",
    mode: "light",
  },

  rose: {
    colors: {
      primary: "#e11d48",
      secondary: "#be123c",
      accent: "#fb7185",
      background: "#fff1f2",
      surface: "#ffe4e6",
      text: "#4c0519",
      textMuted: "#9f1239",
      border: "#fecdd3",
    },
    radius: "xl",
    spacing: "spacious",
    shadow: "sm",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "solid",
    cardStyle: "elevated",
    mode: "light",
  },

  midnight: {
    colors: {
      primary: "#6366f1",
      secondary: "#4f46e5",
      accent: "#f472b6",
      background: "#020617",
      surface: "#0f172a",
      text: "#f8fafc",
      textMuted: "#94a3b8",
      border: "#1e293b",
    },
    radius: "lg",
    spacing: "normal",
    shadow: "lg",
    font: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    buttonStyle: "gradient",
    cardStyle: "glass",
    mode: "dark",
  },
};

export function getTheme(themeId: string): ThemeTokens {
  return THEME_PRESETS[themeId] ?? THEME_PRESETS.clean;
}

export function getSpacingValue(spacing: ThemeTokens["spacing"]): {
  section: string;
  element: string;
  inner: string;
} {
  switch (spacing) {
    case "compact":
      return { section: "py-12", element: "gap-4", inner: "p-4" };
    case "spacious":
      return { section: "py-24", element: "gap-8", inner: "p-8" };
    default:
      return { section: "py-16", element: "gap-6", inner: "p-6" };
  }
}

export function getRadiusValue(radius: ThemeTokens["radius"]): string {
  switch (radius) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded-sm";
    case "md":
      return "rounded-md";
    case "lg":
      return "rounded-lg";
    case "xl":
      return "rounded-xl";
    case "full":
      return "rounded-full";
    default:
      return "rounded-lg";
  }
}

export function getShadowValue(shadow: ThemeTokens["shadow"]): string {
  switch (shadow) {
    case "none":
      return "";
    case "sm":
      return "shadow-sm";
    case "md":
      return "shadow-md";
    case "lg":
      return "shadow-lg";
    default:
      return "";
  }
}

export function getButtonClasses(theme: ThemeTokens): string {
  const radius = getRadiusValue(theme.radius);
  const base = `${radius} font-bold text-sm transition-all duration-200 px-6 py-3`;

  switch (theme.buttonStyle) {
    case "outline":
      return `${base} border-2 bg-transparent hover:opacity-80`;
    case "ghost":
      return `${base} bg-transparent hover:opacity-70`;
    case "gradient":
      return `${base} bg-gradient-to-r text-white hover:opacity-90`;
    default:
      return `${base} text-white hover:opacity-90`;
  }
}

export function getCardClasses(theme: ThemeTokens): string {
  const radius = getRadiusValue(theme.radius);
  const shadow = getShadowValue(theme.shadow);

  switch (theme.cardStyle) {
    case "flat":
      return `${radius}`;
    case "elevated":
      return `${radius} ${shadow}`;
    case "bordered":
      return `${radius} border`;
    case "glass":
      return `${radius} ${shadow} backdrop-blur-xl bg-opacity-10`;
    default:
      return `${radius}`;
  }
}
