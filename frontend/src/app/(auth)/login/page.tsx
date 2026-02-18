import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">

      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/login.webp"
          alt="Trener pomagający podczas ćwiczeń"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Link href="/" className="absolute top-8 left-8 text-2xl font-bold text-white">
            TrainMe
          </Link>
          <h2 className="text-4xl font-bold text-white">
            Witaj ponownie
          </h2>
          <p className="mt-3 max-w-md text-lg text-white/80">
            Zaloguj się i kontynuuj swoją drogę do lepszej formy.
          </p>
        </div>
      </div>

      <LoginForm />
    </div>
  );
}
