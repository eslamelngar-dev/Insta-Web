import { z } from "zod";

export const siteIdSchema = z.string().uuid("Invalid site ID");
export const leadIdSchema = z.string().uuid("Invalid lead ID");
export const noteIdSchema = z.string().uuid("Invalid note ID");
export const userIdSchema = z.string().uuid("Invalid user ID");
