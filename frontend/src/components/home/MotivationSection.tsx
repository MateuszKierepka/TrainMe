const VIDEO_URL = "https://res.cloudinary.com/dvrqd0gt6/video/upload/home3_eft1b8.mp4";

const stats = [
  { value: "500+", label: "Trenerów" },
  { value: "10 000+", label: "Treningów" },
  { value: "98%", label: "Zadowolonych klientów" },
];

export default function MotivationSection() {
  return (
    <section id="motivation" className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Twoja przemiana zaczyna się dziś
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          Dołącz do tysięcy osób, które już zmieniły swoje życie dzięki TrainMe.
          Profesjonalni trenerzy, realne wyniki.
        </p>

        <div className="mt-14 grid grid-cols-3 gap-8 sm:gap-16">
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