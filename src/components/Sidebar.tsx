import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardList, Users, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { handleApiError } from "../utils/handleApiError";
import Api from "../config/axiosConfig";
import toast from "react-hot-toast";
import { removeUserInfo } from "../store/slices/authSlice";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
  customClass?: string;
}

const SidebarItem = ({
  icon,
  text,
  to,
  active = false,
  onClick,
  customClass,
}: SidebarItemProps) => (
  <Link to={to} onClick={onClick}>
    <div
      className={`flex items-center space-x-3 px-6 py-3 cursor-pointer hover:bg-blue-50 ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-600"
      } ${customClass}`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </div>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await Api.post("/auth/signout");

      console.log("response----", response);
      if (response.status === 200) {
        dispatch(removeUserInfo());
        toast.success(response.data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      {/* Logo */}
      <div className="h- flex items-center py-4 px-6 border-b border-gray-200">
        <span className="text-2xl font-bold text-blue-600">Inventora</span>
      </div>

      {/* Navigation Items */}
      <div className="flex-grow py-4">
        <SidebarItem
          icon={<Home size={20} />}
          text="Dashboard"
          to="/dashboard"
          active={location.pathname === "/dashboard"}
        />
        <SidebarItem
          icon={<Package size={20} />}
          text="Inventory"
          to="/inventory"
          active={location.pathname === "/inventory"}
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Customers"
          to="/customers"
          active={location.pathname === "/customers"}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          text="Sales"
          to="/sales"
          active={location.pathname === "/sales"}
        />
        <SidebarItem
          icon={<ClipboardList size={20} />}
          text="Report"
          to="/report"
          active={location.pathname === "/report"}
        />
      </div>

      <div className="py-4">
        <SidebarItem
          icon={<ClipboardList size={20} />}
          text="Logout"
          to="#"
          onClick={handleLogout}
          customClass="text-red-600 hover:bg-red-50"
        />
      </div>
    </div>
  );
};

export default Sidebar;
