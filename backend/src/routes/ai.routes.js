import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const client = new GoogleGenerativeAI("");

// console.log("geminini key:", process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-flash-lite-latest" });

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const reply =
      result.response.text() ||
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to parse response";

    res.json({ reply });
  } catch (err) {
    console.log("🔥 Gemini Error:", err);
    res.status(500).json({ error: err });
  }
});

export default router;
