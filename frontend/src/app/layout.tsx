import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

const anta = localFont({
  src: "../fonts/Anta-Regular.ttf",
  variable: "--font-anta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrainMe - Znajdź swojego trenera personalnego",
  description: "Platforma łącząca trenerów personalnych z klientami. Znajdź trenera, zarezerwuj trening i osiągaj swoje cele fitness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${anta.className} antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}