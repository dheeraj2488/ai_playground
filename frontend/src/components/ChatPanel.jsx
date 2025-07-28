import React, { useState, useEffect } from "react";
import axios from "axios";
const ChatPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newChat = { role: "user", text: prompt };
    const updatedHistory = [...chatHistory, newChat];
    setChatHistory(updatedHistory);

    try {
      const res = await axios.post("http://localhost:8001/prompt/", {
        prompt,
      });

      const { jsx, css } = res.data;

      console.log("AI Response:", jsx, css);

      updatedHistory.push({ role: "ai", text: jsx });
      setChatHistory(updatedHistory);

      localStorage.setItem("jsx", jsx);
      localStorage.setItem("css", css);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      const userId = localStorage.getItem("userId");
      if (userId) {
        await axios.post("http://localhost:8001/sessions/autosave", {
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

  return (
    <div className="w-1/3 bg-gray-100 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">💬 Chat with Gemini</h2>

      <div className="flex-1 overflow-y-auto mb-4">
        {chatHistory.map((entry, idx) => (
          <div
            key={idx}
            className={`mb-2 text-sm ${
              entry.role === "user" ? "text-blue-600" : "text-green-700"
            }`}
          >
            <strong>{entry.role}:</strong> {entry.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="p-2 rounded border"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
