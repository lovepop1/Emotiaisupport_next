import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Function to fetch Quote of the Day
export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Provide an inspirational quote for an emotional support and mental health and well-being platform that thrives on AI-driven compassion for today.");
    const quote = result.response.text();

    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}
