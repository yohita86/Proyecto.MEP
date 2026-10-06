import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import MinistryImagesManager from "@/components/admin/MinistryImagesManager";
import MinistryVideosManager from "@/components/admin/MinistryVideosManager";
import DeleteButton from "@/components/admin/DeleteButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarMinisterioPage({
  params,
}: PageProps) {
  const { id } = await params;

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

  const { data: ministry, error: ministryError } =
    await supabase
      .from("ministries")
      .select(
        "id, name, description, target_group, schedule, status, sort_order"
      )
      .eq("id", id)
      .maybeSingle();

  if (ministryError || !ministry) {
    redirect("/admin/ministerios");
  }

  const { data: responsibles } = await supabase
    .from("ministry_responsibles")
    .select(
      "id, name, role, whatsapp, created_at"
    )
    .eq("ministry_id", id)
    .order("created_at", { ascending: true });

  const { data: images } = await supabase
    .from("ministry_images")
    .select(
      "id, image_url, title, description, sort_order, is_primary, created_at"
    )
    .eq("ministry_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const { data: videos } = await supabase
    .from("ministry_videos")
    .select(
      "id, ministry_id, title, description, video_type, video_url, thumbnail_url, sort_order, is_featured, created_at"
    )
    .eq("ministry_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  async function actualizarMinisterio(
    formData: FormData
  ) {
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

    const name = String(
      formData.get("name") || ""
    );

    const description = String(
      formData.get("description") || ""
    );

    const targetGroup = String(
      formData.get("target_group") || ""
    );

    const schedule = String(
      formData.get("schedule") || ""
    );

    const status = String(
      formData.get("status") || "draft"
    );

    const sortOrder = Number(
      formData.get("sort_order") || 0
    );

    await supabase
      .from("ministries")
      .update({
        name,
        description: description || null,
        target_group: targetGroup || null,
        schedule: schedule || null,
        status,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    redirect(
      `/admin/ministerios/editar/${id}`
    );
  }

  async function agregarResponsable(
    formData: FormData
  ) {
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

    const name = String(
      formData.get("name") || ""
    );

    const role = String(
      formData.get("role") || ""
    );

    const whatsapp = String(
      formData.get("whatsapp") || ""
    );

    if (!name) {
      return;
    }

    await supabase
      .from("ministry_responsibles")
      .insert({
        ministry_id: id,
        name,
        role: role || null,
        whatsapp: whatsapp || null,
      });

    redirect(
      `/admin/ministerios/editar/${id}`
    );
  }

  async function actualizarResponsable(
    formData: FormData
  ) {
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

    const responsibleId = String(
      formData.get("responsible_id") || ""
    );

    const name = String(
      formData.get("name") || ""
    );

    const role = String(
      formData.get("role") || ""
    );

    const whatsapp = String(
      formData.get("whatsapp") || ""
    );

    if (!responsibleId || !name) {
      return;
    }

    await supabase
      .from("ministry_responsibles")
      .update({
        name,
        role: role || null,
        whatsapp: whatsapp || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", responsibleId);

    redirect(
      `/admin/ministerios/editar/${id}`
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-20 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ENCABEZADO */}

        <div className="mb-10">
          <a
            href="/admin/ministerios"
            className="text-sm text-neutral-500 transition hover:text-white"
          >
            ← Volver a ministerios
          </a>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Editar ministerio
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Administrá toda la información y el
              contenido de{" "}
              <span className="text-white">
                {ministry.name}
              </span>
              .
            </p>
          </div>
        </div>

        {/* INFORMACIÓN PRINCIPAL */}

        <form
          action={actualizarMinisterio}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Información principal
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Datos del ministerio
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Nombre
              </label>

              <input
                name="name"
                required
                defaultValue={ministry.name}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Descripción
              </label>

              <textarea
                name="description"
                defaultValue={
                  ministry.description || ""
                }
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Grupo / edades
              </label>

              <input
                name="target_group"
                defaultValue={
                  ministry.target_group || ""
                }
                placeholder="Ej: Jóvenes de 18 a 30 años"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Horario
              </label>

              <input
                name="schedule"
                defaultValue={
                  ministry.schedule || ""
                }
                placeholder="Ej: Viernes · 19:30 hs"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Estado
              </label>

              <select
                name="status"
                defaultValue={ministry.status}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              >
                <option value="draft">
                  Borrador
                </option>

                <option value="published">
                  Publicado
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Orden
              </label>

              <input
                name="sort_order"
                type="number"
                defaultValue={
                  ministry.sort_order
                }
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Guardar cambios
            </button>
          </div>
        </form>

        {/* RESPONSABLES */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Equipo
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Responsables
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Personas encargadas del ministerio y
              sus datos de contacto.
            </p>
          </div>

          <form
            action={agregarResponsable}
            className="mb-8 rounded-2xl border border-white/10 bg-neutral-900/60 p-5"
          >
            <h3 className="text-base font-semibold">
              Agregar responsable
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <input
                name="name"
                required
                placeholder="Nombre"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />

              <input
                name="role"
                placeholder="Rol"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />

              <input
                name="whatsapp"
                placeholder="WhatsApp"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
              />
            </div>

            <button
              type="submit"
              className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Agregar responsable
            </button>
          </form>

          {responsibles &&
          responsibles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {responsibles.map(
                (responsible) => (
                  <div
                    key={responsible.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <form
                      action={
                        actualizarResponsable
                      }
                    >
                      <input
                        type="hidden"
                        name="responsible_id"
                        value={
                          responsible.id
                        }
                      />

                      <div className="grid gap-4">
                        <input
                          name="name"
                          required
                          defaultValue={
                            responsible.name
                          }
                          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                        />

                        <input
                          name="role"
                          defaultValue={
                            responsible.role ||
                            ""
                          }
                          placeholder="Rol"
                          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                        />

                        <input
                          name="whatsapp"
                          defaultValue={
                            responsible.whatsapp ||
                            ""
                          }
                          placeholder="WhatsApp"
                          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                        />
                      </div>

                      <div className="mt-5 flex items-center gap-4">
                        <button
                          type="submit"
                          className="text-sm font-medium text-white transition hover:text-amber-300"
                        >
                          Guardar cambios ✏️
                        </button>

                        <DeleteButton
                          label="responsable"
                          endpoint={`/api/admin/ministerios/responsables/${responsible.id}`}
                        />
                      </div>
                    </form>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-neutral-500">
                Todavía no hay responsables
                cargados.
              </p>
            </div>
          )}
        </section>

        {/* IMÁGENES */}

        <MinistryImagesManager
          ministryId={ministry.id}
          initialImages={images ?? []}
        />

        {/* VIDEOS */}

        <MinistryVideosManager
          ministryId={ministry.id}
          initialVideos={videos ?? []}
        />

        {/* REDES SOCIALES */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Próximamente
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Redes sociales
          </h2>

          <p className="mt-2 text-sm text-neutral-400">
            Acá vamos a administrar Instagram,
            Facebook, TikTok, YouTube, WhatsApp y
            otros enlaces.
          </p>
        </section>
      </div>
    </main>
  );
}