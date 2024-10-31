import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthForm from "../screen/AuthForm";
import HomeScreen from "../screen/HomeScreen";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import PublicProtectedRoute from "../components/protectedRoute/PublicProtectedRoute";
import Inventory from "../screen/Inventory";
import Customer from "../screen/Customer";
import Sales from "../screen/Sales";
import Reports from "../screen/Reports";
import Dashboard from "../screen/Dashboard";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicProtectedRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<HomeScreen />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/report" element={<Reports />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
