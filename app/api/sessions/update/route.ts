import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function PUT(request: Request) {
  try {
    const { sessionId, userId, sessionSummary, sessionTakeaways } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json({ message: "Session ID and User ID are required" }, { status: 400 });
    }

    // Ensure the session belongs to the user before updating
    const sessionQuery = await pool.query(
      "SELECT user_id FROM user_sessions WHERE session_id = $1",
      [sessionId]
    );

    if (sessionQuery.rowCount === 0) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    if (sessionQuery.rows[0].user_id !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Update session details
    await pool.query(
      "UPDATE session_details SET session_summary = $1, session_takeaways = $2 WHERE session_id = $3",
      [sessionSummary, sessionTakeaways, sessionId]
    );

    return NextResponse.json({ message: "Session updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
