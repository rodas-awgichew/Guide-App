import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full flex justify-center py-6 bg-darkblue text-white sticky top-0 z-50 shadow-md">
      <nav className="flex space-x-8 text-lg font-semibold">
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
    </header>
  );
}
