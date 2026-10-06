"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MinistryImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

type MinistryImagesManagerProps = {
  ministryId: string;
  initialImages: MinistryImage[];
};

export default function MinistryImagesManager({
  ministryId,
  initialImages,
}: MinistryImagesManagerProps) {
  const [images, setImages] = useState<MinistryImage[]>(
    [...initialImages].sort(
      (a, b) => a.sort_order - b.sort_order
    )
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUploadId, setEditingUploadId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function uploadImage(
    file: File,
    folder: string
  ): Promise<string> {
    const supabase = createClient();

    const extension =
      file.name.split(".").pop() || "jpg";

    const filePath = `${ministryId}/${folder}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("ministry-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("ministry-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleNewImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen no puede superar los 10 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const url = await uploadImage(file, "gallery");

      setNewImageUrl(url);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir la imagen."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleAddImage(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!newImageUrl) {
      setError("Primero seleccioná una imagen.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();

      const nextOrder =
        images.length > 0
          ? Math.max(
              ...images.map((image) => image.sort_order)
            ) + 1
          : 1;

      // Si es la primera imagen, será la portada automáticamente.
      const isFirstImage = images.length === 0;

      const { data, error: insertError } = await supabase
        .from("ministry_images")
        .insert({
          ministry_id: ministryId,
          image_url: newImageUrl,
          title: newTitle || null,
          description: newDescription || null,
          sort_order: nextOrder,
          is_primary: isFirstImage,
        })
        .select(
          "id, image_url, title, description, sort_order, is_primary, created_at"
        )
        .single();

      if (insertError) {
        throw insertError;
      }

      setImages((current) =>
        [...current, data].sort(
          (a, b) => a.sort_order - b.sort_order
        )
      );

      setNewImageUrl("");
      setNewTitle("");
      setNewDescription("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la imagen."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReplaceImage(
    imageId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setEditingUploadId(imageId);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error(
          "El archivo seleccionado no es una imagen."
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error(
          "La imagen no puede superar los 10 MB."
        );
      }

      const url = await uploadImage(
        file,
        "replacements"
      );

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("ministry_images")
        .update({
          image_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", imageId);

      if (updateError) {
        throw updateError;
      }

      setImages((current) =>
        current.map((image) =>
          image.id === imageId
            ? {
                ...image,
                image_url: url,
              }
            : image
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo reemplazar la imagen."
      );
    } finally {
      setEditingUploadId(null);
      event.target.value = "";
    }
  }

  async function handleUpdateImage(
    image: MinistryImage,
    form: HTMLFormElement
  ) {
    setSaving(true);
    setError("");

    try {
      const formData = new FormData(form);

      const title = String(
        formData.get("title") || ""
      );

      const description = String(
        formData.get("description") || ""
      );

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("ministry_images")
        .update({
          title: title || null,
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id);

      if (updateError) {
        throw updateError;
      }

      setImages((current) =>
        current.map((item) =>
          item.id === image.id
            ? {
                ...item,
                title: title || null,
                description: description || null,
              }
            : item
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar los cambios."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveOrder(
    orderedImages: MinistryImage[],
    primaryId: string
  ) {
    const supabase = createClient();

    /*
     * Primero quitamos todas las portadas.
     * Esto evita conflictos con el trigger de Supabase.
     */
    const { error: clearPrimaryError } = await supabase
      .from("ministry_images")
      .update({
        is_primary: false,
      })
      .eq("ministry_id", ministryId);

    if (clearPrimaryError) {
      throw clearPrimaryError;
    }

    /*
     * Guardamos las posiciones.
     */
    for (let index = 0; index < orderedImages.length; index++) {
      const image = orderedImages[index];

      const { error: orderError } = await supabase
        .from("ministry_images")
        .update({
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id);

      if (orderError) {
        throw orderError;
      }
    }

    /*
     * Finalmente marcamos la portada.
     */
    const { error: primaryError } = await supabase
      .from("ministry_images")
      .update({
        is_primary: true,
        sort_order: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", primaryId);

    if (primaryError) {
      throw primaryError;
    }

    /*
     * Actualizamos el estado local.
     */
    setImages(
      orderedImages.map((image, index) => ({
        ...image,
        sort_order: index + 1,
        is_primary: image.id === primaryId,
      }))
    );
  }

  async function handleSetPrimary(
    image: MinistryImage
  ) {
    setSaving(true);
    setError("");

    try {
      const orderedImages = [
        image,
        ...images.filter(
          (item) => item.id !== image.id
        ),
      ];

      await saveOrder(
        orderedImages,
        image.id
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo establecer la portada."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(
    image: MinistryImage,
    direction: "up" | "down"
  ) {
    const currentIndex = images.findIndex(
      (item) => item.id === image.id
    );

    if (currentIndex === -1) return;

    const newIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      newIndex < 0 ||
      newIndex >= images.length
    ) {
      return;
    }

    const orderedImages = [...images];

    [
      orderedImages[currentIndex],
      orderedImages[newIndex],
    ] = [
      orderedImages[newIndex],
      orderedImages[currentIndex],
    ];

    /*
     * La imagen que queda en #1 siempre es la portada.
     */
    const primaryId = orderedImages[0].id;

    setSaving(true);
    setError("");

    try {
      await saveOrder(
        orderedImages,
        primaryId
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cambiar el orden."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    image: MinistryImage
  ) {
    setDeleting(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: deleteError } =
        await supabase
          .from("ministry_images")
          .delete()
          .eq("id", image.id);

      if (deleteError) {
        throw deleteError;
      }

      /*
       * Eliminamos también el archivo de Storage.
       */
      const marker =
        "/storage/v1/object/public/ministry-images/";

      const index =
        image.image_url.indexOf(marker);

      if (index !== -1) {
        const filePath =
          image.image_url.slice(
            index + marker.length
          );

        const { error: storageError } =
          await supabase.storage
            .from("ministry-images")
            .remove([filePath]);

        if (storageError) {
          console.error(
            "No se pudo eliminar el archivo de Storage:",
            storageError
          );
        }
      }

      const remainingImages = images.filter(
        (item) => item.id !== image.id
      );

      if (remainingImages.length === 0) {
        setImages([]);
        setDeleteId(null);
        return;
      }

      /*
       * Si eliminamos una imagen, reorganizamos todo.
       * La primera pasa a ser la portada.
       */
      const orderedImages =
        remainingImages
          .sort(
            (a, b) =>
              a.sort_order - b.sort_order
          );

      const primaryId =
        image.is_primary
          ? orderedImages[0].id
          : orderedImages.find(
              (item) => item.is_primary
            )?.id || orderedImages[0].id;

      await saveOrder(
        orderedImages,
        primaryId
      );

      setDeleteId(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la imagen."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          Contenido visual
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Imágenes
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          Administrá la portada y la galería de imágenes del ministerio.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* AGREGAR IMAGEN */}

      <form
        onSubmit={handleAddImage}
        className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5"
      >
        <h3 className="text-base font-semibold text-white">
          Agregar nueva imagen
        </h3>

        <div className="mt-5 grid gap-6 lg:grid-cols-[180px_1fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {newImageUrl ? (
                <img
                  src={newImageUrl}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <label
                  htmlFor="ministry-image-upload"
                  className="flex h-full cursor-pointer flex-col items-center justify-center px-4 text-center transition hover:bg-white/[0.04]"
                >
                  <span className="text-2xl">
                    📷
                  </span>

                  <span className="mt-2 text-xs font-medium text-white">
                    {uploading
                      ? "Subiendo..."
                      : "Seleccionar imagen"}
                  </span>

                  <span className="mt-1 text-[11px] text-neutral-500">
                    Máx. 10 MB
                  </span>
                </label>
              )}
            </div>

            <input
              id="ministry-image-upload"
              type="file"
              accept="image/*"
              onChange={
                handleNewImageUpload
              }
              disabled={uploading}
              className="hidden"
            />

            {newImageUrl && (
              <label className="mt-3 block cursor-pointer text-center text-xs text-neutral-400 hover:text-white">
                Cambiar imagen

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleNewImageUpload
                  }
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Título
              </label>

              <input
                type="text"
                value={newTitle}
                onChange={(event) =>
                  setNewTitle(
                    event.target.value
                  )
                }
                placeholder="Ej: Jóvenes compartiendo"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Descripción
              </label>

              <textarea
                value={newDescription}
                onChange={(event) =>
                  setNewDescription(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Descripción opcional..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-amber-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={
                !newImageUrl ||
                saving ||
                uploading
              }
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Guardando..."
                : "Agregar imagen"}
            </button>
          </div>
        </div>
      </form>

      {/* GALERÍA */}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            Imágenes cargadas
          </h3>

          <span className="text-xs text-neutral-500">
            {images.length}{" "}
            {images.length === 1
              ? "imagen"
              : "imágenes"}
          </span>
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-neutral-500">
              Todavía no hay imágenes cargadas.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {images
              .slice()
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order
              )
              .map((image, index) => {
                const isFirst = index === 0;
                const isLast =
                  index === images.length - 1;

                return (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-neutral-900">
                      <img
                        src={image.image_url}
                        alt={
                          image.title ||
                          "Imagen del ministerio"
                        }
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <div className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          #{index + 1}
                        </div>

                        {image.is_primary && (
                          <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black shadow-lg">
                            ⭐ Portada
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      {editingId === image.id ? (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();

                            handleUpdateImage(
                              image,
                              event.currentTarget
                            );
                          }}
                        >
                          <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Título
                            </label>

                            <input
                              name="title"
                              defaultValue={
                                image.title || ""
                              }
                              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                            />
                          </div>

                          <div className="mt-4">
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Descripción
                            </label>

                            <textarea
                              name="description"
                              defaultValue={
                                image.description ||
                                ""
                              }
                              rows={3}
                              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                            />
                          </div>

                          <div className="mt-5 flex gap-3">
                            <button
                              type="submit"
                              disabled={saving}
                              className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
                            >
                              {saving
                                ? "Guardando..."
                                : "Guardar"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setEditingId(null)
                              }
                              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-white">
                                {image.title ||
                                  "Sin título"}
                              </h4>

                              {image.description && (
                                <p className="mt-2 text-sm leading-5 text-neutral-500">
                                  {
                                    image.description
                                  }
                                </p>
                              )}
                            </div>

                            <span className="shrink-0 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs font-semibold text-neutral-400">
                              #{index + 1}
                            </span>
                          </div>

                          {/* ORDEN */}

                          <div className="mt-5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleMove(
                                  image,
                                  "up"
                                )
                              }
                              disabled={
                                isFirst ||
                                saving
                              }
                              title="Subir posición"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleMove(
                                  image,
                                  "down"
                                )
                              }
                              disabled={
                                isLast ||
                                saving
                              }
                              title="Bajar posición"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                            >
                              ↓
                            </button>

                            <span className="ml-1 text-xs text-neutral-600">
                              Mover posición
                            </span>
                          </div>

                          {/* ACCIONES */}

                          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingId(
                                  image.id
                                )
                              }
                              className="text-sm font-medium text-white transition hover:text-amber-300"
                            >
                              Editar ✏️
                            </button>

                            <label className="cursor-pointer text-sm font-medium text-white transition hover:text-amber-300">
                              {editingUploadId ===
                              image.id
                                ? "Subiendo..."
                                : "Cambiar imagen 🖼️"}

                              <input
                                type="file"
                                accept="image/*"
                                disabled={
                                  editingUploadId ===
                                  image.id
                                }
                                onChange={(event) =>
                                  handleReplaceImage(
                                    image.id,
                                    event
                                  )
                                }
                                className="hidden"
                              />
                            </label>

                            {!image.is_primary && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleSetPrimary(
                                    image
                                  )
                                }
                                disabled={saving}
                                className="text-sm font-medium text-amber-400 transition hover:text-amber-300 disabled:opacity-40"
                              >
                                ⭐ Portada
                              </button>
                            )}

                            {image.is_primary && (
                              <span className="text-sm font-medium text-amber-400">
                                ⭐ Portada actual
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteId(
                                  image.id
                                )
                              }
                              className="text-sm font-medium text-red-400 transition hover:text-red-300"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </div>

      {/* MODAL ELIMINAR */}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xl">
                🗑️
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  ¿Eliminar imagen?
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleting}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  const image =
                    images.find(
                      (item) =>
                        item.id === deleteId
                    );

                  if (image) {
                    handleDelete(image);
                  }
                }}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleting
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}