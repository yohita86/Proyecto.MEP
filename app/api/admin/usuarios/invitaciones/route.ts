
import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MODULES = ["messages", "events", "ministries", "meetings"] as const;

type ModulePermission = {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

function normalizePermissions(value: unknown) {
  const result: Record<string, ModulePermission> = {};

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return result;
  }

  const input = value as Record<string, unknown>;

  for (const module of MODULES) {
    const item = input[module];

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      continue;
    }

    const permission = item as Record<string, unknown>;

    result[module] = {
      can_view: permission.can_view === true,
      can_create: permission.can_create === true,
      can_edit: permission.can_edit === true,
      can_delete: permission.can_delete === true,
    };
  }

  return result;
}

// CREAR Y ENVIAR INVITACIÓN
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Verificar sesión.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Tenés que iniciar sesión." },
        { status: 401 }
      );
    }

    // 2. Verificar que sea administrador.
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      return NextResponse.json(
        { error: "No tenés permiso para enviar invitaciones." },
        { status: 403 }
      );
    }

    // 3. Validar datos.
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const role =
      body.role === "admin"
        ? "admin"
        : body.role === "editor"
          ? "editor"
          : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ingresá un correo electrónico válido." },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: "El rol seleccionado no es válido." },
        { status: 400 }
      );
    }

    // Los administradores tienen acceso completo.
    const permissions =
      role === "admin"
        ? {}
        : normalizePermissions(body.permissions);

    // 4. Generar token seguro.
    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const adminSupabase = createAdminClient();

    // 5. Guardar invitación.
    const { data: invitation, error: invitationError } =
      await adminSupabase
        .from("user_invitations")
        .insert({
          email,
          token_hash: tokenHash,
          role,
          permissions,
          created_by: user.id,
        })
        .select("id")
        .single();

    if (invitationError || !invitation) {
      console.error("Error creando invitación:", invitationError);

      return NextResponse.json(
        { error: "No se pudo guardar la invitación." },
        { status: 500 }
      );
    }

    // 6. Preparar enlace de aceptación.
    const redirectTo = new URL(
      `/admin/aceptar-invitacion?token=${token}`,
      request.nextUrl.origin
    ).toString();

    // 7. Enviar invitación por Supabase Auth.
    const { error: inviteError } =
      await adminSupabase.auth.admin.inviteUserByEmail(email, {
        redirectTo,
        data: {
          invitation_id: invitation.id,
          invitation_token: token,
        },
      });

    if (inviteError) {
      await adminSupabase
        .from("user_invitations")
        .delete()
        .eq("id", invitation.id);

      console.error("Error enviando invitación:", inviteError);

      return NextResponse.json(
        {
          error:
            "No se pudo enviar el correo. Puede que esa dirección ya tenga una cuenta o que exista un problema con la configuración de correo de Supabase.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invitación enviada a ${email}.`,
    });
  } catch (error) {
    console.error("Error en invitaciones:", error);

    return NextResponse.json(
      { error: "Ocurrió un error al procesar la invitación." },
      { status: 500 }
    );
  }
}

// LISTAR USUARIOS
export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Verificar sesión.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Tenés que iniciar sesión." },
        { status: 401 }
      );
    }

    // 2. Verificar administrador.
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      return NextResponse.json(
        { error: "No tenés permiso para consultar los usuarios." },
        { status: 403 }
      );
    }

    const adminSupabase = createAdminClient();

    // 3. Obtener usuarios registrados.
    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

    if (authError) throw authError;

    // 4. Obtener roles.
    const { data: roles, error: rolesError } = await adminSupabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) throw rolesError;

    // 5. Obtener permisos.
    const { data: permissions, error: permissionsError } =
      await adminSupabase
        .from("user_permissions")
        .select(
          "user_id, module, can_view, can_create, can_edit, can_delete"
        );

    if (permissionsError) throw permissionsError;

    // 6. Unificar información.
    const users = authData.users.map((authUser) => {
      const userRole = roles?.find(
        (item) => item.user_id === authUser.id
      );

      const userPermissions = (permissions ?? [])
        .filter((item) => item.user_id === authUser.id)
        .map((item) => ({
          module: item.module,
          can_view: item.can_view,
          can_create: item.can_create,
          can_edit: item.can_edit,
          can_delete: item.can_delete,
        }));

      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        role: userRole?.role ?? "sin_acceso",
        permissions: userPermissions,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error consultando usuarios:", error);

    return NextResponse.json(
      { error: "No se pudieron consultar los usuarios." },
      { status: 500 }
    );
  }
}
