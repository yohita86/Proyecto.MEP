export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fondo temporal */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-zinc-950" />

        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 sm:text-sm">
          Ministerio Evangelio de Paz
        </p>

        <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-7xl md:text-8xl">
          Hay un lugar para vos.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/75 sm:text-xl">
          No importa tu historia. Queremos conocerte y caminar junto a vos.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#primera-visita"
            className="rounded-full bg-white px-7 py-3.5 font-medium text-black transition duration-300 hover:scale-105 hover:bg-white/90"
          >
            Planificá tu primera visita
          </a>

          <a
            href="#primera-visita"
            className="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur-sm transition duration-300 hover:bg-white/15"
          >
            Ver horarios
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Descubrí
        </span>

        <div className="h-10 w-px bg-white/40" />
      </div>
    </section>
  );
}