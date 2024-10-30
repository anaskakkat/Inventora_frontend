
import React from 'react';
import { 
  Home,
  Package,
  ClipboardList,
  Users,
  Settings,
  Bell,
//   LogOut,
  ChevronDown
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const SidebarItem = ({ icon, text, active = false }: SidebarItemProps) => (
  <div className={`flex items-center space-x-3 px-6 py-3 cursor-pointer hover:bg-blue-50 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}>
    {icon}
    <span className="font-medium">{text}</span>
  </div>
);

const HomeScreen = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-blue-600">Inventora</span>
        </div>
        
        {/* Navigation Items */}
        <div className="py-4">
          <SidebarItem icon={<Home size={20} />} text="Dashboard" active />
          <SidebarItem icon={<Package size={20} />} text="Inventory" />
          <SidebarItem icon={<ClipboardList size={20} />} text="Orders" />
          <SidebarItem icon={<Users size={20} />} text="Suppliers" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Top Navigation Bar */}
        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          {/* Search Bar */}
          <div className="w-96">
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Right Side Icons/Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">JD</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">John Doe</span>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, John!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your inventory today.</p>
          
          {/* Dashboard Content Goes Here */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Total Items</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Low Stock Items</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Pending Orders</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;