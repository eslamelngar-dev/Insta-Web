import { z } from "zod";

export const siteIdSchema = z.string().uuid("Invalid site ID.");