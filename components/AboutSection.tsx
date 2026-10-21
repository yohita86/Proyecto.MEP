
export default function AboutSection() {
  return (
    <section
      id="conocenos"
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#181818] px-6 py-24 text-white sm:py-28"
    >
      {/* Iluminación ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Presentación */}
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-16">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400/70" />
              Conocenos
            </p>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Una iglesia para{" "}
              <span className="text-white/55">caminar juntos.</span>
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed text-white/90 sm:text-2xl">
              Somos el Ministerio Evangelio de Paz, una comunidad que busca
              conocer a Dios, crecer en la fe y compartir Su amor.
            </p>

            <div className="mt-8 space-y-5 text-base leading-8 text-white/60 sm:text-lg">
              <p>
                Creemos que cada persona tiene una historia y que siempre hay
                un lugar donde podés ser recibido, escuchado y acompañado.
              </p>

              <p>
                Queremos caminar juntos, crecer en nuestra relación con Dios y
                llevar Su mensaje de esperanza a nuestra comunidad.
              </p>
            </div>

            <a
              href="/conocenos"
              className="mt-9 inline-flex items-center gap-3 text-sm font-semibold text-amber-400 transition duration-300 hover:gap-5 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Conocé más sobre nosotros
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>

            <div className="mt-10 h-px w-24 bg-gradient-to-r from-amber-400/70 to-transparent" />
          </div>
        </div>

        {/* Tres ideas que representan nuestra comunidad */}
        <div className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
          <div className="group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#111111] p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 sm:min-h-60 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-amber-400/[0.10] transition duration-500 group-hover:scale-110"
            />

            <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              01
            </p>

            <div className="relative">
              <div className="mb-4 h-px w-10 bg-amber-400/70 transition-all duration-300 group-hover:w-16" />
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                Conocer a Dios
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/50">
                Una vida que crece en Su presencia.
              </p>
            </div>
          </div>

          <div className="group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#111111] p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 sm:min-h-60 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-sky-700/[0.15] transition duration-500 group-hover:scale-110"
            />

            <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              02
            </p>

            <div className="relative">
              <div className="mb-4 h-px w-10 bg-sky-800/90 transition-all duration-300 group-hover:w-16" />
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                Crecer en la fe
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/50">
                Aprender y avanzar juntos en el camino.
              </p>
            </div>
          </div>

          <div className="group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#111111] p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 sm:min-h-60 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-amber-400/[0.10] transition duration-500 group-hover:scale-110"
            />

            <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              03
            </p>

            <div className="relative">
              <div className="mb-4 h-px w-10 bg-amber-400/70 transition-all duration-300 group-hover:w-16" />
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                Compartir Su amor
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/50">
                Llevar esperanza a nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
