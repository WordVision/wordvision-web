//app/private/page.tsx
import { redirect } from "next/navigation";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/server";
import FileUploader from "@/components/FileUploader";

export default async function PrivatePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <FileUploader user={user} />;
}
