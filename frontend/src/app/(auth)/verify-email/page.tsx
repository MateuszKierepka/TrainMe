import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { backendFetch, ApiError } from "@/lib/api-client";

export default async function VerifyEmailPage({searchParams}: {searchParams: Promise<{ token?: string }>}) {
  const { token } = await searchParams;

  let success = false;
  let message = "";

  if (!token) {
    message = "Brak tokenu weryfikacyjnego.";
  } else {
    try {
      await backendFetch(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: "POST",
      });
      success = true;
      message = "Twoje konto zostało pomyślnie zweryfikowane.";
    } catch (error) {
      message = error instanceof ApiError
        ? error.body.message
        : "Nie udało się połączyć z serwerem. Spróbuj ponownie później.";
    }
  }

  return <VerifyEmailResult success={success} message={message} />;
}

function VerifyEmailResult({ success, message }: { success: boolean; message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full 
            ${success ? "bg-green-100" : "bg-red-100"}`}
        >
          {success 
            ? ( <CheckCircle className="h-8 w-8 text-green-600" /> ) 
            : ( <XCircle className="h-8 w-8 text-red-600" /> )
          }
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          {success ? "E-mail zweryfikowany" : "Weryfikacja nieudana"}
        </h1>

        <p className="mt-3 text-sm text-gray-500">{message}</p>

        <Link
          href={success ? "/login" : "/register"}
          className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          {success ? "Przejdź do logowania" : "Wróć do rejestracji"}
        </Link>
      </div>
    </div>
  );
}
