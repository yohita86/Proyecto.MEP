export default function AboutSection() {
  return (
    <section id="conocenos" className="bg-white px-6 py-24 text-gray-950">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-600">
              Conocenos
            </p>

            <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
              Una iglesia para caminar juntos.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed text-gray-800 md:text-2xl">
              Somos el Ministerio Evangelio de Paz, una comunidad que busca
              conocer a Dios, crecer en la fe y compartir Su amor.
            </p>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-gray-700">
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
              className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-gray-950 transition hover:gap-4"
            >
              Conocé más sobre nosotros
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="h-48 rounded-3xl bg-zinc-100 md:h-64" />

          <div className="h-48 rounded-3xl bg-zinc-900 md:h-64" />

          <div className="h-48 rounded-3xl bg-zinc-200 md:h-64" />
        </div>
      </div>
    </section>
  );
}