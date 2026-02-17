import "server-only";
import { cookies } from "next/headers";

export type FlashToastType = "success" | "error" | "info" | "warning";

interface FlashToastData {
  type: FlashToastType;
  message: string;
}

export async function setFlashToast(type: FlashToastType, message: string) {
  const cookieStore = await cookies();
  const data: FlashToastData = { type, message: message.slice(0, 200) };

  cookieStore.set("flash_toast", JSON.stringify(data), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30,
  });
}
