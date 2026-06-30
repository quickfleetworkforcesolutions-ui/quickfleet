export default function Card() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <h2 className="text-xl font-semibold">Card Components</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Basic Card</h3>
          <p className="text-gray-600">
            This is a simple card with a shadow and border. It can contain any content.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Gradient Card</h3>
          <p className="text-blue-100">
            This card features a gradient background with white text for a modern look.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500"></div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Card with Image</h3>
            <p className="text-gray-600">
              This card has an image placeholder at the top with content below.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-2">Accent Card</h3>
          <p className="text-gray-600">
            This card has a left border accent for visual emphasis.
          </p>
        </div>
      </div>
    </div>
  );
}
