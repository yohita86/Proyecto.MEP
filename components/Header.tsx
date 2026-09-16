export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 text-white backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-bold tracking-wide">
          MEP
        </a>

        <div className="flex items-center gap-6 text-sm">
          <a href="/" className="transition hover:text-white/70">
            Inicio
          </a>

          <a href="/conocenos" className="transition hover:text-white/70">
            Conocenos
          </a>

          <a href="/ministerios" className="transition hover:text-white/70">
            Ministerios
          </a>

          <a href="/mensajes" className="transition hover:text-white/70">
            Mensajes
          </a>

          <a href="/eventos" className="transition hover:text-white/70">
            Eventos
          </a>

          <a href="/contacto" className="transition hover:text-white/70">
            Contacto
          </a>

          <a
            href="https://wa.me/541158888118"
            className="rounded-full bg-white px-5 py-2 font-medium text-black transition hover:bg-white/80"
          >
            Escribinos
          </a>
        </div>
      </nav>
    </header>
  );
}