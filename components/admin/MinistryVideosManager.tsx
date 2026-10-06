"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type VideoType = "youtube" | "vimeo" | "mp4";

type MinistryVideo = {
  id: string;
  ministry_id: string;
  title: string | null;
  description: string | null;
  video_type: VideoType;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
};

type MinistryVideosManagerProps = {
  ministryId: string;
  initialVideos: MinistryVideo[];
};

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname
        .replace("/", "")
        .split("?")[0];
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname
          .split("/")[2]
          ?.split("?")[0];
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname
          .split("/")[2]
          ?.split("?")[0];
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumbnail(url: string) {
  const id = getYouTubeId(url);

  if (!id) {
    return null;
  }

  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

function getFileExtension(fileName: string) {
  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase();

  return extension || "mp4";
}

function getSafeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-");
}

async function uploadFile(
  file: File,
  bucket: string,
  folder: string
): Promise<string> {
  const supabase = createClient();

  const extension = getFileExtension(file.name);

  const safeName = getSafeFileName(
    file.name.replace(/\.[^/.]+$/, "")
  );

  const filePath = `${folder}/${crypto.randomUUID()}-${safeName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/*
 * Genera una miniatura tomando un fotograma del MP4.
 */
async function generateVideoThumbnail(
  file: File
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    const objectUrl = URL.createObjectURL(file);

    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.addEventListener("loadedmetadata", () => {
      const duration = Number.isFinite(video.duration)
        ? video.duration
        : 0;

      const targetTime =
        duration > 0
          ? Math.min(1.5, Math.max(0, duration / 3))
          : 0;

      video.currentTime = targetTime;
    });

    video.addEventListener("seeked", () => {
      try {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(objectUrl);

          reject(
            new Error(
              "No se pudo generar la miniatura."
            )
          );

          return;
        }

        context.drawImage(
          video,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              reject(
                new Error(
                  "No se pudo crear la miniatura."
                )
              );

              return;
            }

            resolve(blob);
          },
          "image/jpeg",
          0.88
        );
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    });

    video.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error(
          "No se pudo leer el video para generar la miniatura."
        )
      );
    });
  });
}

async function uploadThumbnailBlob(
  ministryId: string,
  blob: Blob
): Promise<string> {
  const supabase = createClient();

  const filePath = `${ministryId}/thumbnails/auto-${crypto.randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("ministry-videos")
    .upload(filePath, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/jpeg",
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("ministry-videos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function generateAutomaticThumbnail(
  ministryId: string,
  videoType: VideoType,
  videoUrl: string,
  videoFile?: File | null
): Promise<string | null> {
  if (videoType === "youtube") {
    return getYouTubeThumbnail(videoUrl);
  }

  if (videoType === "mp4" && videoFile) {
    const thumbnailBlob =
      await generateVideoThumbnail(videoFile);

    return uploadThumbnailBlob(
      ministryId,
      thumbnailBlob
    );
  }

  return null;
}

export default function MinistryVideosManager({
  ministryId,
  initialVideos,
}: MinistryVideosManagerProps) {
  const [videos, setVideos] = useState<MinistryVideo[]>(
    [...initialVideos].sort(
      (a, b) => a.sort_order - b.sort_order
    )
  );

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [newVideoType, setNewVideoType] =
    useState<VideoType>("youtube");

  const [newVideoUrl, setNewVideoUrl] =
    useState("");

  const [newVideoFile, setNewVideoFile] =
    useState<File | null>(null);

  const [newTitle, setNewTitle] =
    useState("");

  const [newDescription, setNewDescription] =
    useState("");

  const [newThumbnailFile, setNewThumbnailFile] =
    useState<File | null>(null);

  const [newThumbnailUrl, setNewThumbnailUrl] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingUploadId, setEditingUploadId] =
    useState<string | null>(null);

  const [editingThumbnailId, setEditingThumbnailId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  /*
   * SUBIR VIDEO MP4
   */

  async function handleNewVideoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !file.type.startsWith("video/")
    ) {
      setError(
        "El archivo seleccionado no es un video."
      );

      event.target.value = "";

      return;
    }

    setUploading(true);

    try {
      const url = await uploadFile(
        file,
        "ministry-videos",
        `${ministryId}/videos`
      );

      setNewVideoFile(file);
      setNewVideoUrl(url);

      /*
       * Generamos automáticamente la miniatura
       * del MP4.
       */
      const thumbnailUrl =
        await generateAutomaticThumbnail(
          ministryId,
          "mp4",
          url,
          file
        );

      setNewThumbnailUrl(
        thumbnailUrl || ""
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir el video."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  /*
   * SUBIR MINIATURA PERSONALIZADA
   */

  async function handleNewThumbnailUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError(
        "El archivo seleccionado no es una imagen."
      );

      event.target.value = "";

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "La miniatura no puede superar los 10 MB."
      );

      event.target.value = "";

      return;
    }

    setUploading(true);

    try {
      const url = await uploadFile(
        file,
        "ministry-videos",
        `${ministryId}/thumbnails`
      );

      setNewThumbnailFile(file);
      setNewThumbnailUrl(url);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir la miniatura."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  /*
   * AGREGAR VIDEO
   */

  async function handleAddVideo(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      newVideoType !== "mp4" &&
      !newVideoUrl
    ) {
      setError(
        "Primero ingresá la URL del video."
      );

      return;
    }

    if (
      newVideoType === "mp4" &&
      !newVideoFile
    ) {
      setError(
        "Primero seleccioná un archivo de video."
      );

      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      let videoUrl = newVideoUrl;

      /*
       * Si el MP4 todavía no fue subido,
       * lo subimos ahora.
       */
      if (
        newVideoType === "mp4" &&
        newVideoFile &&
        !newVideoUrl
      ) {
        videoUrl = await uploadFile(
          newVideoFile,
          "ministry-videos",
          `${ministryId}/videos`
        );
      }

      let thumbnailUrl =
        newThumbnailUrl || null;

      /*
       * Si no hay miniatura manual,
       * generamos la automática.
       */
      if (!newThumbnailFile) {
        thumbnailUrl =
          await generateAutomaticThumbnail(
            ministryId,
            newVideoType,
            videoUrl,
            newVideoFile
          );
      }

      const nextOrder =
        videos.length > 0
          ? Math.max(
              ...videos.map(
                (video) =>
                  video.sort_order
              )
            ) + 1
          : 1;

      const isFirstVideo =
        videos.length === 0;

      const { data, error: insertError } =
        await supabase
          .from("ministry_videos")
          .insert({
            ministry_id: ministryId,
            title: newTitle || null,
            description:
              newDescription || null,
            video_type: newVideoType,
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
            sort_order: nextOrder,
            is_featured: isFirstVideo,
          })
          .select(
            "id, ministry_id, title, description, video_type, video_url, thumbnail_url, sort_order, is_featured, created_at"
          )
          .single();

      if (insertError) {
        throw insertError;
      }

      setVideos((current) =>
        [...current, data].sort(
          (a, b) =>
            a.sort_order - b.sort_order
        )
      );

      setNewVideoType("youtube");
      setNewVideoUrl("");
      setNewVideoFile(null);
      setNewTitle("");
      setNewDescription("");
      setNewThumbnailFile(null);
      setNewThumbnailUrl("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el video."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * REEMPLAZAR VIDEO
   */

  async function handleReplaceVideo(
    video: MinistryVideo,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setEditingUploadId(video.id);

    try {
      if (
        !file.type.startsWith("video/")
      ) {
        throw new Error(
          "El archivo seleccionado no es un video."
        );
      }

      const url = await uploadFile(
        file,
        "ministry-videos",
        `${ministryId}/videos`
      );

      let thumbnailUrl =
        video.thumbnail_url;

      /*
       * Si reemplazamos el video por un MP4,
       * generamos una nueva miniatura automática.
       */
      if (
        video.video_type === "mp4"
      ) {
        const thumbnailBlob =
          await generateVideoThumbnail(
            file
          );

        thumbnailUrl =
          await uploadThumbnailBlob(
            ministryId,
            thumbnailBlob
          );
      }

      const supabase = createClient();

      const { error: updateError } =
        await supabase
          .from("ministry_videos")
          .update({
            video_url: url,
            thumbnail_url:
              thumbnailUrl,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", video.id);

      if (updateError) {
        throw updateError;
      }

      setVideos((current) =>
        current.map((item) =>
          item.id === video.id
            ? {
                ...item,
                video_url: url,
                thumbnail_url:
                  thumbnailUrl,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo reemplazar el video."
      );
    } finally {
      setEditingUploadId(null);
      event.target.value = "";
    }
  }

  /*
   * CAMBIAR MINIATURA
   */

  async function handleReplaceThumbnail(
    video: MinistryVideo,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setEditingThumbnailId(video.id);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error(
          "El archivo seleccionado no es una imagen."
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error(
          "La miniatura no puede superar los 10 MB."
        );
      }

      const url = await uploadFile(
        file,
        "ministry-videos",
        `${ministryId}/thumbnails`
      );

      const supabase = createClient();

      const { error: updateError } =
        await supabase
          .from("ministry_videos")
          .update({
            thumbnail_url: url,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", video.id);

      if (updateError) {
        throw updateError;
      }

      setVideos((current) =>
        current.map((item) =>
          item.id === video.id
            ? {
                ...item,
                thumbnail_url: url,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo reemplazar la miniatura."
      );
    } finally {
      setEditingThumbnailId(null);
      event.target.value = "";
    }
  }

  /*
   * RESTAURAR MINIATURA AUTOMÁTICA
   */

  async function handleRestoreAutomaticThumbnail(
    video: MinistryVideo
  ) {
    setSaving(true);
    setError("");

    try {
      let thumbnailUrl: string | null =
        null;

      if (
        video.video_type === "youtube"
      ) {
        thumbnailUrl =
          getYouTubeThumbnail(
            video.video_url
          );
      }

      if (
        video.video_type === "mp4"
      ) {
        const response =
          await fetch(
            video.video_url
          );

        if (!response.ok) {
          throw new Error(
            "No se pudo obtener el video MP4."
          );
        }

        const blob =
          await response.blob();

        const file = new File(
          [blob],
          "video.mp4",
          {
            type:
              blob.type ||
              "video/mp4",
          }
        );

        const thumbnailBlob =
          await generateVideoThumbnail(
            file
          );

        thumbnailUrl =
          await uploadThumbnailBlob(
            ministryId,
            thumbnailBlob
          );
      }

      /*
       * Vimeo queda sin miniatura propia
       * hasta que implementemos su API.
       */
      if (
        video.video_type === "vimeo"
      ) {
        thumbnailUrl = null;
      }

      const supabase = createClient();

      const { error: updateError } =
        await supabase
          .from("ministry_videos")
          .update({
            thumbnail_url:
              thumbnailUrl,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", video.id);

      if (updateError) {
        throw updateError;
      }

      setVideos((current) =>
        current.map((item) =>
          item.id === video.id
            ? {
                ...item,
                thumbnail_url:
                  thumbnailUrl,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo restaurar la miniatura automática."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * EDITAR DATOS
   */

  async function handleUpdateVideo(
    video: MinistryVideo,
    form: HTMLFormElement
  ) {
    setSaving(true);
    setError("");

    try {
      const formData =
        new FormData(form);

      const title = String(
        formData.get("title") || ""
      );

      const description = String(
        formData.get("description") || ""
      );

      const supabase = createClient();

      const { error: updateError } =
        await supabase
          .from("ministry_videos")
          .update({
            title: title || null,
            description:
              description || null,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", video.id);

      if (updateError) {
        throw updateError;
      }

      setVideos((current) =>
        current.map((item) =>
          item.id === video.id
            ? {
                ...item,
                title: title || null,
                description:
                  description || null,
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

  /*
   * GUARDAR ORDEN
   */

  async function saveOrder(
    orderedVideos: MinistryVideo[],
    primaryId: string
  ) {
    const supabase = createClient();

    /*
     * Primero quitamos todas las portadas.
     */
    const { error: clearPrimaryError } =
      await supabase
        .from("ministry_videos")
        .update({
          is_featured: false,
        })
        .eq(
          "ministry_id",
          ministryId
        );

    if (clearPrimaryError) {
      throw clearPrimaryError;
    }

    /*
     * Guardamos posiciones.
     */
    for (
      let index = 0;
      index < orderedVideos.length;
      index++
    ) {
      const video =
        orderedVideos[index];

      const { error: orderError } =
        await supabase
          .from("ministry_videos")
          .update({
            sort_order: index + 1,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            video.id
          );

      if (orderError) {
        throw orderError;
      }
    }

    /*
     * Finalmente marcamos la portada.
     */
    const { error: primaryError } =
      await supabase
        .from("ministry_videos")
        .update({
          is_featured: true,
          sort_order: 1,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          primaryId
        );

    if (primaryError) {
      throw primaryError;
    }

    setVideos(
      orderedVideos.map(
        (video, index) => ({
          ...video,
          sort_order: index + 1,
          is_featured:
            video.id ===
            primaryId,
        })
      )
    );
  }

  /*
   * ESTABLECER PORTADA
   */

  async function handleSetPrimary(
    video: MinistryVideo
  ) {
    setSaving(true);
    setError("");

    try {
      const orderedVideos = [
        video,
        ...videos.filter(
          (item) =>
            item.id !== video.id
        ),
      ];

      await saveOrder(
        orderedVideos,
        video.id
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

  /*
   * MOVER VIDEO
   */

  async function handleMove(
    video: MinistryVideo,
    direction: "up" | "down"
  ) {
    const currentIndex =
      videos.findIndex(
        (item) =>
          item.id === video.id
      );

    if (currentIndex === -1) {
      return;
    }

    const newIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      newIndex < 0 ||
      newIndex >= videos.length
    ) {
      return;
    }

    const orderedVideos = [
      ...videos,
    ];

    [
      orderedVideos[currentIndex],
      orderedVideos[newIndex],
    ] = [
      orderedVideos[newIndex],
      orderedVideos[currentIndex],
    ];

    /*
     * El que queda #1 es la portada.
     */
    const primaryId =
      orderedVideos[0].id;

    setSaving(true);
    setError("");

    try {
      await saveOrder(
        orderedVideos,
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

  /*
   * ELIMINAR VIDEO
   */

  async function handleDelete(
    video: MinistryVideo
  ) {
    setDeleting(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: deleteError } =
        await supabase
          .from("ministry_videos")
          .delete()
          .eq(
            "id",
            video.id
          );

      if (deleteError) {
        throw deleteError;
      }

      /*
       * Intentamos eliminar el archivo
       * de video de Storage.
       */
      const videoMarker =
        "/storage/v1/object/public/ministry-videos/";

      const videoIndex =
        video.video_url.indexOf(
          videoMarker
        );

      if (videoIndex !== -1) {
        const filePath =
          video.video_url.slice(
            videoIndex +
              videoMarker.length
          );

        const {
          error: storageVideoError,
        } = await supabase.storage
          .from("ministry-videos")
          .remove([
            filePath,
          ]);

        if (storageVideoError) {
          console.error(
            "No se pudo eliminar el video de Storage:",
            storageVideoError
          );
        }
      }

      /*
       * Intentamos eliminar la miniatura
       * de Storage.
       */
      if (video.thumbnail_url) {
        const thumbnailIndex =
          video.thumbnail_url.indexOf(
            videoMarker
          );

        if (thumbnailIndex !== -1) {
          const thumbnailPath =
            video.thumbnail_url.slice(
              thumbnailIndex +
                videoMarker.length
            );

          const {
            error: storageThumbnailError,
          } =
            await supabase.storage
              .from("ministry-videos")
              .remove([
                thumbnailPath,
              ]);

          if (
            storageThumbnailError
          ) {
            console.error(
              "No se pudo eliminar la miniatura de Storage:",
              storageThumbnailError
            );
          }
        }
      }

      const remainingVideos =
        videos.filter(
          (item) =>
            item.id !== video.id
        );

      if (
        remainingVideos.length === 0
      ) {
        setVideos([]);
        setDeleteId(null);

        return;
      }

      /*
       * Reordenamos después de eliminar.
       * El primero pasa a ser portada.
       */
      const orderedVideos =
        remainingVideos.sort(
          (a, b) =>
            a.sort_order -
            b.sort_order
        );

      const primaryId =
        video.is_featured
          ? orderedVideos[0].id
          : orderedVideos.find(
              (item) =>
                item.is_featured
            )?.id ||
            orderedVideos[0].id;

      await saveOrder(
        orderedVideos,
        primaryId
      );

      setDeleteId(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el video."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          Contenido multimedia
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Videos
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          Administrá los videos del ministerio,
          sus miniaturas y la portada principal.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* AGREGAR VIDEO */}

      <form
        onSubmit={handleAddVideo}
        className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5"
      >
        <h3 className="text-base font-semibold text-white">
          Agregar nuevo video
        </h3>

        <div className="mt-5 grid gap-6 lg:grid-cols-[180px_1fr]">
          {/* PREVIEW */}

          <div>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {newThumbnailUrl ? (
                <img
                  src={newThumbnailUrl}
                  alt="Vista previa"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="text-2xl">
                    🎥
                  </span>

                  <span className="mt-2 px-3 text-xs text-neutral-500">
                    Vista previa
                  </span>
                </div>
              )}
            </div>

            {newVideoType === "mp4" &&
              newVideoFile && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Miniatura automática generada
                </p>
              )}
          </div>

          {/* CAMPOS */}

          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Tipo de video
                </label>

                <select
                  value={newVideoType}
                  onChange={(event) => {
                    const type =
                      event.target
                        .value as VideoType;

                    setNewVideoType(type);
                    setNewVideoUrl("");
                    setNewVideoFile(null);
                    setNewThumbnailFile(null);
                    setNewThumbnailUrl("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                >
                  <option value="youtube">
                    YouTube
                  </option>

                  <option value="vimeo">
                    Vimeo
                  </option>

                  <option value="mp4">
                    MP4
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  {newVideoType ===
                  "mp4"
                    ? "Archivo de video"
                    : "URL del video"}
                </label>

                {newVideoType ===
                "mp4" ? (
                  <label className="block cursor-pointer rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300 transition hover:border-amber-400/30">
                    {uploading
                      ? "Subiendo..."
                      : newVideoFile
                      ? newVideoFile.name
                      : "Seleccionar video"}

                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={
                        handleNewVideoUpload
                      }
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(event) => {
                      const url =
                        event.target
                          .value;

                      setNewVideoUrl(url);

                      if (
                        newVideoType ===
                        "youtube"
                      ) {
                        setNewThumbnailUrl(
                          getYouTubeThumbnail(
                            url
                          ) || ""
                        );
                      }
                    }}
                    placeholder={
                      newVideoType ===
                      "youtube"
                        ? "https://youtube.com/..."
                        : "https://vimeo.com/..."
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-amber-400/50"
                  />
                )}
              </div>
            </div>

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
                placeholder="Ej: Reunión de jóvenes"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Miniatura
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <label className="cursor-pointer text-sm font-medium text-white transition hover:text-amber-300">
                  {newThumbnailFile
                    ? "Cambiar miniatura 🖼️"
                    : "Seleccionar miniatura 🖼️"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleNewThumbnailUpload
                    }
                    className="hidden"
                  />
                </label>

                {newThumbnailFile && (
                  <button
                    type="button"
                    onClick={async () => {
                      setNewThumbnailFile(
                        null
                      );

                      if (
                        newVideoType ===
                        "youtube"
                      ) {
                        setNewThumbnailUrl(
                          getYouTubeThumbnail(
                            newVideoUrl
                          ) || ""
                        );
                      } else if (
                        newVideoType ===
                          "mp4" &&
                        newVideoFile
                      ) {
                        try {
                          setUploading(
                            true
                          );

                          const blob =
                            await generateVideoThumbnail(
                              newVideoFile
                            );

                          const url =
                            await uploadThumbnailBlob(
                              ministryId,
                              blob
                            );

                          setNewThumbnailUrl(
                            url
                          );
                        } catch (err) {
                          console.error(
                            err
                          );

                          setError(
                            "No se pudo generar nuevamente la miniatura del MP4."
                          );
                        } finally {
                          setUploading(
                            false
                          );
                        }
                      } else {
                        setNewThumbnailUrl(
                          ""
                        );
                      }
                    }}
                    className="text-sm text-neutral-500 transition hover:text-amber-300"
                  >
                    Volver a automática
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs text-neutral-600">
                YouTube y MP4 generan una
                miniatura automáticamente si no
                cargás una personalizada.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                saving ||
                uploading
              }
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Guardando..."
                : "Agregar video"}
            </button>
          </div>
        </div>
      </form>

      {/* VIDEOS CARGADOS */}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            Videos cargados
          </h3>

          <span className="text-xs text-neutral-500">
            {videos.length}{" "}
            {videos.length === 1
              ? "video"
              : "videos"}
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-neutral-500">
              Todavía no hay videos cargados.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {videos
              .slice()
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order
              )
              .map((video, index) => {
                const isFirst =
                  index === 0;

                const isLast =
                  index ===
                  videos.length - 1;

                return (
                  <article
                    key={video.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    {/* MINIATURA */}

                    <div className="relative aspect-video overflow-hidden bg-neutral-900">
                      {video.thumbnail_url ? (
                        <img
                          src={
                            video.thumbnail_url
                          }
                          alt={
                            video.title ||
                            "Video del ministerio"
                          }
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <span className="text-4xl">
                            🎥
                          </span>

                          <span className="mt-2 text-xs text-neutral-500">
                            Sin miniatura
                          </span>
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <div className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          #{index + 1}
                        </div>

                        {video.is_featured && (
                          <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black shadow-lg">
                            ⭐ Portada
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      {editingId ===
                      video.id ? (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();

                            handleUpdateVideo(
                              video,
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
                                video.title ||
                                ""
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
                                video.description ||
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
                                setEditingId(
                                  null
                                )
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
                                {video.title ||
                                  "Sin título"}
                              </h4>

                              {video.description && (
                                <p className="mt-2 text-sm leading-5 text-neutral-500">
                                  {
                                    video.description
                                  }
                                </p>
                              )}

                              <span className="mt-2 inline-block text-xs uppercase tracking-wider text-neutral-600">
                                {video.video_type}
                              </span>
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
                                  video,
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
                                  video,
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
                                  video.id
                                )
                              }
                              className="text-sm font-medium text-white transition hover:text-amber-300"
                            >
                              Editar ✏️
                            </button>

                            <label className="cursor-pointer text-sm font-medium text-white transition hover:text-amber-300">
                              {editingUploadId ===
                              video.id
                                ? "Subiendo..."
                                : "Cambiar video 🎥"}

                              <input
                                type="file"
                                accept="video/mp4,video/*"
                                disabled={
                                  editingUploadId ===
                                  video.id
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleReplaceVideo(
                                    video,
                                    event
                                  )
                                }
                                className="hidden"
                              />
                            </label>

                            <label className="cursor-pointer text-sm font-medium text-white transition hover:text-amber-300">
                              {editingThumbnailId ===
                              video.id
                                ? "Subiendo..."
                                : "Cambiar miniatura 🖼️"}

                              <input
                                type="file"
                                accept="image/*"
                                disabled={
                                  editingThumbnailId ===
                                  video.id
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleReplaceThumbnail(
                                    video,
                                    event
                                  )
                                }
                                className="hidden"
                              />
                            </label>

                            {!video.is_featured && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleSetPrimary(
                                    video
                                  )
                                }
                                disabled={saving}
                                className="text-sm font-medium text-amber-400 transition hover:text-amber-300 disabled:opacity-40"
                              >
                                ⭐ Portada
                              </button>
                            )}

                            {video.is_featured && (
                              <span className="text-sm font-medium text-amber-400">
                                ⭐ Portada actual
                              </span>
                            )}

                            {(video.video_type ===
                              "youtube" ||
                              video.video_type ===
                                "mp4") && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRestoreAutomaticThumbnail(
                                    video
                                  )
                                }
                                disabled={saving}
                                className="text-sm font-medium text-neutral-400 transition hover:text-amber-300 disabled:opacity-40"
                              >
                                ↻ Automática
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteId(
                                  video.id
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
                  ¿Eliminar video?
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
                  const video =
                    videos.find(
                      (item) =>
                        item.id ===
                        deleteId
                    );

                  if (video) {
                    handleDelete(
                      video
                    );
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