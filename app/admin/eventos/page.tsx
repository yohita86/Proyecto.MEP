import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DeleteButton from "@/components/admin/DeleteButton";

export default async function EventosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!adminRole) redirect("/admin");

  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_date, event_time, image_url, status, location, video_type, video_url, created_at"
    )
    .order("event_date", { ascending: true });

  return (
    <main className="min-h-screen bg-neutral-950 pt-20 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Eventos
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Administrá los eventos y actividades de MEP.
            </p>
          </div>

          <a
            href="/admin/eventos/nuevo"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
          >
            + Nuevo evento
          </a>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 p-5 text-red-300">
            Error al cargar los eventos: {error.message}
          </div>
        )}

        {!error && events?.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-lg font-semibold">
              Todavía no hay eventos
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Creá el primero desde el botón “Nuevo evento”.
            </p>
          </div>
        )}

        {!error && events && events.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
              >
                <div className="flex h-40 items-center justify-center overflow-hidden bg-neutral-900 p-3">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className={
                        event.video_url
                          ? "h-auto max-h-[420px] w-full object-contain"
                          : "h-auto max-h-[520px] w-full object-contain"
                      }
                    />
                  ) : (
                    <img
                      src="/paloma-color.png"
                      alt="Ministerio Evangelio de Paz"
                      className="h-24 w-24 object-contain"
                    />
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        event.status === "published"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {event.status === "published"
                        ? "Publicado"
                        : "Borrador"}
                    </span>

                    {event.event_date && (
                      <span className="text-xs text-neutral-500">
                        {event.event_date}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold">
                    {event.title}
                  </h2>

                  {event.location && (
                    <p className="mt-2 text-sm text-neutral-400">
                      📍 {event.location}
                    </p>
                  )}

                  {event.event_time && (
                    <p className="mt-1 text-sm text-neutral-500">
                      🕐 {event.event_time}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-neutral-500">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-4">
                    <a
                      href={`/admin/eventos/editar/${event.id}`}
                      className="text-sm text-white hover:text-amber-300"
                    >
                      Editar ✏️
                    </a>

                    <DeleteButton
                      label="evento"
                      endpoint={`/api/admin/eventos/${event.id}`}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}