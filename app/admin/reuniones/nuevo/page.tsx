import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MeetingForm from "@/components/admin/MeetingForm";

export default async function NuevaReunionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRole, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !adminRole) {
    redirect("/admin");
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

          <h1 className="mt-2 text-3xl font-semibold">
            Nueva reunión
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Completá los datos de la reunión. Si está activa, podrá aparecer
            en la sección pública “Lo próximo en MEP”.
          </p>
        </div>

        <MeetingForm mode="create" />
      </div>
    </div>
  );
}
