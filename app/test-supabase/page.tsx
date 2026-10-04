
import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, title, status")
    .limit(5);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        Prueba Supabase
      </h1>

      <pre className="mt-4 whitespace-pre-wrap">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}