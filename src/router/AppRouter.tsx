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
          <Route path="/dashboard" element={<HomeScreen />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
