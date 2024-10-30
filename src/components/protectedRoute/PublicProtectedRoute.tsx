import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../store/store";

const PublicProtectedRoute: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.authUser.userInfo);

  return userInfo ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicProtectedRoute;
