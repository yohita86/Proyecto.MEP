
export default function ConocenosPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#101010] px-6 py-24 md:min-h-[75vh] md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(191,145,65,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/35 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
            Conocenos
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Una iglesia para caminar juntos.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Somos el Ministerio Evangelio de Paz, una comunidad que busca
            conocer a Dios, crecer en la fe y compartir Su amor.
          </p>

          <div className="mt-9 h-px w-24 bg-amber-400/70" />
        </div>
      </section>

      {/* Identidad */}
      <section className="relative overflow-hidden px-6 py-24 md:py-28">
        <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-amber-500/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                Nuestra identidad
              </p>

              <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight md:text-5xl">
                Un lugar donde podés ser vos mismo.
              </h2>

              <div className="mt-6 h-px w-16 bg-amber-400/60" />
            </div>

            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-white/60 md:text-xl">
              <p>
                Creemos que cada persona tiene una historia, un propósito y un
                lugar dentro de la comunidad.
              </p>

              <p>
                Queremos acompañarte en tu camino de fe, generar vínculos
                genuinos y construir una comunidad donde podamos crecer
                juntos.
              </p>

              <p>
                Nuestro deseo es que cada persona que llegue pueda sentirse
                recibida, escuchada y parte de algo más grande.
              </p>
            </div>
          </div>

          {/* Espacios preparados para futuras fotografías */}
          <div className="mt-16 grid gap-4 md:mt-20 md:grid-cols-[1.2fr_0.8fr]">
            <div className="group relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#202020] via-[#151515] to-[#111111] md:min-h-[420px]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(191,145,65,0.10),transparent_55%)] transition-opacity duration-500 group-hover:opacity-60" />
              <div className="absolute bottom-6 left-6">
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Nuestra comunidad
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="group relative min-h-[150px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#202020] to-[#111111] md:min-h-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(191,145,65,0.09),transparent_55%)] transition-opacity duration-500 group-hover:opacity-60" />
              </div>

              <div className="group relative min-h-[150px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#191919] to-[#0f0f0f] md:min-h-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(55,95,105,0.10),transparent_55%)] transition-opacity duration-500 group-hover:opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#111111] px-6 py-24 md:py-28">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-amber-500/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-start md:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                Nuestra visión
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Conocer a Dios. Crecer juntos. Llevar esperanza.
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-white/60 md:text-xl">
                Queremos ser una comunidad que refleje el amor de Dios y que
                pueda llevar esperanza a las personas y a nuestra comunidad.
              </p>

              <div className="mt-9 h-px w-24 bg-amber-400/70" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
