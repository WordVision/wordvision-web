// app/lib/redirectIfLoggedIn.ts
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function redirectIfLoggedIn() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/library");
}
