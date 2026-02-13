import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";

export default async function RegisterSuccessPage() {
  const cookieStore = await cookies();
  const flash = cookieStore.get("register_success");

  if (!flash) {
    redirect("/register");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Konto zostało utworzone
        </h1>

        <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
          <Mail className="h-5 w-5" />
          <p>Sprawdź swoją skrzynkę e-mail</p>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Wysłaliśmy link weryfikacyjny na Twój adres e-mail. Kliknij w link, aby aktywować konto.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Przejdź do logowania
        </Link>

        <p className="mt-6 text-sm text-gray-400">
          Nie otrzymałeś wiadomości? Sprawdź folder spam. Jeśli problem się powtarza,{" "}
          <Link href="/contact" className="text-gray-900 underline hover:text-gray-600">
            skontaktuj się z nami
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
