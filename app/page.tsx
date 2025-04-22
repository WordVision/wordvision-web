import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <Container />
    </main>
  );
}

const Container = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 dark:to-gray-800 pt-20"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
          <span className="highlight-cursor">
            WordVision
            <span className="moving-cursor"></span>
          </span>
        </h1>
        <div className="flex justify-center">
          <SignInBtn />
        </div>
      </div>
    </section>
  );
};

const SignInBtn = () => {
  return (
    <Button size="md" variant="solid" action="primary">
      <ButtonText>Sign in / Register</ButtonText>
    </Button>
  );
};
