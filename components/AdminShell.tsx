
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const [userEmail, setUserEmail] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (mounted && !error) {
        setUserEmail(data.user?.email ?? "");
      }
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUserEmail(session?.user?.email ?? "");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    setSigningOut(true);
    setError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("No pudimos cerrar la sesión. Intentá nuevamente.");
      setSigningOut(false);
      return;
    }

    window.location.href = "/admin/login";
  }

  // El login conserva su pantalla independiente.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const links = [
  { href: "/admin", label: "Inicio del panel", icon: "⌂" },
  { href: "/admin/mensajes", label: "Mensajes", icon: "◉" },
  { href: "/admin/eventos", label: "Eventos", icon: "□" },
  { href: "/admin/reuniones", label: "Reuniones y horarios", icon: "◷" },
  { href: "/admin/ministerios", label: "Ministerios", icon: "✦" },
];

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function navigationLinks(mobile = false) {
    return (
      <>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              isActive(link.href)
                ? "bg-amber-400/10 text-amber-400"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            } ${mobile ? "border border-white/10" : ""}`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}

        <span
          title="La administración de usuarios todavía no está disponible."
          className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-500 ${
            mobile ? "border border-white/5" : ""
          }`}
        >
          <span>◎</span>
          <span>Usuarios</span>
          <span className="rounded-full bg-white/5 px-2 py-1 text-[10px]">
            Próximamente
          </span>
        </span>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#090909] lg:flex">
        <Link
          href="/admin"
          className="flex items-center gap-3 border-b border-white/10 px-6 py-6"
        >
          <img
            src="/paloma-color.png"
            alt="Ministerio Evangelio de Paz"
            className="h-12 w-auto object-contain"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400">
              MEP
            </p>
            <p className="text-sm font-medium">Administración</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navigationLinks()}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-amber-400 transition hover:bg-amber-400/10"
          >
            <span>↗</span>
            Volver al sitio público
          </Link>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin"
              className="flex shrink-0 items-center gap-2 font-semibold transition hover:text-amber-400"
            >
              <span className="text-xl text-amber-400">⌂</span>
              <span>Panel MEP</span>
            </Link>

            <Link
              href="/"
              className="shrink-0 rounded-full border border-white/10 px-3 py-2 text-xs text-amber-400 transition hover:bg-amber-400/10 sm:px-4 sm:text-sm"
            >
              Ver sitio ↗
            </Link>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navigationLinks(true)}
          </nav>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">
                Sesión iniciada como
              </p>
              <p className="break-all text-sm font-medium text-white">
                {userEmail || "Verificando cuenta..."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-200 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {signingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </header>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
