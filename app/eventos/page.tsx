import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  image_url: string | null;
  status: string | null;
  location: string | null;
  video_type: string | null;
  video_url: string | null;
};

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) return null;

  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) return time;

  return `${hours}:${minutes} hs`;
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean).pop() ||
        "";
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

function getVimeoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const videoId = parts[parts.length - 1];

    if (!videoId) return null;

    return `https://player.vimeo.com/video/${videoId}`;
  } catch {
    return null;
  }
}

function isPastEvent(eventDate: string) {
  const today = new Date();

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const event = new Date(`${eventDate}T00:00:00`);

  return event < currentDate;
}

function EventMedia({ event }: { event: Event }) {
  if (event.video_type === "mp4" && event.video_url) {
    return (
      <video
        src={event.video_url}
        controls
        className="h-full w-full object-cover"
      />
    );
  }

  if (
    event.video_type === "youtube" &&
    event.video_url
  ) {
    const embedUrl = getYoutubeEmbedUrl(event.video_url);

    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title={event.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }
  }

  if (
    event.video_type === "vimeo" &&
    event.video_url
  ) {
    const embedUrl = getVimeoEmbedUrl(event.video_url);

    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title={event.title}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  if (event.image_url) {
    return (
      <img
        src={event.image_url}
        alt={event.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-900">
      <img
        src="/paloma-color.png"
        alt="Ministerio Evangelio de Paz"
        className="w-20 opacity-40"
      />
    </div>
  );
}

function EventCard({
  event,
  past = false,
}: {
  event: Event;
  past?: boolean;
}) {
  const time = formatTime(event.event_time);

  return (
    <article
      className={`group overflow-hidden rounded-[2rem] border transition duration-500 ${
        past
          ? "border-white/[0.07] bg-[#171717] hover:border-amber-400/20 hover:bg-[#1b1b1b]"
          : "border-white/[0.09] bg-[#111111] hover:border-amber-400/30 hover:bg-[#151515]"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <EventMedia event={event} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-5 top-5">
          <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
            {past ? "Compartido" : "Próximo"}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-400">
          <span className="text-amber-400">
            {formatDate(event.event_date)}
          </span>

          {time && (
            <>
              <span className="text-neutral-700">•</span>
              <span>{time}</span>
            </>
          )}

          {event.location && (
            <>
              <span className="text-neutral-700">•</span>
              <span>{event.location}</span>
            </>
          )}
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {event.title}
        </h3>

        {event.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-400">
            {event.description}
          </p>
        )}
      </div>
    </article>
  );
}

export default async function EventosPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_date, event_time, image_url, status, location, video_type, video_url"
    )
    .eq("status", "published")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error cargando eventos:", error);
  }

  const allEvents: Event[] = events ?? [];

  const upcomingEvents = allEvents.filter(
    (event) => !isPastEvent(event.event_date)
  );

  const pastEvents = allEvents
    .filter((event) => isPastEvent(event.event_date))
    .sort((a, b) => {
      return (
        new Date(`${b.event_date}T00:00:00`).getTime() -
        new Date(`${a.event_date}T00:00:00`).getTime()
      );
    });

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* HERO */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-[#090909]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,158,11,0.10),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.05),transparent_35%)]" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full border border-amber-400/[0.06]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full border border-white/[0.04]" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:px-10 md:pb-28">
          <div className="max-w-4xl">
            <span className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400" />
              Comunidad
            </span>

            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
              Hay momentos
              <br />
              que se viven
              <span className="text-neutral-500"> mejor juntos.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-neutral-400 md:text-lg">
              Cada encuentro es una oportunidad para compartir, crecer y
              seguir construyendo juntos.
            </p>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#101010]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                Lo que viene
              </span>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Próximos eventos
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-neutral-500">
              Encontrá el próximo momento para compartir con nuestra
              comunidad.
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/[0.07] bg-[#151515] px-6 py-16 text-center">
              <p className="text-neutral-500">
                Próximamente vamos a compartir nuevos encuentros.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* EVENTOS PASADOS */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#181818]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,0.06),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.025),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                Nuestra historia
              </span>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Momentos que ya compartimos
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-neutral-500">
              Lo que vivimos también forma parte de nuestra historia. Acá
              podés volver a encontrar algunos de esos momentos.
            </p>
          </div>

          {pastEvents.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/[0.07] bg-[#202020] px-6 py-16 text-center">
              <p className="text-neutral-500">
                Todavía no hay eventos anteriores para mostrar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CIERRE */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#090909]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <div className="mx-auto mb-7 h-px w-16 bg-amber-400/60" />

          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Nos vemos en el próximo encuentro.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 md:text-base">
            Siempre hay un lugar para compartir, conocer gente y seguir
            creciendo juntos.
          </p>
        </div>
      </section>
    </main>
  );
}