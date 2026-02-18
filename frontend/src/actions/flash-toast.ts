"use server";

import { deleteFlashToast } from "@/lib/flash-toast";

export async function consumeFlashToastAction() {
  await deleteFlashToast();
}
