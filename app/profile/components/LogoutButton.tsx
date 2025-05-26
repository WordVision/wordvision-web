"use client"

import { redirect } from "next/navigation";
import { Inter } from "next/font/google";

import { createClient } from "@/utils/supabase/client";

const inter600 = Inter({ weight: '600', subsets: ['latin'] })

export default function LogoutButton() {

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  }

  return (
    <button
      style={inter600.style}
      className="text-[#DF1C41] text-[14px] py-4 rounded-xl active:bg-white w-full"
      aria-label="Sign Out"
      onClick={handleSignOut}
    >
      Logout
    </button>
  )
}
