
export default function ContactSection() {
  return (
    <section
      id="contacto"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] bg-[#090909] px-6 py-24 text-white sm:py-28"
    >
      {/* Iluminación ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.10), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end md:gap-12">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400/70" />
              Contacto
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Estamos para{" "}
              <span className="text-white/55">escucharte.</span>
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-base leading-8 text-white/60 sm:text-lg md:text-xl">
              Si querés conocernos, tenés alguna pregunta o simplemente querés
              acercarte, podés escribirnos. Estamos para ayudarte.
            </p>
          </div>
        </div>

        {/* Tarjetas de contacto */}
        <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-2">
          {/* Ubicación */}
          <article className="group relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#141414] p-7 transition duration-300 hover:border-amber-400/25 sm:p-9 md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/[0.04] blur-3xl transition duration-500 group-hover:bg-amber-400/[0.08]"
            />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] text-amber-400">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
                Encontranos
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ministerio Evangelio de Paz
              </h3>

              <p className="mt-5 leading-7 text-white/60">
                Bernardo de Irigoyen 1436
                <br />
                Paso del Rey, Buenos Aires
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Bernardo+de+Irigoyen+1436+Paso+del+Rey"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-amber-400/30 px-5 py-3 text-sm font-semibold text-amber-400 transition duration-300 hover:border-amber-400 hover:bg-amber-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Ver ubicación
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </article>

          {/* WhatsApp */}
          <article className="group relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#141414] p-7 transition duration-300 hover:border-white/20 sm:p-9 md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#25D366]/[0.04] blur-3xl transition duration-500 group-hover:bg-[#25D366]/[0.08]"
            />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#25D366]/20 bg-[#25D366]/[0.08] text-[#25D366]">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.7a12 12 0 0 0 5.8 1.5h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.1-3.6-8.4ZM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a9.7 9.7 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.8-9.7 9.8Zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.6-1-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.6s1.2 3 1.3 3.2c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.8.6.8.3 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4Z" />
                </svg>
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#25D366]/80">
                Escribinos
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                ¿Querés hablar con nosotros?
              </h3>

              <p className="mt-5 max-w-md leading-7 text-white/60">
                Podés comunicarte directamente por WhatsApp y te ayudamos con
                lo que necesites.
              </p>

              <a
                href="https://wa.me/541158888118"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-[#07140b] transition duration-300 hover:scale-[1.03] hover:bg-[#35e477] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
              >
                Escribinos por WhatsApp
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </div>

        {/* Cierre */}
        <div className="mt-16 border-t border-white/[0.08] pt-8 sm:mt-20">
          <p className="text-sm tracking-wide text-white/35">
            Ministerio Evangelio de Paz
          </p>
        </div>
      </div>
    </section>
  );
}
