import { z } from "zod";

export const trackViewSchema = z
  .object({
    site_id: z.string().uuid("Invalid site ID."),
    visitor_id: z.string().max(255).optional().nullable(),
    device: z.string().max(100).optional().nullable(),
    referrer: z.string().max(500).optional().nullable(),
  })
  .strict();
