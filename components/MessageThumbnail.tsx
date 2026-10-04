"use client";

import { useState } from "react";

type MessageThumbnailProps = {
  src: string | null;
  alt: string;
};

export default function MessageThumbnail({
  src,
  alt,
}: MessageThumbnailProps) {
  const [hasError, setHasError] = useState(!src);

  if (hasError) {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-zinc-950">
        <img
          src="/paloma-color.png"
          alt="Ministerio Evangelio de Paz"
          className="h-24 w-24 object-contain opacity-80"
        />

        <div className="absolute inset-0 bg-black/20" />

        <span className="absolute bottom-4 text-xs uppercase tracking-[0.2em] text-white/40">
          Ministerio Evangelio de Paz
        </span>
      </div>
    );
  }

  return (
    <img
      src={src!}
      alt={alt}
      className="h-48 w-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}