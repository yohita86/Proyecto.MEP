const ministries = [
  {
    name: "New Life Jóvenes",
    description:
      "Un espacio para jóvenes que quieren conocer más de Dios, compartir y crecer juntos en la fe.",
    schedule: "Viernes · 19:30 hs",
  },
  {
    name: "Revolución Pre",
    description:
      "Un encuentro pensado para preadolescentes, donde pueden aprender de Dios y compartir con otros.",
    schedule: "Jueves · 18:30 hs",
  },
  {
    name: "MEP Kids",
    description:
      "Nuestra escuelita bíblica para que los más chicos puedan aprender de Dios de una manera cercana y divertida.",
    schedule: "Sábados · 10:00 hs",
  },
  {
    name: "Red Amor y Contención",
    description:
      "Un espacio de acompañamiento, escucha y contención para quienes necesitan ser recibidos y caminar acompañados.",
    schedule: "Martes · 19:00 a 21:00 hs · Jueves · 18:00 a 20:00 hs",
  },
];

export default function MinistriesPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-zinc-950 px-6 py-20 text-white md:min-h-[75vh] md:py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Comunidad
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Hay un lugar para cada etapa.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Conocé los diferentes espacios que forman parte de la comunidad
            del Ministerio Evangelio de Paz.
          </p>
        </div>
      </section>

      {/* Ministerios */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Nuestros ministerios
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Espacios para compartir, aprender y crecer.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {ministries.map((ministry, index) => (
              <article
                key={ministry.name}
                className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Futura fotografía */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-zinc-200 via-zinc-100 to-white md:h-64">
                  <div className="absolute bottom-6 left-7">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {ministry.name}
                  </h3>

                  <p className="mt-4 max-w-xl leading-relaxed text-gray-600">
                    {ministry.description}
                  </p>

                  <div className="mt-7 flex items-center gap-3 border-t border-gray-200 pt-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

                    <p className="text-sm font-semibold text-gray-800">
                      {ministry.schedule}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-zinc-950 px-6 py-24 text-white md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                Comunidad
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Un espacio para crecer juntos.
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-white/60 md:text-xl">
                Cada ministerio tiene una identidad y un propósito particular,
                pero todos forman parte de una misma comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}