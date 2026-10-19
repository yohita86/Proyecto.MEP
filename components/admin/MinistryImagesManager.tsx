
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
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

const IMAGE_SELECT =
  "id, image_url, title, description, sort_order, is_primary, created_at";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function MinistryImagesManager({
  ministryId,
  initialImages,
}: MinistryImagesManagerProps) {
  const [images, setImages] = useState<MinistryImage[]>(() =>
    [...initialImages].sort((a, b) => a.sort_order - b.sort_order)
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUploadId, setEditingUploadId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sortedImages = [...images].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function getErrorMessage(err: unknown, fallback: string) {
    if (err instanceof Error) return err.message;

    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof err.message === "string"
    ) {
      return err.message;
    }

    return fallback;
  }

  function validateImage(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo seleccionado no es una imagen.");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("La imagen no puede superar los 10 MB.");
    }
  }

  async function uploadImage(file: File, folder: string): Promise<string> {
    const supabase = createClient();

    const originalExtension = file.name.split(".").pop() || "jpg";
    const extension = originalExtension
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "jpg";

    const filePath =
      `${ministryId}/${folder}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("ministry-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("ministry-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  function getStoragePath(imageUrl: string): string | null {
    const marker = "/storage/v1/object/public/ministry-images/";
    const index = imageUrl.indexOf(marker);

    if (index === -1) return null;

    const path = imageUrl.slice(index + marker.length);

    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  }

  async function handleNewImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    clearMessages();
    setUploading(true);

    try {
      validateImage(file);

      const url = await uploadImage(file, "gallery");

      setNewImageUrl(url);
      setSuccess("Imagen subida. Ahora podés agregarla a la galería.");
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setError(getErrorMessage(err, "No se pudo subir la imagen."));
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  async function handleAddImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();

    if (!newImageUrl) {
      setError("Primero seleccioná una imagen y esperá a que termine de subir.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const nextOrder =
        images.length > 0
          ? Math.max(...images.map((image) => image.sort_order)) + 1
          : 1;

      const isFirstImage = images.length === 0;

      const { data, error: insertError } = await supabase
        .from("ministry_images")
        .insert({
          ministry_id: ministryId,
          image_url: newImageUrl,
          title: newTitle.trim() || null,
          description: newDescription.trim() || null,
          sort_order: nextOrder,
          is_primary: isFirstImage,
        })
        .select(IMAGE_SELECT)
        .single();

      if (insertError) throw insertError;

      setImages((current) =>
        [...current, data].sort((a, b) => a.sort_order - b.sort_order)
      );

      setNewImageUrl("");
      setNewTitle("");
      setNewDescription("");
      setSuccess("La imagen se agregó correctamente.");
    } catch (err) {
      console.error("Error al agregar imagen:", err);
      setError(getErrorMessage(err, "No se pudo guardar la imagen."));
    } finally {
      setSaving(false);
    }
  }

  async function handleReplaceImage(
    imageId: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    clearMessages();
    setEditingUploadId(imageId);

    try {
      validateImage(file);

      const image = images.find((item) => item.id === imageId);

      if (!image) {
        throw new Error("No se encontró la imagen que querés reemplazar.");
      }

      const newUrl = await uploadImage(file, "replacements");
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("ministry_images")
        .update({
          image_url: newUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", imageId)
        .eq("ministry_id", ministryId);

      if (updateError) {
        const uploadedPath = getStoragePath(newUrl);

        if (uploadedPath) {
          await supabase.storage
            .from("ministry-images")
            .remove([uploadedPath]);
        }

        throw updateError;
      }

      setImages((current) =>
        current.map((item) =>
          item.id === imageId ? { ...item, image_url: newUrl } : item
        )
      );

      setSuccess("La imagen se reemplazó correctamente.");

      // Se elimina la imagen anterior solo después de actualizar la base de datos.
      const oldPath = getStoragePath(image.image_url);

      if (oldPath) {
        const { error: storageError } = await supabase.storage
          .from("ministry-images")
          .remove([oldPath]);

        if (storageError) {
          console.error("No se pudo eliminar el archivo anterior:", storageError);
        }
      }
    } catch (err) {
      console.error("Error al reemplazar imagen:", err);
      setError(getErrorMessage(err, "No se pudo reemplazar la imagen."));
    } finally {
      setEditingUploadId(null);
      input.value = "";
    }
  }

  async function handleUpdateImage(
    image: MinistryImage,
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    clearMessages();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    setSaving(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("ministry_images")
        .update({
          title: title || null,
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id)
        .eq("ministry_id", ministryId);

      if (updateError) throw updateError;

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
      setSuccess("Los cambios se guardaron correctamente.");
    } catch (err) {
      console.error("Error al guardar imagen:", err);
      setError(getErrorMessage(err, "No se pudieron guardar los cambios."));
    } finally {
      setSaving(false);
    }
  }

  async function saveOrder(
    orderedImages: MinistryImage[],
    primaryId: string
  ) {
    const supabase = createClient();

    if (!orderedImages.some((image) => image.id === primaryId)) {
      throw new Error("No se encontró la imagen elegida como portada.");
    }

    /*
     * Primero liberamos las posiciones actuales usando números temporales.
     * Esto evita conflictos si la base de datos exige posiciones únicas.
     */
    const { error: clearPrimaryError } = await supabase
      .from("ministry_images")
      .update({ is_primary: false })
      .eq("ministry_id", ministryId);

    if (clearPrimaryError) throw clearPrimaryError;

    for (let index = 0; index < orderedImages.length; index++) {
      const image = orderedImages[index];

      const { error: temporaryOrderError } = await supabase
        .from("ministry_images")
        .update({
          sort_order: 100000 + index,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id)
        .eq("ministry_id", ministryId);

      if (temporaryOrderError) throw temporaryOrderError;
    }

    for (let index = 0; index < orderedImages.length; index++) {
      const image = orderedImages[index];

      const { error: orderError } = await supabase
        .from("ministry_images")
        .update({
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id)
        .eq("ministry_id", ministryId);

      if (orderError) throw orderError;
    }

    const { error: primaryError } = await supabase
      .from("ministry_images")
      .update({
        is_primary: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", primaryId)
      .eq("ministry_id", ministryId);

    if (primaryError) throw primaryError;

    setImages(
      orderedImages.map((image, index) => ({
        ...image,
        sort_order: index + 1,
        is_primary: image.id === primaryId,
      }))
    );
  }

  async function handleSetPrimary(image: MinistryImage) {
    if (saving) return;

    clearMessages();
    setSaving(true);

    try {
      const orderedImages = [
        image,
        ...sortedImages.filter((item) => item.id !== image.id),
      ];

      await saveOrder(orderedImages, image.id);
      setSuccess("La portada del ministerio se actualizó correctamente.");
    } catch (err) {
      console.error("Error al establecer portada:", err);
      setError(
        getErrorMessage(
          err,
          "No se pudo establecer la portada. Revisá la conexión y volvé a intentar."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(
    image: MinistryImage,
    direction: "up" | "down"
  ) {
    if (saving) return;

    const currentIndex = sortedImages.findIndex((item) => item.id === image.id);

    if (currentIndex === -1) return;

    const newIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sortedImages.length) return;

    clearMessages();

    const orderedImages = [...sortedImages];

    [orderedImages[currentIndex], orderedImages[newIndex]] = [
      orderedImages[newIndex],
      orderedImages[currentIndex],
    ];

    // La primera imagen de la galería será también la portada.
    const primaryId = orderedImages[0].id;

    setSaving(true);

    try {
      await saveOrder(orderedImages, primaryId);
      setSuccess("El orden de las imágenes se actualizó correctamente.");
    } catch (err) {
      console.error("Error al cambiar orden:", err);
      setError(
        getErrorMessage(
          err,
          "No se pudo cambiar el orden. Volvé a intentar."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(image: MinistryImage) {
    if (deleting) return;

    clearMessages();
    setDeleting(true);

    try {
      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from("ministry_images")
        .delete()
        .eq("id", image.id)
        .eq("ministry_id", ministryId);

      if (deleteError) throw deleteError;

      const remainingImages = sortedImages.filter(
        (item) => item.id !== image.id
      );

      if (remainingImages.length === 0) {
        setImages([]);
        setDeleteId(null);
        setSuccess("La imagen se eliminó correctamente.");
      } else {
        const currentPrimary = remainingImages.find(
          (item) => item.is_primary
        );

        const primaryId = image.is_primary
          ? remainingImages[0].id
          : currentPrimary?.id ?? remainingImages[0].id;

        // Si se elimina la portada, la siguiente imagen ocupa su lugar.
        const orderedImages = [...remainingImages].sort((a, b) => {
          if (a.id === primaryId) return -1;
          if (b.id === primaryId) return 1;
          return a.sort_order - b.sort_order;
        });

        await saveOrder(orderedImages, primaryId);
        setDeleteId(null);
        setSuccess(
          image.is_primary
            ? "La imagen se eliminó y se asignó una nueva portada."
            : "La imagen se eliminó correctamente."
        );
      }

      // El registro ya fue eliminado; intentamos quitar también el archivo.
      const filePath = getStoragePath(image.image_url);

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("ministry-images")
          .remove([filePath]);

        if (storageError) {
          console.error("No se pudo eliminar el archivo de Storage:", storageError);
        }
      }
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      setError(
        getErrorMessage(
          err,
          "No se pudo completar la eliminación. Revisá los permisos y volvé a intentar."
        )
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-400">
            Contenido visual
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Imágenes</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Elegí la portada y ordená las imágenes del ministerio.
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-neutral-400">
          {images.length} {images.length === 1 ? "imagen" : "imágenes"}
        </span>
      </div>

      {(error || success) && (
        <div
          role="status"
          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-500/20 bg-red-500/10 text-red-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {error || success}
        </div>
      )}

      {/* AGREGAR IMAGEN */}
      <form
        onSubmit={handleAddImage}
        className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4"
      >
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">
            Agregar imagen
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Formatos de imagen · Máximo 10 MB
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/30">
              {newImageUrl ? (
                <img
                  src={newImageUrl}
                  alt="Vista previa de la nueva imagen"
                  className="h-full w-full object-cover"
                />
              ) : (
                <label
                  htmlFor="ministry-image-upload"
                  className="flex h-full cursor-pointer flex-col items-center justify-center px-2 text-center transition hover:bg-white/[0.05]"
                >
                  <span className="text-2xl">📷</span>
                  <span className="mt-2 text-xs font-medium text-white">
                    {uploading ? "Subiendo..." : "Elegir imagen"}
                  </span>
                </label>
              )}
            </div>

            <input
              id="ministry-image-upload"
              type="file"
              accept="image/*"
              onChange={handleNewImageUpload}
              disabled={uploading || saving}
              className="sr-only"
            />

            {newImageUrl && (
              <label className="mt-2 block cursor-pointer text-center text-xs text-neutral-400 hover:text-amber-300">
                Cambiar archivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewImageUpload}
                  disabled={uploading || saving}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="new-image-title"
                className="mb-1.5 block text-xs font-medium text-neutral-300"
              >
                Título
              </label>
              <input
                id="new-image-title"
                type="text"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Ej.: Jóvenes compartiendo"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-amber-400/50"
              />
            </div>

            <div>
              <label
                htmlFor="new-image-description"
                className="mb-1.5 block text-xs font-medium text-neutral-300"
              >
                Descripción
              </label>
              <textarea
                id="new-image-description"
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
                rows={2}
                placeholder="Descripción opcional..."
                className="w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-amber-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={!newImageUrl || saving || uploading}
              className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Guardando..." : "Agregar a la galería"}
            </button>
          </div>
        </div>
      </form>

      {/* GALERÍA */}
      <div className="mt-7">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Galería cargada
        </h3>

        {sortedImages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
            <p className="text-sm text-neutral-400">
              Todavía no hay imágenes cargadas.
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              La primera imagen que agregues será la portada.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedImages.map((image, index) => {
              const isFirst = index === 0;
              const isLast = index === sortedImages.length - 1;

              return (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900/70"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
                    <img
                      src={image.image_url}
                      alt={image.title || "Imagen del ministerio"}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white">
                        #{index + 1}
                      </span>

                      {image.is_primary && (
                        <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-black">
                          ⭐ Portada
                        </span>
                      )}
                    </div>

                    <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-black/75 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black">
                      {editingUploadId === image.id
                        ? "Subiendo..."
                        : "Cambiar foto"}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={
                          saving ||
                          deleting ||
                          editingUploadId === image.id
                        }
                        onChange={(event) =>
                          handleReplaceImage(image.id, event)
                        }
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div className="p-4">
                    {editingId === image.id ? (
                      <form onSubmit={(event) => handleUpdateImage(image, event)}>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                            Título
                          </label>
                          <input
                            name="title"
                            defaultValue={image.title || ""}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                          />
                        </div>

                        <div className="mt-3">
                          <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                            Descripción
                          </label>
                          <textarea
                            name="description"
                            defaultValue={image.description || ""}
                            rows={3}
                            className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-semibold text-black disabled:opacity-50"
                          >
                            {saving ? "Guardando..." : "Guardar cambios"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            disabled={saving}
                            className="rounded-lg border border-white/10 px-3.5 py-2 text-xs text-neutral-300 hover:bg-white/5 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h4 className="truncate text-sm font-semibold text-white">
                          {image.title || "Sin título"}
                        </h4>

                        <p className="mt-1 min-h-5 text-xs leading-5 text-neutral-500">
                          {image.description || "Sin descripción"}
                        </p>

                        <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-3">
                          <button
                            type="button"
                            onClick={() => handleMove(image, "up")}
                            disabled={isFirst || saving || deleting}
                            title="Subir posición"
                            aria-label="Subir posición"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMove(image, "down")}
                            disabled={isLast || saving || deleting}
                            title="Bajar posición"
                            aria-label="Bajar posición"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            ↓
                          </button>

                          <span className="ml-1 text-[11px] text-neutral-600">
                            Orden
                          </span>

                          <div className="flex-1" />

                          <button
                            type="button"
                            onClick={() => {
                              clearMessages();
                              setEditingId(image.id);
                            }}
                            disabled={saving || deleting}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-white disabled:opacity-40"
                          >
                            ✏️ Editar
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          {!image.is_primary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(image)}
                              disabled={saving || deleting}
                              className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-400/10 disabled:opacity-40"
                            >
                              ⭐ Hacer portada
                            </button>
                          ) : (
                            <span className="px-1 text-xs font-medium text-amber-400">
                              ⭐ Portada actual
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              clearMessages();
                              setDeleteId(image.id);
                            }}
                            disabled={saving || deleting}
                            aria-label={`Eliminar ${image.title || "imagen"}`}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteId(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-image-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xl">
                🗑️
              </div>

              <div>
                <h2
                  id="delete-image-title"
                  className="text-lg font-semibold text-white"
                >
                  ¿Eliminar imagen?
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {images.find((item) => item.id === deleteId)?.is_primary
                    ? "Esta es la portada actual. Si la eliminás, otra imagen ocupará su lugar."
                    : "La imagen se quitará de la galería. Esta acción no se puede deshacer."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  const image = images.find((item) => item.id === deleteId);
                  if (image) void handleDelete(image);
                }}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
