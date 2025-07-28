const express = require("express");
const router = express.Router();
const UserSession = require("../models/UserSession");
router.post("/autosave", async (req, res) => {
  const { userId, chatHistory, jsx, css } = req.body;

  await UserSession.updateOne(
    { userId },
    { $set: { chatHistory, jsx, css } },
    { upsert: true }
  );

  res.status(200).json({ message: "Saved successfully" });
});
router.get("/restore/:userId", async (req, res) => {
  const { userId } = req.params;
  const session = await UserSession.findOne({ userId });
  if (!session) return res.status(404).json({});

  res.json({
    chatHistory: session.chatHistory,
    jsx: session.jsx,
    css: session.css,
  });
});

module.exports = router;
