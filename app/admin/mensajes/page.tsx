import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import MessageThumbnail from "@/components/MessageThumbnail";

import DeleteButton from "@/components/admin/DeleteButton";

export default async function MensajesPage() {
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

  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      "id, title, preacher, date, video_type, video_url, thumbnail_url, published, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-neutral-950 pt-20 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Mensajes
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Administrá las prédicas y videos de MEP.
            </p>
          </div>

          <a
            href="/admin/mensajes/nuevo"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
          >
            + Nuevo mensaje
          </a>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 p-5 text-red-300">
            Error: {error.message}
          </p>
        )}

        {!error && messages.length === 0 && (
          <p className="text-neutral-500">
            Todavía no hay mensajes.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {messages?.map((message) => (
            <article
              key={message.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <MessageThumbnail
                src={
                  message.thumbnail_url ||
                  getYoutubeThumbnail(message.video_url)
                }
                alt={message.title}
              />

              <div className="p-6">
                <div className="mb-4 flex justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${message.published
                        ? "bg-green-400/10 text-green-400"
                        : "bg-amber-400/10 text-amber-400"
                      }`}
                  >
                    {message.published
                      ? "Publicado"
                      : "Borrador"}
                  </span>

                  <span className="text-xs uppercase text-neutral-600">
                    {message.video_type}
                  </span>
                </div>

                <h2 className="text-lg font-semibold">
                  {message.title}
                </h2>

                {message.preacher && (
                  <p className="mt-2 text-sm text-neutral-400">
                    {message.preacher}
                  </p>
                )}

                {message.date && (
                  <p className="mt-1 text-sm text-neutral-500">
                    {message.date}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-4">
                  {message.video_url && (
                    <a
                      href={message.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber-400 hover:text-amber-300"
                    >
                      Ver video →
                    </a>
                  )}

                  <a
                    href={`/admin/mensajes/editar/${message.id}`}
                    className="text-sm text-white hover:text-amber-300"
                  >
                    Editar ✏️
                  </a>

                  <DeleteButton
                    label="mensaje"
                    endpoint={`/api/admin/mensajes/${message.id}`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function getYoutubeThumbnail(url: string | null) {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^&?/]+)/
  );

  return match?.[1]
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : null;
}