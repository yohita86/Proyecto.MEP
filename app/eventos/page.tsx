import { events } from "@/data/events";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-zinc-950 px-6 py-20 text-white md:min-h-[75vh] md:py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Eventos
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Momentos que compartimos juntos.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Conocé nuestros próximos eventos y todo lo que vivimos como
            comunidad.
          </p>
        </div>
      </section>

      {/* Eventos */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Próximos eventos
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Lo que viene.
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
              Encuentros, celebraciones y momentos especiales que compartimos
              como comunidad.
            </p>
          </div>

          <div className="space-y-10">
            {events.map((event) => (
              <article
                key={event.videoUrl}
                className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 transition duration-300 hover:shadow-xl"
              >
                {/* Video */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {event.videoType === "mp4" && (
                    <video
                      src={event.videoUrl}
                      controls
                      className="h-full w-full object-contain"
                    />
                  )}

                  {event.videoType === "youtube" && (
                    <iframe
                      src={event.videoUrl}
                      title={event.title}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  )}

                  {event.videoType === "vimeo" && (
                    <iframe
                      src={event.videoUrl}
                      title={event.title}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  )}
                </div>

                {/* Información */}
                <div className="p-7 md:p-9">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                        Próximo evento
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                        {event.title}
                      </h2>
                    </div>

                    <p className="text-sm font-medium text-gray-500">
                      {event.date}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-zinc-950 px-6 py-24 text-white md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                Comunidad
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Hay momentos que se viven mejor juntos.
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-white/60 md:text-xl">
                Cada encuentro es una oportunidad para compartir, celebrar y
                seguir construyendo comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}