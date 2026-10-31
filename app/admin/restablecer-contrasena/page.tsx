
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RestablecerContrasenaPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    async function verifyRecovery() {
      try {
        const supabase = createClient();
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error("Error verificando recuperación:", error);
            setError("El enlace venció o no es válido. Solicitá uno nuevo.");
            return;
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setError("No encontramos una sesión de recuperación válida. Solicitá un nuevo enlace.");
          return;
        }

        setValidSession(true);
      } catch (err) {
        console.error("Error verificando el enlace:", err);
        setError("No pudimos verificar el enlace. Intentá nuevamente.");
      } finally {
        setVerifying(false);
      }
    }

    verifyRecovery();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("¡Contraseña actualizada correctamente! Ya podés iniciar sesión.");
      setValidSession(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error al actualizar contraseña:", err);
      setError("Ocurrió un error inesperado. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/paloma-color.png"
            alt="Ministerio Evangelio de Paz"
            className="mx-auto mb-6 h-20 w-auto object-contain"
          />

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-400">
            Ministerio Evangelio de Paz
          </p>

          <h1 className="text-3xl font-semibold">
            Restablecer contraseña
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            Elegí una nueva contraseña para tu cuenta.
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl">
          {verifying ? (
            <p className="text-center text-sm text-neutral-300">
              Verificando el enlace...
            </p>
          ) : validSession ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400"
                  placeholder="Repetí la contraseña"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60"
              >
                {loading ? "Actualizando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          ) : null}

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              {message}
            </p>
          )}

          {(message || (!verifying && !validSession)) && (
            <a
              href="/admin/login"
              className="block text-center text-sm text-amber-400 hover:text-amber-300"
            >
              Ir al inicio de sesión
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
