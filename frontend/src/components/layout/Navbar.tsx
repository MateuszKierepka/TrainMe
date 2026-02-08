"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/trainers", label: "Znajdź trenera" },
  { href: "/about", label: "O nas" },
  { href: "/chat", label: "Czat" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onVideo, setOnVideo] = useState(true);

  useEffect(() => {
    const sections = [
      document.getElementById("hero"),
      document.getElementById("motivation"),
    ].filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });
        setOnVideo(visible.size > 0);
      },
      { threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        onVideo
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          <Link
            href="/"
            className={`text-2xl font-bold tracking-wide transition-colors duration-500 ${
              onVideo ? "text-white" : "text-gray-900"
            }`}
          >
            TrainMe
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-500 ${
                  onVideo
                    ? "text-white/80 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-500 ${
                onVideo
                  ? "text-white border-white/30 hover:bg-white/20 hover:border-white"
                  : "text-gray-900 border-gray-300 hover:bg-gray-900/10 hover:border-gray-900"
              }`}
            >
              Zaloguj się
            </Link>
            <Link
              href="/register"
              className={`rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-500 ${
                onVideo
                  ? "bg-white text-black border-white hover:bg-white/60 hover:border-white/60"
                  : "bg-gray-900 text-white border-gray-900 hover:bg-gray-600 hover:border-gray-600"
              }`}
            >
              Zarejestruj się
            </Link>
          </div>

          <button
            type="button"
            className={`md:hidden p-2 transition-colors duration-500 ${
              onVideo ? "text-white" : "text-gray-900"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className={`md:hidden backdrop-blur-md border-t ${
            onVideo
              ? "bg-black/90 border-white/10"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                  onVideo
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div
              className={`pt-3 border-t space-y-2 ${
                onVideo ? "border-white/10" : "border-gray-200"
              }`}
            >
              <Link
                href="/login"
                className={`block rounded-lg px-3 py-2 text-center text-sm font-medium border transition-all ${
                  onVideo
                    ? "text-white border-white/30 hover:bg-white/20 hover:border-white"
                    : "text-gray-900 border-gray-300 hover:bg-gray-900/10 hover:border-gray-900"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Zaloguj się
              </Link>
              <Link
                href="/register"
                className={`block rounded-lg px-3 py-2 text-center text-sm font-medium border transition-all ${
                  onVideo
                    ? "bg-white text-black border-white hover:bg-white/60 hover:border-white/60"
                    : "bg-gray-900 text-white border-gray-900 hover:bg-gray-600 hover:border-gray-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Zarejestruj się
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
