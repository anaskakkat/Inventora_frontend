import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const HomeScreen = () => {
  return (
    <div className="min-h-screen h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      {/* </div> */}
    </div>
  );
};

export default HomeScreen;
