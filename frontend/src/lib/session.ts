import "server-only";
import { cache } from "react";
import { backendFetch } from "@/lib/api-client";
import type { AuthResponse } from "@/types/api";

export const getCurrentUser = cache(
  async (): Promise<AuthResponse | null> => {
    try {
      const response = await backendFetch("/api/auth/me", {
        authenticated: true,
      });
      return await response.json();
    } catch {
      return null;
    }
  },
);
