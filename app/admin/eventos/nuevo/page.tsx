import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import EventFileUpload from "@/components/admin/EventFileUpload";

async function createEvent(formData: FormData) {
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
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const videoType = String(formData.get("videoType") ?? "").trim();
    const videoExternalUrl = String(
        formData.get("videoExternalUrl") ?? ""
    ).trim();

    const videoUploadedUrl = String(
        formData.get("videoUploadedUrl") ?? ""
    ).trim();

    const videoUrl =
        videoType === "mp4"
            ? videoUploadedUrl
            : videoExternalUrl;
    const status = String(formData.get("status") ?? "draft");

    if (!title) {
        throw new Error("El nombre del evento es obligatorio.");
    }

    const { error } = await supabase.from("events").insert({
        title,
        description: description || null,
        event_date: eventDate || null,
        event_time: eventTime || null,
        location: location || null,
        image_url: imageUrl || null,
        video_type: videoType || null,
        video_url: videoUrl || null,
        status,
    });

    if (error) {
        console.error("ERROR AL CREAR EVENTO:", error);
        throw new Error(error.message);
    }

    console.log("EVENTO CREADO CORRECTAMENTE");

    revalidatePath("/admin/eventos");
    revalidatePath("/");

    redirect("/admin/eventos");
}

export default function NuevoEventoPage() {
    return (
        <main className="min-h-screen bg-neutral-950 pt-20 text-white">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <a
                    href="/admin/eventos"
                    className="text-sm text-neutral-400 hover:text-white"
                >
                    ← Volver a eventos
                </a>

                <div className="mt-6 mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                        Administración
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold">
                        Nuevo evento
                    </h1>

                    <p className="mt-2 text-sm text-neutral-400">
                        Cargá la información del evento para publicarlo en la web.
                    </p>
                </div>

                <form action={createEvent} className="space-y-6">
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
                                    placeholder="Ej. Congreso Evangelio de Paz"
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-300">
                                    Fecha
                                </label>

                                <input
                                    type="date"
                                    name="eventDate"
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
                                    placeholder="Ej. Ministerio Evangelio de Paz"
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-white/30"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm text-neutral-300">
                                    Descripción
                                </label>

                                <textarea
                                    name="description"
                                    rows={5}
                                    placeholder="Contá brevemente de qué se trata el evento..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-white/30"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <h2 className="mb-2 text-xl font-semibold">
                            Imagen del evento
                        </h2>

                        <EventFileUpload
                            bucket="event-images"
                            name="imageUrl"
                            accept="image/*"
                            label="Seleccionar imagen"
                            description="Elegí desde tu PC el flyer o imagen del evento."
                        />
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <h2 className="mb-6 text-xl font-semibold">
                            Video
                        </h2>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm text-neutral-300">
                                    Tipo
                                </label>

                                <select
                                    name="videoType"
                                    defaultValue=""
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
                                    URL del video
                                </label>

                                <input
                                    type="url"
                                    name="videoExternalUrl"
                                    placeholder="https://youtube.com/..."
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-600"
                                />
                            </div>
                        </div>

                        <div className="mt-6 border-t border-white/10 pt-6">
                            <EventFileUpload
                                bucket="event-videos"
                                name="videoUploadedUrl"
                                accept="video/mp4,video/webm,video/quicktime"
                                label="O subir un video desde tu PC"
                                description="Podés subir un archivo MP4, WebM o MOV."
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <h2 className="mb-4 text-xl font-semibold">
                            Publicación
                        </h2>

                        <label className="mb-5 block text-sm text-neutral-300">
                            Estado
                        </label>

                        <select
                            name="status"
                            defaultValue="draft"
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
                        >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                        </select>
                    </section>

                    <div className="flex justify-end gap-3">
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
                            Crear evento
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}