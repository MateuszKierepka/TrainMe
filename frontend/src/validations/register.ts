import { z } from "zod";
import { getCountries } from "libphonenumber-js";

const VALID_COUNTRY_CODES = new Set(getCountries());

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const registerObject = z.object({
  role: z.enum(["CLIENT", "TRAINER"], {
    message: "Wybierz typ konta",
  }),
  countryCode: z
    .string()
    .refine((val) => VALID_COUNTRY_CODES.has(val as never), "Nieprawidłowy kod kraju"),
  email: z
    .string()
    .min(1, "Adres e-mail jest wymagany")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Wprowadź poprawny adres e-mail"),
  password: z
    .string()
    .min(1, "Hasło jest wymagane")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Min. 8 znaków, 1 duża litera, 1 mała litera, 1 cyfra, 1 znak specjalny",
    ),
  confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  firstName: z
    .string()
    .min(2, "Imię musi mieć minimum 2 znaki")
    .max(20, "Imię musi mieć maksymalnie 20 znaków")
    .regex(
      /^[A-ZŁŚŹŻĆŃÓĘ][a-złśźżćńóęA-ZŁŚŹŻĆŃÓĘ]*$/,
      "Imię musi zaczynać się od dużej litery i zawierać tylko litery",
    ),
  lastName: z
    .string()
    .min(2, "Nazwisko musi mieć minimum 2 znaki")
    .max(35, "Nazwisko musi mieć maksymalnie 35 znaków")
    .regex(
      /^[A-ZŁŚŹŻĆŃÓĘ][a-złśźżćńóęA-ZŁŚŹŻĆŃÓĘ-]*$/,
      "Nazwisko musi zaczynać się od dużej litery i zawierać tylko litery lub myślnik",
    ),
  phone: z
    .string()
    .min(1, "Numer telefonu jest wymagany")
    .regex(/^\d{9}$/, "Numer telefonu musi mieć dokładnie 9 cyfr"),
  dateOfBirth: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(
      (val) => {
        const birth = new Date(val);
        return birth < today();
      },
      "Data urodzenia musi być w przeszłości",
    )
    .refine(
      (val) => {
        const birth = new Date(val);
        const t = today();
        const eighteenYearsAgo = new Date(
          t.getFullYear() - 18,
          t.getMonth(),
          t.getDate(),
        );
        return birth <= eighteenYearsAgo;
      },
      "Musisz mieć ukończone 18 lat",
    )
    .refine(
      (val) => {
        const birth = new Date(val);
        const t = today();
        const hundredYearsAgo = new Date(
          t.getFullYear() - 100,
          t.getMonth(),
          t.getDate(),
        );
        return birth >= hundredYearsAgo;
      },
      "Musisz mieć maksymalnie 100 lat",
    ),
});

export const registerSchema = registerObject.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  },
);

export type RegisterFormInput = z.input<typeof registerSchema>;

export const registerStep2Schema = registerObject
  .pick({ email: true, password: true, confirmPassword: true })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export const registerStep3Schema = registerObject.pick({
  firstName: true,
  lastName: true,
  phone: true,
  dateOfBirth: true,
  countryCode: true,
});
