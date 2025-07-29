import { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-hot-toast';
export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await toast.promise( axios.post(`${serverEndpoint}/auth/register`, form) ,{
      loading: "Creating account...",
      success: "Account created successfully!",
      error: (error) => {
        console.error("Signup error:", error);
        return error.response?.data?.error || "An error occurred during signup";
      }
    });
    
    navigate("/login");
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr "
      style={{ backgroundColor: "#1f203d" }}
    >
      <div
        className="shadow-2xl rounded-xl p-10 w-full max-w-md"
        style={{ backgroundColor: "#2a2b53" }}
      >
        <form
          className="flex flex-col gap-4 max-w-sm mx-auto mt-20"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Signup
          </h2>
          <input
            type="email"
            placeholder="Email"
            className="p-2 border"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition duration-200">
            Signup
          </button>
          <div className="text-center">
            <span>Already have an account? </span>
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
