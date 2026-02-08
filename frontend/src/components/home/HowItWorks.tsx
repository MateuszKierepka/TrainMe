import { Search, CalendarCheck, Dumbbell } from "lucide-react";
import StaggerReveal from "@/components/ui/StaggerReveal";

const steps = [
  {
    icon: Search,
    title: "Znajdź trenera",
    description: "Przeglądaj profile trenerów, filtruj po lokalizacji, specjalizacji i cenie. Wybierz idealnego trenera dla siebie.",
  },
  {
    icon: CalendarCheck,
    title: "Zarezerwuj trening",
    description: "Sprawdź dostępność trenera w kalendarzu i zarezerwuj termin, który Ci odpowiada. Szybko i wygodnie.",
  },
  {
    icon: Dumbbell,
    title: "Trenuj i osiągaj cele",
    description: "Ćwicz pod okiem profesjonalisty, śledź postępy i osiągaj swoje cele fitness szybciej niż kiedykolwiek.",
  },
];

export default function HowItWorks() {
  return (
    <section className="h-screen flex items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Jak to działa?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trzy proste kroki do lepszej formy
          </p>
        </div>

        <StaggerReveal className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-gray-600">{step.description}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
