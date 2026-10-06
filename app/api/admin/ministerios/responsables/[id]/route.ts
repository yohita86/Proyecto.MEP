import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }

  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!adminRole) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 }
    );
  }

  // Primero obtenemos el responsable para saber a qué ministerio pertenece
  const { data: responsible, error: responsibleError } =
    await supabase
      .from("ministry_responsibles")
      .select("id, ministry_id")
      .eq("id", id)
      .maybeSingle();

  if (responsibleError) {
    console.error(
      "ERROR AL BUSCAR RESPONSABLE:",
      responsibleError
    );

    return NextResponse.json(
      { error: responsibleError.message },
      { status: 500 }
    );
  }

  if (!responsible) {
    return NextResponse.json(
      { error: "Responsable no encontrado." },
      { status: 404 }
    );
  }

  // Eliminamos el responsable
  const { error: deleteError } = await supabase
    .from("ministry_responsibles")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error(
      "ERROR AL ELIMINAR RESPONSABLE:",
      deleteError
    );

    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  // Buscamos los responsables restantes
  const { data: remaining, error: remainingError } =
    await supabase
      .from("ministry_responsibles")
      .select("id")
      .eq("ministry_id", responsible.ministry_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

  if (remainingError) {
    console.error(
      "ERROR AL ORDENAR RESPONSABLES:",
      remainingError
    );

    return NextResponse.json({
      success: true,
      warning:
        "El responsable fue eliminado, pero no se pudo reordenar el resto.",
    });
  }

  // Reordenamos desde #1
  if (remaining && remaining.length > 0) {
    for (let index = 0; index < remaining.length; index++) {
      await supabase
        .from("ministry_responsibles")
        .update({
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", remaining[index].id);
    }
  }

  return NextResponse.json({
    success: true,
  });
}