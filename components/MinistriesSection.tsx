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
      className="scroll-mt-24 bg-zinc-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Comunidad
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Hay un lugar para cada etapa.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-white/65">
            Encontrá el espacio donde podés compartir, aprender y crecer junto
            a otros.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {ministries.map((ministry, index) => (
            <article
              key={ministry.name}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              {/* Espacio reservado para futura fotografía */}
              <div className="h-52 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black md:h-60">
                <div className="flex h-full items-end p-7">
                  <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/30">
                    0{index + 1}
                  </span>
                </div>
              </div>

              <div className="p-7 md:p-8">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {ministry.name}
                </h3>

                <p className="mt-4 max-w-xl leading-relaxed text-white/60">
                  {ministry.description}
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />

                  <p className="text-sm font-medium text-white/75">
                    {ministry.schedule}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="/ministerios"
            className="inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:gap-4"
          >
            Conocé todos nuestros ministerios
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}