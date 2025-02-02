import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between text-white">
      <div>
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/profile" className="mr-4">
          My Profile
        </Link>{" "}
      </div>
      <div>
        <Link href="/auth/login" className="mr-4">
          Login
        </Link>
        <Link href="/auth/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
