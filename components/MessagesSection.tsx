import { messages } from "@/data/messages";

export default function MessagesSection() {
  return (
    <section id="mensajes" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Mensajes
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Escuchá nuestros mensajes
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Volvé a escuchar nuestros mensajes y compartí la palabra.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((message, index) => (
            <article
              key={message.videoUrl}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={`https://img.youtube.com/vi/${getYoutubeId(
                    message.videoUrl
                  )}/hqdefault.jpg`}
                  alt="Miniatura del mensaje"
                  className="h-full w-full object-cover"
                />

                <a
                  href={message.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-xl text-black shadow-lg transition hover:scale-110">
                    ▶
                  </span>
                </a>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-gray-500">
                  Mensaje #{index + 1}
                </p>

                <a
                  href={message.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Ver mensaje
                </a>
              </div>
            </article>
          ))}
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