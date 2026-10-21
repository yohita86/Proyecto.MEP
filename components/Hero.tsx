
export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] py-28 text-white">
      {/* Fondo oscuro con iluminación sutil, al estilo Eventos */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, rgba(245,158,11,0.11) 0%, transparent 48%), radial-gradient(ellipse at 85% 65%, rgba(30,90,105,0.07) 0%, transparent 38%)",
          }}
        />

        {/* Círculos decorativos */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045] sm:h-[580px] sm:w-[580px]" />

        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/[0.07] sm:h-[450px] sm:w-[450px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
      </div>

      {/* Línea superior de acento */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-center sm:px-10">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400 sm:text-sm sm:tracking-[0.35em]">
          Ministerio Evangelio de Paz
        </p>

        <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-7xl md:text-8xl">
          Hay un lugar{" "}
          <span className="text-white/60">para vos.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg md:text-xl">
          No importa tu historia. Queremos conocerte y caminar junto a vos.
        </p>

        {/* Acciones */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#primera-visita"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] sm:w-auto"
          >
            Planificá tu primera visita
          </a>

          <a
            href="#horarios"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/85 transition duration-300 hover:border-amber-400/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:w-auto"
          >
            Ver horarios
          </a>
        </div>
      </div>

      {/* Indicador de desplazamiento */}
      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/45">
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Descubrí
        </span>

        <div className="h-10 w-px bg-gradient-to-b from-amber-400/70 to-transparent" />
      </div>

      {/* Línea inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
    </section>
  );
}
