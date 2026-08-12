import { z } from "zod";
import type { Dictionary } from "@/lib/i18n";

export function createNameSchema(t: Dictionary) {
  return z
    .string()
    .trim()
    .min(2, t.validation.nameMin)
    .max(100, t.validation.nameMax);
}

export function createEmailSchema(t: Dictionary) {
  return z
    .string()
    .trim()
    .email(t.validation.emailInvalid)
    .max(200, t.validation.emailMax);
}

export function createPhoneSchema(t: Dictionary) {
  return z
    .string()
    .trim()
    .max(20, t.validation.phoneMax)
    .optional()
    .or(z.literal(""));
}

export function createMessageSchema(t: Dictionary) {
  return z
    .string()
    .trim()
    .min(10, t.validation.messageMin)
    .max(2000, t.validation.messageMax);
}

export function createCommentSchema(t: Dictionary) {
  return z
    .string()
    .trim()
    .max(2000, t.validation.commentMax)
    .optional()
    .or(z.literal(""));
}

export function createQuantitySchema(t: Dictionary) {
  return z
    .number()
    .int()
    .min(1, t.validation.qtyMin)
    .max(99, t.validation.qtyMax);
}
