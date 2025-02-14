import { NextRequest, NextResponse } from "next/server";
import { fetchChatHistory, fetchGeminiTakeaways } from "@/utils/embedding";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Read JSON body
    const { sessionId, sessionType } = body;

    if (!sessionId || !sessionType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log("Fetching chat history for session:", sessionId);

    // Fetch last 10 chat messages for context
    const chatHistory = await fetchChatHistory(sessionId, 10);

    if (!chatHistory || chatHistory.length === 0) {
      return NextResponse.json({ takeaways: "No significant takeaways recorded yet." });
    }

    console.log("Generating takeaways using Gemini...");

    // Generate session takeaways
    const takeaways = await fetchGeminiTakeaways(chatHistory, sessionType);

    return NextResponse.json({ takeaways });
  } catch (error) {
    console.error("Error generating session takeaways:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
