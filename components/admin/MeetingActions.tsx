"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

type MeetingActionsProps = {
    meetingId: string;
    meetingName: string;
    isActive: boolean;
};

export default function MeetingActions({
    meetingId,
    meetingName,
    isActive,
}: MeetingActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function toggleActive() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/admin/reuniones/${meetingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    is_active: !isActive,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "No pudimos cambiar el estado de la reunión."
                );
            }

            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al cambiar el estado."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 border-t border-white/[0.08] pt-4">
            <div className="flex flex-wrap items-center gap-3">

                <Link
                    href={`/admin/reuniones/editar/${meetingId}`}
                    className="text-sm font-medium text-amber-400 transition hover:text-amber-300"
                >
                    Editar reunión →
                </Link>

                <button
                    type="button"
                    onClick={toggleActive}
                    disabled={loading}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                        ? "border-white/10 text-neutral-300 hover:bg-white/5"
                        : "border-green-400/20 text-green-400 hover:bg-green-400/10"
                        }`}
                >
                    {loading
                        ? "Actualizando..."
                        : isActive
                            ? "Desactivar"
                            : "Activar"}
                </button>

                <DeleteButton
                    label={`reunión "${meetingName}"`}
                    endpoint={`/api/admin/reuniones/${meetingId}`}
                />
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-300" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
