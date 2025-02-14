import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Query all mental health tests for the given user
    const query = await pool.query(
      `
      SELECT id, user_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, created_at
      FROM mental_health_tests
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    if (query.rowCount === 0) {
      return NextResponse.json({ message: "No tests found for this user" }, { status: 404 });
    }

    // Format response: Convert individual q1-q12 fields into an array
    const tests = query.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      responses: [
        row.q1, row.q2, row.q3, row.q4, row.q5, row.q6, 
        row.q7, row.q8, row.q9, row.q10, row.q11, row.q12
      ],
      created_at: row.created_at,
    }));

    return NextResponse.json({ tests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching mental health tests:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
