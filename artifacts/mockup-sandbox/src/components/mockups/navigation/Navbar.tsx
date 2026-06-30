export default function Navbar() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Navigation Components</h2>
      
      <nav className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="text-xl font-bold text-blue-600">Logo</div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Services</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      </nav>

      <div className="mt-6 bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-white">Dark Navbar</div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-300 hover:text-white transition">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Services</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Contact</a>
          </div>
          <button className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100 transition">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
