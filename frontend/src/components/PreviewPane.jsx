import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import LivePreview from "./LivePreview";

const PreviewPanel = () => {
  const [jsx, setJsx] = useState("");
  const [css, setCss] = useState("");
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    const update = () => {
      const storedJSX = localStorage.getItem("jsx") || "";
      const storedCSS = localStorage.getItem("css") || "";
      setJsx(storedJSX);
      setCss(storedCSS);
    };

    window.addEventListener("updatePreview", update);
    update();

    return () => window.removeEventListener("updatePreview", update);
  }, []);

  const downloadZip = async () => {
    const res = await fetch("http://localhost:8001/prompt/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsx, css }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "component.zip";
    link.click();
  };

  return (
    <div className="h-full w-full flex flex-col p-6 bg-white shadow-md rounded-lg overflow-auto">
    
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {["preview", "jsx", "css"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm rounded-md font-semibold shadow-md transition duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-blue-100"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}

        <button
          onClick={downloadZip}
          className="ml-auto px-5 py-2 text-sm font-semibold rounded-md bg-black text-white hover:bg-gray-800 transition duration-200 shadow"
        >
          ⬇ Download .zip
        </button>
      </div>

  
      <div className="flex-1 rounded-lg bg-gray-50 p-4 shadow-inner min-h-[300px] overflow-auto">
        {activeTab === "preview" && (
          <LivePreview jsx={jsx} css={css} />
        )}

        {activeTab === "jsx" && (
          <SyntaxHighlighter language="jsx" style={oneDark} wrapLines>
            {jsx}
          </SyntaxHighlighter>
        )}

        {activeTab === "css" && (
          <SyntaxHighlighter language="css" style={oneDark} wrapLines>
            {css}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
