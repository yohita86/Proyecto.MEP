import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const tokenHash = url.searchParams.get("token_hash");
  const invitationToken = url.searchParams.get("token");
  const type = url.searchParams.get("type");

  const errorUrl = new URL("/admin/login", url.origin);
  errorUrl.searchParams.set(
    "error",
    "No se pudo verificar la invitación. Solicitá que te envíen una nueva."
  );

  if (
    !tokenHash ||
    !invitationToken ||
    !/^[a-f0-9]{64}$/i.test(invitationToken) ||
    type !== "invite"
  ) {
    return NextResponse.redirect(errorUrl);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "invite",
  });

  if (error) {
    return NextResponse.redirect(errorUrl);
  }

  const acceptUrl = new URL("/admin/aceptar-invitacion", url.origin);
  acceptUrl.searchParams.set("token", invitationToken);

  return NextResponse.redirect(acceptUrl);
}