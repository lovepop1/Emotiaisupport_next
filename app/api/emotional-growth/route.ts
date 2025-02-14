// import { NextResponse } from "next/server";
// import { Pool } from "pg";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// // Define questionnaire and response labels
// const questionnaire = [
//   "How often do you feel focused and able to concentrate on daily tasks?",
//   "Do you get restful sleep, even during stressful times?",
//   "Do you feel that your daily activities contribute meaningfully to your life or others’?",
//   "Do you feel confident in making decisions, even in uncertain situations?",
//   "How often do you feel calm and in control of your emotions?",
//   "When facing difficulties, do you feel capable of handling them?",
//   "Do you find joy and satisfaction in your daily tasks and activities?",
//   "Do you effectively manage stress and challenges in your life?",
//   "How frequently do you feel emotionally balanced and generally happy?",
//   "How strong and confident do you feel in yourself and your abilities?",
//   "Do you generally feel valued, worthy, and appreciated?",
//   "Lately, how often do you experience a sense of contentment and well-being?"
// ];

// const responseLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"];

// export async function GET(request: Request, { params }: { params: { userId: string } }) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = params.userId;
//     if (!userId) {
//       return NextResponse.json({ message: "User ID is required" }, { status: 400 });
//     }

//     // Parse time range (if provided)
//     const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : null;
//     const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : new Date();

//     // Fetch filtered mental health test records for the user
//     let queryText = `SELECT id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, created_at
//                      FROM mental_health_tests
//                      WHERE user_id = $1`;
//     const queryParams: any[] = [userId];

//     if (fromDate) {
//       queryText += ` AND created_at >= $2`;
//       queryParams.push(fromDate);
//     }
//     if (toDate) {
//       queryText += ` AND created_at <= $${queryParams.length + 1}`;
//       queryParams.push(toDate);
//     }

//     queryText += ` ORDER BY created_at ASC`;
//     const query = await pool.query(queryText, queryParams);

//     if (query.rowCount === 0) {
//       return NextResponse.json({ message: "No mental health records found for the selected time range" }, { status: 404 });
//     }

//     // Format test history for AI analysis
//     const testHistory = query.rows.map((row, testIndex) => {
//       const formattedResponses = questionnaire.map((question, qIndex) => {
//         const responseValue = row[`q${qIndex + 1}`];
//         return `Q${qIndex + 1}: ${question}\nAnswer: ${responseLabels[responseValue]}`;
//       }).join("\n");

//       return `Test ${testIndex + 1} (Date: ${row.created_at.toISOString()}):\n${formattedResponses}`;
//     }).join("\n\n");

//     // Gemini AI prompt with time range
//     const model = gemini.getGenerativeModel({ model: "gemini-pro" });
//     const prompt = `
//       A user has taken multiple mental health assessments between ${fromDate ? fromDate.toDateString() : "the beginning"} and ${toDate.toDateString()}.
      
//       --- Question Set ---
//       ${questionnaire.map((q, i) => `Q${i + 1}: ${q}`).join("\n")}

//       --- Response Scale ---
//       0 = Never, 1 = Rarely, 2 = Sometimes, 3 = Often, 4 = Always

//       --- User's Test History ---
//       ${testHistory}

//       Analyze the user's emotional progress during this time range:
//       - Identify patterns of improvement or decline.
//       - Highlight areas where the user has shown positive emotional growth.
//       - Point out areas that need attention or improvement.
//       - Offer personalized recommendations to enhance emotional well-being.
//     `;

//     const response = await model.generateContent(prompt);
//     const insights: string = response.response.text();

//     return NextResponse.json({ insights }, { status: 200 });
//   } catch (error) {
//     console.error("Error generating emotional growth insights:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { Pool } from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Mental health questionnaire and response mapping
const questionnaire = [
  "How often do you feel focused and able to concentrate on daily tasks?",
  "Do you get restful sleep, even during stressful times?",
  "Do you feel that your daily activities contribute meaningfully to your life or others’?",
  "Do you feel confident in making decisions, even in uncertain situations?",
  "How often do you feel calm and in control of your emotions?",
  "When facing difficulties, do you feel capable of handling them?",
  "Do you find joy and satisfaction in your daily tasks and activities?",
  "Do you effectively manage stress and challenges in your life?",
  "How frequently do you feel emotionally balanced and generally happy?",
  "How strong and confident do you feel in yourself and your abilities?",
  "Do you generally feel valued, worthy, and appreciated?",
  "Lately, how often do you experience a sense of contentment and well-being?"
];

const responseLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId || !startDate || !endDate) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // Fetch mental health records for the user within the time range
    const testQuery = await pool.query(
      `SELECT * FROM mental_health_tests 
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3 
       ORDER BY created_at ASC`,
      [userId, startDate, endDate]
    );

    if (testQuery.rowCount === 0) {
      return NextResponse.json({ message: "No records found in this range" }, { status: 404 });
    }

    // Format responses with labels
    const testRecords = testQuery.rows.map(record => ({
      date: record.created_at,
      responses: questionnaire.map((question, index) => ({
        question,
        response: responseLabels[record[`q${index + 1}`] as number] || "Unknown"
      }))
    }));

    // Generate insights with Gemini AI
    const prompt = `
      Analyze the following mental health test records over time and provide insights on emotional growth patterns.
      Identify improvements, setbacks, and overall trends. Suggest areas for further focus.
      Data:
      ${JSON.stringify(testRecords, null, 2)}
      Talk about  significant observations and avoid using * and #. Give actionable advice and recommendations and dont mention record numbers
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("Error fetching emotional growth insights:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
