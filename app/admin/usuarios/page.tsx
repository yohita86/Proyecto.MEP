
"use client";

import { useEffect, useState } from "react";

type UserPermission = {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

type User = {
  id: string;
  email: string | null;
  created_at: string;
  role: string;
  permissions: UserPermission[];
};

type ModulePermission = {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

const MODULES = [
  { id: "messages", name: "Mensajes" },
  { id: "events", name: "Eventos" },
  { id: "ministries", name: "Ministerios" },
  { id: "meetings", name: "Reuniones y horarios" },
];

const emptyPermissions = (): Record<string, ModulePermission> =>
  Object.fromEntries(
    MODULES.map((module) => [
      module.id,
      {
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
      },
    ])
  );

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [permissions, setPermissions] =
    useState<Record<string, ModulePermission>>(emptyPermissions);

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/usuarios/invitaciones", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudieron cargar los usuarios.");
      }

      setUsers(data.users ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function updatePermission(
    module: string,
    action: keyof ModulePermission,
    checked: boolean
  ) {
    setPermissions((current) => ({
      ...current,
      [module]: {
        ...current[module],
        [action]: checked,
      },
    }));
  }

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Ingresá un correo electrónico.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/admin/usuarios/invitaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          role,
          permissions: role === "admin" ? {} : permissions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar la invitación.");
      }

      setNotice(data.message || "Invitación enviada correctamente.");
      setEmail("");
      setRole("editor");
      setPermissions(emptyPermissions());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setSending(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-10">
      <div>
        <p className="text-sm text-neutral-400">Administración</p>
        <h1 className="text-3xl font-semibold text-white">
          Usuarios y permisos
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Invitá colaboradores y administrá el acceso al panel de MEP.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <h2 className="text-xl font-semibold text-white">
          Invitar a una persona
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          La persona recibirá un correo para aceptar la invitación.
        </p>

        <form onSubmit={handleInvite} className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="colaborador@correo.com"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Tipo de acceso
            </label>
            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value as "editor" | "admin")
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-amber-400/50"
            >
              <option value="editor">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
            <p className="mt-2 text-xs text-neutral-500">
              Los administradores tienen acceso completo a todos los módulos.
            </p>
          </div>

          {role === "editor" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white">
                  Permisos del colaborador
                </h3>
                <p className="mt-1 text-xs text-neutral-400">
                  Elegí qué puede hacer en cada sección.
                </p>
              </div>

              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <h4 className="mb-3 font-medium text-white">
                    {module.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(
                      [
                        ["can_view", "Ver"],
                        ["can_create", "Crear"],
                        ["can_edit", "Editar"],
                        ["can_delete", "Eliminar"],
                      ] as const
                    ).map(([action, label]) => (
                      <label
                        key={action}
                        className="flex items-center gap-2 text-sm text-neutral-300"
                      >
                        <input
                          type="checkbox"
                          checked={permissions[module.id][action]}
                          onChange={(event) =>
                            updatePermission(
                              module.id,
                              action,
                              event.target.checked
                            )
                          }
                          className="accent-amber-400"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {notice && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="rounded-xl bg-amber-400 px-6 py-3 font-medium text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Enviando invitación..." : "Enviar invitación"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Usuarios registrados
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Personas que ya tienen una cuenta en MEP.
            </p>
          </div>

          <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xl font-semibold text-white">
            {users.length}
          </span>
        </div>

        {loading && (
          <p className="rounded-xl border border-white/10 p-6 text-center text-neutral-400">
            Cargando usuarios...
          </p>
        )}

        {!loading && users.length === 0 && !error && (
          <p className="rounded-xl border border-white/10 p-6 text-center text-neutral-400">
            Todavía no hay usuarios registrados.
          </p>
        )}

        {!loading &&
          users.map((user) => (
            <article
              key={user.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium text-white">
                    {user.email || "Sin correo"}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Registrado el {formatDate(user.created_at)}
                  </p>
                </div>

                <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                  {user.role === "admin"
                    ? "Administrador"
                    : user.role === "editor"
                      ? "Colaborador"
                      : "Sin acceso"}
                </span>
              </div>

              {user.role === "admin" ? (
                <p className="mt-4 text-sm text-neutral-400">
                  Tiene acceso completo a todos los módulos.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                  {user.permissions.map((permission) => {
                    const actions = [
                      permission.can_view && "Ver",
                      permission.can_create && "Crear",
                      permission.can_edit && "Editar",
                      permission.can_delete && "Eliminar",
                    ].filter(Boolean);

                    return (
                      <div
                        key={permission.module}
                        className="rounded-lg border border-white/10 bg-black/20 p-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {MODULES.find(
                            (module) => module.id === permission.module
                          )?.name || permission.module}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {actions.length
                            ? actions.join(" · ")
                            : "Sin permisos"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          ))}
      </section>
    </div>
  );
}
