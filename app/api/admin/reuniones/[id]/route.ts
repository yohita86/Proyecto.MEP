import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Tenés que iniciar sesión para realizar esta acción." },
        { status: 401 }
      );
    }

    const { data: adminRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("ERROR AL VERIFICAR ADMIN:", roleError);
      return NextResponse.json(
        { error: "No pudimos verificar tus permisos." },
        { status: 500 }
      );
    }

    if (!adminRole) {
      return NextResponse.json(
        { error: "No tenés permisos para editar reuniones." },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Los datos recibidos no son válidos." },
        { status: 400 }
      );
    }

    const allowedFields = [
      "name",
      "day_of_week",
      "start_time",
      "end_time",
      "location",
      "description",
      "is_active",
      "sort_order",
    ];

    const receivedFields = Object.keys(body);

    if (
      receivedFields.length === 0 ||
      receivedFields.some((field) => !allowedFields.includes(field))
    ) {
      return NextResponse.json(
        { error: "No hay datos válidos para actualizar." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if ("name" in body) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 120
      ) {
        return NextResponse.json(
          { error: "Ingresá un nombre de hasta 120 caracteres." },
          { status: 400 }
        );
      }

      updates.name = body.name.trim();
    }

    if ("day_of_week" in body) {
      if (
        !Number.isInteger(body.day_of_week) ||
        body.day_of_week < 0 ||
        body.day_of_week > 6
      ) {
        return NextResponse.json(
          { error: "Seleccioná un día válido de la semana." },
          { status: 400 }
        );
      }

      updates.day_of_week = body.day_of_week;
    }

    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if ("start_time" in body) {
      if (
        typeof body.start_time !== "string" ||
        !timePattern.test(body.start_time)
      ) {
        return NextResponse.json(
          { error: "Ingresá una hora de inicio válida." },
          { status: 400 }
        );
      }

      updates.start_time = `${body.start_time}:00`;
    }

    if ("end_time" in body) {
      if (
        body.end_time !== null &&
        body.end_time !== "" &&
        (typeof body.end_time !== "string" ||
          !timePattern.test(body.end_time))
      ) {
        return NextResponse.json(
          { error: "Ingresá una hora de finalización válida." },
          { status: 400 }
        );
      }

      updates.end_time =
        body.end_time && body.end_time !== ""
          ? `${body.end_time}:00`
          : null;
    }

    if (
      ("start_time" in body || "end_time" in body) &&
      "start_time" in body &&
      body.start_time &&
      "end_time" in body &&
      body.end_time &&
      body.end_time <= body.start_time
    ) {
      return NextResponse.json(
        { error: "La hora de finalización debe ser posterior a la de inicio." },
        { status: 400 }
      );
    }

    if ("location" in body) {
      if (
        body.location !== null &&
        (typeof body.location !== "string" ||
          body.location.length > 200)
      ) {
        return NextResponse.json(
          { error: "El lugar no puede superar los 200 caracteres." },
          { status: 400 }
        );
      }

      updates.location =
        typeof body.location === "string"
          ? body.location.trim() || null
          : null;
    }

    if ("description" in body) {
      if (
        body.description !== null &&
        (typeof body.description !== "string" ||
          body.description.length > 1000)
      ) {
        return NextResponse.json(
          { error: "La descripción no puede superar los 1000 caracteres." },
          { status: 400 }
        );
      }

      updates.description =
        typeof body.description === "string"
          ? body.description.trim() || null
          : null;
    }

    if ("is_active" in body) {
      if (typeof body.is_active !== "boolean") {
        return NextResponse.json(
          { error: "El estado de la reunión no es válido." },
          { status: 400 }
        );
      }

      updates.is_active = body.is_active;
    }

    if ("sort_order" in body) {
      if (!Number.isInteger(body.sort_order) || body.sort_order < 0) {
        return NextResponse.json(
          { error: "El orden debe ser un número entero igual o mayor que cero." },
          { status: 400 }
        );
      }

      updates.sort_order = body.sort_order;
    }

    updates.updated_at = new Date().toISOString();

    const { data: meeting, error: updateError } = await supabase
      .from("upcoming_meetings")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("ERROR AL ACTUALIZAR REUNIÓN:", updateError);

      return NextResponse.json(
        { error: "No pudimos actualizar la reunión en la base de datos." },
        { status: 500 }
      );
    }

    if (!meeting) {
      return NextResponse.json(
        { error: "No encontramos esa reunión." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, meeting });
  } catch (error) {
    console.error("ERROR INESPERADO AL ACTUALIZAR REUNIÓN:", error);

    return NextResponse.json(
      { error: "Ocurrió un error inesperado al actualizar la reunión." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Verificar que el usuario haya iniciado sesión.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Tenés que iniciar sesión para realizar esta acción." },
        { status: 401 }
      );
    }

    // Verificar los permisos de administrador.
    const { data: adminRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("ERROR AL VERIFICAR ADMIN:", roleError);

      return NextResponse.json(
        { error: "No pudimos verificar tus permisos." },
        { status: 500 }
      );
    }

    if (!adminRole) {
      return NextResponse.json(
        { error: "No tenés permisos para eliminar reuniones." },
        { status: 403 }
      );
    }

    // Eliminar la reunión seleccionada.
    const { data: deletedMeeting, error: deleteError } = await supabase
      .from("upcoming_meetings")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error("ERROR AL ELIMINAR REUNIÓN:", deleteError);

      return NextResponse.json(
        { error: "No pudimos eliminar la reunión." },
        { status: 500 }
      );
    }

    if (!deletedMeeting) {
      return NextResponse.json(
        { error: "No encontramos esa reunión para eliminarla." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERROR INESPERADO AL ELIMINAR REUNIÓN:", error);

    return NextResponse.json(
      { error: "Ocurrió un error inesperado al eliminar la reunión." },
      { status: 500 }
    );
  }
}
