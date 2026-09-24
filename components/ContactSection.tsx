export default function ContactSection() {
  return (
    <section
      id="contacto"
      className="scroll-mt-24 bg-zinc-950 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            Contacto
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Estamos para escucharte
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Si querés conocernos, tenés alguna pregunta o simplemente querés
            comunicarte con nosotros, podés escribirnos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Encontranos
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Ministerio Evangelio de Paz
            </h3>

            <p className="mt-4 text-white/70">
              Bernardo de Irigoyen 1436
              <br />
              Paso del Rey
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Bernardo+de+Irigoyen+1436+Paso+del+Rey"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Ver ubicación
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Escribinos
            </p>

            <h3 className="mt-3 text-xl font-bold">
              ¿Querés hablar con nosotros?
            </h3>

            <p className="mt-4 text-white/70">
              Podés comunicarte directamente por WhatsApp. Estaremos
              encantados de ayudarte.
            </p>

            <a
              href="https://wa.me/541158888118"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:scale-105"
            >
              <span className="text-xl">◉</span>
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}