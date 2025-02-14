import { NextRequest, NextResponse } from "next/server";
import { getEmbedding, fetchGeminiResponse, fetchRelevantGuides, fetchChatHistory } from "@/utils/embedding";
import prisma from "@/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId, message, sessionType } = await req.json(); // ✅ Extract sessionType from request

    if (!sessionId || !userId || !message || !sessionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Step 1: Generate embedding for the user message
    const messageEmbedding = await getEmbedding(message);

    // ✅ Step 2: Retrieve top 3 relevant CBT guides based on similarity
    const relevantGuides = await fetchRelevantGuides(messageEmbedding) as any[];

    // ✅ Step 3: Fetch the last 5 messages in the session for context
    const chatHistory: any[] = await fetchChatHistory(sessionId);

    // ✅ Step 4: Call Gemini API with sessionType to generate a personalized response
    const aiResponse = await fetchGeminiResponse(message, relevantGuides, chatHistory, sessionType);

    // ✅ Step 5: Save the chat message and AI response to the database
    const chatMessage = await prisma.chat_message.create({
      data: {
        user_id: userId,
        session_id: sessionId,
        message: message,
        response: aiResponse,
      },
    });

    return NextResponse.json(chatMessage);
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
