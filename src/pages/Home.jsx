import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to GuideApp</h2>
      <p className="mb-6 text-gray-600">Find your way anywhere with ease.</p>
      <button
        onClick={() => navigate("/map")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Get Started
      </button>
    </div>
  );
}
