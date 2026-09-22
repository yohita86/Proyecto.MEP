const events = [
  {
    title: "Próximo evento",
    date: "Próximamente",
    description:
      "En este espacio vamos a mostrar los próximos eventos de MEP.",
  },
];

export default function EventsSection() {
  return (
    <section
      id="eventos"
      className="scroll-mt-24 bg-zinc-950 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Comunidad
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Próximos eventos
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Enterate de las próximas actividades y momentos especiales que
            compartimos como comunidad.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                📅
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {event.title}
              </h3>

              <p className="mt-3 text-sm font-medium text-white/70">
                {event.date}
              </p>

              <p className="mt-4 leading-relaxed text-white/65">
                {event.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}