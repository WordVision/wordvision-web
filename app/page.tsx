import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center text-center px-4 dark:to-gray-800 pt-20"
      >
        <div className="flex justify-center">
          <Text className="text-2xl mb-4">Bring your stories to life</Text>
        </div>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="highlight-cursor">
              WordVision
              <span className="moving-cursor"></span>
            </span>
          </h1>
          <Link className="flex justify-center" href="/login">
            <Button size="md" variant="solid" action="primary">
              <ButtonText>Log In</ButtonText>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
