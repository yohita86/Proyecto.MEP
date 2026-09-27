import { messages } from "@/data/messages";

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-zinc-950 px-6 py-20 text-white md:min-h-[75vh] md:py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Mensajes
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Palabras para seguir creciendo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Volvé a escuchar nuestros mensajes y compartí junto a nosotros
            momentos de reflexión, fe y aprendizaje.
          </p>
        </div>
      </section>

      {/* Mensajes */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Predicaciones
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Una palabra para este momento.
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
              Escuchá nuestros mensajes, encontrá una palabra que pueda
              acompañarte y compartila con alguien más.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((message, index) => (
              <article
                key={message.videoUrl}
                className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-900">
                  <img
                    src={`https://img.youtube.com/vi/${getYoutubeId(
                      message.videoUrl
                    )}/hqdefault.jpg`}
                    alt={`Miniatura del mensaje ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/30" />

                  <a
                    href={message.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Ver mensaje ${index + 1}`}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg text-black shadow-xl transition duration-300 group-hover:scale-110">
                      ▶
                    </span>
                  </a>
                </div>

                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                    Mensaje #{index + 1}
                  </p>

                  <a
                    href={message.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-gray-950 transition hover:gap-4"
                  >
                    Ver mensaje
                    <span aria-hidden="true">→</span>
                  </a>
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
                Mensajes
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Una palabra puede acompañarte en cualquier momento.
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-white/60 md:text-xl">
                Seguimos compartiendo lo que Dios está haciendo en nuestra
                comunidad para que puedas escucharlo estés donde estés.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function getYoutubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/
  );

  return match?.[1] ?? "";
}