// app/library/page.tsx
import { redirect } from "next/navigation";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/server";
import UserLibrary from "@/components/UserLibrary";

export default async function Library() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <UserLibrary user={user} />;
}
