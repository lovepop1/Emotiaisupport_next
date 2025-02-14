import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function DELETE(request: Request) {
  try {
    const { sessionId, userId } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json({ message: "Session ID and User ID are required" }, { status: 400 });
    }

    // Ensure the session belongs to the user before deleting
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

    // Delete session details first (due to foreign key constraint)
    await pool.query("DELETE FROM session_details WHERE session_id = $1", [sessionId]);

    // Delete session itself
    await pool.query("DELETE FROM user_sessions WHERE session_id = $1", [sessionId]);

    return NextResponse.json({ message: "Session deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
