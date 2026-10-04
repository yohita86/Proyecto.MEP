
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage("No pudimos iniciar sesión. Revisá tu correo y contraseña.");
      return;
    }

    window.location.href = "/admin";
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
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {errorMessage}
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