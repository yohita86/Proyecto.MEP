import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DeleteButton from "@/components/admin/DeleteButton";

export default async function MinisteriosPage() {
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

  const { data: ministries, error } = await supabase
    .from("ministries")
    .select(
      "id, name, description, target_group, schedule, status, sort_order, created_at"
    )
    .order("sort_order", { ascending: true })
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
              Ministerios
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Administrá los ministerios, sus responsables y todo su contenido.
            </p>
          </div>

          <a
            href="/admin/ministerios/nuevo"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
          >
            + Nuevo ministerio
          </a>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 p-5 text-red-300">
            Error al cargar los ministerios: {error.message}
          </div>
        )}

        {!error && ministries?.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-lg font-semibold">
              Todavía no hay ministerios
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Creá el primero desde el botón “Nuevo ministerio”.
            </p>
          </div>
        )}

        {!error && ministries && ministries.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ministries.map((ministry) => (
              <article
                key={ministry.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
              >
                <div className="flex h-40 items-center justify-center overflow-hidden bg-neutral-900 p-3">
                  <img
                    src="/paloma-color.png"
                    alt="Ministerio Evangelio de Paz"
                    className="h-24 w-24 object-contain"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        ministry.status === "published"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {ministry.status === "published"
                        ? "Publicado"
                        : "Borrador"}
                    </span>

                    <span className="text-xs text-neutral-500">
                      Orden {ministry.sort_order}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold">
                    {ministry.name}
                  </h2>

                  {ministry.target_group && (
                    <p className="mt-2 text-sm text-neutral-400">
                      👥 {ministry.target_group}
                    </p>
                  )}

                  {ministry.schedule && (
                    <p className="mt-1 text-sm text-neutral-500">
                      🕐 {ministry.schedule}
                    </p>
                  )}

                  {ministry.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-neutral-500">
                      {ministry.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-4">
                    <a
                      href={`/admin/ministerios/editar/${ministry.id}`}
                      className="text-sm text-white hover:text-amber-300"
                    >
                      Editar ✏️
                    </a>

                    <DeleteButton
                      label="ministerio"
                      endpoint={`/api/admin/ministerios/${ministry.id}`}
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