"use server";

import { redirect } from "next/navigation";
import { deleteAuthCookie } from "@/lib/auth";

export async function logoutAction() {
  await deleteAuthCookie();
  redirect("/");
}
