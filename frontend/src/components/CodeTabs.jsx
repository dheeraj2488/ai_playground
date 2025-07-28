
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function CodeTabs({ jsx, css }) {
  const [tab, setTab] = useState("jsx");

  const handleDownload = async () => {
    const zip = new JSZip();
    zip.file("Component.jsx", jsx);
    zip.file("styles.css", css);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "component.zip");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between p-2 bg-gray-100">
        <div>
          <button className={`mr-2 ${tab === "jsx" && "font-bold"}`} onClick={() => setTab("jsx")}>JSX</button>
          <button className={tab === "css" && "font-bold"} onClick={() => setTab("css")}>CSS</button>
        </div>
        <div>
          <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={() => navigator.clipboard.writeText(tab === "jsx" ? jsx : css)}>Copy</button>
          <button className="bg-green-500 text-white px-2 py-1" onClick={handleDownload}>Download</button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-black text-white">
        <SyntaxHighlighter language={tab} style={darcula} wrapLines>
          {tab === "jsx" ? jsx : css}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
