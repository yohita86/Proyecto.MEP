"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type MinistryImageUploadProps = {
  onUploaded: (url: string) => void;
};

export default function MinistryImageUpload({
  onUploaded,
}: MinistryImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const supabase = createClient();

      const extension = file.name.split(".").pop();

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const filePath = fileName;

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

      onUploaded(data.publicUrl);
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

  return (
    <div>
      <label
        htmlFor="ministry-image"
        className="inline-flex cursor-pointer rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
      >
        {uploading ? "Subiendo..." : "Seleccionar imagen"}
      </label>

      <input
        id="ministry-image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}