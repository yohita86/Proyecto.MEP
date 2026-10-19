
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Ministry = {
  id: string;
  name: string;
  description: string | null;
  target_group: string | null;
  schedule: string | null;
  status: string;
};

type MinistryImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
};

type MinistrySocialLink = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number | null;
};

type MinistryVideo = {
  id: string;
  title: string;
  description: string | null;
  video_type: string;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number | null;
};

function getVideoEmbedUrl(type: string, url: string) {
  try {
    const parsed = new URL(url);
    const normalizedType = type.toLowerCase();

    if (
      normalizedType === "youtube" ||
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname === "youtu.be"
    ) {
      let videoId = "";

      if (parsed.hostname === "youtu.be") {
        videoId = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2] ?? "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2] ?? "";
      } else {
        videoId = parsed.searchParams.get("v") ?? "";
      }

      return /^[a-zA-Z0-9_-]+$/.test(videoId)
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null;
    }

    if (
      normalizedType === "vimeo" ||
      parsed.hostname.includes("vimeo.com")
    ) {
      const videoId = parsed.pathname
        .split("/")
        .filter(Boolean)
        .find((part) => /^\d+$/.test(part));

      return videoId
        ? `https://player.vimeo.com/video/${videoId}`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

export default async function MinisterioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ministryData, error: ministryError } = await supabase
    .from("ministries")
    .select("id, name, description, target_group, schedule, status")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (ministryError) {
    throw new Error("No se pudo cargar el ministerio.");
  }

  if (!ministryData) {
    notFound();
  }

  const ministry = ministryData as Ministry;

  const [
    { data: imagesData, error: imagesError },
    { data: socialData, error: socialError },
    { data: videosData, error: videosError },
  ] = await Promise.all([
    supabase
      .from("ministry_images")
      .select(
        "id, image_url, title, description, sort_order, is_primary"
      )
      .eq("ministry_id", id)
      .order("sort_order", { ascending: true }),

    supabase
      .from("ministry_social_links")
      .select("id, platform, label, url, sort_order")
      .eq("ministry_id", id)
      .order("sort_order", { ascending: true }),

    supabase
      .from("ministry_videos")
      .select(
        "id, title, description, video_type, video_url, thumbnail_url, sort_order"
      )
      .eq("ministry_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  const images = (imagesData ?? []) as MinistryImage[];
  const socialLinks = (socialData ?? []) as MinistrySocialLink[];
  const videos = (videosData ?? []) as MinistryVideo[];

  const cover =
    images.find((image) => image.is_primary) ?? images[0] ?? null;

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* Portada */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#101010]">
        <div className="absolute inset-0">
          {cover && (
            <img
              src={cover.image_url}
              alt={cover.title || ministry.name}
              className="h-full w-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/60 via-[#090909]/75 to-[#090909]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:pb-24 sm:pt-40">
          <Link
            href="/ministerios"
            className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-amber-300"
          >
            <span aria-hidden="true">←</span>
            Todos los ministerios
          </Link>

          <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-sm">
            Ministerio Evangelio de Paz
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {ministry.name}
          </h1>

          {ministry.target_group && (
            <p className="mt-5 inline-flex rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-white/80">
              {ministry.target_group}
            </p>
          )}

          {ministry.description && (
            <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-white/70 sm:text-lg">
              {ministry.description}
            </p>
          )}

          {ministry.schedule && (
            <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Nuestros encuentros
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/85 sm:text-base">
                {ministry.schedule}
              </p>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Seguinos
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:border-amber-400/60 hover:text-amber-300"
                  >
                    {link.label?.trim() || link.platform}
                    <span className="ml-2" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Galería de imágenes */}
      {imagesError ? (
        <section className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-sm text-white/50">
            No se pudo cargar la galería en este momento.
          </p>
        </section>
      ) : images.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Nuestra comunidad
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Momentos que compartimos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <figure
                key={image.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121212]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#1b1b1b]">
                  <img
                    src={image.image_url}
                    alt={image.title || ministry.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {(image.title || image.description) && (
                  <figcaption className="p-4">
                    {image.title && (
                      <h3 className="font-semibold text-white">
                        {image.title}
                      </h3>
                    )}
                    {image.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/55">
                        {image.description}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Videos */}
      {videosError ? (
        <section className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-sm text-white/50">
            No se pudieron cargar los videos en este momento.
          </p>
        </section>
      ) : videos.length > 0 ? (
        <section className="border-t border-white/10 bg-[#101010] px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Conocé más
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Videos del ministerio
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2">
              {videos.map((video) => {
                const embedUrl = getVideoEmbedUrl(
                  video.video_type,
                  video.video_url
                );

                const isMp4 =
                  video.video_type.toLowerCase() === "mp4" ||
                  /\.mp4($|[?#])/i.test(video.video_url);

                return (
                  <article
                    key={video.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515]"
                  >
                    {isMp4 ? (
                      <div className="aspect-video bg-black">
                        <video
                          controls
                          preload="metadata"
                          poster={video.thumbnail_url || undefined}
                          className="h-full w-full"
                        >
                          <source
                            src={video.video_url}
                            type="video/mp4"
                          />
                          Tu navegador no puede reproducir este video.
                        </video>
                      </div>
                    ) : embedUrl ? (
                      <div className="aspect-video bg-black">
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex aspect-video items-center justify-center bg-[#202020] text-amber-300 hover:bg-[#292929]"
                      >
                        Ver video ↗
                      </a>
                    )}

                    <div className="p-5">
                      <h3 className="text-lg font-semibold">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/60">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Contacto */}
      <section className="border-t border-white/10 px-5 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-white/10 bg-[#121212] p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Queremos conocerte
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              ¿Querés formar parte?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Escribinos y te ayudamos a conocer más sobre este ministerio.
            </p>
          </div>

          <a
            href={`https://wa.me/541158888118?text=${encodeURIComponent(
              `Hola, quisiera conocer más sobre el ministerio ${ministry.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-full bg-amber-400 px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-amber-300"
          >
            Consultar por WhatsApp
          </a>
        </div>

        <div className="mx-auto mt-8 max-w-6xl">
          <Link
            href="/ministerios"
            className="text-sm text-white/60 transition-colors hover:text-amber-300"
          >
            ← Volver a todos los ministerios
          </Link>
        </div>
      </section>
    </main>
  );
}
