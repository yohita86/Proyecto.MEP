export default function FirstVisitSection() {
  return (
    <section
      id="primera-visita"
      className="scroll-mt-24 bg-white px-6 py-16 text-gray-950"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Primera visita
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Nos encantaría recibirte.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            Si es tu primera vez en MEP, acá vas a encontrar la información
            que necesitás para venir y conocernos.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {/* Ubicación */}
          <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Dónde estamos
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Vení a conocernos.
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Queremos que puedas acercarte con tranquilidad y sentirte
              bienvenido desde el primer momento.
            </p>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <p className="text-sm font-semibold">
                Bernardo de Irigoyen 1436
              </p>

              <p className="text-sm text-gray-600">
                Paso del Rey
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Bernardo+de+Irigoyen+1436+Paso+del+Rey"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Ver ubicación
              </a>
            </div>
          </div>

          {/* Encuentros */}
          <div className="rounded-[1.75rem] bg-zinc-950 p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              Nuestros encuentros
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Encontrá tu momento.
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">Reunión general</p>
                <p className="mt-1 text-sm text-white/55">
                  Sábados · 18:00 y 20:00 hs
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">New Life Jóvenes</p>
                <p className="mt-1 text-sm text-white/55">
                  Viernes · 19:30 hs
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">Revolución Pre</p>
                <p className="mt-1 text-sm text-white/55">
                  Jueves · 18:30 hs
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">Red Amor y Contención</p>
                <p className="mt-1 text-sm text-white/55">
                  Mar · 19:00–21:00
                  <br />
                  Jue · 18:00–20:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="mt-4 rounded-[1.75rem] bg-zinc-950 px-7 py-6 text-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                ¿Tenés alguna pregunta?
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Escribinos antes de venir.
              </h3>

              <p className="mt-1 text-sm text-white/55">
                Estamos para ayudarte con lo que necesites.
              </p>
            </div>

            <a
              href="https://wa.me/541158888118"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#20bd5a]"
            >
              <span className="text-lg">◉</span>
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}