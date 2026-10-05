import { createClient } from "@/lib/supabase/server";

function formatDate(date: string | null) {
  if (!date) return null;

  const parsedDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatTime(time: string | null) {
  if (!time) return null;

  return `${time.slice(0, 5)} hs`;
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const id = parsedUrl.pathname.replace("/", "");

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const shortsMatch = parsedUrl.pathname.match(
        /^\/shorts\/([^/?]+)/
      );

      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      }

      const watchId = parsedUrl.searchParams.get("v");

      if (watchId) {
        return `https://www.youtube.com/embed/${watchId}`;
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }
  } catch {
    return url;
  }

  return url;
}

function getVimeoEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("vimeo.com")) {
      const parts = parsedUrl.pathname
        .split("/")
        .filter(Boolean);

      const id = parts.find((part) => /^\d+$/.test(part));

      if (id) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_date, event_time, image_url, status, location, video_type, video_url"
    )
    .eq("status", "published")
    .order("event_date", { ascending: true });

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

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              No pudimos cargar los eventos en este momento.
            </div>
          )}

          {!error && (!events || events.length === 0) && (
            <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Próximamente
              </p>

              <h2 className="mt-4 text-2xl font-semibold">
                No hay eventos publicados por el momento.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-gray-500">
                Volvé a visitarnos pronto para conocer nuestros próximos
                encuentros.
              </p>
            </div>
          )}

          {!error && events && events.length > 0 && (
            <div className="space-y-12">
              {events.map((event) => {
                const youtubeUrl =
                  event.video_type === "youtube" && event.video_url
                    ? getYoutubeEmbedUrl(event.video_url)
                    : null;

                const vimeoUrl =
                  event.video_type === "vimeo" && event.video_url
                    ? getVimeoEmbedUrl(event.video_url)
                    : null;

                return (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 transition duration-300 hover:shadow-xl"
                  >
                    {/* Multimedia */}
                    {(event.image_url || event.video_url) && (
                      <div className="border-b border-gray-200 bg-white p-5 md:p-7">
                        <div
                          className={
                            event.image_url && event.video_url
                              ? "grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:items-center"
                              : "flex justify-center"
                          }
                        >
                          {/* Imagen */}
                          {event.image_url && (
                            <div
                              className={
                                event.video_url
                                  ? "mx-auto w-full max-w-md"
                                  : "mx-auto w-full max-w-xl"
                              }
                            >
                              <div className="overflow-hidden rounded-2xl bg-zinc-100 shadow-sm">
                                <img
                                  src={event.image_url}
                                  alt={event.title}
                                  className={
                                    event.video_url
                                      ? "h-auto max-h-[420px] w-full object-contain"
                                      : "h-auto max-h-[520px] w-full object-contain"
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {/* Video */}
                          {event.video_url && event.video_type && (
                            <div className="w-full">
                              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-sm">
                                {event.video_type === "mp4" && (
                                  <video
                                    src={event.video_url}
                                    controls
                                    className="h-full w-full object-contain"
                                  />
                                )}

                                {event.video_type === "youtube" &&
                                  youtubeUrl && (
                                    <iframe
                                      src={youtubeUrl}
                                      title={event.title}
                                      className="h-full w-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  )}

                                {event.video_type === "vimeo" &&
                                  vimeoUrl && (
                                    <iframe
                                      src={vimeoUrl}
                                      title={event.title}
                                      className="h-full w-full"
                                      allow="autoplay; fullscreen; picture-in-picture"
                                      allowFullScreen
                                    />
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sin imagen ni video */}
                    {!event.image_url && !event.video_url && (
                      <div className="flex h-48 items-center justify-center border-b border-gray-200 bg-zinc-950">
                        <img
                          src="/paloma-color.png"
                          alt="Ministerio Evangelio de Paz"
                          className="h-24 w-24 object-contain"
                        />
                      </div>
                    )}

                    {/* Información */}
                    <div className="p-7 md:p-9">
                      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                            Próximo evento
                          </p>

                          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                            {event.title}
                          </h2>

                          {event.description && (
                            <p className="mt-4 leading-relaxed text-gray-600">
                              {event.description}
                            </p>
                          )}

                          <div className="mt-5 space-y-2">
                            {event.location && (
                              <p className="text-sm font-medium text-gray-500">
                                📍 {event.location}
                              </p>
                            )}

                            {event.event_time && (
                              <p className="text-sm text-gray-500">
                                🕐 {formatTime(event.event_time)}
                              </p>
                            )}
                          </div>
                        </div>

                        {event.event_date && (
                          <div className="shrink-0 rounded-2xl bg-zinc-950 px-5 py-4 text-white md:min-w-[190px] md:text-center">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                              Fecha
                            </p>

                            <p className="mt-2 text-sm font-medium capitalize text-white/90">
                              {formatDate(event.event_date)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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