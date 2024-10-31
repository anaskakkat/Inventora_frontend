const Dashboard = () => {
  return (
    <>
      <div className="px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, John!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your inventory today.
        </p>

        {/* Dashboard Content Goes Here */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Total Items</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Customers
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
            Total Sales
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">8</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
