import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  await connection();

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dateMin = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate())
    .toISOString()
    .split("T")[0];
  const dateMax = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate())
    .toISOString()
    .split("T")[0];

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

      <RegisterForm dateMin={dateMin} dateMax={dateMax} />
    </div>
  );
}
