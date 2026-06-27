"use server";

import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://admin:password@localhost:5432/personalProjectDB",
});

type MarkerData = {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  title: string;
  activity: string;
  dateCreated: string;
};

export async function saveMarkerToDatabase(marker: MarkerData) {
  try {
    const query = `
      INSERT INTO markers (id, user_id, lat, lng, title, activity, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const values = [
      marker.id,
      marker.userId,
      marker.lat,
      marker.lng,
      marker.title,
      marker.activity,
      marker.dateCreated,
    ];

    await pool.query(query, values);
    console.log("Marker successfully saved to Docker Postgres!");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save marker.");
  }
}

export async function retrieveMarkersFromDB() {
  try {
    const result = await pool.query(
      "SELECT * FROM markers ORDER BY date_created DESC",
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      lat: row.lat,
      lng: row.lng,
      title: row.title,
      activity: row.activity,
      dateCreated: row.date_created.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to retrieve Markers: ", error);
    return [];
  }
}
