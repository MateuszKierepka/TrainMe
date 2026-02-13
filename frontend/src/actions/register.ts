"use server";

import { cookies } from "next/headers";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import { registerSchema } from "@/validations/register";
import { backendFetch, ApiError } from "@/lib/api-client";
import type { AuthActionState, RegisterRequest } from "@/types/api";

export async function registerAction(
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    role: formData.get("role") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    countryCode: formData.get("countryCode") as string,
    phone: (formData.get("phone") as string)?.replace(/\s/g, "") ?? "",
    dateOfBirth: formData.get("dateOfBirth") as string,
  };

  const result = registerSchema.safeParse(raw);

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

  const callingCode = getCountryCallingCode(result.data.countryCode as CountryCode);
  const phoneNumber = `+${callingCode}${result.data.phone}`;

  const body: RegisterRequest = {
    email: result.data.email,
    password: result.data.password,
    confirmPassword: result.data.confirmPassword,
    role: result.data.role,
    firstName: result.data.firstName,
    lastName: result.data.lastName,
    phoneNumber,
    dateOfBirth: result.data.dateOfBirth,
  };

  try {
    await backendFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const { status, body: errorBody } = error;

      if (status === 400 && errorBody.errors && Object.keys(errorBody.errors).length > 0) {
        const fieldErrors: Record<string, string> = {};
        for (const [key, value] of Object.entries(errorBody.errors)) {
          const frontendKey = key === "phoneNumber" ? "phone" : key;
          fieldErrors[frontendKey] = value;
        }
        return { success: false, fieldErrors };
      }

      if (status === 409) {
        const message = errorBody.message;
        if (message.includes("e-mail")) {
          return {
            success: false,
            fieldErrors: { email: message },
          };
        }
        if (message.includes("telefon")) {
          return {
            success: false,
            fieldErrors: { phone: message },
          };
        }
        return { success: false, globalError: message };
      }

      return { success: false, globalError: errorBody.message };
    }

    return {
      success: false,
      globalError: "Nie udało się połączyć z serwerem. Spróbuj ponownie później.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("register_success", "1", {
    httpOnly: true,
    maxAge: 60,
    path: "/register/success",
  });

  return { success: true };
}
