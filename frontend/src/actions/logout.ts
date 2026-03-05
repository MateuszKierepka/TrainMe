"use server";

import { deleteAuthCookie } from "@/lib/auth";

export async function logoutAction() {
  await deleteAuthCookie();
}
