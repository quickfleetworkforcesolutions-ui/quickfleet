export default function Button() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-xl font-semibold">Button Components</h2>
      
      <div className="flex gap-4 flex-wrap">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Primary Button
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
          Secondary Button
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Success Button
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Danger Button
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
          Outlined Primary
        </button>
        <button className="px-4 py-2 border-2 border-gray-400 text-gray-600 rounded hover:bg-gray-50 transition">
          Outlined Secondary
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
          Large Button
        </button>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
          Small Button
        </button>
      </div>
    </div>
  );
}
