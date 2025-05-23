// app/login/page.tsx
import Image from "next/image";
// import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage() {
  return (
    <div className="flex w-full min-h-screen bg-login-background">
      {/* Left Side - Decorative Section */}
      <div className="relative hidden md:flex md:w-5/12 items-center justify-center">
        <div className="absolute w-full h-2/5 bg-purple-600 opacity-80 rounded-full transform scale-100 rotate-[-15deg]"></div>
        <div className="relative z-10 w-2/5 h-2/5 rounded-full overflow-hidden bg-white">
          <Image
            src="/icons/my_logo.png"
            alt="wordVision Logo"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-7/12 flex flex-col items-center justify-center p-6 sm:p-8 md:px-12 lg:px-20">
        {/* WordVision Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3">
          WordVision
        </h1>

        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Login to Account
          </h2>

          <form action={login}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your Email here"
                className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your Password here"
                className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
