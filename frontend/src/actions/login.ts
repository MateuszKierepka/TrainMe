"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/validations/login";
import { backendFetch, ApiError } from "@/lib/api-client";
import { setAuthCookie } from "@/lib/auth";
import { setFlashToast } from "@/lib/flash-toast";
import type { AuthActionState } from "@/types/api";

const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(["CLIENT", "TRAINER", "ADMIN"]),
    photoUrl: z.string().nullable(),
    verified: z.boolean(),
  }),
});

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }

  try {
    const response = await backendFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(result.data),
    });

    const data: unknown = await response.json();
    const parsed = loginResponseSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, globalError: "Nieprawidłowa odpowiedź serwera." };
    }

    await setAuthCookie(parsed.data.token);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 403 && error.body.message.includes("zweryfikowane")) {
        return {
          success: false,
          globalError: error.body.message,
          accountNotVerified: true,
          notVerifiedEmail: result.data.email,
        };
      }
      return { success: false, globalError: error.body.message };
    }

    return {
      success: false,
      globalError: "Nie udało się połączyć z serwerem. Spróbuj ponownie później.",
    };
  }

  await setFlashToast("success", "Zalogowano pomyślnie");
  redirect("/");
}
