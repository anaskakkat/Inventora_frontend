import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "../utils/validation";
import Api from "../config/axiosConfig";
import { handleApiError } from "../utils/handleApiError";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/slices/authSlice";

const AuthForm: React.FC = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const [isLogin, setIsLogin] = useState(isLoginRoute);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsLogin(isLoginRoute);
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for sign-up form
    if (!validateEmail(form.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!validatePassword(form.password)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (
      !isLogin &&
      !validateConfirmPassword(form.password, form.confirmPassword)
    ) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await Api.post(
        isLogin ? "/auth/login" : "/auth/signup",
        {
          name: isLogin ? undefined : form.name,
          email: form.email,
          password: form.password,
        }
      );

      console.log("Response:", response);
      toast.success(response.data.message);
      const user = response.data.user;
      const userInfo = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
      if (isLogin) {
        dispatch(setUserInfo(userInfo));
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const toggleAuthMode = () => {
    navigate(isLogin ? "/signup" : "/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-100"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100"
          required
        />

        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-100"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {!isLogin && (
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-blue-100"
            required
          />
        )}

        <button
          type="submit"
          className="w-full py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={toggleAuthMode}
            className="text-blue-500 cursor-pointer hover:underline ml-1"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
