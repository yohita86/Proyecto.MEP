
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  // Verificamos que haya una sesión válida.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Verificamos que el usuario tenga el rol de administrador.
  const { data: adminRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !adminRole) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-neutral-950 px-6 py-12 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-2xl text-red-300">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Acceso no autorizado
          </h1>

          <p className="mt-3 text-neutral-400">
            Tu cuenta no tiene permisos para ingresar al panel administrativo
            de MEP.
          </p>

          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-lg bg-amber-400 px-5 py-3 font-semibold text-neutral-950 transition hover:bg-amber-300"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-neutral-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* PRESENTACIÓN DEL PANEL */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-400">
            Ministerio Evangelio de Paz
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Panel administrativo
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Gestioná el contenido de la web de MEP desde un solo lugar.
          </p>

          <p className="mt-3 break-all text-xs text-neutral-500 sm:hidden">
            Sesión iniciada como {user.email}
          </p>
        </div>

        {/* BIENVENIDA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-medium text-amber-400">
              Bienvenida 👋
            </p>

            <h2 className="mt-2 text-xl font-semibold sm:text-3xl">
              Todo el contenido de MEP, en un solo lugar.
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Desde este panel vas a poder administrar mensajes, eventos,
              ministerios y próximamente los usuarios y permisos.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
          />
        </section>

        {/* RESUMEN DE SECCIONES */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <section
            id="mensajes"
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-400">
                ◉
              </div>
              <span className="text-xs text-neutral-500">Contenido</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold">Mensajes</h3>

            <p className="mt-2 text-sm leading-5 text-neutral-400">
              Administrá prédicas, videos y mensajes publicados.
            </p>

            <Link
              href="/admin/mensajes"
              className="mt-5 inline-block text-sm font-medium text-amber-400 transition hover:text-amber-300"
            >
              Administrar →
            </Link>
          </section>

          <section
            id="eventos"
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-400">
                □
              </div>
              <span className="text-xs text-neutral-500">Agenda</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold">Eventos</h3>

            <p className="mt-2 text-sm leading-5 text-neutral-400">
              Gestioná eventos, fechas, horarios, flyers y videos.
            </p>

            <Link
              href="/admin/eventos"
              className="mt-5 inline-block text-sm font-medium text-amber-400 transition hover:text-amber-300"
            >
              Administrar →
            </Link>
          </section>

          <section
            id="ministerios"
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-400">
                ✦
              </div>
              <span className="text-xs text-neutral-500">Comunidad</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold">Ministerios</h3>

            <p className="mt-2 text-sm leading-5 text-neutral-400">
              Administrá ministerios, horarios y actividades.
            </p>

            <Link
              href="/admin/ministerios"
              className="mt-5 inline-block text-sm font-medium text-amber-400 transition hover:text-amber-300"
            >
              Administrar →
            </Link>
          </section>

          <section
            id="usuarios"
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-400">
                ◎
              </div>
              <span className="text-xs text-neutral-500">Accesos</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold">Usuarios</h3>

            <p className="mt-2 text-sm leading-5 text-neutral-400">
              Más adelante gestionaremos usuarios, roles y permisos.
            </p>

            <span className="mt-5 inline-block text-sm text-neutral-600">
              Próximamente
            </span>
          </section>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
              Accesos rápidos
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              ¿Qué querés hacer?
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/mensajes/nuevo"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-amber-400/30 hover:bg-white/[0.07]"
            >
              <div>
                <p className="font-medium">Crear nuevo mensaje</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Agregar una nueva prédica o video.
                </p>
              </div>

              <span className="text-2xl text-amber-400 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/admin/eventos/nuevo"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-amber-400/30 hover:bg-white/[0.07]"
            >
              <div>
                <p className="font-medium">Crear nuevo evento</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Publicar una actividad de MEP.
                </p>
              </div>

              <span className="text-2xl text-amber-400 transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
