
"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import EventFileUpload from "@/components/admin/EventFileUpload";

type EditarEventoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function updateEvent(
  id: string,
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

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const eventTime = String(formData.get("eventTime") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  const removeImage = formData.get("removeImage") === "true";
  const removeVideo = formData.get("removeVideo") === "true";

  const existingImageUrl = String(
    formData.get("existingImageUrl") ?? ""
  ).trim();

  const newImageUrl = String(
    formData.get("imageUrl") ?? ""
  ).trim();

  const imageUrl = removeImage
    ? null
    : newImageUrl || existingImageUrl || null;

  const videoType = String(
    formData.get("videoType") ?? ""
  ).trim();

  const existingVideoUrl = String(
    formData.get("existingVideoUrl") ?? ""
  ).trim();

  const videoExternalUrl = String(
    formData.get("videoExternalUrl") ?? ""
  ).trim();

  const videoUploadedUrl = String(
    formData.get("videoUploadedUrl") ?? ""
  ).trim();

  let videoUrl: string | null = existingVideoUrl || null;

  if (removeVideo || !videoType) {
    videoUrl = null;
  } else if (videoType === "mp4") {
    if (videoUploadedUrl) {
      videoUrl = videoUploadedUrl;
    } else if (
      !existingVideoUrl ||
      existingVideoUrl === videoExternalUrl
    ) {
      videoUrl = null;
    }
  } else if (videoType === "youtube" || videoType === "vimeo") {
    videoUrl = videoExternalUrl || existingVideoUrl || null;
  } else {
    videoUrl = null;
  }

  const status = String(
    formData.get("status") ?? "draft"
  ).trim();

  if (!title) {
    throw new Error("El nombre del evento es obligatorio.");
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: description || null,
      event_date: eventDate || null,
      event_time: eventTime || null,
      location: location || null,
      image_url: imageUrl,
      video_type: videoUrl ? videoType || null : null,
      video_url: videoUrl,
      status,
    })
    .eq("id", id);

  if (error) {
    console.error("ERROR AL ACTUALIZAR EVENTO:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/eventos");
  revalidatePath(`/admin/eventos/editar/${id}`);
  revalidatePath("/eventos");
  revalidatePath("/");

  redirect("/admin/eventos");
}

export default async function EditarEventoPage({
  params,
}: EditarEventoPageProps) {
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

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_date, event_time, image_url, status, location, video_type, video_url"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  const isExternalVideo =
    event.video_type === "youtube" ||
    event.video_type === "vimeo";

  return (
    <main className="min-h-screen bg-neutral-950 pt-20 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <a
          href="/admin/eventos"
          className="text-sm text-neutral-400 hover:text-white"
        >
          ← Volver a eventos
        </a>

        <div className="mb-8 mt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Editar evento
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Modificá la información, la imagen y el video del evento.
          </p>
        </div>

        <form
          action={updateEvent.bind(null, event.id)}
          className="space-y-6"
        >
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Información del evento
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-neutral-300">
                  Nombre del evento
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={event.title}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Fecha
                </label>

                <input
                  type="date"
                  name="eventDate"
                  defaultValue={event.event_date ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Hora
                </label>

                <input
                  type="time"
                  name="eventTime"
                  defaultValue={
                    event.event_time
                      ? event.event_time.slice(0, 5)
                      : ""
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-neutral-300">
                  Lugar
                </label>

                <input
                  type="text"
                  name="location"
                  defaultValue={event.location ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-neutral-300">
                  Descripción
                </label>

                <textarea
                  name="description"
                  rows={5}
                  defaultValue={event.description ?? ""}
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-2 text-xl font-semibold">
              Imagen del evento
            </h2>

            <p className="mb-5 text-sm text-neutral-400">
              La imagen puede acompañar al video en la página pública.
            </p>

            <input
              type="hidden"
              name="existingImageUrl"
              value={event.image_url ?? ""}
              readOnly
            />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={`Imagen de ${event.title}`}
                  className="h-28 w-44 shrink-0 rounded-lg border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-28 w-44 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 bg-black/20 text-sm text-neutral-500">
                  Sin imagen
                </div>
              )}

              <div className="min-w-0 flex-1">
                <EventFileUpload
                  bucket="event-images"
                  name="imageUrl"
                  accept="image/*"
                  label="Cambiar imagen"
                  description="Seleccioná una imagen nueva para reemplazar la actual."
                />

                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-red-300">
                  <input
                    type="checkbox"
                    name="removeImage"
                    value="true"
                    className="h-4 w-4 accent-red-500"
                  />
                  Quitar imagen de este evento
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-2 text-xl font-semibold">
              Video del evento
            </h2>

            <p className="mb-5 text-sm text-neutral-400">
              Podés conservarlo, reemplazarlo o quitarlo por completo.
            </p>

            <input
              type="hidden"
              name="existingVideoUrl"
              value={event.video_url ?? ""}
              readOnly
            />

            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-3xl">
                <span aria-hidden="true">▶</span>
              </div>

              <div className="min-w-0">
                <p className="font-medium">
                  {event.video_url ? "Video cargado" : "Sin video"}
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  {event.video_url
                    ? `Tipo: ${event.video_type ?? "no especificado"}`
                    : "Todavía no se agregó un video."}
                </p>

                {event.video_url && (
                  <a
                    href={event.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block break-all text-xs text-amber-400 hover:text-amber-300"
                  >
                    Abrir video actual ↗
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Tipo de video
                </label>

                <select
                  name="videoType"
                  defaultValue={event.video_type ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  <option value="">Sin video</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="mp4">MP4</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-neutral-300">
                  URL de YouTube o Vimeo
                </label>

                <input
                  type="url"
                  name="videoExternalUrl"
                  defaultValue={isExternalVideo ? event.video_url ?? "" : ""}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <EventFileUpload
                bucket="event-videos"
                name="videoUploadedUrl"
                accept="video/mp4,video/webm,video/quicktime"
                label="Subir o reemplazar video desde tu PC"
                description="Formatos admitidos: MP4, WebM o MOV."
              />
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-red-300">
              <input
                type="checkbox"
                name="removeVideo"
                value="true"
                className="h-4 w-4 accent-red-500"
              />
              Quitar video de este evento
            </label>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Publicación
            </h2>

            <label className="mb-2 block text-sm text-neutral-300">
              Estado
            </label>

            <select
              name="status"
              defaultValue={event.status ?? "draft"}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </section>

          <div className="flex flex-wrap justify-end gap-3">
            <a
              href="/admin/eventos"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
            >
              Cancelar
            </a>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}