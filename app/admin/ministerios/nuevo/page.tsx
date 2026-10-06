import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function NuevoMinisterioPage() {
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

  async function crearMinisterio(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) {
      redirect("/admin");
    }

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const targetGroup = String(formData.get("target_group") || "").trim();
    const schedule = String(formData.get("schedule") || "").trim();
    const status = String(formData.get("status") || "draft");
    const sortOrder = Number(formData.get("sort_order") || 0);

    if (!name) {
      return;
    }

    const { error } = await supabase.from("ministries").insert({
      name,
      description: description || null,
      target_group: targetGroup || null,
      schedule: schedule || null,
      status,
      sort_order: sortOrder,
    });

    if (error) {
      console.error("ERROR AL CREAR MINISTERIO:", error);
      throw new Error(error.message);
    }

    redirect("/admin/ministerios");
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-20 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Nuevo ministerio
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Creá el ministerio y configurá su información principal.
          </p>
        </div>

        <form
          action={crearMinisterio}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-neutral-200"
              >
                Nombre del ministerio
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ej. New Life Jóvenes"
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-amber-400"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-neutral-200"
              >
                Descripción
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Contá brevemente de qué se trata este ministerio..."
                className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-amber-400"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="target_group"
                  className="mb-2 block text-sm font-medium text-neutral-200"
                >
                  Grupo / edad
                </label>

                <input
                  id="target_group"
                  name="target_group"
                  type="text"
                  placeholder="Ej. Jóvenes de 18 a 30 años"
                  className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-amber-400"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule"
                  className="mb-2 block text-sm font-medium text-neutral-200"
                >
                  Horario
                </label>

                <input
                  id="schedule"
                  name="schedule"
                  type="text"
                  placeholder="Ej. Viernes · 19:30 hs"
                  className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-neutral-200"
                >
                  Estado
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue="draft"
                  className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort_order"
                  className="mb-2 block text-sm font-medium text-neutral-200"
                >
                  Orden de aparición
                </label>

                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  min="0"
                  defaultValue="0"
                  className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                />

                <p className="mt-2 text-xs text-neutral-500">
                  Los números más bajos aparecen primero.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-6">
            <a
              href="/admin/ministerios"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
            >
              Cancelar
            </a>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Crear ministerio
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}