export default function ConocenosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-zinc-950 px-6 py-20 text-white md:min-h-[75vh] md:py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Conocenos
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Una iglesia para caminar juntos.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Somos el Ministerio Evangelio de Paz, una comunidad que busca
            conocer a Dios, crecer en la fe y compartir Su amor.
          </p>
        </div>
      </section>

      {/* Identidad */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Nuestra identidad
              </p>

              <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight md:text-5xl">
                Un lugar donde podés ser vos mismo.
              </h2>
            </div>

            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-gray-600 md:text-xl">
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

          {/* Espacio para futuras fotografías */}
          <div className="mt-20 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="min-h-[320px] rounded-[2rem] bg-zinc-100 md:min-h-[420px]" />

            <div className="grid gap-4">
              <div className="min-h-[150px] rounded-[2rem] bg-zinc-900 md:min-h-0" />
              <div className="min-h-[150px] rounded-[2rem] bg-zinc-200 md:min-h-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="bg-zinc-950 px-6 py-24 text-white md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}