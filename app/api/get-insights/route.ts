import { fetchRelevantGuides, getEmbedding } from "@/utils/embedding";
import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const questionnaire: string[] = [
  "How often do you feel focused and able to concentrate on daily tasks?",
  "Do you get restful sleep, even during stressful times?",
  "Do you feel that your daily activities contribute meaningfully to your life or others’?",
  "Do you feel confident in making decisions, even in uncertain situations?",
  "How often do you feel calm and in control of your emotions?",
  "When facing difficulties, do you feel capable in handling them?",
  "Do you find joy and satisfaction in your daily tasks and activities?",
  "Do you effectively manage stress and challenges in your life?",
  "How frequently do you feel emotionally balanced and generally happy?",
  "How strong and confident do you feel in yourself and your abilities?",
  "Do you generally feel valued, worthy, and appreciated?",
  "Lately, how often do you experience a sense of contentment and well-being?"
];

const responseLabels: string[] = ["Never", "Rarely", "Sometimes", "Often", "Always"];

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { responses }: { responses: number[] } = body;

    if (!responses || responses.length !== questionnaire.length) {
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 });
    }

    // Format responses into a readable Q&A format
    const formattedResponses: string = responses
      .map((val: number, index: number) => `Q${index + 1}: ${questionnaire[index]}\nAnswer: ${responseLabels[val]}`)
      .join("\n\n");

    const userEmbedding: number[] = await getEmbedding(formattedResponses);
    const relevantGuides = (await fetchRelevantGuides(userEmbedding)) as { content: string }[];
    const guidesText: string = relevantGuides.map((g) => g.content).join("\n");

    // Generate insights using Gemini AI
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      A user has completed a mental health assessment with the following responses:

      ${formattedResponses}

      Based on these responses and the following expert mental health guidance:

      ${guidesText}

      Provide a well-structured, supportive, and actionable set of insights tailored to the user's mental well-being. Offer personalized recommendations on how they can improve their mental health.
      Avoid using *,#, or other special characters in the response and return a consolidated paragh with insights and recommendations.
      Keep the response friendly and supportive.
    `;

    const response = await model.generateContent(prompt);
    const insights: string = response.response.text();

    return new Response(JSON.stringify({ insights }), { status: 200 });
  } catch (error) {
    console.error("Error generating insights:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
