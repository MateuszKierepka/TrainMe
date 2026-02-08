"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Dumbbell, User, ChevronDown } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import OAuthButtons from "@/components/auth/OAuthButtons";
import StepIndicator from "@/components/auth/StepIndicator";

type Role = "CLIENT" | "TRAINER" | null;

interface FormData {
  role: Role;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  bio: string;
}

const INITIAL_FORM_DATA: FormData = {
  role: null,
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  countryCode: "PL",
  phone: "",
  bio: "",
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
const NAME_REGEX = /^[A-ZŁŚŹŻĆŃÓĘ][a-złśźżćńóę]*$/;
const PHONE_REGEX = /^\d{9}$/;
const countryNames = new Intl.DisplayNames(["pl"], { type: "region" });
const COUNTRY_CODES = getCountries()
  .map((iso) => ({
    iso,
    callingCode: `+${getCountryCallingCode(iso)}`,
    name: countryNames.of(iso) ?? iso,
  }))
  .sort((a, b) => parseInt(a.callingCode) - parseInt(b.callingCode));

type FieldErrors = Partial<Record<keyof FormData, string>>;

function validateStep2(data: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Wprowadź poprawny adres e-mail";
  }
  if (!PASSWORD_REGEX.test(data.password)) {
    errors.password = "Min. 8 znaków, 1 duża litera, 1 mała litera, 1 cyfra, 1 znak specjalny";
  }
  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Hasła nie są identyczne";
  }
  if (data.confirmPassword.length === 0) {
    errors.confirmPassword = "Potwierdzenie hasła jest wymagane";
  }
  return errors;
}

function validateStep3(data: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (data.firstName.trim().length === 0) {
    errors.firstName = "Imię jest wymagane";
  } else if (data.firstName.length < 3) {
    errors.firstName = "Imię musi mieć minimum 3 znaki";
  } else if (data.firstName.length > 15) {
    errors.firstName = "Imię może mieć maksymalnie 15 znaków";
  } else if (!NAME_REGEX.test(data.firstName)) {
    errors.firstName = "Imię musi zaczynać się od dużej litery";
  }

  if (data.lastName.trim().length === 0) {
    errors.lastName = "Nazwisko jest wymagane";
  } else if (data.lastName.length < 3) {
    errors.lastName = "Nazwisko musi mieć minimum 3 znaki";
  } else if (data.lastName.length > 25) {
    errors.lastName = "Nazwisko może mieć maksymalnie 25 znaków";
  } else if (!NAME_REGEX.test(data.lastName)) {
    errors.lastName = "Nazwisko musi zaczynać się od dużej litery";
  }

  const digitsOnly = data.phone.replace(/\s/g, "");
  if (digitsOnly.length === 0) {
    errors.phone = "Numer telefonu jest wymagany";
  } else if (!PHONE_REGEX.test(digitsOnly)) {
    errors.phone = "Numer telefonu musi mieć dokładnie 9 cyfr";
  }

  return errors;
}

function inputCls(touched: boolean, hasError: boolean, extra = "") {
  const base = "block w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:ring-1 focus:outline-none";
  const border = touched && hasError
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : touched && !hasError
      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
      : "border-gray-300 focus:border-gray-900 focus:ring-gray-900";
  return `${base} ${border} ${extra}`;
}

function formatName(value: string, maxLen: number): string {
  const cleaned = value.replace(/[^a-zA-ZłśźżćńóęŁŚŹŻĆŃÓĘ]/g, "");
  const trimmed = cleaned.slice(0, maxLen);
  if (trimmed.length === 0) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const totalSteps = 3;
  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const stepErrors: FieldErrors = step === 2
    ? validateStep2(formData)
    : step === 3
      ? validateStep3(formData)
      : {};
  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return formData.role !== null;
      case 2:
        return Object.keys(validateStep2(formData)).length === 0;
      case 3:
        return Object.keys(validateStep3(formData)).length === 0;
      default:
        return false;
    }
  };
  const handleNext = () => {
    if (step === 2) {
      setTouched((prev) => ({
        ...prev,
        email: true,
        password: true,
        confirmPassword: true,
      }));
    }
    if (step === 3) {
      setTouched((prev) => ({
        ...prev,
        firstName: true,
        lastName: true,
        phone: true,
      }));
    }
    if (canGoNext() && step < totalSteps) {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      phone: true,
    }));
    if (!canGoNext()) return;
    // TODO: integrate with backend
  };

  return (
    <div className="flex min-h-screen">

      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/register.webp"
          alt="Trener i klient podczas treningu"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Link
            href="/"
            className="absolute top-8 left-8 text-2xl font-bold text-white"
          >
            TrainMe
          </Link>
          <h2 className="text-4xl font-bold text-white">Dołącz do nas</h2>
          <p className="mt-3 max-w-md text-lg text-white/80">
            Stwórz konto i zacznij swoją przygodę z treningiem personalnym.
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

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Zarejestruj się
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {step === 1 && "Wybierz typ konta"}
                {step === 2 && "Podaj dane logowania"}
                {step === 3 && "Uzupełnij dane osobowe"}
              </p>
            </div>
            <StepIndicator currentStep={step} totalSteps={totalSteps} />
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {step === 1 && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => updateField("role", "CLIENT")}
                  className={`flex w-full items-center gap-4 rounded-lg border-2 p-5 text-left transition-colors ${
                    formData.role === "CLIENT"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      formData.role === "CLIENT"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      Klient
                    </p>
                    <p className="text-sm text-gray-500">
                      Szukam trenera personalnego
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField("role", "TRAINER")}
                  className={`flex w-full items-center gap-4 rounded-lg border-2 p-5 text-left transition-colors ${
                    formData.role === "TRAINER"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      formData.role === "TRAINER"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Dumbbell size={24} />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      Trener
                    </p>
                    <p className="text-sm text-gray-500">
                      Chcę oferować swoje usługi treningowe
                    </p>
                  </div>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adres e-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="test@example.com"
                    className={inputCls(
                      !!touched.email,
                      !!stepErrors.email,
                      "mt-1.5",
                    )}
                  />
                  {touched.email && stepErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {stepErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hasło <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      onBlur={() => markTouched("password")}
                      placeholder="Min. 8 znaków"
                      className={inputCls(
                        !!touched.password,
                        !!stepErrors.password,
                        "pr-12",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Ukryj hasło" : "Pokaż hasło"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {touched.password && stepErrors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {stepErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Potwierdź hasło <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="reg-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      onBlur={() => markTouched("confirmPassword")}
                      placeholder="Powtórz hasło"
                      className={inputCls(
                        !!touched.confirmPassword,
                        !!stepErrors.confirmPassword,
                        "pr-12",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showConfirmPassword ? "Ukryj hasło" : "Pokaż hasło"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && stepErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {stepErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-sm text-gray-400">lub</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <OAuthButtons />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Imię <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      maxLength={15}
                      value={formData.firstName}
                      onChange={(e) =>
                        updateField("firstName", formatName(e.target.value, 15))
                      }
                      onBlur={() => markTouched("firstName")}
                      placeholder="Jan"
                      className={inputCls(
                        !!touched.firstName,
                        !!stepErrors.firstName,
                        "mt-1.5",
                      )}
                    />
                    {touched.firstName && stepErrors.firstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {stepErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nazwisko <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      maxLength={25}
                      value={formData.lastName}
                      onChange={(e) =>
                        updateField("lastName", formatName(e.target.value, 25))
                      }
                      onBlur={() => markTouched("lastName")}
                      placeholder="Kowalski"
                      className={inputCls(
                        !!touched.lastName,
                        !!stepErrors.lastName,
                        "mt-1.5",
                      )}
                    />
                    {touched.lastName && stepErrors.lastName && (
                      <p className="mt-1 text-xs text-red-500">
                        {stepErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Numer telefonu <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <div className="relative">
                      <select
                        value={formData.countryCode}
                        onChange={(e) =>
                          updateField("countryCode", e.target.value)
                        }
                        className="h-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-8 pl-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.iso} value={c.iso}>
                            {c.iso} {c.callingCode}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel-national"
                      required
                      maxLength={9}
                      value={formData.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                        updateField("phone", digits);
                      }}
                      onBlur={() => markTouched("phone")}
                      placeholder="123456789"
                      className={inputCls(
                        !!touched.phone,
                        !!stepErrors.phone,
                        "flex-1",
                      )}
                    />
                  </div>
                  {touched.phone && stepErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {stepErrors.phone}
                    </p>
                  )}
                </div>

                {formData.role === "TRAINER" && (
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      O mnie
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      placeholder="Opowiedz krótko o sobie, swoim doświadczeniu i stylu treningów..."
                      className="mt-1.5 block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Opcjonalne — możesz uzupełnić później
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-100 hover:shadow-sm"
                >
                  Wstecz
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Dalej
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canGoNext()}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Zarejestruj się
                </button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Masz już konto?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-900 hover:text-gray-600"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}