
import { createClient } from "@/lib/supabase/server";

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

export default async function MinisteriosPage() {
  const supabase = await createClient();

  const { data: ministriesData, error: ministriesError } = await supabase
    .from("ministries")
    .select(
      "id, name, description, target_group, schedule, status, sort_order"
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  const ministries = (ministriesData ?? []) as Ministry[];
  let ministryImages: MinistryImage[] = [];
  let imagesError = false;

  if (ministries.length > 0) {
    const ministryIds = ministries.map((ministry) => ministry.id);

    const { data: imagesData, error } = await supabase
      .from("ministry_images")
      .select(
        "id, ministry_id, image_url, title, description, sort_order, is_primary"
      )
      .in("ministry_id", ministryIds)
      .order("sort_order", { ascending: true });

    ministryImages = (imagesData ?? []) as MinistryImage[];
    imagesError = Boolean(error);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* Encabezado */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#101010] px-5 pb-16 pt-32 sm:pb-20 sm:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-[100px]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-sm">
            Ministerio Evangelio de Paz
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Hay un lugar para vos
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Crecemos juntos, compartimos la fe y construimos comunidad.
            Conocé nuestros ministerios y encontrá tu lugar.
          </p>

          <div className="mt-8 h-1 w-16 rounded-full bg-amber-400" />
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

                return (
                  <article
                    key={ministry.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition-colors duration-300 hover:border-amber-400/40"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#1b1b1b]">
                      {cover ? (
                        <img
                          src={cover.image_url}
                          alt={cover.title || ministry.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#242019] to-[#101010]">
                          <span className="text-5xl font-bold text-amber-400/70">
                            MEP
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                      {ministry.target_group && (
                        <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                          {ministry.target_group}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-amber-300 sm:text-2xl">
                        {ministry.name}
                      </h3>

                      {ministry.description && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/60">
                          {ministry.description}
                        </p>
                      )}

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
                    </div>
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
            rel="noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-full bg-amber-400 px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-amber-300"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
