import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateMessage(id: string, formData: FormData) {
  "use server";

  const supabase = await createClient();

  // Verificar usuario
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Verificar que sea administrador
  const { data: adminRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !adminRole) {
    redirect("/admin");
  }

  // Obtener datos del formulario
  const title = String(formData.get("title") ?? "").trim();
  const preacher = String(formData.get("preacher") ?? "").trim();
  const dateValue = String(formData.get("date") ?? "").trim();
  const videoType = String(formData.get("videoType") ?? "youtube");
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();
  const published = formData.get("published") === "on";

  // Validación
  if (!title) {
    throw new Error("El título del mensaje es obligatorio.");
  }

  // Actualizar mensaje
  const { error } = await supabase
    .from("messages")
    .update({
      title,
      preacher: preacher || null,
      date: dateValue || null,
      video_type: videoType,
      video_url: videoUrl || null,
      thumbnail_url: thumbnail || null,
      published,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  // Actualizar las páginas relacionadas
  revalidatePath("/admin/mensajes");
  revalidatePath("/mensajes");

  // Volver a la lista
  redirect("/admin/mensajes");
}

export default async function EditarMensajePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // Verificar usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verificar administrador
  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!adminRole) {
    redirect("/admin");
  }

  // Buscar mensaje
  const { data: message, error } = await supabase
    .from("messages")
    .select(
      "id, title, preacher, date, video_type, video_url, thumbnail_url, published"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !message) {
    redirect("/admin/mensajes");
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-20 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Encabezado */}
        <div className="mb-8">
          <a
            href="/admin/mensajes"
            className="mb-4 inline-block text-sm text-neutral-400 transition hover:text-white"
          >
            ← Volver a mensajes
          </a>

          <h1 className="text-3xl font-bold">Editar mensaje</h1>

          <p className="mt-2 text-neutral-400">
            Modificá la información de esta prédica o video.
          </p>
        </div>

        <form
          action={updateMessage.bind(null, message.id)}
          className="space-y-6"
        >
          {/* Información */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Información del mensaje
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-neutral-300">
                  Título
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={message.title}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Predicador
                </label>

                <input
                  type="text"
                  name="preacher"
                  defaultValue={message.preacher ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Fecha
                </label>

                <input
                  type="date"
                  name="date"
                  defaultValue={message.date ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
                />
              </div>
            </div>
          </section>

          {/* Video */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-semibold">Video</h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Tipo de video
                </label>

                <select
                  name="videoType"
                  defaultValue={message.video_type ?? "youtube"}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="mp4">MP4</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-neutral-300">
                  URL del video
                </label>

                <input
                  type="url"
                  name="videoUrl"
                  defaultValue={message.video_url ?? ""}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                />
              </div>
            </div>
          </section>

          {/* Miniatura */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">Miniatura</h2>

            <p className="mb-5 text-sm text-neutral-400">
              Podés ingresar una URL de imagen. Si la dejás vacía, YouTube
              intentará proporcionar automáticamente la portada del video.
            </p>

            <input
              type="url"
              name="thumbnail"
              defaultValue={message.thumbnail_url ?? ""}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
            />
          </section>

          {/* Publicación */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold">Publicación</h2>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="published"
                defaultChecked={message.published}
                className="h-4 w-4 rounded border-white/20 bg-black/30"
              />

              <span className="text-sm text-neutral-300">
                Publicar este mensaje en la web
              </span>
            </label>
          </section>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <a
              href="/admin/mensajes"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/5 hover:text-white"
            >
              Cancelar
            </a>

            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}