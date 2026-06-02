type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

function formatLog(entry: LogEntry): string {
  if (isDev) {
    const colors = {
      debug: "\x1b[90m",
      info: "\x1b[36m",
      warn: "\x1b[33m",
      error: "\x1b[31m",
    };
    const reset = "\x1b[0m";
    const color = colors[entry.level];
    const data = entry.data ? "\n" + JSON.stringify(entry.data, null, 2) : "";
    return `${color}[${entry.level.toUpperCase()}]${reset} ${entry.message}${data}`;
  }

  return JSON.stringify(entry);
}

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  if (isProd && level === "debug") return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  };

  const formatted = formatLog(entry);

  switch (level) {
    case "debug":
    case "info":
      console.log(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) =>
    log("debug", message, data),
  info: (message: string, data?: Record<string, unknown>) =>
    log("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) =>
    log("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) =>
    log("error", message, data),
};
