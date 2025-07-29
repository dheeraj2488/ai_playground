import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { serverEndpoint } from "../config";
const ChatPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newChat = { role: "user", text: prompt };
    const updatedHistory = [...chatHistory, newChat];
    setChatHistory(updatedHistory);

    try {
   
      const res = await axios.post(`${serverEndpoint}/prompt/`, {
        prompt,
      });

      const { jsx, css } = res.data;
      // console.log("Received JSX:", jsx);
      // console.log("Received CSS:", css);
      updatedHistory.push({ role: "ai", text: jsx });
      setChatHistory(updatedHistory);

      localStorage.setItem("jsx", jsx);
      localStorage.setItem("css", css);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));

      const userId = localStorage.getItem("userId");
      if (userId) {
        await axios.post(`${serverEndpoint}/sessions/autosave`, {
          userId,
          chatHistory: updatedHistory,
          jsx,
          css,
        });
      }

      window.dispatchEvent(new Event("updatePreview"));
      setPrompt("");
    } catch (err) {
      console.error("Error during prompt handling or autosave:", err);
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("jsx");
    localStorage.removeItem("css");
    window.dispatchEvent(new Event("updatePreview"));
  };

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800"> History </h2>
        <button
          onClick={handleClear}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
        {chatHistory.map((entry, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow ${
              entry.role === "user"
                ? "bg-blue-100 self-end text-blue-800"
                : "bg-green-100 self-start text-green-800"
            }`}
          >
            {entry.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <textarea
          className="p-2 rounded border resize-none h-24"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt to create a React component with jsx and css" 
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
