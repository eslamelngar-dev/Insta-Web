import { z } from "zod";
import { ValidationError } from "@/lib/errors";

function issuesToDetails(issues: z.ZodIssue[]) {
  const details: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path.length ? issue.path.join(".") : "general";
    if (!details[key]) {
      details[key] = issue.message;
    }
  }

  return details;
}

export function validate<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  input: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(issuesToDetails(result.error.issues));
  }

  return result.data;
}

export async function validateJson<TSchema extends z.ZodTypeAny>(
  req: Request,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    throw new ValidationError({ body: "Invalid JSON body." });
  }

  return validate(schema, body);
}

export function validateQuery<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  searchParams: URLSearchParams,
): z.infer<TSchema> {
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return validate(schema, params);
}
