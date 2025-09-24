import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🌍 GuideApp</h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/map" className="hover:underline">Map</Link>
        <Link to="/search" className="hover:underline">Search places</Link>
        <Link to="/settings" className="hover:underline">Settings</Link>
        
      </nav>
    </header>
  );
}
