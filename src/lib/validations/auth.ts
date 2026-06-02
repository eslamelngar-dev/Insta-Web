import { z } from "zod";

const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "guerrillamail.net",
  "mailinator.com",
  "yopmail.com",
  "10minutemail.com",
  "trashmail.com",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "temp-mail.org",
  "tempail.com",
  "getnada.com",
  "emailondeck.com",
  "mailnesia.com",
  "mintemail.com",
  "tmail.ws",
  "tmpmail.net",
  "tmpmail.org",
  "bupmail.com",
  "mailcatch.com",
  "trashmail.net",
  "trashmail.org",
  "mytemp.email",
  "trash-mail.com",
  "harakirimail.com",
  "mailexpire.com",
  "tempinbox.com",
  "mailnull.com",
  "spamgourmet.com",
  "jetable.org",
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain);
}

function hasValidDomainStructure(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  const parts = domain.split(".");
  if (parts.length < 2) return false;
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2) return false;
  if (parts.some((part) => part.length === 0)) return false;
  return true;
}

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email is too long")
  .toLowerCase()
  .trim()
  .refine(hasValidDomainStructure, "Please enter a real email address")
  .refine(
    (email) => !isDisposableEmail(email),
    "Disposable email addresses are not allowed",
  )
  .refine((email) => {
    const localPart = email.split("@")[0];
    if (!localPart || localPart.length === 0 || localPart.length > 64)
      return false;
    return /^[a-zA-Z0-9._%+-]+$/.test(localPart);
  }, "Email contains invalid characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .refine((p) => /[a-z]/.test(p), "Must contain a lowercase letter")
  .refine((p) => /[A-Z]/.test(p), "Must contain an uppercase letter")
  .refine((p) => /\d/.test(p), "Must contain a number");

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .toLowerCase()
  .trim()
  .refine(
    (u) => /^[a-z0-9_-]+$/.test(u),
    "Only letters, numbers, _ and - allowed",
  )
  .refine(
    (u) => !u.startsWith("-") && !u.startsWith("_"),
    "Username cannot start with - or _",
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim()
    .refine(
      (name) => /^[a-zA-Z\s\u0600-\u06FF'-]+$/.test(name),
      "Name contains invalid characters",
    ),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
