import "server-only";
import { cookies } from "next/headers";

export type FlashToastType = "success" | "error" | "info" | "warning";

interface FlashToastData {
  type: FlashToastType;
  message: string;
}

const FLASH_COOKIE_NAME = "flash_toast";
const VALID_TOAST_TYPES = new Set<FlashToastType>(["success", "error", "info", "warning"]);

export async function deleteFlashToast() {
  const cookieStore = await cookies();
  cookieStore.delete(FLASH_COOKIE_NAME);
}

export async function setFlashToast(type: FlashToastType, message: string) {
  const cookieStore = await cookies();
  const data: FlashToastData = { type, message: message.slice(0, 200) };

  cookieStore.set(FLASH_COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30,
  });
}

export async function getFlashToast(): Promise<FlashToastData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(FLASH_COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const data: unknown = JSON.parse(raw);
    if (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      "message" in data &&
      typeof (data as { type: unknown }).type === "string" &&
      typeof (data as { message: unknown }).message === "string" &&
      VALID_TOAST_TYPES.has((data as { type: string }).type as FlashToastType)
    ) {
      const { type, message } = data as FlashToastData;
      return { type, message: message.slice(0, 200) };
    }
  } catch {
    // ignore invalid cookie data
  }
  return null;
}
