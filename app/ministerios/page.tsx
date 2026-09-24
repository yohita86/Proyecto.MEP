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
      <section className="bg-zinc-950 px-6 py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Comunidad
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            Hay un lugar para cada etapa.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
            Conocé los diferentes espacios que forman parte de la comunidad
            del Ministerio Evangelio de Paz.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {ministries.map((ministry) => (
              <article
                key={ministry.name}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-white">
                  ✦
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  {ministry.name}
                </h2>

                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  {ministry.description}
                </p>

                <div className="mt-6 border-t border-gray-200 pt-5">
                  <p className="text-sm font-semibold text-gray-950">
                    {ministry.schedule}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Comunidad
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Un espacio para crecer juntos.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-white/70">
              Cada ministerio tiene una identidad y un propósito particular,
              pero todos forman parte de una misma comunidad.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}