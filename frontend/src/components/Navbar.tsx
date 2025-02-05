"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    router.replace("/");
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white shadow-lg">
      <div className="text-xl font-bold">
        <Link href="/dashboard" className="hover:text-blue-400 transition">
          moja socjalna apka
        </Link>
      </div>
      {isLoggedIn ? (
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/profile" className="hover:text-blue-400 transition">
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
