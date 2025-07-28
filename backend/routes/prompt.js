const express = require("express");
const router = express.Router();
const JSZip = require("jszip");
const axios = require("axios");
function extractJSX(text) {
  const jsxMatch = text.match(/```(?:jsx|tsx)\n([\s\S]*?)```/i);
  return jsxMatch ? jsxMatch[1].trim() : "";
}

function extractCSS(text) {
  const cssMatch = text.match(/```css\n([\s\S]*?)```/i);
  return cssMatch ? cssMatch[1].trim() : "";
}

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `You are a UI generator AI. Based on this user request: "${prompt}", generate a React component using JSX and CSS. Your response must be structured like this:

JSX:
<COMPONENT_CODE_HERE>

CSS:
<STYLES_HERE>`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const aiText =
      geminiResponse.data.candidates[0]?.content?.parts[0]?.text || "";
    console.log("AI Response:", aiText);

    
    const generatedJSX = extractJSX(aiText);
    const generatedCSS = extractCSS(aiText);

    console.log("Generated JSX:", generatedJSX);
    console.log("Generated CSS:", generatedCSS);
    res.json({ jsx: generatedJSX, css: generatedCSS });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate code from Gemini API." });
  }
});


router.post("/export", async (req, res) => {
  const { jsx, css } = req.body;

  try {
    const zip = new JSZip();
    zip.file("Component.jsx", jsx);
    zip.file("styles.css", css);

    const content = await zip.generateAsync({ type: "nodebuffer" });
    res.set("Content-Type", "application/zip");
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate zip file." });
  }
});

module.exports = router;
