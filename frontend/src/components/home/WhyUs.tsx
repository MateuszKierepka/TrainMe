import { ShieldCheck, CalendarCog, CreditCard, Star } from "lucide-react";
import StaggerReveal from "@/components/ui/StaggerReveal";

const features = [
  {
    icon: ShieldCheck,
    title: "Zweryfikowani profesjonaliści",
    description: "Każdy trener przechodzi weryfikację kwalifikacji. Klienci trenują z profesjonalistami, a trenerzy budują wiarygodność.",
  },
  {
    icon: CalendarCog,
    title: "Inteligentny kalendarz",
    description: "Klienci rezerwują terminy online, a trenerzy zarządzają grafikiem w jednym miejscu. Koniec z chaosem w ustalaniu terminów.",
  },
  {
    icon: CreditCard,
    title: "Bezpieczne płatności",
    description: "Płatności online przez Stripe lub gotówką na miejscu. Klienci płacą wygodnie, trenerzy otrzymują środki szybko i bezpiecznie.",
  },
  {
    icon: Star,
    title: "Opinie i reputacja",
    description: "System ocen pomaga klientom wybrać najlepszego trenera, a trenerom budować markę i przyciągać nowych klientów.",
  },
];

export default function WhyUs() {
  return (
    <section className="flex-1 flex items-center bg-gray-100 px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Dlaczego TrainMe?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Narzędzia, które pomagają klientom osiągać cele, a trenerom
            rozwijać biznes
          </p>
        </div>

        <StaggerReveal className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                <feature.icon size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
