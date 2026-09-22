export default function FirstVisitSection() {
  return (
    <section
      id="primera-visita"
      className="scroll-mt-24 px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Primera visita
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Nos encantaría recibirte
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Si es tu primera vez en MEP, acá vas a encontrar toda la
            información que necesitás para venir y conocernos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Ubicación */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold text-gray-950">
              Dónde estamos
            </h3>

            <p className="mt-4 leading-relaxed text-gray-700">
              Encontranos en nuestro lugar de reunión y acercate con
              tranquilidad. Queremos que te sientas bienvenido desde el
              primer momento.
            </p>

            <div className="mt-6 rounded-2xl bg-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-600">
                Ubicación
              </p>

              <p className="mt-1 font-semibold text-gray-950">
                Bernardo de Irigoyen 1436
              </p>

              <p className="text-gray-700">
                Paso del Rey
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Bernardo+de+Irigoyen+1436+Paso+del+Rey"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                📍 Ver ubicación en Google Maps
              </a>
            </div>
          </div>

          {/* Encuentros */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold text-gray-950">
              Nuestros encuentros
            </h3>

            <div className="mt-5 space-y-5 text-gray-700">
              <p>
                <strong className="text-gray-950">
                  Reunión general
                </strong>
                <br />
                Domingos · 18:00 y 20:00 hs
              </p>

              <p>
                <strong className="text-gray-950">
                  New Life Jóvenes
                </strong>
                <br />
                Viernes · 19:30 hs
              </p>

              <p>
                <strong className="text-gray-950">
                  Revolución Pre
                </strong>
                <br />
                Jueves · 18:30 hs
              </p>

              <p>
                <strong className="text-gray-950">
                  Red Amor y Contención
                </strong>
                <br />
                Martes · 19:00 a 21:00 hs
                <br />
                Jueves · 18:00 a 20:00 hs
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="mt-6 rounded-3xl bg-zinc-950 p-8 text-white md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                ¿Tenés alguna pregunta?
              </h3>

              <p className="mt-2 text-white/70">
                Escribinos y te ayudamos con lo que necesites antes de venir.
              </p>
            </div>

            <a
              href="https://wa.me/541158888118"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-[#20bd5a]"
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