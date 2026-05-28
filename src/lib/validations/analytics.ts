import { z } from "zod";

export const trackViewSchema = z
  .object({
    site_id: z.string().uuid("Invalid site ID."),
  })
  .strict();
