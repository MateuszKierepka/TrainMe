"use client";

import { useRef, useEffect } from "react";

const VIDEO_URL = "https://res.cloudinary.com/dvrqd0gt6/video/upload/w_1920,q_auto/home3_eft1b8.mp4";
const POSTER_URL = "https://res.cloudinary.com/dvrqd0gt6/video/upload/w_1920,q_auto,so_0/home3_eft1b8.jpg";

const stats = [
  { value: "50+", label: "Trenerów na platformie" },
  { value: "5 000+", label: "Przeprowadzonych treningów" },
  { value: "98%", label: "Zadowolonych użytkowników" },
  { value: "4.6", label: "Średnia ocena trenerów" },
];

export default function MotivationSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="motivation"
      className="relative h-screen w-full overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        poster={POSTER_URL}
        preload="none"
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Platforma, która zmienia zasady gry
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          Tysiące klientów osiąga swoje cele, a trenerzy budują dochodowy
          biznes. Dołącz do społeczności TrainMe.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-4xl font-bold text-white sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-white/70 sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
