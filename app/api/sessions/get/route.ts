import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;

    if (!sessionId) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 400 });
    }

    // Query session details with user information
    const sessionQuery = await pool.query(
      `
      SELECT s.session_id, s.session_name, s.mood, s.intensity, s.session_type, s.created_at
      FROM sessions s
      WHERE s.session_id = $1
      `,
      [sessionId]
    );

    if (sessionQuery.rowCount === 0) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: sessionQuery.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
