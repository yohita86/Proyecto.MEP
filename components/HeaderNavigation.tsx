
"use client";

import { useState } from "react";
import Link from "next/link";

type Ministry = {
  id: string;
  name: string;
};

type HeaderNavigationProps = {
  ministries: Ministry[];
  isAdmin: boolean;
};

const links = [
  { label: "Inicio", href: "/" },
  { label: "Conocenos", href: "/conocenos" },
  { label: "Mensajes", href: "/mensajes" },
  { label: "Eventos", href: "/eventos" },
  { label: "Contacto", href: "/#contacto" },
];

export default function HeaderNavigation({
  ministries,
  isAdmin,
}: HeaderNavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ministriesOpen, setMinistriesOpen] = useState(false);

  const closeMenus = () => {
    setMobileOpen(false);
    setMinistriesOpen(false);
  };

  return (
    <>
      <div className="hidden items-center gap-5 text-sm md:flex">
        {links.slice(0, 2).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-amber-300"
          >
            {link.label}
          </Link>
        ))}

        <div className="group relative">
          <Link
            href="/ministerios"
            className="flex items-center gap-2 py-3 transition-colors hover:text-amber-300"
            aria-haspopup="true"
          >
            Ministerios
            <span className="text-xs transition-transform group-hover:rotate-180">
              ▾
            </span>
          </Link>

          <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-2 rounded-2xl border border-white/10 bg-[#141414] p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <Link
              href="/ministerios"
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-amber-300 transition-colors hover:bg-white/[0.06]"
            >
              Ver todos los ministerios →
            </Link>

            <div className="my-1 border-t border-white/10" />

            {ministries.length > 0 ? (
              ministries.map((ministry) => (
                <Link
                  key={ministry.id}
                  href={`/ministerios/${ministry.id}`}
                  className="block rounded-xl px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-amber-300"
                >
                  {ministry.name}
                </Link>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-white/45">
                Próximamente habrá más ministerios.
              </p>
            )}
          </div>
        </div>

        {links.slice(2).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-amber-300"
          >
            {link.label}
          </Link>
        ))}

        {isAdmin && (
          <Link
            href="/admin"
            className="rounded-full border border-amber-400/40 px-4 py-2 font-medium text-amber-300 transition hover:bg-amber-400/10"
          >
            Administración
          </Link>
        )}

        <Link
          href="https://wa.me/541158888118"
          className="rounded-full bg-white px-5 py-2 font-medium text-black transition hover:scale-105 hover:bg-amber-100"
        >
          Escribinos
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileOpen}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-2xl transition hover:bg-white/10 md:hidden"
      >
        {mobileOpen ? "×" : "☰"}
      </button>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full max-h-[80vh] overflow-y-auto border-b border-white/10 bg-[#101010] px-6 py-5 shadow-2xl md:hidden">
          <nav className="flex flex-col gap-1 text-sm">
            {links.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06] hover:text-amber-300"
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setMinistriesOpen(!ministriesOpen)}
              aria-expanded={ministriesOpen}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/[0.06] hover:text-amber-300"
            >
              Ministerios
              <span>{ministriesOpen ? "−" : "+"}</span>
            </button>

            {ministriesOpen && (
              <div className="ml-3 border-l border-amber-400/30 pl-3">
                <Link
                  href="/ministerios"
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-3 font-medium text-amber-300 hover:bg-white/[0.06]"
                >
                  Ver todos los ministerios →
                </Link>

                {ministries.length > 0 ? (
                  ministries.map((ministry) => (
                    <Link
                      key={ministry.id}
                      href={`/ministerios/${ministry.id}`}
                      onClick={closeMenus}
                      className="block rounded-lg px-4 py-3 text-white/75 transition-colors hover:bg-white/[0.06] hover:text-amber-300"
                    >
                      {ministry.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-white/45">
                    Próximamente habrá más ministerios.
                  </p>
                )}
              </div>
            )}

            {links.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06] hover:text-amber-300"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenus}
                className="mt-2 rounded-xl border border-amber-400/40 px-4 py-3 font-medium text-amber-300 transition hover:bg-amber-400/10"
              >
                Administración →
              </Link>
            )}

            <Link
              href="https://wa.me/541158888118"
              onClick={closeMenus}
              className="mt-3 rounded-full bg-white px-5 py-3 text-center font-medium text-black transition hover:bg-amber-100"
            >
              Escribinos por WhatsApp
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
