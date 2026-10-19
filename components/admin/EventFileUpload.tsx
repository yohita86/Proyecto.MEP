"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventFileUploadProps = {
  bucket: "event-images" | "event-videos";
  name: string;
  accept: string;
  label: string;
  description: string;
  initialUrl?: string;
  removeName?: string;
};

export default function EventFileUpload({
  bucket,
  name,
  accept,
  label,
  description,
  initialUrl = "",
  removeName,
}: EventFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [removed, setRemoved] = useState(false);

  const isVideo = bucket === "event-videos";

  useEffect(() => {
    setFileUrl("");
    setFileName("");
    setRemoved(false);
  }, [initialUrl]);

  const previewUrl = fileUrl || (!removed ? initialUrl : "");

  async function handleUpload(file: File) {
    setError("");
    setFileName("");
    setFileUrl("");
    setRemoved(false);
    setUploading(true);

    try {
      const supabase = createClient();

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "file";

      const filePath = `events/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error("Supabase no devolvió una URL pública.");
      }

      setFileUrl(data.publicUrl);
      setFileName(file.name);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir el archivo."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setFileUrl("");
    setFileName("");
    setRemoved(true);
    setError("");
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-neutral-300">
        {label}
      </label>

      <p className="mb-4 text-sm text-neutral-500">
        {description}
      </p>

      {previewUrl && !uploading && (
        <div className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-medium text-neutral-300">
              Vista previa
            </span>

            {removeName && (
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
              >
                Quitar
              </button>
            )}
          </div>

          <div className="p-4">
            {isVideo ? (
              <video
                src={previewUrl}
                controls
                className="max-h-72 w-full rounded-lg bg-black object-contain"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Vista previa"
                className="max-h-72 w-full rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      )}

      {!previewUrl && !uploading && (
        <div className="mb-5 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-4 text-center text-sm text-neutral-500">
          No hay archivo seleccionado
        </div>
      )}

      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) return;

          handleUpload(file);

          event.target.value = "";
        }}
        className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-amber-300"
      />

      <input
        type="hidden"
        name={name}
        value={fileUrl}
        readOnly
      />

      {removeName && (
        <input
          type="hidden"
          name={removeName}
          value={removed ? "true" : "false"}
          readOnly
        />
      )}

      {uploading && (
        <p className="mt-3 text-sm text-amber-400">
          Subiendo archivo...
        </p>
      )}

      {fileName && !uploading && (
        <p className="mt-3 text-sm text-green-400">
          ✓ Archivo nuevo: {fileName}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">
          Error: {error}
        </p>
      )}

      <p className="mt-3 text-xs text-neutral-600">
        Si seleccionás un archivo nuevo, reemplazará al anterior al guardar.
      </p>
    </div>
  );
}