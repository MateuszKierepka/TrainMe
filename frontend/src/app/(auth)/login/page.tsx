"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import OAuthButtons from "@/components/auth/OAuthButtons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInputClassName(touched: boolean, isValid: boolean, extra = "") {
  const base = "block w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:ring-1 focus:outline-none";
  const border = touched && !isValid
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : touched && isValid
      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
      : "border-gray-300 focus:border-gray-900 focus:ring-gray-900";
  return `${base} ${border} ${extra}`;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const isEmailValid = EMAIL_REGEX.test(email);
  const isPasswordValid = password.length >= 1;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isEmailValid || !isPasswordValid) return;
    // TODO: integrate with backend
  };

  return (
    <div className="flex min-h-screen">
      
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/login.webp"
          alt="Trener pomagający podczas ćwiczeń"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Link href="/" className="absolute top-8 left-8 text-2xl font-bold text-white">
            TrainMe
          </Link>
          <h2 className="text-4xl font-bold text-white">
            Witaj ponownie
          </h2>
          <p className="mt-3 max-w-md text-lg text-white/80">
            Zaloguj się i kontynuuj swoją drogę do lepszej formy.
          </p>
        </div>
      </div>
      
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          
          <Link
            href="/"
            className="mb-8 block text-center text-2xl font-bold text-gray-900 lg:hidden"
          >
            TrainMe
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Zaloguj się
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Wprowadź swoje dane, aby uzyskać dostęp do konta
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adres e-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder="test@example.com"
                className={getInputClassName(!!touched.email, isEmailValid, "mt-1.5")}
              />
              {touched.email && !isEmailValid && (
                <p className="mt-1 text-xs text-red-500">
                  Wprowadź poprawny adres e-mail
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Hasło <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => markTouched("password")}
                  placeholder="Wprowadź hasło"
                  className={getInputClassName(!!touched.password, isPasswordValid, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.password && !isPasswordValid && (
                <p className="mt-1 text-xs text-red-500">
                  Hasło jest wymagane
                </p>
              )}
              <Link
                href="/forgot-password"
                className="mt-2 block text-right text-sm font-medium text-gray-900 hover:text-gray-600"
              >
                Zapomniałeś hasła?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isEmailValid || !isPasswordValid}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Zaloguj się
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">lub</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <OAuthButtons />

          <p className="mt-8 text-center text-sm text-gray-500">
            Nie masz jeszcze konta?{" "}
            <Link
              href="/register"
              className="font-medium text-gray-900 hover:text-gray-600"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}