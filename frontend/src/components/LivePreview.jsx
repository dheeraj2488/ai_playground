import React, { useEffect, useRef, useState } from 'react';
import * as Babel from '@babel/standalone';

const LivePreview = ({ jsx, css }) => {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    
    let cleanedJSX = jsx
      .replace(/```(jsx|js)?/g, '')
      .replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
      .replace(/import\s+['"][^'"]+['"];?/g, '')
      .replace(/export\s+default\s+/g, '')
      .trim();

    const match = cleanedJSX.match(/function\s+([A-Za-z0-9_]+)/);
    const componentName = match?.[1];
    if (!componentName) {
      setError("Could not find component name in JSX.");
      return;
    }

    
    const fullCode = `
      ${cleanedJSX}
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(React.createElement(${componentName}, {
        text: "Click Me",
        onClick: () => alert("Clicked from iframe!")
      }));
    `;


    let compiledCode = '';
    try {
      compiledCode = Babel.transform(fullCode, {
        presets: ['react']
      }).code;
      setError(null);
    } catch (e) {
      console.error("Transpile error:", e);
      setError(e.message);
      return;
    }

  
    const iframeHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>${css}</style>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script>
          try {
            ${compiledCode}
          } catch (err) {
            document.body.innerHTML = '<pre style="color:red;">' + err.message + '</pre>';
          }
        </script>
      </body>
      </html>
    `;

    
    const iframe = iframeRef.current;
    iframe.srcdoc = iframeHTML;
  }, [jsx, css]);

  return (
    <div className="border rounded overflow-hidden">
      <iframe
        ref={iframeRef}
        title="Component Preview"
        sandbox="allow-scripts"
        style={{ width: '100%', height: '300px', border: 'none' }}
      />
      {error && (
        <pre className="text-red-500 mt-2 text-sm font-mono whitespace-pre-wrap p-2 bg-red-100 rounded">
          ⚠️ Render Error: {error}
        </pre>
      )}
    </div>
  );
};

export default LivePreview;
