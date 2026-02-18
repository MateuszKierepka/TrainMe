import { z } from "zod";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Adres e-mail jest wymagany")
    .regex(EMAIL_REGEX, "Wprowadź poprawny adres e-mail"),
  password: z.string().min(1, "Hasło jest wymagane"),
});
