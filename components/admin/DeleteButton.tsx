"use client";

import { useState } from "react";

type DeleteButtonProps = {
  label: string;
  endpoint?: string;
  onDelete?: () => Promise<void>;
};

export default function DeleteButton({
  label,
  endpoint,
  onDelete,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "DELETE",
        });

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              `No se pudo eliminar el ${label}.`
          );
        }

        window.location.reload();
        return;
      }

      if (onDelete) {
        await onDelete();
        return;
      }

      throw new Error(
        `No se configuró cómo eliminar el ${label}.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `No se pudo eliminar el ${label}.`
      );

      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        title={`Eliminar ${label}`}
        aria-label={`Eliminar ${label}`}
        className="text-sm font-medium text-red-400 transition hover:text-red-300"
      >
        🗑️
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xl">
                🗑️
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  ¿Eliminar {label}?
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleting
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}