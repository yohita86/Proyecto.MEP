
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Error real de inicio de sesión:", error);
        setErrorMessage(error.message);
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
      console.error("Error inesperado al iniciar sesión:", error);
      setErrorMessage("Ocurrió un error inesperado. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordRecovery() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Primero ingresá tu correo electrónico.");
      return;
    }

    setRecovering(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/admin/restablecer-contrasena`,
        }
      );

      if (error) {
        console.error("Error al solicitar recuperación:", error);
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        "Te enviamos un correo para restablecer tu contraseña. Revisá también Spam."
      );
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("No pudimos enviar el correo. Intentá nuevamente.");
    } finally {
      setRecovering(false);
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
            Panel administrativo
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            Ingresá con tu cuenta autorizada para continuar.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-neutral-300">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-amber-400"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-neutral-300">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-amber-400"
              placeholder="Tu contraseña"
            />

            <button
              type="button"
              onClick={handlePasswordRecovery}
              disabled={recovering}
              className="mt-3 text-sm text-amber-400 transition hover:text-amber-300 disabled:opacity-60"
            >
              {recovering
                ? "Enviando correo..."
                : "¿Olvidaste tu contraseña?"}
            </button>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300"
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Acceso exclusivo para el equipo autorizado de MEP.
        </p>
      </div>
    </main>
  );
}
