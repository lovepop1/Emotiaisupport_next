import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Fetch sessions belonging to the logged-in user
    const sessions = await pool.query(
      `SELECT s.session_id, s.session_name, us.created_at
       FROM user_sessions us
       JOIN sessions s ON us.session_id = s.session_id
       WHERE us.user_id = $1
       ORDER BY us.created_at DESC`,
      [userId]
    );

    return NextResponse.json({ sessions: sessions.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
