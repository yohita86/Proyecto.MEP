export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 text-white backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center">
          <img
            src="/paloma-color.png"
            alt="Ministerio Evangelio de Paz"
            className="h-12 w-auto"
          />
        </a>

        <div className="flex items-center gap-5 text-sm">
          <a
            href="/"
            className="transition-colors hover:text-white/60"
          >
            Inicio
          </a>

          <a
            href="/conocenos"
            className="transition-colors hover:text-white/60"
          >
            Conocenos
          </a>

          <a
            href="/ministerios"
            className="transition-colors hover:text-white/60"
          >
            Ministerios
          </a>

          <a
            href="/mensajes"
            className="transition-colors hover:text-white/60"
          >
            Mensajes
          </a>

          <a
            href="/eventos"
            className="transition-colors hover:text-white/60"
          >
            Eventos
          </a>

          <a
            href="/#contacto"
            className="transition-colors hover:text-white/60"
          >
            Contacto
          </a>

          <a
            href="https://wa.me/541158888118"
            className="rounded-full bg-white px-5 py-2 font-medium text-black transition hover:scale-105 hover:bg-white/90"
          >
            Escribinos
          </a>
        </div>
      </nav>
    </header>
  );
}