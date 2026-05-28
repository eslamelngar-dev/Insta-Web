import { z } from "zod";

const optionalTrimmedString = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(max).optional().nullable());

const optionalEmail = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim().toLowerCase();
  return trimmed === "" ? undefined : trimmed;
}, z.string().email("Please enter a valid email address.").max(255).optional().nullable());

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "archived",
] as const;

export const createLeadSchema = z
  .object({
    site_id: z.string().uuid("Invalid site ID."),
    name: optionalTrimmedString(100),
    email: optionalEmail,
    phone: optionalTrimmedString(20),
    message: optionalTrimmedString(5000),
    source: optionalTrimmedString(100),
    metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const hasMetadata =
      !!data.metadata && Object.keys(data.metadata).length > 0;

    if (!data.name && !data.email && !hasMetadata) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field (name, email) is required.",
        path: ["general"],
      });
    }
  });

export const updateLeadSchema = z
  .object({
    status: z.enum(leadStatuses).optional(),
    name: z.preprocess((value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    }, z.string().min(1).max(100).optional()),
    email: z.preprocess((value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim().toLowerCase();
      return trimmed === "" ? undefined : trimmed;
    }, z.string().email("Please enter a valid email address.").max(255).optional()),
    phone: z.preprocess((value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    }, z.string().max(20).optional()),
    message: z.preprocess((value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    }, z.string().max(5000).optional()),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No valid fields to update.",
        path: ["general"],
      });
    }
  });

export const createNoteSchema = z
  .object({
    content: z.preprocess(
      (value) => {
        if (typeof value !== "string") return value;
        return value.trim();
      },
      z
        .string()
        .min(1, "Note content cannot be empty.")
        .max(2000, "Note cannot exceed 2000 characters."),
    ),
  })
  .strict();

export const leadsQuerySchema = z.object({
  status: z.union([z.literal("all"), z.enum(leadStatuses)]).optional(),
  site_id: z
    .union([z.literal("all"), z.string().uuid("Invalid site ID.")])
    .optional(),
  search: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(100).optional()),
  date_from: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional()),
  date_to: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const exportQuerySchema = z.object({
  site_id: z
    .union([z.literal("all"), z.string().uuid("Invalid site ID.")])
    .optional(),
  status: z.union([z.literal("all"), z.enum(leadStatuses)]).optional(),
});

export const leadParamsSchema = z.object({
  id: z.string().uuid("Invalid lead ID."),
});

export const leadNoteParamsSchema = z.object({
  id: z.string().uuid("Invalid lead ID."),
  noteId: z.string().uuid("Invalid note ID."),
});
