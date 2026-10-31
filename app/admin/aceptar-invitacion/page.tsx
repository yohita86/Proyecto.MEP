
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkInvitation() {
      try {
        const params = new URLSearchParams(window.location.search);

        const invitationToken = params.get("token");
        const code = params.get("code");
        const authError = params.get("error_description");

        if (authError) {
          throw new Error(
            "Supabase no pudo verificar el enlace. Solicitá una nueva invitación."
          );
        }

        if (
          !invitationToken ||
          !/^[a-f0-9]{64}$/i.test(invitationToken)
        ) {
          throw new Error(
            "El enlace de invitación no contiene un token válido."
          );
        }

        setToken(invitationToken);

        // Si Supabase devuelve un código PKCE,
        // intercambiarlo por una sesión.
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw new Error(
              "No se pudo verificar tu correo. Solicitá una nueva invitación."
            );
          }

          // Quitar el código de la dirección del navegador.
          window.history.replaceState(
            {},
            "",
            `/admin/aceptar-invitacion?token=${invitationToken}`
          );
        }

        // Comprobar que exista una sesión válida.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error(
            "No pudimos verificar tu sesión. Abrí nuevamente el enlace del correo de invitación."
          );
        }

        if (!cancelled) {
          setEmail(session.user.email ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo verificar la invitación."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void checkInvitation();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handleAccept(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("No encontramos un token de invitación válido.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setAccepting(true);

    try {
      // Confirmar que la sesión siga activa.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Tu sesión expiró. Volvé a abrir el enlace de invitación."
        );
      }

      // Guardar la contraseña elegida.
      const { error: passwordError } =
        await supabase.auth.updateUser({
          password,
        });

      if (passwordError) {
        throw new Error(passwordError.message);
      }

      // Calcular SHA-256 del token privado.
      const encodedToken = new TextEncoder().encode(token);

      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        encodedToken
      );

      const tokenHash = Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      // Aceptar la invitación y asignar el rol y permisos.
      const { error: invitationError } = await supabase.rpc(
        "accept_user_invitation",
        {
          p_token_hash: tokenHash,
        }
      );

      if (invitationError) {
        throw new Error(invitationError.message);
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo completar la aceptación de la invitación."
      );

      setAccepting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <img
            src="/paloma-color.png"
            alt="Ministerio Evangelio de Paz"
            className="mx-auto mb-4 h-16 w-auto object-contain"
          />

          <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-400">
            Ministerio Evangelio de Paz
          </p>

          <h1 className="mt-3 text-2xl font-semibold">
            Aceptar invitación
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Configurá tu contraseña para ingresar al panel administrativo.
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-neutral-400">
            Verificando invitación...
          </p>
        ) : error && !token ? (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        ) : (
          <>
            {email && (
              <p className="mb-5 rounded-lg border border-white/10 bg-black/20 p-3 text-center text-sm text-neutral-300">
                Invitación para{" "}
                <strong className="text-white">{email}</strong>
              </p>
            )}

            <form onSubmit={handleAccept} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm text-neutral-300"
                >
                  Nueva contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm text-neutral-300"
                >
                  Confirmar contraseña
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Repetí tu contraseña"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400/50"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={accepting || !token}
                className="w-full rounded-xl bg-amber-400 px-5 py-3 font-medium text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {accepting
                  ? "Activando cuenta..."
                  : "Aceptar invitación y crear cuenta"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
