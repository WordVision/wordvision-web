import Link from "next/link";
import { redirect } from "next/navigation";
import { Inter } from "next/font/google";
import { X } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import HeaderLayout from "@/components/HeaderLayout";

import LogoutButton from "./components/LogoutButton";

const inter500 = Inter({ weight: '500', subsets: ['latin'] })
const inter400 = Inter({ weight: '400', subsets: ['latin'] })

export default async function UserProfilePage() {

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data) {
    return redirect("/login");
  }

  const userData = {
    email: data.user.email,
    firstName: data.user.user_metadata.first_name,
    lastName: data.user.user_metadata.last_name,
    birthDate: data.user.user_metadata.birthdate,
  }

  const formatBirthDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col justify-between h-screen">

      <HeaderLayout text="Profile">
        <Link href="/library">
          <button className="p-3 rounded-full active:bg-neutral-50">
            <X color="#162664" />
          </button>
        </Link>
      </HeaderLayout>

      <div className="px-4 flex-1">
        <div className="p-4 flex flex-col items-center gap-4 border-b">
          <div
            style={inter500.style}
            className="mt-4 w-[72px] h-[72px] text-2xl text-[#0A0D14] flex justify-center items-center rounded-full shadow-[inset_0px_-8px_16px_0px_rgba(0,0,0,0.1)]"
          >
            {userData.firstName[0] + userData.lastName[0]}
          </div>
          <p style={inter500.style} className="text-lg text-[#0A0D14]">
            {userData.firstName} {userData.lastName}
          </p>
        </div>

        <div className="py-4 px-2 border-b">
          <p style={inter400.style} className="px-2 text-xs text-[#525866]">Email</p>
          <input
            type="text"
            value={userData.email}
            style={inter500.style}
            className="px-2 w-full text-sm text-[#0A0D14] bg-inherit"
            readOnly
          />
        </div>

        <div className="py-4 px-2 border-b">
          <p style={inter400.style} className="px-2 text-xs text-[#525866]">Password</p>
          <input
            type="password"
            value={userData.firstName}
            style={inter500.style}
            className="px-2 w-full text-sm text-[#0A0D14] bg-inherit"
            readOnly
          />
        </div>

        <div className="py-4 px-2 border-b">
          <p style={inter400.style} className="px-2 text-xs text-[#525866]">Date of Birth</p>
          <p style={inter500.style} className="px-2 w-full text-sm text-[#0A0D14] bg-inherit">
            {formatBirthDate(userData.birthDate)}
          </p>
        </div>
      </div>

      <div className="bg-[#F6F8FA] pt-2 pb-8 px-3 flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
}
