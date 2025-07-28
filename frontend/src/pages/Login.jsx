import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { serverEndpoint } from "../config";
import axios from "axios";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${serverEndpoint}/auth/login`, form);
  
      if (res.data.token) {
        console.log("Login successful:", res.data.user);
  
        localStorage.setItem("userId", res.data.user.id);
        loginUser(res.data.token);
  
        try {
          const sessionRes = await axios.get(
            `${serverEndpoint}/sessions/restore/${res.data.user.id}`
          );
  
          const { chatHistory = [], jsx = "", css = "" } = sessionRes.data || {};
  
          // Only save if there's some data
          if (chatHistory.length > 0 || jsx || css) {
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
            localStorage.setItem("jsx", jsx);
            localStorage.setItem("css", css);
  
            // Trigger update only if preview exists
            window.dispatchEvent(new Event("updatePreview"));
          }
        } catch (sessionErr) {
          console.warn("No previous session found. Skipping restore.");
          // Optional: Clear any old session just in case
          localStorage.removeItem("chatHistory");
          localStorage.removeItem("jsx");
          localStorage.removeItem("css");
        }
  
        // ✅ Always navigate to home
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check credentials.");
    }
  };

  return (
    <form className="flex flex-col gap-4 max-w-sm mx-auto mt-20" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <input type="email" placeholder="Email" className="p-2 border" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" className="p-2 border" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
    </form>
  );
}
