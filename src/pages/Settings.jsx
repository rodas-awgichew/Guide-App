export default function Settings() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-4">
        <button className="px-4 py-2 bg-gray-200 rounded-lg">
          Toggle Dark/Light Mode
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg">
          Offline Cache
        </button>
      </div>
    </div>
  );
}
