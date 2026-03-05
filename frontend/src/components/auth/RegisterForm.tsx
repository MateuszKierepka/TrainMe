"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Dumbbell, User, ChevronDown } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import OAuthButtons from "@/components/auth/OAuthButtons";
import StepIndicator from "@/components/auth/StepIndicator";
import { registerAction } from "@/actions/register";
import { registerStep2Schema, registerStep3Schema } from "@/validations/register";
import { inputClassName } from "@/utils/styles";
import type { AuthActionState } from "@/types/api";

type Role = "CLIENT" | "TRAINER" | null;

interface RegisterFormData {
  role: Role;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  dateOfBirth: string;
}

const FIELD_STEP: Record<string, number> = {
  role: 1,
  email: 2,
  password: 2,
  confirmPassword: 2,
  firstName: 3,
  lastName: 3,
  phone: 3,
  dateOfBirth: 3,
};

const INITIAL_FORM_DATA: RegisterFormData = {
  role: null,
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  countryCode: "PL",
  phone: "",
  dateOfBirth: "",
};

const COUNTRY_CODES = getCountries()
  .map((iso) => ({
    iso,
    callingCode: `+${getCountryCallingCode(iso)}`,
  }))
  .sort((a, b) => parseInt(a.callingCode) - parseInt(b.callingCode));

type FieldErrors = Partial<Record<keyof RegisterFormData, string>>;

function getStepErrors(step: number, data: RegisterFormData): FieldErrors {
  if (step === 2) {
    const result = registerStep2Schema.safeParse({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    if (result.success) return {};
    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof RegisterFormData;
      if (!errors[field]) errors[field] = issue.message;
    }
    return errors;
  }
  if (step === 3) {
    const result = registerStep3Schema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      countryCode: data.countryCode,
    });
    if (result.success) return {};
    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof RegisterFormData;
      if (!errors[field]) errors[field] = issue.message;
    }
    return errors;
  }
  return {};
}

function formatName(value: string, maxLen: number, allowHyphen = false): string {
  const pattern = allowHyphen
    ? /[^a-zA-ZłśźżćńóęŁŚŹŻĆŃÓĘ-]/g
    : /[^a-zA-ZłśźżćńóęŁŚŹŻĆŃÓĘ]/g;
  const cleaned = value.replace(pattern, "");
  const trimmed = cleaned.slice(0, maxLen);
  if (trimmed.length === 0) return "";
  return trimmed
    .split("-")
    .map((part) =>
      part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : "",
    )
    .join("-");
}

interface RegisterFormProps {
  dateMin: string;
  dateMax: string;
}

export default function RegisterForm({ dateMin, dateMax }: RegisterFormProps) {
  const router = useRouter();
  const lastStepChange = useRef(0);
  const [isPending, setIsPending] = useState(false);
  const [actionState, setActionState] = useState<AuthActionState>({ success: false });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [editedSinceAction, setEditedSinceAction] = useState<Set<string>>(new Set());
  const [prevActionState, setPrevActionState] = useState(actionState);
  const totalSteps = 3;

  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    setEditedSinceAction(new Set());

    if (actionState.fieldErrors) {
      const errorFields = Object.keys(actionState.fieldErrors);
      const earliestStep = Math.min(...errorFields.map((f) => FIELD_STEP[f] ?? 3));
      if (earliestStep < step) {
        setStep(earliestStep);
      }
      const newTouched: Record<string, boolean> = {};
      for (const field of errorFields) {
        newTouched[field] = true;
      }
      setTouched((prev) => ({ ...prev, ...newTouched }));
    }
  }

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const updateField = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditedSinceAction((prev) => new Set(prev).add(field));
  };

  const serverErrors: FieldErrors = {};
  if (actionState.fieldErrors) {
    for (const [key, value] of Object.entries(actionState.fieldErrors)) {
      if (!editedSinceAction.has(key)) {
        serverErrors[key as keyof RegisterFormData] = value;
      }
    }
  }
  const clientErrors: FieldErrors = {
    ...getStepErrors(step, formData),
    ...serverErrors,
  };
  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return formData.role !== null;
      case 2:
        return Object.keys(getStepErrors(2, formData)).length === 0;
      case 3:
        return Object.keys(getStepErrors(3, formData)).length === 0;
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
    if (canGoNext() && step < totalSteps) {
      setStep(step + 1);
      lastStepChange.current = Date.now();
    }
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const submitRegistration = async () => {
    if (step !== totalSteps || isPending) return;
    if (Date.now() - lastStepChange.current < 300) return;

    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
    }));
    if (!canGoNext()) return;

    const fd = new FormData();
    fd.set("role", formData.role ?? "");
    fd.set("email", formData.email);
    fd.set("password", formData.password);
    fd.set("confirmPassword", formData.confirmPassword);
    fd.set("firstName", formData.firstName);
    fd.set("lastName", formData.lastName);
    fd.set("countryCode", formData.countryCode);
    fd.set("phone", formData.phone);
    fd.set("dateOfBirth", formData.dateOfBirth);

    setIsPending(true);
    try {
      const result = await registerAction(fd);
      if (result.success) {
        router.push("/register/success");
        return;
      }
      setActionState(result);
    } catch {
      setActionState({
        success: false,
        globalError: "Nie udało się połączyć z serwerem. Spróbuj ponownie później.",
      });
    } finally {
      setIsPending(false);
    }
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRegistration();
  };

  return (
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

        {actionState.globalError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionState.globalError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} noValidate>

          {step === 1 && (
            <div className="space-y-4">
              <button
                type="button"
                disabled={isPending}
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
                disabled={isPending}
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
                  disabled={isPending}
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                  placeholder="test@example.com"
                  className={inputClassName(
                    !!touched.email,
                    !!clientErrors.email,
                    "mt-1.5",
                  )}
                />
                {touched.email && clientErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {clientErrors.email}
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
                    disabled={isPending}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => markTouched("password")}
                    placeholder="Min. 8 znaków"
                    className={inputClassName(
                      !!touched.password,
                      !!clientErrors.password,
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
                {touched.password && clientErrors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {clientErrors.password}
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
                    disabled={isPending}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    onBlur={() => markTouched("confirmPassword")}
                    placeholder="Powtórz hasło"
                    className={inputClassName(
                      !!touched.confirmPassword,
                      !!clientErrors.confirmPassword,
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
                {touched.confirmPassword && clientErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {clientErrors.confirmPassword}
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
                    maxLength={20}
                    disabled={isPending}
                    value={formData.firstName}
                    onChange={(e) =>
                      updateField("firstName", formatName(e.target.value, 20))
                    }
                    onBlur={() => markTouched("firstName")}
                    placeholder="Jan"
                    className={inputClassName(
                      !!touched.firstName,
                      !!clientErrors.firstName,
                      "mt-1.5",
                    )}
                  />
                  {touched.firstName && clientErrors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {clientErrors.firstName}
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
                    maxLength={35}
                    disabled={isPending}
                    value={formData.lastName}
                    onChange={(e) =>
                      updateField("lastName", formatName(e.target.value, 35, true))
                    }
                    onBlur={() => markTouched("lastName")}
                    placeholder="Kowalski"
                    className={inputClassName(
                      !!touched.lastName,
                      !!clientErrors.lastName,
                      "mt-1.5",
                    )}
                  />
                  {touched.lastName && clientErrors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {clientErrors.lastName}
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
                      disabled={isPending}
                      value={formData.countryCode}
                      onChange={(e) =>
                        updateField("countryCode", e.target.value)
                      }
                      className="h-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-8 pl-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                    disabled={isPending}
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                      updateField("phone", digits);
                    }}
                    onBlur={() => markTouched("phone")}
                    placeholder="123456789"
                    className={inputClassName(
                      !!touched.phone,
                      !!clientErrors.phone,
                      "flex-1",
                    )}
                  />
                </div>
                {touched.phone && clientErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {clientErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Data urodzenia <span className="text-red-500">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  required
                  min={dateMin}
                  max={dateMax}
                  disabled={isPending}
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  onBlur={() => markTouched("dateOfBirth")}
                  className={inputClassName(
                    !!touched.dateOfBirth,
                    !!clientErrors.dateOfBirth,
                    "mt-1.5",
                  )}
                />
                {touched.dateOfBirth && clientErrors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-500">
                    {clientErrors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Wstecz
              </button>
            )}

            <button
              type="button"
              onClick={step < totalSteps ? handleNext : submitRegistration}
              disabled={!canGoNext() || isPending}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {step < totalSteps
                ? "Dalej"
                : isPending
                  ? "Rejestracja..."
                  : "Zarejestruj się"}
            </button>
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
  );
}
