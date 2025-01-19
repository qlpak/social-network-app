import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to Social Network App
      </h1>
      <div className="space-x-4 mt-4">
        <Link
          href="/auth/register"
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Register
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 transition duration-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
