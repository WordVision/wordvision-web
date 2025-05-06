import { redirect } from "next/navigation";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  // return <p>Hello {data.user.email}</p>;
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 dark:to-gray-800 pt-20"
    >
      <div className="flex justify-center"></div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
          <span className="highlight-cursor">
            {data.user.email}
            <span className="moving-cursor"></span>
          </span>
        </h1>
        <form action={signOut}>
          <button
            className="w-full flex items-center justify-center bg-transparent border border-gray-700 text-black py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
            type="submit"
          >
            Sign Out
          </button>
        </form>
      </div>
    </section>
  );
}
