import React from "react";
import ChatPanel from "../components/ChatPanel";
import PreviewPanel from "../components/PreviewPane";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handelClick = () => {
    logout();
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("jsx");
    localStorage.removeItem("css");
    navigate("/login");
  };
  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 bg-black text-white flex items-center px-4">
        AI UI Playground
      </header>

      <button onClick={handelClick}> Logout </button>
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
