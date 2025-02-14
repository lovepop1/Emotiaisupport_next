import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { userId, sessionName, mood, intensity, sessionType } = await request.json();

    if (!userId || !sessionName || !mood || !intensity || !sessionType) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Insert into `sessions` table
    const sessionResult = await pool.query(
      `INSERT INTO sessions (session_name, mood, intensity, session_type, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING session_id`,
      [sessionName, mood, intensity, sessionType]
    );

    const sessionId = sessionResult.rows[0].session_id;

    // Insert into `user_sessions` table
    await pool.query(
      `INSERT INTO user_sessions (session_id, user_id, created_at)
       VALUES ($1, $2, NOW())`,
      [sessionId, userId]
    );

    return NextResponse.json({ message: "Session created successfully", sessionId }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
