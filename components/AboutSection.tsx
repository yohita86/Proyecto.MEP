export default function AboutSection() {
  return (
    <section id="conocenos" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
              Conocenos
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Una iglesia para caminar juntos
            </h2>
          </div>

          <div className="space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              Somos el Ministerio Evangelio de Paz, una comunidad que busca
              conocer a Dios, crecer en la fe y compartir Su amor.
            </p>

            <p>
              Creemos que cada persona tiene una historia y que siempre hay
              un lugar donde podés ser recibido, escuchado y acompañado.
            </p>

            <p>
              Queremos caminar juntos, crecer en nuestra relación con Dios y
              llevar Su mensaje de esperanza a nuestra comunidad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}