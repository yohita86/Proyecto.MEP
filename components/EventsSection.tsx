import { events } from "@/data/events";

export default function EventsSection() {
  return (
    <section
      id="eventos"
      className="scroll-mt-24 bg-zinc-950 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Comunidad
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Próximos eventos
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Compartimos juntos momentos especiales.
          </p>
        </div>

        <div className="mt-12">
          {events.map((event) => (
            <article
              key={event.videoUrl}
              className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="w-full bg-black">
                {event.videoType === "mp4" && (
                  <video
                    src={event.videoUrl}
                    controls
                    className="h-[360px] w-full object-contain md:h-[420px]"
                  />
                )}

                {event.videoType === "youtube" && (
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="h-[360px] w-full md:h-[420px]"
                    allowFullScreen
                  />
                )}

                {event.videoType === "vimeo" && (
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="h-[360px] w-full md:h-[420px]"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                  Próximo evento
                </p>

                <h3 className="mt-3 text-2xl font-bold md:text-3xl">
                  {event.title}
                </h3>

                <p className="mt-3 text-white/60">
                  {event.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}