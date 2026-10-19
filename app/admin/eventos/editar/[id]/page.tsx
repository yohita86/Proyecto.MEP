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

  const existingImageUrl = String(
    formData.get("existingImageUrl") ?? ""
  ).trim();

  const newImageUrl = String(
    formData.get("imageUrl") ?? ""
  ).trim();

  const removeImage =
    formData.get("removeImage") === "true";

  const existingVideoUrl = String(
    formData.get("existingVideoUrl") ?? ""
  ).trim();

  const videoType = String(
    formData.get("videoType") ?? ""
  ).trim();

  const videoExternalUrl = String(
    formData.get("videoExternalUrl") ?? ""
  ).trim();

  const videoUploadedUrl = String(
    formData.get("videoUploadedUrl") ?? ""
  ).trim();

  const removeVideo =
    formData.get("removeVideo") === "true";

  const status = String(
    formData.get("status") ?? "draft"
  ).trim();

  if (!title) {
    throw new Error("El nombre del evento es obligatorio.");
  }

  /*
   * IMAGEN
   */

  let imageUrl: string | null = existingImageUrl || null;

  if (newImageUrl) {
    imageUrl = newImageUrl;
  } else if (removeImage) {
    imageUrl = null;
  }

  /*
   * VIDEO
   *
   * Un archivo nuevo siempre tiene prioridad.
   * Si se sube un MP4, reemplaza automáticamente
   * al YouTube/Vimeo anterior.
   */

  let videoUrl: string | null = existingVideoUrl || null;
  let finalVideoType: string | null = videoType || null;

  if (videoUploadedUrl) {
    videoUrl = videoUploadedUrl;
    finalVideoType = "mp4";
  } else if (
    videoExternalUrl &&
    (videoType === "youtube" || videoType === "vimeo")
  ) {
    videoUrl = videoExternalUrl;
    finalVideoType = videoType;
  } else if (removeVideo) {
    videoUrl = null;
    finalVideoType = null;
  } else if (!videoType) {
    videoUrl = null;
    finalVideoType = null;
  }

  if (!videoUrl) {
    finalVideoType = null;
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
      video_type: finalVideoType,
      video_url: videoUrl,
      status,
    })
    .eq("id", id);

  if (error) {
    console.error(
      "ERROR AL ACTUALIZAR EVENTO:",
      error
    );

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
            Modificá la información del evento y sus contenidos.
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
              Podés conservar la imagen actual o seleccionar otra para reemplazarla.
            </p>

            <input
              type="hidden"
              name="existingImageUrl"
              value={event.image_url ?? ""}
              readOnly
            />

            <EventFileUpload
              bucket="event-images"
              name="imageUrl"
              accept="image/*"
              label="Imagen"
              description="Seleccioná una nueva imagen desde tu PC."
              initialUrl={event.image_url ?? ""}
              removeName="removeImage"
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-2 text-xl font-semibold">
              Video del evento
            </h2>

            <p className="mb-6 text-sm text-neutral-400">
              Podés conservar el video actual, reemplazarlo por otro o quitarlo.
            </p>

            <input
              type="hidden"
              name="existingVideoUrl"
              value={event.video_url ?? ""}
              readOnly
            />

            {isExternalVideo && event.video_url && (
              <div className="mb-6 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="text-sm font-medium text-neutral-300">
                    Video actual
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-400">
                    {event.video_type === "youtube"
                      ? "YouTube"
                      : "Vimeo"}
                  </span>
                </div>

                <div className="p-4">
                  <a
                    href={event.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-amber-400 hover:text-amber-300"
                  >
                    {event.video_url}
                  </a>
                </div>
              </div>
            )}

            {event.video_type === "mp4" &&
              event.video_url && (
                <div className="mb-6 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-sm font-medium text-neutral-300">
                      Video actual
                    </span>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-400">
                      MP4
                    </span>
                  </div>

                  <div className="p-4">
                    <video
                      src={event.video_url}
                      controls
                      className="max-h-80 w-full rounded-lg bg-black object-contain"
                    />
                  </div>
                </div>
              )}

            <div className="mb-6">
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

            <div className="mb-6">
              <label className="mb-2 block text-sm text-neutral-300">
                URL de YouTube o Vimeo
              </label>

              <input
                type="url"
                name="videoExternalUrl"
                defaultValue={
                  isExternalVideo
                    ? event.video_url ?? ""
                    : ""
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-600"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <EventFileUpload
                bucket="event-videos"
                name="videoUploadedUrl"
                accept="video/mp4,video/webm,video/quicktime"
                label="Reemplazar con un archivo"
                description="Seleccioná un MP4, WebM o MOV desde tu PC."
              />
            </div>

            {event.video_url && (
              <p className="mt-4 text-xs text-neutral-600">
                Si seleccionás un archivo nuevo, reemplazará automáticamente al video actual al guardar.
              </p>
            )}
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