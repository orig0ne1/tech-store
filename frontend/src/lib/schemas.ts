import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Введите имя (минимум 2 символа)")
  .max(100, "Слишком длинное имя");

export const emailSchema = z
  .string()
  .trim()
  .email("Введите корректный email")
  .max(200, "Слишком длинный email");

export const phoneSchema = z
  .string()
  .trim()
  .max(20, "Слишком длинный номер")
  .optional()
  .or(z.literal(""));

export const messageSchema = z
  .string()
  .trim()
  .min(10, "Опишите ваш вопрос подробнее (минимум 10 символов)")
  .max(2000, "Сообщение слишком длинное");

export const commentSchema = z.string().trim().max(2000, "Комментарий слишком длинный").optional().or(z.literal(""));

export const quantitySchema = z.number().int().min(1, "Минимум 1").max(99, "Максимум 99");
