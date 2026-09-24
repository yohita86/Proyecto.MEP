import { events } from "@/data/events";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="bg-zinc-950 px-6 py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Eventos
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            Momentos que compartimos juntos.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
            Conocé nuestros próximos eventos y todo lo que vivimos como
            comunidad.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-10">
            {events.map((event) => (
              <article
                key={event.videoUrl}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="w-full bg-black">
                  {event.videoType === "mp4" && (
                    <video
                      src={event.videoUrl}
                      controls
                      className="h-[360px] w-full object-contain md:h-[500px]"
                    />
                  )}

                  {event.videoType === "youtube" && (
                    <iframe
                      src={event.videoUrl}
                      title={event.title}
                      className="h-[360px] w-full md:h-[500px]"
                      allowFullScreen
                    />
                  )}

                  {event.videoType === "vimeo" && (
                    <iframe
                      src={event.videoUrl}
                      title={event.title}
                      className="h-[360px] w-full md:h-[500px]"
                      allowFullScreen
                    />
                  )}
                </div>

                <div className="p-7 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                    Próximo evento
                  </p>

                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    {event.title}
                  </h2>

                  <p className="mt-3 text-gray-600">{event.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}