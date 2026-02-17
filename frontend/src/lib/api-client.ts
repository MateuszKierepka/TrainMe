import "server-only";
import type { ApiErrorResponse } from "@/types/api";
import { getAuthToken } from "@/lib/auth";

const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorResponse,
  ) {
    super(body.message);
  }
}

interface BackendFetchOptions extends RequestInit {
  authenticated?: boolean;
  timeoutMs?: number;
}

function getBackendUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error("Brak zmiennej środowiskowej BACKEND_URL");
  }
  return url;
}

async function parseErrorBody(response: Response): Promise<ApiErrorResponse> {
  try {
    return await response.json();
  } catch {
    return {
      status: response.status,
      message: "Nieznany błąd serwera",
      errors: {},
      timestamp: new Date().toISOString(),
    };
  }
}

export async function backendFetch(
  path: string,
  options: BackendFetchOptions = {},
): Promise<Response> {
  const {
    authenticated = false,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    ...fetchOptions
  } = options;
  const url = `${getBackendUrl()}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = await getAuthToken();

    if (!token) {
      throw new ApiError(401, {
        status: 401,
        message: "Brak tokenu autoryzacji",
        errors: {},
        timestamp: new Date().toISOString(),
      });
    }

    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new ApiError(response.status, await parseErrorBody(response));
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
