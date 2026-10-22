
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      "id, title, preacher, date, video_type, video_url, thumbnail_url"
    )
    .eq("published", true)
    .order("date", { ascending: false });

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#101010] px-6 py-24 md:min-h-[75vh] md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(191,145,65,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/35 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
            Mensajes
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Palabras para seguir creciendo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Volvé a escuchar nuestros mensajes y compartí junto a nosotros
            momentos de reflexión, fe y aprendizaje.
          </p>

          <div className="mt-9 h-px w-24 bg-amber-400/70" />
        </div>
      </section>

      {/* Mensajes */}
      <section className="relative overflow-hidden px-6 py-24 md:py-28">
        <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-amber-500/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                Predicaciones
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Una palabra para este momento.
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-white/60 md:text-xl">
              Escuchá nuestros mensajes, encontrá una palabra que pueda
              acompañarte y compartila con alguien más.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-6 text-sm text-red-300">
              No pudimos cargar los mensajes en este momento.
            </div>
          )}

          {!error && (!messages || messages.length === 0) && (
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#141414] px-6 py-20 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(191,145,65,0.10),transparent_65%)]" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/70">
                  Predicaciones
                </p>

                <h3 className="mt-4 text-2xl font-semibold">
                  Próximamente vas a encontrar nuestros mensajes acá.
                </h3>

                <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/50">
                  Estamos preparando este espacio para compartir las palabras
                  y enseñanzas de nuestra comunidad.
                </p>
              </div>
            </div>
          )}

          {!error && messages && messages.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message, index) => {
                const thumbnail =
                  message.thumbnail_url ||
                  getYoutubeThumbnail(message.video_url);

                return (
                  <article
                    key={message.id}
                    className="group overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#141414] transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#090909]">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={`Miniatura de ${message.title || "mensaje"}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                          Video
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/35" />

                      {message.video_url && (
                        <a
                          href={message.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label={`Ver ${message.title || "mensaje"}`}
                        >
                          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 text-lg text-white shadow-xl backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:border-amber-300/60 group-hover:bg-amber-400 group-hover:text-black">
                            ▶
                          </span>
                        </a>
                      )}

                      <div className="absolute bottom-3 left-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                        Mensaje #{index + 1}
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl font-semibold leading-tight text-white transition-colors group-hover:text-amber-200">
                        {message.title || "Sin título"}
                      </h3>

                      {message.preacher && (
                        <p className="mt-3 text-sm text-white/60">
                          {message.preacher}
                        </p>
                      )}

                      {message.date && (
                        <p className="mt-1 text-sm text-white/35">
                          {formatDate(message.date)}
                        </p>
                      )}

                      {message.video_url && (
                        <a
                          href={message.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-amber-300 transition-all hover:gap-4 hover:text-amber-200"
                        >
                          Ver mensaje
                          <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cierre */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#111111] px-6 py-24 md:py-28">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-amber-500/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-start md:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
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

              <div className="mt-9 h-px w-24 bg-amber-400/70" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function getYoutubeThumbnail(url: string | null) {
  if (!url) return null;

  const youtubeId = getYoutubeId(url);

  if (!youtubeId) return null;

  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      return parsed.pathname.replace("/", "").split("/")[0];
    }

    if (
      hostname.includes("youtube.com") ||
      hostname.includes("youtube-nocookie.com")
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2]?.split("?")[0] || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2]?.split("?")[0] || "";
      }
    }

    return "";
  } catch {
    return "";
  }
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}
