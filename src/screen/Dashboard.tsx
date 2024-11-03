import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { NewCustomersList, NewInventoryList } from "@/components/DashboardLists";
import EarningsGraph from "@/components/EarningsGraph";
import { handleApiError } from "@/utils/handleApiError";
import Api from "@/config/axiosConfig";
import Loader from "@/components/Loader";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";

const Dashboard: React.FC = () => {
  const name = useSelector((state: RootState) => state.authUser.userInfo?.name);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("/sale/dashboard");
        setDashboardData(response.data);
      } catch (err) {
        handleApiError(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-8 bg-gray-50 min-h-screen">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-8 px-8 py-8 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {name || "User"} 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Cards with Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Total Items
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData.totalCustomers || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Customers
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData.totalItems || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Total Sales
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ₹{dashboardData.totalSales || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Graph with Card Style */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Earnings Overview
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
          </div>
          <EarningsGraph data={dashboardData.dailyEarnings || []} />
        </div>
      </div>

      {/* Lists Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <NewCustomersList customers={dashboardData.lastFiveCustomers || []} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <NewInventoryList items={dashboardData.itemNames || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;