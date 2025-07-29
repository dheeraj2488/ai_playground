import React from "react";
import ChatPanel from "../components/ChatPanel";
import PreviewPanel from "../components/PreviewPane";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handelClick = () => {
    logout();
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("jsx");
    localStorage.removeItem("css");
    toast.success("Logout successful");
    navigate("/login");
  };
  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 bg-black text-white flex items-center px-4">
        <div className="flex flex-row justify-between items-center w-full">
          <span>AI Playground</span>
          <button
            onClick={handelClick}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/3 h-full overflow-y-auto border-r border-gray-300 bg-gray-100">
          <ChatPanel />
        </div>

        <div className="flex-1 h-full overflow-y-auto bg-white">
          <PreviewPanel />
        </div>
      </main>
    </div>
  );
};

export default Home;
