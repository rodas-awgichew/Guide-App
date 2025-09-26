import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-darkblue text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
        {/* Optional Logo / Title (hidden on small screens) */}
        <h1 className="text-lg sm:text-xl font-bold hidden sm:block">
          GoBuddy
        </h1>

        {/* Centered Desktop Menu */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 hidden sm:flex space-x-8 text-lg font-semibold">
          <Link to="/map" className="hover:text-yellow-400 transition-colors">
            Map
          </Link>
          <Link to="/search" className="hover:text-yellow-400 transition-colors">
            Search
          </Link>
          <Link to="/settings" className="hover:text-yellow-400 transition-colors">
            Settings
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 rounded hover:bg-blue-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="sm:hidden bg-darkblue px-4 pb-4 space-y-2">
          <Link
            to="/map"
            className="block hover:text-yellow-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Map
          </Link>
          <Link
            to="/search"
            className="block hover:text-yellow-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Search
          </Link>
          <Link
            to="/settings"
            className="block hover:text-yellow-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
        </nav>
      )}
    </header>
  );
}
