import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [uniqueID, setUniqueID] = useState("");
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (uniqueID.trim()) {
      dispatch(registerRequest(uniqueID.trim()));
    }
  };

  useEffect(() => {
    if (auth.token) {
      navigate("/tasks");
    }
  }, [auth.token, navigate]);

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="uniqueID" className="block text-gray-700">
            Sign In name - (save it somewhere safe)
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
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={auth.loading}
        >
          {auth.loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have a unique ID?{" "}
          <button onClick={goToLogin} className="text-blue-600">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
