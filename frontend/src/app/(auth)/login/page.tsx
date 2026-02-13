"use client";

import { useState, useActionState, startTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { loginAction } from "@/actions/login";
import { inputClassName } from "@/utils/styles";
import type { AuthActionState } from "@/types/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [actionState, formAction, isPending] = useActionState<AuthActionState, FormData>(
    loginAction,
    { success: false },
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [editedSinceAction, setEditedSinceAction] = useState<Set<string>>(new Set());
  const [prevActionState, setPrevActionState] = useState(actionState);

  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    setEditedSinceAction(new Set());

    if (actionState.fieldErrors) {
      const newTouched: Record<string, boolean> = {};
      for (const field of Object.keys(actionState.fieldErrors)) {
        newTouched[field] = true;
      }
      setTouched((prev) => ({ ...prev, ...newTouched }));
    }
  }

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const updateField = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    setEditedSinceAction((prev) => new Set(prev).add(field));
  };

  const serverErrors: Record<string, string> = {};
  if (actionState.fieldErrors) {
    for (const [key, value] of Object.entries(actionState.fieldErrors)) {
      if (!editedSinceAction.has(key)) {
        serverErrors[key] = value;
      }
    }
  }

  const isEmailValid = EMAIL_REGEX.test(email);
  const isPasswordValid = password.length >= 1;

  const clientErrors: Record<string, string> = {};
  if (!isEmailValid) clientErrors.email = "Wprowadź poprawny adres e-mail";
  if (!isPasswordValid) clientErrors.password = "Hasło jest wymagane";
  const errors = { ...clientErrors, ...serverErrors };

  const canSubmit = isEmailValid && isPasswordValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;

    const fd = new FormData();
    fd.set("email", email);
    fd.set("password", password);

    startTransition(() => formAction(fd));
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

          {actionState.globalError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionState.globalError}
            </div>
          )}

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
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder="test@example.com"
                className={inputClassName(!!touched.email, !!errors.email, "mt-1.5")}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email}
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
                  onChange={(e) => updateField("password", e.target.value)}
                  onBlur={() => markTouched("password")}
                  placeholder="Wprowadź hasło"
                  className={inputClassName(!!touched.password, !!errors.password, "pr-12")}
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
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
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
              disabled={!canSubmit || isPending}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isPending ? "Logowanie..." : "Zaloguj się"}
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
