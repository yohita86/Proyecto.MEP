
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MinistryImagesManager from "@/components/admin/MinistryImagesManager";
import MinistryVideosManager from "@/components/admin/MinistryVideosManager";
import MinistrySocialLinksManager from "@/components/admin/MinistrySocialLinksManager";
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

  // INFORMACIÓN DEL MINISTERIO
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

  // RESPONSABLES
  const { data: responsibles } = await supabase
    .from("ministry_responsibles")
    .select(
      "id, name, role, whatsapp, sort_order, created_at"
    )
    .eq("ministry_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // IMÁGENES
  const { data: images } = await supabase
    .from("ministry_images")
    .select(
      "id, image_url, title, description, sort_order, is_primary, created_at"
    )
    .eq("ministry_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // VIDEOS
  const { data: videos } = await supabase
    .from("ministry_videos")
    .select(
      "id, ministry_id, title, description, video_type, video_url, thumbnail_url, sort_order, is_featured, created_at"
    )
    .eq("ministry_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // REDES SOCIALES
  const {
    data: socialLinks,
    error: socialLinksError,
  } = await supabase
    .from("ministry_social_links")
    .select(
      "id, ministry_id, platform, label, url, sort_order, created_at"
    )
    .eq("ministry_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (socialLinksError) {
    console.error(
      "Error al cargar redes sociales:",
      socialLinksError.message
    );
  }

  // ACTUALIZAR MINISTERIO
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
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const targetGroup = String(
      formData.get("target_group") || ""
    ).trim();

    const schedule = String(
      formData.get("schedule") || ""
    ).trim();

    const status = String(
      formData.get("status") || "draft"
    );

    const sortOrder = Number(
      formData.get("sort_order") || 0
    );

    if (
      !name ||
      !["draft", "published"].includes(status) ||
      !Number.isInteger(sortOrder)
    ) {
      throw new Error("Los datos del ministerio no son válidos.");
    }

    const { error } = await supabase
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

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/admin/ministerios/editar/${id}`);
  }

  // AGREGAR RESPONSABLE
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
    ).trim();

    const role = String(
      formData.get("role") || ""
    ).trim();

    const whatsapp = String(
      formData.get("whatsapp") || ""
    ).trim();

    if (!name) {
      return;
    }

    const { data: lastResponsible } = await supabase
      .from("ministry_responsibles")
      .select("sort_order")
      .eq("ministry_id", id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextSortOrder =
      (lastResponsible?.sort_order ?? 0) + 1;

    const { error } = await supabase
      .from("ministry_responsibles")
      .insert({
        ministry_id: id,
        name,
        role: role || null,
        whatsapp: whatsapp || null,
        sort_order: nextSortOrder,
      });

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/admin/ministerios/editar/${id}`);
  }

  // ACTUALIZAR RESPONSABLE
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
    ).trim();

    const role = String(
      formData.get("role") || ""
    ).trim();

    const whatsapp = String(
      formData.get("whatsapp") || ""
    ).trim();

    if (!responsibleId || !name) {
      return;
    }

    const { error } = await supabase
      .from("ministry_responsibles")
      .update({
        name,
        role: role || null,
        whatsapp: whatsapp || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", responsibleId)
      .eq("ministry_id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/admin/ministerios/editar/${id}`);
  }

  // MOVER RESPONSABLE
  async function moverResponsable(
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

    const direction = String(
      formData.get("direction") || ""
    );

    if (
      !responsibleId ||
      !["up", "down"].includes(direction)
    ) {
      return;
    }

    const { data: current } = await supabase
      .from("ministry_responsibles")
      .select("id, ministry_id, sort_order")
      .eq("id", responsibleId)
      .eq("ministry_id", id)
      .maybeSingle();

    if (!current) {
      return;
    }

    const { data: allResponsibles } = await supabase
      .from("ministry_responsibles")
      .select("id, sort_order")
      .eq("ministry_id", current.ministry_id)
      .order("sort_order", { ascending: true });

    if (
      !allResponsibles ||
      allResponsibles.length < 2
    ) {
      return;
    }

    const currentIndex = allResponsibles.findIndex(
      (item) => item.id === current.id
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= allResponsibles.length
    ) {
      return;
    }

    const target = allResponsibles[targetIndex];

    const { error: firstError } = await supabase
      .from("ministry_responsibles")
      .update({
        sort_order: target.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id);

    if (firstError) {
      throw new Error(firstError.message);
    }

    const { error: secondError } = await supabase
      .from("ministry_responsibles")
      .update({
        sort_order: current.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", target.id);

    if (secondError) {
      throw new Error(secondError.message);
    }

    redirect(
      `/admin/ministerios/editar/${current.ministry_id}`
    );
  }

  // AGREGAR RED SOCIAL
  async function agregarRedSocial(
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

    const ministryId = String(
      formData.get("ministry_id") || ""
    );

    const platform = String(
      formData.get("platform") || ""
    );

    const label = String(
      formData.get("label") || ""
    ).trim();

    const url = String(
      formData.get("url") || ""
    ).trim();

    const allowedPlatforms = [
      "instagram",
      "facebook",
      "tiktok",
      "youtube",
      "whatsapp",
      "website",
      "other",
    ];

    if (
      ministryId !== id ||
      !allowedPlatforms.includes(platform)
    ) {
      throw new Error("Los datos de la red social no son válidos.");
    }

    try {
      const parsedUrl = new URL(url);

      if (
        !["http:", "https:"].includes(parsedUrl.protocol)
      ) {
        throw new Error("URL inválida.");
      }
    } catch {
      throw new Error(
        "Ingresá una URL válida que comience con https://"
      );
    }

    if (!url) {
      throw new Error("La URL es obligatoria.");
    }

    const { data: lastLink } = await supabase
      .from("ministry_social_links")
      .select("sort_order")
      .eq("ministry_id", id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabase
      .from("ministry_social_links")
      .insert({
        ministry_id: id,
        platform,
        label: label || null,
        url,
        sort_order: (lastLink?.sort_order ?? 0) + 1,
      });

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/admin/ministerios/editar/${id}`);
  }

  // ACTUALIZAR RED SOCIAL
  async function actualizarRedSocial(
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

    const linkId = String(
      formData.get("social_link_id") || ""
    );

    const ministryId = String(
      formData.get("ministry_id") || ""
    );

    const platform = String(
      formData.get("platform") || ""
    );

    const label = String(
      formData.get("label") || ""
    ).trim();

    const url = String(
      formData.get("url") || ""
    ).trim();

    const sortOrder = Number(
      formData.get("sort_order")
    );

    const allowedPlatforms = [
      "instagram",
      "facebook",
      "tiktok",
      "youtube",
      "whatsapp",
      "website",
      "other",
    ];

    if (
      !linkId ||
      ministryId !== id ||
      !allowedPlatforms.includes(platform) ||
      !Number.isInteger(sortOrder) ||
      sortOrder < 0
    ) {
      throw new Error("Los datos de la red social no son válidos.");
    }

    try {
      const parsedUrl = new URL(url);

      if (
        !["http:", "https:"].includes(parsedUrl.protocol)
      ) {
        throw new Error("URL inválida.");
      }
    } catch {
      throw new Error(
        "Ingresá una URL válida que comience con https://"
      );
    }

    const { error } = await supabase
      .from("ministry_social_links")
      .update({
        platform,
        label: label || null,
        url,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", linkId)
      .eq("ministry_id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/admin/ministerios/editar/${id}`);
  }

  // ELIMINAR RED SOCIAL
  async function eliminarRedSocial(
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

    const linkId = String(
      formData.get("social_link_id") || ""
    );

    const ministryId = String(
      formData.get("ministry_id") || ""
    );

    if (!linkId || ministryId !== id) {
      throw new Error("El enlace no es válido.");
    }

    const { error } = await supabase
      .from("ministry_social_links")
      .delete()
      .eq("id", linkId)
      .eq("ministry_id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/admin/ministerios/editar/${id}`);
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
              Administrá toda la información y el contenido de{" "}
              <span className="text-white">
                {ministry.name}
              </span>.
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
                defaultValue={ministry.description || ""}
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
                defaultValue={ministry.target_group || ""}
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
                defaultValue={ministry.schedule || ""}
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
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Orden
              </label>

              <input
                name="sort_order"
                type="number"
                defaultValue={ministry.sort_order}
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
              Personas encargadas del ministerio y sus datos de contacto.
            </p>
          </div>

          {/* AGREGAR RESPONSABLE */}
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

          {/* RESPONSABLES EXISTENTES */}
          {responsibles && responsibles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {responsibles.map((responsible, index) => (
                <div
                  key={responsible.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-neutral-300">
                        #{index + 1}
                      </span>

                      <span className="text-sm text-neutral-500">
                        Responsable
                      </span>
                    </div>

                    {/* ORDEN */}
                    <div className="flex items-center gap-2">
                      <form action={moverResponsable}>
                        <input
                          type="hidden"
                          name="responsible_id"
                          value={responsible.id}
                        />

                        <input
                          type="hidden"
                          name="direction"
                          value="up"
                        />

                        <button
                          type="submit"
                          disabled={index === 0}
                          title="Subir"
                          className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↑
                        </button>
                      </form>

                      <form action={moverResponsable}>
                        <input
                          type="hidden"
                          name="responsible_id"
                          value={responsible.id}
                        />

                        <input
                          type="hidden"
                          name="direction"
                          value="down"
                        />

                        <button
                          type="submit"
                          disabled={index === responsibles.length - 1}
                          title="Bajar"
                          className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* EDITAR RESPONSABLE */}
                  <form action={actualizarResponsable}>
                    <input
                      type="hidden"
                      name="responsible_id"
                      value={responsible.id}
                    />

                    <div className="grid gap-4">
                      <input
                        name="name"
                        required
                        defaultValue={responsible.name}
                        className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                      />

                      <input
                        name="role"
                        defaultValue={responsible.role || ""}
                        placeholder="Rol"
                        className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                      />

                      <input
                        name="whatsapp"
                        defaultValue={responsible.whatsapp || ""}
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
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-neutral-500">
                Todavía no hay responsables cargados.
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
        <MinistrySocialLinksManager
          ministryId={ministry.id}
          initialLinks={socialLinks ?? []}
          addAction={agregarRedSocial}
          updateAction={actualizarRedSocial}
          deleteAction={eliminarRedSocial}
        />
      </div>
    </main>
  );
}
