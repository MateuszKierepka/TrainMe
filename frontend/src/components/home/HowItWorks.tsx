"use client";

import { useState } from "react";
import {
  Search,
  CalendarCheck,
  Dumbbell,
  UserPlus,
  CalendarCog,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import StaggerReveal from "@/components/ui/StaggerReveal";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const clientSteps: Step[] = [
  {
    icon: Search,
    title: "Znajdź trenera",
    description: "Przeglądaj profile trenerów, filtruj po specjalizacji, lokalizacji i cenie. Wybierz idealnego trenera dla siebie.",
  },
  {
    icon: CalendarCheck,
    title: "Zarezerwuj termin",
    description: "Sprawdź dostępność w kalendarzu i zarezerwuj trening jednym kliknięciem. Szybko i wygodnie.",
  },
  {
    icon: Dumbbell,
    title: "Trenuj i osiągaj cele",
    description: "Ćwicz pod okiem profesjonalisty, śledź swoje postępy i osiągaj cele szybciej niż kiedykolwiek.",
  },
];

const trainerSteps: Step[] = [
  {
    icon: UserPlus,
    title: "Stwórz profil",
    description: "Załóż konto, dodaj swoje specjalizacje, doświadczenie i cennik. Pokaż klientom, co Cię wyróżnia.",
  },
  {
    icon: CalendarCog,
    title: "Zarządzaj grafikiem",
    description: "Ustaw swoją dostępność w kalendarzu. Klienci rezerwują terminy, a Ty masz pełną kontrolę nad harmonogramem.",
  },
  {
    icon: TrendingUp,
    title: "Rozwijaj biznes",
    description: "Zdobywaj klientów, zbieraj opinie i buduj swoją reputację. TrainMe pomaga Ci rosnąć.",
  },
];

type Tab = "client" | "trainer";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<Tab>("client");
  const steps = activeTab === "client" ? clientSteps : trainerSteps;

  return (
    <section className="h-screen flex items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Jak to działa?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Prosta ścieżka dla klientów i trenerów
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setActiveTab("client")}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
              activeTab === "client"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dla klientów
          </button>
          <button
            onClick={() => setActiveTab("trainer")}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
              activeTab === "trainer"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dla trenerów
          </button>
        </div>

        <StaggerReveal
          key={activeTab}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
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
