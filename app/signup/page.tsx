// app/signup/page.tsx
import Image from "next/image";
import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage() {
  return (
    <div className="flex w-full h-screen bg-login-background">
      {/* Left Side - Decorative Section */}
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center">
        <div className="absolute w-[70%] h-[40%] bg-purple-600 opacity-80 rounded-full transform scale-100 rotate-[-15deg]"></div>
        <div className="relative z-10 w-[40%] h-[40%] rounded-full overflow-hidden bg-white">
          <Image
            src="/icons/my_logo.png"
            alt="wordVision Logo"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex w-full md:w-1/2 min-h-screen bg-login-background flex-col items-center justify-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3">
          WordVision
        </h1>

        <div className="w-full px-4 md:px-8 lg:px-12 flex justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Create your Account
            </h2>

            <form action={signup}>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your First Name here"
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your Last Name here"
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email here"
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-2">
                  Birthdate
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  placeholder="Select your Birthdate"
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your Password here"
                  className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
              >
                Create Account
              </button>
            </form>

            <div className="mt-4 text-center text-gray-600">
              Already have an account?
              <Link
                href="/login"
                className="text-purple-500 hover:text-purple-400 ml-1"
              >
                Log in
              </Link>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center bg-transparent border border-gray-300 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors duration-300">
              <Image
                src="/icons/google.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
