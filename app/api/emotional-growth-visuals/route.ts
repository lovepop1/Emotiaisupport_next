import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId || !startDate || !endDate) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const testQuery = await pool.query(
      `SELECT * FROM mental_health_tests 
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3 
       ORDER BY created_at ASC`,
      [userId, startDate, endDate]
    );

    if (testQuery.rowCount === 0) {
      return NextResponse.json({ message: "No records found" }, { status: 404 });
    }

    const testRecords = testQuery.rows.map((record) => ({
      date: new Date(record.created_at).toISOString().split("T")[0], // ✅ Converts Date to ISO string
      scores: Array.from({ length: 12 }, (_, i) => Number(record[`q${i + 1}`]) || 0), // ✅ Ensure valid numbers
    }));

    // 🔹 **Bar Chart Data** (Tracks individual question scores over time)
    const barChartData = testRecords.map((record) => ({
      date: record.date,
      ...record.scores.reduce((acc, score, index) => {
        acc[`Aspect ${index + 1}`] = score;
        return acc;
      }, {} as Record<string, number>),
    }));

    // 🔹 **Line Chart Data** (Shows average score trends over time)
    const lineChartData = testRecords.map((record) => ({
      date: record.date,
      avgScore: record.scores.reduce((sum, score) => sum + score, 0) / record.scores.length,
    }));

    return NextResponse.json({ barChartData, lineChartData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching emotional growth visuals:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
