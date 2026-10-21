
export default function FirstVisitSection() {
  return (
    <section
      id="primera-visita"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] bg-[#181818] px-6 py-24 text-white sm:py-28"
    >
      {/* Iluminación ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.09), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            <span className="h-px w-8 bg-amber-400/70" />
            Primera visita
          </p>

          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Nos encantaría{" "}
            <span className="text-white/55">recibirte.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Si es tu primera vez en MEP, acá vas a encontrar la información
            que necesitás para venir y conocernos.
          </p>
        </div>

        {/* Ubicación y encuentros */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
          {/* Ubicación */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#111111] p-7 transition duration-300 hover:border-amber-400/25 sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-amber-400/[0.08] transition duration-500 group-hover:scale-110"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
                Dónde estamos
              </p>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Vení a conocernos.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-base">
                Queremos que puedas acercarte con tranquilidad y sentirte
                bienvenido desde el primer momento.
              </p>

              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.08] text-amber-400">
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>

                  <div>
                    <p className="text-base font-semibold text-white sm:text-lg">
                      Bernardo de Irigoyen 1436
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Paso del Rey
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Bernardo+de+Irigoyen+1436+Paso+del+Rey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-white/[0.14] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-amber-400/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Ver ubicación
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Encuentros */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#111111] p-7 transition duration-300 hover:border-amber-400/25 sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-sky-800/[0.18]"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
                Nuestros encuentros
              </p>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Encontrá tu momento.
              </h3>

              <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                <div className="border-l-2 border-amber-400/60 pl-4">
                  <p className="text-sm font-semibold text-white">
                    Reunión general
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Sábados · 18:00 y 20:00 hs
                  </p>
                </div>

                <div className="border-l-2 border-sky-800 pl-4">
                  <p className="text-sm font-semibold text-white">
                    New Life Jóvenes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Viernes · 19:30 hs
                  </p>
                </div>

                <div className="border-l-2 border-sky-800 pl-4">
                  <p className="text-sm font-semibold text-white">
                    Revolución Pre
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Jueves · 18:30 hs
                  </p>
                </div>

                <div className="border-l-2 border-amber-400/60 pl-4">
                  <p className="text-sm font-semibold text-white">
                    Red Amor y Contención
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Martes · 19:00–21:00 hs
                    <br />
                    Jueves · 18:00–20:00 hs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#111111] p-7 sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(30,90,105,0.12), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
                ¿Tenés alguna pregunta?
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                Escribinos antes de venir.
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55 sm:text-base">
                Estamos para ayudarte con lo que necesites.
              </p>
            </div>

            <a
              href="https://wa.me/541158888118"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#071b0d] transition duration-300 hover:bg-[#42e477] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
              </svg>
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
