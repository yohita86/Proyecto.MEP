"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventFileUploadProps = {
  bucket: "event-images" | "event-videos";
  name: string;
  accept: string;
  label: string;
  description: string;
};

export default function EventFileUpload({
  bucket,
  name,
  accept,
  label,
  description,
}: EventFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(file: File) {
    setError("");
    setFileName("");
    setFileUrl("");
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

  return (
    <div>
      <label className="mb-2 block text-sm text-neutral-300">
        {label}
      </label>

      <p className="mb-4 text-sm text-neutral-500">
        {description}
      </p>

      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) return;

          handleUpload(file);
        }}
        className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-amber-300"
      />

      <input
        type="hidden"
        name={name}
        value={fileUrl}
        readOnly
      />

      {uploading && (
        <p className="mt-3 text-sm text-amber-400">
          Subiendo archivo...
        </p>
      )}

      {fileName && !uploading && (
        <p className="mt-3 text-sm text-green-400">
          ✓ {fileName}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">
          Error: {error}
        </p>
      )}
    </div>
  );
}