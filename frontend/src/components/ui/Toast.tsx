"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

const TOAST_ICON: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-900",
    icon: "text-green-600",
  },
  info: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-900",
    icon: "text-blue-600",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-900",
    icon: "text-yellow-600",
  },
  error: {
    bg: "bg-red-100",
    border: "border-red-500",
    text: "text-red-900",
    icon: "text-red-600",
  },
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const config = TOAST_CONFIG[toast.type];
  const Icon = TOAST_ICON[toast.type];

  const isUrgent = toast.type === "error" || toast.type === "warning";

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      className={`
        ${config.bg} ${config.border} ${config.text}
        flex items-center gap-2 rounded-lg border-l-4 p-3 shadow-lg
        transition-all duration-300 ease-in-out
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <Icon className={`h-5 w-5 shrink-0 ${config.icon}`} />

      <p className="flex-1 text-sm font-semibold">{toast.message}</p>

      <button
        type="button"
        onClick={handleDismiss}
        className={`shrink-0 rounded p-0.5 ${config.text} opacity-70 transition-opacity hover:opacity-100`}
        aria-label="Zamknij powiadomienie"
      >
        <X size={16} />
      </button>
    </div>
  );
}
