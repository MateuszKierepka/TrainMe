"use client";

import { useState, useTransition } from "react";
import { resendVerificationAction } from "@/actions/resend-verification";
import type { ResendVerificationState } from "@/types/api";

export function ResendVerificationButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ResendVerificationState | null>(null);

  const handleResend = () => {
    startTransition(async () => {
      const res = await resendVerificationAction(email);
      setResult(res);
    });
  };

  if (result?.success) {
    return (
      <p className="text-sm text-green-600">{result.message}</p>
    );
  }

  return (
    <div className="space-y-1.5">
      {result && !result.success && (
        <p className="text-sm text-red-500">{result.message}</p>
      )}
      <button
        type="button"
        onClick={handleResend}
        disabled={isPending}
        className="cursor-pointer text-sm text-gray-900 underline hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Wysyłanie..." : "Wyślij ponownie email weryfikacyjny"}
      </button>
    </div>
  );
}
