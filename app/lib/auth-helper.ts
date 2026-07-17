// @/lib/auth-helper.ts
import { cookies } from "next/headers";
import { query } from "./db";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    // finds the user associated with the session token and checks if the session is still valid
    const res = await query(
      `SELECT id, email 
       FROM users 
       WHERE session_token = $1 
         AND session_expires_at > NOW()`,
      [sessionId],
    );

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0] as { id: number; email: string };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}
