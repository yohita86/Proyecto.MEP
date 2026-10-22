
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeaderNavigation from "./HeaderNavigation";

type Ministry = {
  id: string;
  name: string;
};

export default async function Header() {
  let ministries: Ministry[] = [];
  let isAdmin = false;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ministries")
      .select("id, name")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error al cargar ministerios del Header:", error);
    } else {
      ministries = (data ?? []) as Ministry[];
    }

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) {
      console.error("Error al verificar la sesión del Header:", authError);
    }

    if (authData.user) {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (roleError) {
        console.error("Error al verificar el rol del usuario:", roleError);
      } else {
        isAdmin = roleData?.role === "admin";
      }
    }
  } catch (error) {
    console.error("No se pudieron cargar los datos del Header:", error);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 text-white backdrop-blur-lg">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          aria-label="Ir al inicio de Ministerio Evangelio de Paz"
          className="flex shrink-0 items-center"
        >
          <img
            src="/paloma-color.png"
            alt="Ministerio Evangelio de Paz"
            className="h-12 w-auto"
          />
        </Link>

        <HeaderNavigation
          ministries={ministries}
          isAdmin={isAdmin}
        />
      </nav>
    </header>
  );
}
