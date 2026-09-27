import { events } from "@/data/events";

export default function EventsSection() {
  return (
    <section
      id="eventos"
      className="scroll-mt-24 bg-zinc-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              Comunidad
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Momentos que compartimos.
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-white/60 md:text-xl">
            Eventos, encuentros y momentos especiales que forman parte de
            nuestra vida como comunidad.
          </p>
        </div>

        <div className="mt-14">
          {events.map((event) => (
            <article
              key={event.videoUrl}
              className="mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl"
            >
              <div className="relative w-full overflow-hidden bg-black">
                {event.videoType === "mp4" && (
                  <video
                    src={event.videoUrl}
                    controls
                    className="aspect-video w-full object-contain"
                  />
                )}

                {event.videoType === "youtube" && (
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="aspect-video w-full"
                    allowFullScreen
                  />
                )}

                {event.videoType === "vimeo" && (
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="aspect-video w-full"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="p-7 md:p-9">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                      Próximo evento
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-white/50">
                    {event.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="/eventos"
            className="inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:gap-4"
          >
            Ver todos los eventos
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}