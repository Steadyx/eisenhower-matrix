import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [uniqueID, setUniqueID] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uniqueID.trim()) {
      dispatch(loginRequest(uniqueID.trim()));
    }
  };

  if (auth.token) {
    navigate("/tasks");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="uniqueID" className="block text-gray-700">
            Unique ID
          </label>
          <input
            type="text"
            id="uniqueID"
            value={uniqueID}
            onChange={(e) => setUniqueID(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-gray-800"
            required
          />
        </div>
        {auth.error && <p className="text-red-500 mb-4">{auth.error}</p>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={auth.loading}
        >
          {auth.loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
