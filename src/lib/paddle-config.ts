export type PaddleEnvironmentName = "sandbox" | "production";

function cleanEnvValue(value?: string | null): string {
  return (
    value
      ?.trim()
      .replace(/^["']|["']$/g, "")
      .toLowerCase() ?? ""
  );
}

export function resolvePaddleEnvironmentName(
  value?: string | null,
): PaddleEnvironmentName | null {
  const normalized = cleanEnvValue(value);

  if (normalized === "sandbox") return "sandbox";
  if (normalized === "production") return "production";

  return null;
}

export function getBrowserPaddleEnvironmentName(): PaddleEnvironmentName {
  return (
    resolvePaddleEnvironmentName(process.env.NEXT_PUBLIC_PADDLE_ENV) ??
    "sandbox"
  );
}
