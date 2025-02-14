import prisma from "@/utils/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ Use `text-embedding-002` (for 1536D) or `text-embedding-004` (for 768D)
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await model.embedContent(text);

    if (!response || !response.embedding || !response.embedding.values) {
      throw new Error("Invalid response from Gemini API");
    }

    return response.embedding.values; // Returns the embedding array
  } catch (error) {
    console.error("❌ Error fetching embedding:", error);
    return [];
  }
}







// Fetch last 5 messages in a session
export async function fetchChatHistory(sessionId: string, limit: number = 5) {
  return await prisma.chat_message.findMany({
    where: { session_id: sessionId },
    orderBy: { created_at: "desc" },
    take: limit,
  });
}

// Fetch the top 3 most relevant CBT guides using vector similarity search
export async function fetchRelevantGuides(questionEmbedding: number[]) {
  return await prisma.$queryRaw`
    SELECT id, title, content 
    FROM cbt_guide_duplicate
    ORDER BY embedding <=> (${questionEmbedding}::vector)
    LIMIT 3;
  `;
}


const model2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function fetchGeminiResponse(
  userMessage: string,
  relevantGuides: any[],
  chatHistory: any[],
  sessionType: string | null
) {
  const chatContext = chatHistory
    .map((chat) => `User: ${chat.message}\nAI: ${chat.response}`)
    .join("\n\n");

  const guideContext = relevantGuides
    .map((guide, index) => `Guide ${index + 1}: ${guide.title}\n${guide.content}`)
    .join("\n\n");

  // ✅ Define AI behavior based on session type
  let sessionContext = "You are a mental health AI assistant trained in Cognitive Behavioral Therapy (CBT).";

  if (sessionType) {
    switch (sessionType) {
      case "Free Chat":
        sessionContext = "You are a cognitive behavioral therapist and You are also a friendly conversational AI. Speak naturally, compassionately, and with sensitivity.Offer structured CBT responses to help users reframe their thoughts and keep responses informal and supportive.";
        break;
      case "Guided Reflection":
        sessionContext = "You are a reflective therapist guiding users through introspective questions. Focus on encouraging deeper thinking.";
        break;
      case "Meditation":
        sessionContext = "You are a mindfulness coach. Provide calming, grounding, and meditation-related responses. The user is seeking relaxation and stress relief.";
        break;
      case "Cognitive Support":
        sessionContext = "You are a cognitive behavioral therapist. Offer structured CBT responses to help users reframe their thoughts.";
        break;
      case "Journaling":
        sessionContext = "You are a journaling coach. Encourage users to explore their emotions through writing and self-reflection.";
        break;
    }
  }

  const prompt = `
  ${sessionContext}

  Here is the chat history from the ongoing session:

  ${chatContext}

  A user has asked the following question:
  "${userMessage}"

  Use the most relevant information from these guides to generate a helpful response:
  ${guideContext}

  Your response should be concise, empathetic, and actionable and dont include the guide number in response.
  `;

  try {
    const result = await model2.generateContent(prompt);
    const responseText = result.response.text();

    return responseText || "I'm sorry, but I couldn't find a relevant response.";
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    return "An error occurred while generating a response.";
  }
}


// const model3 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function fetchGeminiTakeaways(chatHistory: any[], sessionType: string) {
  const chatContext = chatHistory
    .map((chat) => `User: ${chat.message}\nAI: ${chat.response}`)
    .join("\n\n");

  const prompt = `
  You are a mental health AI assistant trained in Cognitive Behavioral Therapy (CBT).
  The user has just completed a session of type: "${sessionType}".

  Here is the chat history from this session:
  ${chatContext}

  Based on this, summarize the key takeaways from the session in a concise and structured manner.
  Format the response with key insights and lessons learned.
  Keep it helpful and actionable. Avoid using the user said or the user etc and use you . Make it professional like how a therapist would say it to a patient in first person.
  `;

  try {
    const result = await model2.generateContent(prompt);
    const responseText = result.response.text();

    return responseText || "No significant takeaways recorded yet.";
  } catch (error) {
    console.error("❌ Error calling Gemini API for takeaways:", error);
    return "An error occurred while generating takeaways.";
  }
}