
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type Ministry = {
  id: string;
  name: string;
  description: string | null;
  target_group: string | null;
  schedule: string | null;
  status: string;
  sort_order: number | null;
};

type MinistryImage = {
  id: string;
  ministry_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
};

type MinistrySocialLink = {
  id: string;
  ministry_id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number | null;
};

export default async function MinisteriosPage() {
  const supabase = await createClient();

  const {
    data: ministriesData,
    error: ministriesError,
  } = await supabase
    .from("ministries")
    .select(
      "id, name, description, target_group, schedule, status, sort_order"
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (ministriesError) {
  console.error("ERROR AL CARGAR MINISTERIOS:", ministriesError);
}
    const ministries = (ministriesData ?? []) as Ministry[];

  let ministryImages: MinistryImage[] = [];
  let imagesError = false;

  let ministrySocialLinks: MinistrySocialLink[] = [];
  let socialLinksError = false;

  if (ministries.length > 0) {
    const ministryIds = ministries.map((ministry) => ministry.id);

    // Cargar imágenes de los ministerios
    const {
      data: imagesData,
      error: imagesQueryError,
    } = await supabase
      .from("ministry_images")
      .select(
        "id, ministry_id, image_url, title, description, sort_order, is_primary"
      )
      .in("ministry_id", ministryIds)
      .order("sort_order", { ascending: true });

    ministryImages = (imagesData ?? []) as MinistryImage[];
    imagesError = Boolean(imagesQueryError);

    // Cargar redes sociales de los ministerios
    const {
      data: socialLinksData,
      error: socialError,
    } = await supabase
      .from("ministry_social_links")
      .select(
        "id, ministry_id, platform, label, url, sort_order"
      )
      .in("ministry_id", ministryIds)
      .order("sort_order", { ascending: true });

    ministrySocialLinks = (socialLinksData ?? []) as MinistrySocialLink[];
    socialLinksError = Boolean(socialError);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      
      {/* Encabezado */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0b0b0b] px-5 pb-20 pt-32 sm:pb-28 sm:pt-36 lg:pb-32 lg:pt-40">
        {/* Luces ambientales */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 -z-10 h-80 w-80 rounded-full bg-amber-500/[0.12] blur-[100px] sm:h-[440px] sm:w-[440px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-[-8rem] -z-10 h-72 w-72 rounded-full bg-amber-700/[0.09] blur-[100px] sm:h-96 sm:w-96"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            {/* Identidad */}
            <p className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400 sm:text-sm sm:tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-amber-400 sm:w-12"
              />
              Ministerio Evangelio de Paz
            </p>

            {/* Título principal */}
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-8xl">
              Hay un lugar
              <span className="mt-1 block text-amber-400">
                para vos.
              </span>
            </h1>

            {/* Descripción */}
            <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:mt-8 sm:text-lg sm:leading-8">
              Crecemos juntos, compartimos la fe y construimos comunidad.
              Conocé nuestros ministerios y encontrá tu lugar.
            </p>

            {/* Indicador visual */}
            <div className="mt-9 flex items-center gap-4 sm:mt-11">
              <span
                aria-hidden="true"
                className="h-1 w-14 rounded-full bg-amber-400 sm:w-16"
              />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                Somos familia
              </span>
            </div>
          </div>

          {/* Número decorativo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 hidden select-none text-[11rem] font-bold leading-none tracking-tighter text-white/[0.025] lg:block xl:text-[14rem]"
          >
            MEP
          </div>
        </div>
      </section>

      {/* Ministerios */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 sm:mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Somos familia
            </p>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Nuestros ministerios
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Espacios para encontrarnos, crecer y acompañarnos en cada etapa
              de la vida.
            </p>
          </div>

          {ministriesError ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-200">
              No pudimos cargar los ministerios en este momento. Intentá
              nuevamente más tarde.
            </div>
          ) : ministries.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#111111] px-6 py-12 text-center sm:py-16">
              <h3 className="text-xl font-semibold sm:text-2xl">
                Estamos preparando este espacio
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                Próximamente vas a poder conocer nuestros ministerios y todas
                las actividades que compartimos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {ministries.map((ministry) => {
                const images = ministryImages
                  .filter((image) => image.ministry_id === ministry.id)
                  .sort(
                    (a, b) =>
                      (a.sort_order ?? 0) - (b.sort_order ?? 0)
                  );

                const cover =
                  images.find((image) => image.is_primary) ??
                  images[0] ??
                  null;

                const socialLinks = ministrySocialLinks
                  .filter((link) => link.ministry_id === ministry.id)
                  .sort(
                    (a, b) =>
                      (a.sort_order ?? 0) - (b.sort_order ?? 0)
                  );

                return (
                  <article
                    key={ministry.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.06)]"
                  >
                    {/* Contenido que lleva al detalle del ministerio */}
                    <Link
                      href={`/ministerios/${ministry.id}`}
                      className="block flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                      aria-label={`Conocer el ministerio ${ministry.name}`}
                    >
                      {/* Imagen principal */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#1b1b1b]">
                        {cover ? (
                          <img
                            src={cover.image_url}
                            alt={cover.title || ministry.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#302719] via-[#191713] to-[#101010]">
                            <span className="text-5xl font-bold tracking-widest text-amber-400/70">
                              MEP
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

                        {ministry.target_group && (
                          <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                            {ministry.target_group}
                          </span>
                        )}

                        <span className="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/20 bg-black/40 text-lg text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          ↗
                        </span>
                      </div>

                      {/* Información */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-amber-300 sm:text-2xl">
                          {ministry.name}
                        </h3>

                        {ministry.description && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/60">
                            {ministry.description}
                          </p>
                        )}

                        {/* Horarios */}
                        {ministry.schedule && (
                          <div className="mt-5 border-t border-white/10 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                              Encuentros
                            </p>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/75">
                              {ministry.schedule}
                            </p>
                          </div>
                        )}

                        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition-colors group-hover:text-amber-300">
                          Conocé este ministerio
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </p>
                      </div>
                    </Link>

                    {/* Redes sociales: fuera del Link principal */}
                    {socialLinks.length > 0 && (
                      <div className="mx-6 border-t border-white/10 py-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">
                          Seguinos
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {socialLinks.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/80 transition-colors hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            >
                              {link.label?.trim() || link.platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {imagesError && (
            <p className="mt-5 text-xs text-white/40">
              Algunas imágenes no pudieron cargarse.
            </p>
          )}

          {socialLinksError && (
            <p className="mt-5 text-xs text-amber-200/70">
              No pudimos cargar las redes sociales en este momento.
            </p>
          )}
        </div>
      </section>

      {/* Cierre */}
      <section className="border-t border-white/10 bg-[#101010] px-5 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Te esperamos
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              ¿Querés conocernos?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Nos encantaría compartir este camino con vos.
            </p>
          </div>

          <a
            href="https://wa.me/541158888118"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-full bg-amber-400 px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010]"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
