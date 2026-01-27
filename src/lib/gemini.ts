import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateAIContent = async (prompt: string) => {
  if (!apiKey) {
    throw new Error("API Key missing! Please add VITE_GEMINI_API_KEY to your .env file.");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
