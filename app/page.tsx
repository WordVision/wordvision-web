// app/page.tsx
import { redirectIfLoggedIn } from "@/lib/redirectIfLoggedIn";
import HomeContainer from "@/components/HomeContainer";

export default async function Home() {
  await redirectIfLoggedIn();

  return (
    <main>
      <HomeContainer />
    </main>
  );
}
