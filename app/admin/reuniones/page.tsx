import { redirect } from "next/navigation";
import Link from "next/link";
import MeetingActions from "@/components/admin/MeetingActions";
import { createClient } from "@/lib/supabase/server";

export default async function ReunionesPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/admin/login");

    const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

    if (!adminRole) redirect("/admin");

    const { data: meetings, error } = await supabase
        .from("upcoming_meetings")
        .select(
            "id, name, day_of_week, start_time, end_time, location, description, is_active, sort_order"
        )
        .order("sort_order", { ascending: true })
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

    const dayNames: Record<number, string> = {
        0: "Domingo",
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
    };

    return (
        <div className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                            Administración
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold">
                            Reuniones y horarios
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                            Administrá los días, horarios y datos de las reuniones que
                            aparecen en la sección pública “Lo próximo en MEP”.
                        </p>
                    </div>

                    <Link
                        href="/admin/reuniones/nuevo"
                        className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
                    >
                        + Nueva reunión
                    </Link>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-300">
                        <p className="font-semibold">
                            No pudimos cargar las reuniones.
                        </p>
                        <p className="mt-2">{error.message}</p>
                    </div>
                )}

                {!error && meetings?.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
                        <h2 className="text-lg font-semibold">
                            Todavía no hay reuniones
                        </h2>

                        <p className="mt-2 text-sm text-neutral-400">
                            Podés crear la primera desde el botón “Nueva reunión”.
                        </p>
                    </div>
                )}

                {!error && meetings && meetings.length > 0 && (
                    <>
                        <div className="mb-5 flex flex-wrap gap-3">
                            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                <p className="text-xs text-neutral-500">
                                    Total de reuniones
                                </p>
                                <p className="mt-1 text-xl font-semibold">
                                    {meetings.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-green-400/10 bg-green-400/[0.04] px-4 py-3">
                                <p className="text-xs text-neutral-500">
                                    Activas
                                </p>
                                <p className="mt-1 text-xl font-semibold text-green-400">
                                    {meetings.filter((meeting) => meeting.is_active).length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                <p className="text-xs text-neutral-500">
                                    Desactivadas
                                </p>
                                <p className="mt-1 text-xl font-semibold text-neutral-400">
                                    {meetings.filter((meeting) => !meeting.is_active).length}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {meetings.map((meeting) => (
                                <article
                                    key={meeting.id}
                                    className={`rounded-2xl border bg-white/[0.04] p-6 ${meeting.is_active
                                            ? "border-white/10"
                                            : "border-white/5 opacity-70"
                                        }`}
                                >
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${meeting.is_active
                                                    ? "bg-green-400/10 text-green-400"
                                                    : "bg-neutral-800 text-neutral-400"
                                                }`}
                                        >
                                            {meeting.is_active ? "Activa" : "Desactivada"}
                                        </span>

                                        <span className="text-xs text-neutral-500">
                                            Orden {meeting.sort_order}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-semibold">
                                        {meeting.name}
                                    </h2>

                                    <div className="mt-4 space-y-2 text-sm">
                                        <p className="text-neutral-300">
                                            <span className="mr-2 text-amber-400">◷</span>
                                            {dayNames[meeting.day_of_week] ?? "Día sin definir"}
                                        </p>

                                        <p className="text-neutral-400">
                                            {meeting.start_time.slice(0, 5)}
                                            {meeting.end_time
                                                ? ` a ${meeting.end_time.slice(0, 5)}`
                                                : ""}
                                            {" hs"}
                                        </p>

                                        {meeting.location && (
                                            <p className="text-neutral-400">
                                                📍 {meeting.location}
                                            </p>
                                        )}
                                    </div>

                                    {meeting.description && (
                                        <p className="mt-4 border-t border-white/[0.08] pt-4 text-sm leading-6 text-neutral-400">
                                            {meeting.description}
                                        </p>
                                    )}

                                    <MeetingActions
                                        meetingId={meeting.id}
                                        meetingName={meeting.name}
                                        isActive={meeting.is_active}
                                    />
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
