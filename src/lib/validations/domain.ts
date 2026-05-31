import { z } from "zod";

const DOMAIN_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

export const addDomainSchema = z.object({
  siteId: z.string().uuid("Invalid site ID"),
  domain: z
    .string()
    .min(4, "Domain too short")
    .max(253, "Domain too long")
    .transform((d) => d.toLowerCase().trim())
    .refine((d) => DOMAIN_REGEX.test(d), "Invalid domain format")
    .refine(
      (d) => !d.endsWith(".instaweb.me"),
      "Cannot use InstaWeb subdomains",
    )
    .refine(
      (d) => !d.startsWith("www."),
      "Use root domain without www (e.g. example.com)",
    ),
});

export const removeDomainSchema = z.object({
  siteId: z.string().uuid("Invalid site ID"),
});

export const verifyDomainSchema = z.object({
  siteId: z.string().uuid("Invalid site ID"),
});

export type AddDomainInput = z.infer<typeof addDomainSchema>;
export type RemoveDomainInput = z.infer<typeof removeDomainSchema>;
export type VerifyDomainInput = z.infer<typeof verifyDomainSchema>;
