import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Ministry = {
  id: string;
  name: string;
  description: string | null;
  target_group: string | null;
  schedule: string | null;
  status: string;
  sort_order: number;
};

export default async function MinistriesSection() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ministries")
    .select(
      "id, name, description, target_group, schedule, status, sort_order"
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  const ministries = (data ?? []) as Ministry[];

  return (
    <section
      id="ministerios"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] bg-[#090909] px-6 py-24 text-white sm:py-28"
    >
      {/* Luz ambiental sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.09), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400/70" />
              Comunidad
            </p>

            <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Hay un lugar para{" "}
              <span className="text-white/55">cada etapa.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Encontrá el espacio donde podés compartir, aprender y crecer
              junto a otros.
            </p>
          </div>

          <div className="hidden shrink-0 pb-2 md:block">
            <span className="text-sm tracking-[0.2em] text-white/30">
              MEP / MINISTERIOS
            </span>
          </div>
        </div>

        {/* Tarjetas cargadas desde Supabase */}
        {error ? (
          <div
            role="status"
            className="mt-14 rounded-2xl border border-white/10 bg-[#141414] p-7 sm:mt-16 sm:p-8"
          >
            <p className="text-base text-white/70">
              No pudimos cargar los ministerios en este momento.
            </p>
            <p className="mt-2 text-sm text-white/45">
              Intentá nuevamente más tarde.
            </p>
          </div>
        ) : ministries.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2">
            {ministries.map((ministry, index) => {
              const amberAccent = index % 2 === 0;

              return (
                <Link
                  key={ministry.id}
                  href={`/ministerios/${ministry.id}`}
                  aria-label={`Conocer el ministerio ${ministry.name}`}
                  className="group relative block overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#141414] transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {/* Encabezado decorativo */}
                  <div className="relative flex h-36 items-end overflow-hidden border-b border-white/[0.07] bg-[#101010] px-7 py-6 sm:h-40 sm:px-8">
                    <div
                      aria-hidden="true"
                      className="absolute -right-8 -top-20 h-64 w-64 rounded-full border border-white/[0.045] transition duration-500 group-hover:scale-110"
                    />

                    <div
                      aria-hidden="true"
                      className={`absolute -right-4 -top-10 h-48 w-48 rounded-full border ${
                        amberAccent
                          ? "border-amber-400/[0.10]"
                          : "border-sky-800/[0.18]"
                      }`}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-70"
                      style={{
                        background: amberAccent
                          ? "radial-gradient(ellipse at 85% 15%, rgba(245,158,11,0.09), transparent 60%)"
                          : "radial-gradient(ellipse at 85% 15%, rgba(30,90,105,0.12), transparent 60%)",
                      }}
                    />

                    <div className="relative flex w-full items-end justify-between">
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                          amberAccent ? "text-amber-400/80" : "text-sky-700"
                        }`}
                      >
                        Ministerio
                      </span>

                      <span className="text-4xl font-light tracking-tight text-white/[0.16] transition duration-300 group-hover:text-white/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-7 sm:p-8">
                    <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white transition-colors group-hover:text-amber-300 sm:text-3xl">
                      {ministry.name}
                    </h3>

                    {ministry.target_group && (
                      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/40">
                        {ministry.target_group}
                      </p>
                    )}

                    {ministry.description && (
                      <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-7 text-white/60 sm:text-base">
                        {ministry.description}
                      </p>
                    )}

                    {ministry.schedule && (
                      <div className="mt-7 flex items-start gap-3 border-t border-white/[0.08] pt-5">
                        <span
                          aria-hidden="true"
                          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                            amberAccent ? "bg-amber-400" : "bg-sky-800"
                          }`}
                        />

                        <p className="whitespace-pre-line text-sm leading-6 text-white/75">
                          {ministry.schedule}
                        </p>
                      </div>
                    )}

                    <div className="mt-7 flex items-center gap-2 border-t border-white/[0.08] pt-5 text-sm font-semibold text-amber-400 transition-all duration-300 group-hover:gap-4 group-hover:text-amber-300">
                      Conocer ministerio
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 rounded-[2rem] border border-white/[0.09] bg-[#141414] px-7 py-10 sm:mt-16 sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Estamos preparando este espacio
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Pronto vas a encontrar tu lugar.
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Estamos preparando la información de nuestros ministerios.
              Volvé pronto para conocerlos.
            </p>
          </div>
        )}

        {/* Enlace a la página completa */}
        <div className="mt-10 border-t border-white/[0.08] pt-8">
          <Link
            href="/ministerios"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-amber-400 transition duration-300 hover:gap-5 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Conocé todos nuestros ministerios
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}