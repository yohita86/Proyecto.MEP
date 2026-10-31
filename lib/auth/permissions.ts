import { createClient } from "@/lib/supabase/server";

export type PermissionAction = "view" | "create" | "edit" | "delete";

export type ModulePermission = {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

export type UserAccess = {
  userId: string;
  role: string;
  isAdmin: boolean;
  permissions: Record<string, ModulePermission>;
};

export async function getCurrentUserAccess(): Promise<UserAccess | null> {
  const supabase = await createClient();

  // Comprobar que haya una sesión válida.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // Consultar el rol del usuario.
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleError || !roleData) {
    return null;
  }

  const isAdmin = roleData.role === "admin";

  // Los administradores no necesitan permisos individuales.
  if (isAdmin) {
    return {
      userId: user.id,
      role: roleData.role,
      isAdmin: true,
      permissions: {},
    };
  }

  // Consultar los permisos asignados al colaborador.
  const { data: permissionRows, error: permissionError } = await supabase
    .from("user_permissions")
    .select("module, can_view, can_create, can_edit, can_delete")
    .eq("user_id", user.id);

  if (permissionError) {
    return null;
  }

  const permissions: Record<string, ModulePermission> = {};

  for (const permission of permissionRows ?? []) {
    permissions[permission.module] = {
      can_view: permission.can_view,
      can_create: permission.can_create,
      can_edit: permission.can_edit,
      can_delete: permission.can_delete,
    };
  }

  return {
    userId: user.id,
    role: roleData.role,
    isAdmin: false,
    permissions,
  };
}

export async function hasModulePermission(
  module: string,
  action: PermissionAction
): Promise<boolean> {
  const access = await getCurrentUserAccess();

  if (!access) {
    return false;
  }

  // Los administradores tienen acceso completo.
  if (access.isAdmin) {
    return true;
  }

  const permission = access.permissions[module];

  if (!permission) {
    return false;
  }

  const permissionKey: Record<PermissionAction, keyof ModulePermission> = {
    view: "can_view",
    create: "can_create",
    edit: "can_edit",
    delete: "can_delete",
  };

  return permission[permissionKey[action]] === true;
}