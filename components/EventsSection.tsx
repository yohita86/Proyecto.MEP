import { events } from "@/data/events";

export default function EventsSection() {
  return (
    <section
      id="eventos"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] bg-[#181818] px-6 py-24 text-white sm:py-28"
    >
      {/* Iluminación ambiental sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-12">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400/70" />
              Comunidad
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Momentos que{" "}
              <span className="text-white/55">compartimos.</span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-white/60 sm:text-lg md:text-xl">
            Eventos, encuentros y momentos especiales que forman parte de
            nuestra vida como comunidad.
          </p>
        </div>

        {/* Eventos */}
        <div className="mt-14 space-y-8 sm:mt-16">
          {events.map((event) => (
            <article
              key={event.videoUrl}
              className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#111111] shadow-2xl shadow-black/20 transition duration-300 hover:border-amber-400/20"
            >
              {/* Video */}
              <div className="relative w-full overflow-hidden bg-[#090909]">
                {event.videoType === "mp4" && (
                  <video
                    src={event.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full object-contain"
                  />
                )}

                {event.videoType === "youtube" && (
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                )}

                {event.videoType === "vimeo" && (
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="aspect-video w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Información */}
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
                      Próximo evento
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                      {event.title}
                    </h3>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-white/50">
                    {event.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Acceso a todos los eventos */}
        <div className="mt-10 border-t border-white/[0.08] pt-8">
          <a
            href="/eventos"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-amber-400 transition duration-300 hover:gap-5 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Ver todos los eventos
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}