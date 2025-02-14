import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, responses } = await req.json();

    if (!userId || !responses || responses.length !== 12) {
      return NextResponse.json({ error: "Missing required fields or incorrect response format" }, { status: 400 });
    }

    // ✅ Save test record to database
    const mentalHealthTest = await prisma.mental_health_tests.create({
      data: {
        user_id: userId,
        q1: responses[0],
        q2: responses[1],
        q3: responses[2],
        q4: responses[3],
        q5: responses[4],
        q6: responses[5],
        q7: responses[6],
        q8: responses[7],
        q9: responses[8],
        q10: responses[9],
        q11: responses[10],
        q12: responses[11],
      },
    });

    return NextResponse.json(mentalHealthTest, { status: 201 });
  } catch (error) {
    console.error("Error processing mental health test:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
