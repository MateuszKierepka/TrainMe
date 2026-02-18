import Link from "next/link";

const navigation = [
  { href: "/", label: "Strona główna" },
  { href: "/trainers", label: "Znajdź trenera" },
  { href: "/about", label: "O nas" }
];

const legal = [
  { href: "/privacy", label: "Polityka prywatności" },
  { href: "/terms", label: "Regulamin" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <Link href="/" className="text-xl font-bold text-white">
              TrainMe
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              Platforma łącząca trenerów personalnych z klientami. Znajdź idealnego trenera, zarezerwuj trening i osiągaj swoje cele.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Nawigacja
            </h3>
            <ul className="mt-2 space-y-1">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Informacje prawne
            </h3>
            <ul className="mt-2 space-y-1">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} TrainMe. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
