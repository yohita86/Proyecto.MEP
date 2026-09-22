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

export default function MinistriesSection() {
  return (
    <section
      id="ministerios"
      className="scroll-mt-24 bg-zinc-950 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Comunidad
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Nuestros ministerios
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Hay diferentes espacios para cada etapa y necesidad. Encontrá el
            lugar donde podés compartir, aprender y crecer junto a otros.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ministries.map((ministry) => (
            <article
              key={ministry.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                <span className="text-lg">✦</span>
              </div>

              <h3 className="text-xl font-bold">{ministry.name}</h3>

              <p className="mt-4 leading-relaxed text-white/65">
                {ministry.description}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm font-medium leading-relaxed text-white/80">
                  {ministry.schedule}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}