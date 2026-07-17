import { Pool } from "pg";

// only one instance of the database pool should be created and shared across the application
const globalForDb = global as unknown as { pool: Pool };

// find or create the database pool
const pool = new Pool({
  host: process.env.DB_HOST || "nextjs_postgres",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD,
  database: "personalProjectDB",
  port: 5432,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// -- schema.sql
// user table schema
// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) DEFAULT 'User',
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password_hash VARCHAR(255) NOT NULL,
//     recovery_code VARCHAR(255) NOT NULL,
//     session_token VARCHAR(255),
//     session_expires_at TIMESTAMP WITH TIME ZONE,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE IF NOT EXISTS user_settings (
//     user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
//     map_height INT DEFAULT 100, -- Set to 100 here!
//     map_width INT DEFAULT 100,  -- Set to 100 here!
//     map_zoom INT DEFAULT 13,
//     map_center_lat DOUBLE PRECISION DEFAULT 40.759658,
//     map_center_lng DOUBLE PRECISION DEFAULT -98.915037
// );
