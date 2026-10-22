import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Verificar que haya una sesión iniciada.
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

    // 2. Verificar que el usuario tenga rol de administrador.
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
        { error: "No tenés permisos para crear reuniones." },
        { status: 403 }
      );
    }

    // 3. Leer y validar los datos recibidos.
    const body = await request.json();

    const {
      name,
      day_of_week,
      start_time,
      end_time,
      location,
      description,
      is_active,
      sort_order,
    } = body;

    if (typeof name !== "string" || !name.trim() || name.trim().length > 120) {
      return NextResponse.json(
        { error: "Ingresá un nombre de hasta 120 caracteres." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(day_of_week) ||
      day_of_week < 0 ||
      day_of_week > 6
    ) {
      return NextResponse.json(
        { error: "Seleccioná un día válido de la semana." },
        { status: 400 }
      );
    }

    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (typeof start_time !== "string" || !timePattern.test(start_time)) {
      return NextResponse.json(
        { error: "Ingresá una hora de inicio válida." },
        { status: 400 }
      );
    }

    if (
      end_time !== null &&
      end_time !== undefined &&
      end_time !== "" &&
      (typeof end_time !== "string" || !timePattern.test(end_time))
    ) {
      return NextResponse.json(
        { error: "Ingresá una hora de finalización válida." },
        { status: 400 }
      );
    }

    if (
      end_time &&
      end_time <= start_time
    ) {
      return NextResponse.json(
        { error: "La hora de finalización debe ser posterior a la de inicio." },
        { status: 400 }
      );
    }

    if (
      location !== null &&
      location !== undefined &&
      (typeof location !== "string" || location.length > 200)
    ) {
      return NextResponse.json(
        { error: "El lugar no puede superar los 200 caracteres." },
        { status: 400 }
      );
    }

    if (
      description !== null &&
      description !== undefined &&
      (typeof description !== "string" || description.length > 1000)
    ) {
      return NextResponse.json(
        { error: "La descripción no puede superar los 1000 caracteres." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(sort_order) || sort_order < 0) {
      return NextResponse.json(
        { error: "El orden debe ser un número entero igual o mayor que cero." },
        { status: 400 }
      );
    }

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { error: "El estado de la reunión no es válido." },
        { status: 400 }
      );
    }

    // 4. Guardar la reunión en Supabase.
    const { data: meeting, error: insertError } = await supabase
      .from("upcoming_meetings")
      .insert({
        name: name.trim(),
        day_of_week,
        start_time: `${start_time}:00`,
        end_time: end_time ? `${end_time}:00` : null,
        location: typeof location === "string" ? location.trim() || null : null,
        description:
          typeof description === "string"
            ? description.trim() || null
            : null,
        is_active,
        sort_order,
      })
      .select()
      .single();

    if (insertError) {
      console.error("ERROR AL CREAR REUNIÓN:", insertError);

      return NextResponse.json(
        { error: "No pudimos guardar la reunión en la base de datos." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, meeting },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERROR INESPERADO AL CREAR REUNIÓN:", error);

    return NextResponse.json(
      { error: "Ocurrió un error inesperado al crear la reunión." },
      { status: 500 }
    );
  }
}
