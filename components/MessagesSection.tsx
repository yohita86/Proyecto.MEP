import { messages } from "@/data/messages";

export default function MessagesSection() {
  return (
    <section
      id="mensajes"
      className="scroll-mt-24 bg-white px-6 py-24 text-gray-950"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Mensajes
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Palabras para seguir creciendo.
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
              Volvé a escuchar nuestros mensajes, encontrá una palabra para
              este momento y compartila con alguien más.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  alt="Miniatura del mensaje"
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

        <div className="mt-10">
          <a
            href="/mensajes"
            className="inline-flex items-center gap-3 text-sm font-semibold text-gray-950 transition hover:gap-4"
          >
            Ver todos los mensajes
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function getYoutubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/
  );

  return match?.[1] ?? "";
}