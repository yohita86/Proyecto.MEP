export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fondo temporal */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-zinc-900" />
      </div>

      {/* Contenido del Hero */}
      <div className="relative z-10 px-6 text-center text-white">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/70">
          Ministerio Evangelio de Paz
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Hay un lugar para vos.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          No importa tu historia. Queremos conocerte.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#primera-visita"
            className="rounded-full bg-white px-6 py-3 font-medium text-black transition hover:bg-white/80"
          >
            Planificá tu primera visita
          </a>

          <a
            href="#horarios"
            className="rounded-full border border-white/40 px-6 py-3 font-medium transition hover:bg-white/10"
          >
            Ver horarios
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-2xl text-white/70">
        ↓
      </div>
    </section>
  );
}