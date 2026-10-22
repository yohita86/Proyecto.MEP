import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MeetingForm from "@/components/admin/MeetingForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarReunionPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !adminRole) {
    redirect("/admin");
  }

  const { data: meeting, error } = await supabase
    .from("upcoming_meetings")
    .select(
      "id, name, day_of_week, start_time, end_time, location, description, is_active, sort_order"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("ERROR AL CARGAR REUNIÓN PARA EDITAR:", error);

    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-400/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold">No pudimos cargar la reunión</h1>
          <p className="mt-2 text-sm text-red-200">
            Ocurrió un error al consultar los datos. Volvé a intentarlo.
          </p>
          <Link
            href="/admin/reuniones"
            className="mt-5 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            ← Volver a reuniones
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/reuniones"
          className="text-sm text-neutral-400 transition hover:text-amber-400"
        >
          ← Volver a reuniones y horarios
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold">Editar reunión</h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Modificá los datos de esta reunión. Los cambios se guardarán en
            Supabase y se reflejarán en la página pública si está activa.
          </p>
        </div>

        <MeetingForm
          mode="edit"
          meeting={{
            ...meeting,
            end_time: meeting.end_time,
            location: meeting.location,
            description: meeting.description,
            sort_order: meeting.sort_order ?? 0,
          }}
        />
      </div>
    </div>
  );
}
