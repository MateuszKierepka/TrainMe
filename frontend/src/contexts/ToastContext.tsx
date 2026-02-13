"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import Toast, { type ToastData, type ToastType } from "@/components/ui/Toast";

const TOAST_DURATION = 5000;
const MAX_TOASTS = 5;

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastActions | null>(null);
const FLASH_COOKIE_NAME = "flash_toast";
const VALID_TOAST_TYPES = new Set<ToastType>(["success", "error", "info", "warning"]);

function consumeFlashCookie(): { type: ToastType; message: string } | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${FLASH_COOKIE_NAME}=([^;]+)`),
  );
  if (!match) return null;

  document.cookie = `${FLASH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;

  try {
    const data: unknown = JSON.parse(decodeURIComponent(match[1]));
    if (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      "message" in data &&
      typeof (data as { type: unknown }).type === "string" &&
      typeof (data as { message: unknown }).message === "string" &&
      VALID_TOAST_TYPES.has((data as { type: string }).type as ToastType)
    ) {
      const { type, message } = data as { type: ToastType; message: string };
      return { type, message: message.slice(0, 200) };
    }
  } catch {
    // ignoring invalid cookie data
  }
  return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pathname = usePathname();

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      setToasts((prev) => {
        const next = [...prev, { id, type, message }];
        if (next.length > MAX_TOASTS) {
          const evicted = next.slice(0, next.length - MAX_TOASTS);
          for (const t of evicted) {
            const timer = timersRef.current.get(t.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(t.id);
            }
          }
          return next.slice(-MAX_TOASTS);
        }
        return next;
      });

      const timer = setTimeout(() => dismiss(id), TOAST_DURATION);

      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  useEffect(() => {
    const flash = consumeFlashCookie();
    if (flash) {
      queueMicrotask(() => addToast(flash.type, flash.message));
    }
  }, [pathname, addToast]);

  const actions = useMemo<ToastActions>(
    () => ({
      success: (msg) => addToast("success", msg),
      error: (msg) => addToast("error", msg),
      info: (msg) => addToast("info", msg),
      warning: (msg) => addToast("warning", msg),
      dismiss,
    }),
    [addToast, dismiss],
  );

  return (
    <ToastContext.Provider value={actions}>
      {children}

      <div
        aria-live="polite"
        aria-label="Toast"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastActions {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
