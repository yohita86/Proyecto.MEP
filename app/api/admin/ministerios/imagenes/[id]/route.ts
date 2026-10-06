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

  const { data: image, error: imageError } = await supabase
    .from("ministry_images")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  if (imageError) {
    return NextResponse.json(
      { error: imageError.message },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("ministry_images")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (image?.image_url) {
    const marker = "/storage/v1/object/public/ministry-images/";

    const index = image.image_url.indexOf(marker);

    if (index !== -1) {
      const filePath = image.image_url.slice(
        index + marker.length
      );

      await supabase.storage
        .from("ministry-images")
        .remove([filePath]);
    }
  }

  return NextResponse.json({
    success: true,
  });
}