"use server";

// a more efficient query system from PostgreSQL || "pg"
import { Pool } from "pg";
import { z } from "zod";

// DB connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://admin:password@localhost:5432/personalProjectDB",
});

// types here to ensure matching format between db and page
type MarkerData = {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  title: string;
  activity: string;
  dateCreated: string;
};

export type ShapeData = {
  id: string;
  userId: string;
  title: string;
  lat: number;
  lng: number;
  notes: string;
  dateCreated: Date;
  color: string;
  geoJson: string;
};

export type LineData = {
  id: string;
  userId: string;
  title: string;
  lat: number;
  lng: number;
  notes: string;
  dateCreated: Date;
  color: string;
  geoJson: string;
};

export async function saveLineToDatabase(line: LineData) {
  const LineSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().min(1),
    title: z.string().min(1, "Title is required").max(100),
    notes: z.string().max(500),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    dateCreated: z.coerce.date(),
    color: z.string().min(1),
    geoJson: z.string().refine((val) => {
      // ensures valid geoJson format
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid GeoJSON string format"),
  });

  // uses zod verified data to pass to db
  const validatedLine = LineSchema.parse(line);

  try {
    const query = `
      INSERT INTO lines (id, user_id, title, notes, lat, lng, date_created, color, geojson)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      validatedLine.id,
      validatedLine.userId,
      validatedLine.title,
      validatedLine.notes,
      validatedLine.lat,
      validatedLine.lng,
      validatedLine.dateCreated,
      validatedLine.color,
      validatedLine.geoJson,
    ];

    await pool.query(query, values);
    console.log("Line successfully saved");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save line.");
  }
}

export async function retrieveLinesFromDB() {
  try {
    const result = await pool.query(
      "SELECT * FROM lines ORDER BY date_created DESC",
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      notes: row.notes || "",
      lat: Number(row.lat),
      lng: Number(row.lng),
      dateCreated: row.date_created,
      color: row.color,
      geoJson: row.geojson,
    }));
  } catch (error) {
    console.error("Failed to retrieve Lines: ", error);
    return [];
  }
}

export async function saveMarkerToDatabase(marker: MarkerData) {
  const validatedValues = z.object({
    id: z.string().uuid(),
    userId: z.string().min(1),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    title: z.string().min(1),
    activity: z.string().min(1),
    dateCreated: z.string(),
  });

  // uses zod validated data from validated values to pass into db
  const validatedMarker = validatedValues.parse(marker);

  try {
    const query = `
      INSERT INTO markers (id, user_id, lat, lng, title, activity, date_created)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const values = [
      validatedMarker.id,
      validatedMarker.userId,
      validatedMarker.lat,
      validatedMarker.lng,
      validatedMarker.title,
      validatedMarker.activity,
      validatedMarker.dateCreated,
    ];

    await pool.query(query, values);
    console.log("Marker successfully saved");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save marker. Ensure data is valid!");
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

export async function saveShapeToDatabase(shape: ShapeData) {
  const ShapeSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().min(1),
    title: z.string().min(1, "Title is required").max(100),
    notes: z.string().max(500),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    dateCreated: z.coerce.date(),
    color: z.string().min(1),
    geoJson: z.string().refine((val) => {
      // ensures valid geoJson format
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid GeoJSON string format"),
  });

  // uses zod verified data to pass to db
  const validatedShape = ShapeSchema.parse(shape);

  try {
    const query = `
      INSERT INTO shapes (id, user_id, title, notes, lat, lng, date_created, color, geojson)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      validatedShape.id,
      validatedShape.userId,
      validatedShape.title,
      validatedShape.notes,
      validatedShape.lat,
      validatedShape.lng,
      validatedShape.dateCreated,
      validatedShape.color,
      validatedShape.geoJson,
    ];

    await pool.query(query, values);
    console.log("Shape successfully saved");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save shape.");
  }
}

export async function retrieveShapesFromDB() {
  try {
    const result = await pool.query(
      "SELECT * FROM shapes ORDER BY date_created DESC",
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      notes: row.notes || "",
      lat: Number(row.lat),
      lng: Number(row.lng),
      dateCreated: row.date_created,
      color: row.color,
      geoJson: row.geojson,
    }));
  } catch (error) {
    console.error("Failed to retrieve Shapes: ", error);
    return [];
  }
}
