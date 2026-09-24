export default function ConocenosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="bg-zinc-950 px-6 py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Conocenos
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            Una iglesia para caminar juntos.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
            Somos el Ministerio Evangelio de Paz, una comunidad que busca
            conocer a Dios, crecer en la fe y compartir Su amor.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
                Nuestra identidad
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Un lugar donde podés ser vos mismo.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-relaxed text-gray-600">
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
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Nuestra visión
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Conocer a Dios. Crecer juntos. Llevar esperanza.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-white/70">
              Queremos ser una comunidad que refleje el amor de Dios y que
              pueda llevar esperanza a las personas y a nuestra comunidad.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}