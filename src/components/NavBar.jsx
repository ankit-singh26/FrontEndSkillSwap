import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const AuthLinks = () => (
    <>
      <Link
        to="/profile"
        className="hover:underline hover:text-blue-300 transition-colors"
      >
        Profile
      </Link>
      <button
        onClick={logout}
        className="hover:underline hover:text-blue-300 transition-colors"
      >
        Logout
      </button>
    </>
  );

  const GuestLinks = () => (
    <>
      <Link
        to="/login"
        className="hover:underline hover:text-blue-300 transition-colors"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="hover:underline hover:text-blue-300 transition-colors"
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <nav className="bg-blue-900 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">SkillSwap</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="hover:text-blue-300 transition-colors font-semibold"
          >
            Dashboard
          </Link>
          <Link
            to="/browse"
            className="hover:text-blue-300 transition-colors font-semibold"
          >
            Browse
          </Link>

          {/* Optional greeting */}
          {/* {isAuthenticated && user && (
            <span className="text-sm text-white/70">Hi, {user.name}</span>
          )} */}

          {isAuthenticated ? <AuthLinks /> : <GuestLinks />}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white hover:text-blue-300 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 px-6 py-4 bg-blue-900 space-y-4 rounded-b-md shadow-inner">
          <Link
            to="/"
            className="block font-semibold hover:text-blue-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/browse"
            className="block font-semibold hover:text-blue-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Browse
          </Link>

          {/* Optional greeting */}
          {/* {isAuthenticated && user && (
            <span className="block text-sm text-white/70">Hi, {user.name}</span>
          )} */}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="block font-semibold hover:text-blue-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block font-semibold hover:text-blue-300 transition-colors text-left w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block font-semibold hover:text-blue-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block font-semibold hover:text-blue-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
