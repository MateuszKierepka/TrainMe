"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { consumeFlashToastAction } from "@/actions/flash-toast";
import type { FlashToastType } from "@/lib/flash-toast";

interface FlashToastInitializerProps {
  type: FlashToastType;
  message: string;
}

export default function FlashToastInitializer({ type, message }: FlashToastInitializerProps) {
  const toast = useToast();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    toast[type](message);
    consumeFlashToastAction();
  }, [toast, type, message]);

  return null;
}
