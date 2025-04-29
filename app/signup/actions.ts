//app/signup/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  console.log("Cliked signup");
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    birthdate: formData.get("birthdate") as string,
  };

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        birthdate: new Date(data.birthdate).toISOString(),
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    redirect("/error");
  }

  revalidatePath("/private", "layout");
  redirect("/private");
}
