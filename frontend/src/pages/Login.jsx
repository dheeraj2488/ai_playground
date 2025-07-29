import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { serverEndpoint } from "../config";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { Link } from "react-router-dom" ;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginUser , user} = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverEndpoint}/auth/login`, form);

      if (res.data.token) {

        toast.success("Login successful");
        localStorage.setItem("token", res.data.token);
        loginUser(res.data.user);

        try {
          const sessionRes = await axios.get(
            `${serverEndpoint}/sessions/restore/${res.data.user.id}`
          );

          const { chatHistory = [], jsx = "", css = "" } = sessionRes.data || {};
          if (chatHistory.length > 0 || jsx || css) {
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
            localStorage.setItem("jsx", jsx);
            localStorage.setItem("css", css);
            window.dispatchEvent(new Event("updatePreview"));
          }
        } catch {
          localStorage.removeItem("chatHistory");
          localStorage.removeItem("jsx");
          localStorage.removeItem("css");
        }

        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please check credentials.");
    }
  };

  const handelGoogleSigin = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        {
          idToken: authResponse.credential,
        },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      loginUser(response.data.user);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleGoogleSigninFailure = (error) => {
    console.log(error);
    toast.error("Something went wrong during Google Sign-in");
  };
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr " 
    style={{ backgroundColor: '#1f203d'}}>
      <div className="shadow-2xl rounded-xl p-10 w-full max-w-md" style={{ backgroundColor: '#2a2b53'}}>
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" >
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition duration-200"
          >
            Login
          </button>

          <div className="text-center"> 
            <span>don't have account </span> <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handelGoogleSigin}
            onError={handleGoogleSigninFailure}
            theme="outline"
            size="large"
            width="100%"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
