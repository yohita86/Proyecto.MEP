import { createClient } from "@/lib/supabase/client";

export default async function TestSupabasePage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("test")
    .select("*");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Prueba Supabase</h1>

      <pre className="mt-4">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}