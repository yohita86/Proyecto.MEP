
import { messages } from "@/data/messages";

export default function MessagesSection() {
  return (
    <section
      id="mensajes"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] bg-[#101010] px-6 py-24 text-white sm:py-28"
    >
      {/* Iluminación ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.09), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-12">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400/70" />
              Mensajes
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Palabras para{" "}
              <span className="text-white/55">seguir creciendo.</span>
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-base leading-8 text-white/60 sm:text-lg md:text-xl">
              Volvé a escuchar nuestros mensajes, encontrá una palabra para
              este momento y compartila con alguien más.
            </p>
          </div>
        </div>

        {/* Tarjetas de mensajes */}
        <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((message, index) => {
            const youtubeId = getYoutubeId(message.videoUrl);
            const thumbnailUrl = youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : null;

            return (
              <article
                key={message.videoUrl}
                className="group overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#171717] transition duration-300 hover:-translate-y-1 hover:border-amber-400/25"
              >
                {/* Miniatura */}
                <div className="relative aspect-video overflow-hidden bg-[#090909]">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={`Miniatura del mensaje ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#172126] via-[#101010] to-[#090909]">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                        Ministerio Evangelio de Paz
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/25 transition duration-300 group-hover:bg-black/40" />

                  <a
                    href={message.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                    aria-label={`Ver mensaje ${index + 1}`}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-amber-400 text-lg text-black shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-amber-300">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="23"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5.5a1 1 0 0 1 1.5-.87l10 6a1 1 0 0 1 0 1.74l-10 6A1 1 0 0 1 8 17.5z" />
                      </svg>
                    </span>
                  </a>

                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                    Mensaje #{index + 1}
                  </span>
                </div>

                {/* Información */}
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
                    Ministerio Evangelio de Paz
                  </p>

                  <a
                    href={message.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-white transition duration-300 hover:gap-5 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Ver mensaje
                    <span aria-hidden="true" className="text-lg">
                      →
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Acceso a todos los mensajes */}
        <div className="mt-10 border-t border-white/[0.08] pt-8">
          <a
            href="/mensajes"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-amber-400 transition duration-300 hover:gap-5 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Ver todos los mensajes
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

function getYoutubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/i
  );

  return match?.[1] ?? "";
}
