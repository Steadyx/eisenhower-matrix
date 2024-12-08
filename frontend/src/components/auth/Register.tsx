import React, { useState, useEffect, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { registerRequest } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
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
  })

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={uniqueID}
        onChange={(e) => setUniqueID(e.target.value)}
        placeholder="Enter Unique ID"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-gray-800"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
