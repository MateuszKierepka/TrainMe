"use server";

import { backendFetch, ApiError } from "@/lib/api-client";
import type { ResendVerificationState } from "@/types/api";

export async function resendVerificationAction(
  email: string,
): Promise<ResendVerificationState> {
  try {
    await backendFetch("/api/v1/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return {
      success: true,
      message: "Email weryfikacyjny został wysłany. Sprawdź skrzynkę e-mail.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.body.message };
    }

    return {
      success: false,
      message: "Nie udało się połączyć z serwerem. Spróbuj ponownie później.",
    };
  }
}
