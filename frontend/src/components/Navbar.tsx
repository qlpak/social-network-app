import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 flex justify-between items-center text-white shadow-lg rounded-b-lg">
      <div className="text-xl font-bold tracking-wide">
        <Link href="/dashboard" className="hover:text-blue-400 transition">
          moja socjalna apka
        </Link>
      </div>

      <div className="hidden md:flex space-x-6 text-lg">
        <Link href="/dashboard" className="hover:text-blue-400 transition">
          Home
        </Link>
        <Link href="/profile" className="hover:text-blue-400 transition">
          My Profile
        </Link>
      </div>

      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
