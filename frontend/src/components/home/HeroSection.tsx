"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const VIDEO_URL = "https://res.cloudinary.com/dvrqd0gt6/video/upload/w_1920,q_auto/home_jnb4po.mp4";
const POSTER_URL = "https://res.cloudinary.com/dvrqd0gt6/video/upload/w_1920,q_auto,so_0/home_jnb4po.jpg";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        poster={POSTER_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Trenuj z najlepszymi. Buduj swoją markę.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          Platforma, która łączy klientów z najlepszymi trenerami personalnymi.
          Znajdź idealnego trenera lub rozwijaj swoją karierę trenerską.
        </p>
        <Link
          href={
            !user
              ? "/register"
              : user.role === "TRAINER"
                ? "/dashboard"
                : "/trainers"
          }
          className="group mt-10 flex items-center justify-center gap-4 rounded-[5px] border-2 border-white/30 bg-transparent px-4 py-2.5 transition-all duration-400 hover:border-white hover:bg-white"
        >
          <span className="font-bold text-white transition-all duration-400 group-hover:text-black">
            {!user
              ? "Dołącz do nas"
              : user.role === "TRAINER"
                ? "Przejdź do panelu"
                : "Zobacz trenerów"}
          </span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              fill="white"
              className="transition-all duration-400 group-hover:fill-black"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
