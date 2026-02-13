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
});

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
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
    const response = await backendFetch("/api/auth/login", {
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
