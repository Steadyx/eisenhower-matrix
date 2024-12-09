import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearAllTasks } from "@/redux/slices/taskSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    dispatch(logout());
    dispatch(clearAllTasks());

    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
