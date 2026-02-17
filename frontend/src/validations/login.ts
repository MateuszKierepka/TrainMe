import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Adres e-mail jest wymagany")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Wprowadź poprawny adres e-mail"),
  password: z.string().min(1, "Hasło jest wymagane"),
});
