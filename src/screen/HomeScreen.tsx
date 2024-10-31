import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Sidebar from "../components/Sidebar";
import { User } from "lucide-react";

const HomeScreen = () => {
  const user = useSelector((state: RootState) => state.authUser.userInfo);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <div className="h-16 border-b bg-white border-gray-200 px-8 flex items-center justify-between">
          <div className="flex-grow" />

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              {/* User icon */}
              <User size={22} className="text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
        </div>

        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
