//app/logout/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Signout error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
