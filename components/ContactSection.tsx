export default function ContactSection() {
  return (
    <section
      id="contacto"
      className="scroll-mt-24 bg-zinc-950 px-6 py-28 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              Contacto
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Estamos para escucharte.
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-lg leading-relaxed text-white/60 md:text-xl">
              Si querés conocernos, tenés alguna pregunta o simplemente querés
              acercarte, podés escribirnos. Estamos para ayudarte.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2">
          {/* Ubicación */}
          <div className="bg-zinc-950 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              Encontranos
            </p>

            <h3 className="mt-5 text-2xl font-semibold">
              Ministerio Evangelio de Paz
            </h3>

            <p className="mt-5 leading-relaxed text-white/60">
              Bernardo de Irigoyen 1436
              <br />
              Paso del Rey
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Bernardo+de+Irigoyen+1436+Paso+del+Rey"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Ver ubicación
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white/[0.04] p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              Escribinos
            </p>

            <h3 className="mt-5 text-2xl font-semibold">
              ¿Querés hablar con nosotros?
            </h3>

            <p className="mt-5 max-w-md leading-relaxed text-white/60">
              Podés comunicarte directamente por WhatsApp y te ayudamos con lo
              que necesites.
            </p>

            <a
              href="https://wa.me/541158888118"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-[#20bd5a]"
            >
              <span className="text-xl">◉</span>
              Escribinos por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8">
          <p className="text-sm text-white/30">
            Ministerio Evangelio de Paz
          </p>
        </div>
      </div>
    </section>
  );
}