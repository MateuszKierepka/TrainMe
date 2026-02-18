import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
      <p className="text-[clamp(10rem,35vw,22rem)] font-bold leading-none text-white">
        404
      </p>
      <h1 className="mt-4 text-xl font-bold text-white sm:text-2xl">
        Strona nie została znaleziona
      </h1>
      <p className="mt-3 text-sm text-white/50">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link
        href="/"
        className="group relative mt-10 px-8 py-3 text-sm font-medium text-white"
      >
        Wróć na stronę główną
        <span className="absolute inset-x-0 bottom-0 h-px bg-white" />
        <span className="absolute bottom-0 left-0 w-px bg-white transition-all duration-500 ease-out h-0 group-hover:h-full group-hover:delay-0 delay-300" />
        <span className="absolute bottom-0 right-0 w-px bg-white transition-all duration-500 ease-out h-0 group-hover:h-full group-hover:delay-0 delay-300" />
        <span className="absolute top-0 left-0 h-px origin-left bg-white transition-all duration-300 ease-out w-0 group-hover:w-1/2 group-hover:delay-500 delay-0" />
        <span className="absolute top-0 right-0 h-px origin-right bg-white transition-all duration-300 ease-out w-0 group-hover:w-1/2 group-hover:delay-500 delay-0" />
      </Link>
    </div>
  );
}
