"use server";

import { Pool } from "pg";
import { z } from "zod";
import * as Types from "./data";

// #region | db connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://admin:password@localhost:5432/personalProjectDB",
});
//#endregion

// #region | zod schema validation for lines and shapes
const ObjectSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().min(1),
    title: z.string().min(1, "Title is required").max(100),
    notes: z.string().max(500),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    dateCreated: z.coerce.date(),
    color: z.string().min(1),
    geoJson: z.string().refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid GeoJSON string format"),
  })
  .passthrough();

// zod schema validation for markers
const MarkerSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().min(1),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    title: z.string().min(1),
    activity: z.string().min(1),
    dateCreated: z.string(),
    color: z.string().min(1),
  })
  .passthrough();
//#endregion

// #region | helper function to delete any object
async function deleteItemFromTable(table: string, id: string) {
  try {
    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [id],
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Failed to delete from ${table}: `, error);
    return null;
  }
}
// #endregion

// #region | line functions
export async function saveLineToDatabase(line: Types.LineData) {
  const validated = ObjectSchema.parse(line);
  try {
    const query = `
      INSERT INTO lines (id, user_id, title, notes, lat, lng, date_created, color, geojson)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
      validated.id,
      validated.userId,
      validated.title,
      validated.notes,
      validated.lat,
      validated.lng,
      validated.dateCreated,
      validated.color,
      validated.geoJson,
    ];
    await pool.query(query, values);
    console.log("Line successfully saved");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save line.");
  }
}

export async function retrieveLinesFromDB(): Promise<Types.LineData[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM lines ORDER BY date_created DESC",
    );
    return result.rows.map((row) => ({
      objType: "line",
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

export async function updateLineInDB(line: Types.LineData) {
  const validated = ObjectSchema.parse(line);
  try {
    const query = `
      UPDATE lines 
      SET title = $1, notes = $2, lat = $3, lng = $4, color = $5, geojson = $6
      WHERE id = $7
    `;
    const values = [
      validated.title,
      validated.notes,
      validated.lat,
      validated.lng,
      validated.color,
      validated.geoJson,
      validated.id,
    ];
    await pool.query(query, values);
    console.log("Line successfully updated");
  } catch (error) {
    console.error("Database Error updating line:", error);
    throw new Error("Failed to update line.");
  }
}

export async function removeLineFromDB(id: string) {
  return deleteItemFromTable("lines", id);
}
// #endregion

// #region | marker functions
export async function saveMarkerToDatabase(marker: Types.MarkerData) {
  const validated = MarkerSchema.parse(marker);
  try {
    const query = `
      INSERT INTO markers (id, user_id, lat, lng, title, activity, date_created, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      validated.id,
      validated.userId,
      validated.lat,
      validated.lng,
      validated.title,
      validated.activity,
      validated.dateCreated,
      validated.color,
    ];
    await pool.query(query, values);
    console.log("Marker successfully saved");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save marker. Ensure data is valid!");
  }
}

export async function retrieveMarkersFromDB(): Promise<Types.MarkerData[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM markers ORDER BY date_created DESC",
    );
    return result.rows.map((row) => ({
      objType: "marker",
      id: row.id,
      userId: row.user_id,
      lat: row.lat,
      lng: row.lng,
      title: row.title,
      activity: row.activity,
      dateCreated: row.date_created.toISOString(),
      color: row.color,
    }));
  } catch (error) {
    console.error("Failed to retrieve Markers: ", error);
    return [];
  }
}

export async function updateMarkerInDB(marker: Types.MarkerData) {
  const validated = MarkerSchema.parse(marker);
  try {
    const query = `
      UPDATE markers 
      SET lat = $1, lng = $2, title = $3, activity = $4, color = $5
      WHERE id = $6
    `;
    const values = [
      validated.lat,
      validated.lng,
      validated.title,
      validated.activity,
      validated.color,
      validated.id,
    ];
    await pool.query(query, values);
    console.log("Marker successfully updated");
  } catch (error) {
    console.error("Database Error updating marker:", error);
    throw new Error("Failed to update marker.");
  }
}

export async function removeMarkerFromDB(id: string) {
  return deleteItemFromTable("markers", id);
}
// #endregion

// #region | shape functions
export async function saveShapeToDatabase(shape: Types.ShapeData) {
  const validated = ObjectSchema.parse(shape);
  try {
    const query = `
      INSERT INTO shapes (id, user_id, title, notes, lat, lng, date_created, color, geojson)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
      validated.id,
      validated.userId,
      validated.title,
      validated.notes,
      validated.lat,
      validated.lng,
      validated.dateCreated,
      validated.color,
      validated.geoJson,
    ];
    await pool.query(query, values);
    console.log("Shape successfully saved");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save shape.");
  }
}

export async function retrieveShapesFromDB(): Promise<Types.ShapeData[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM shapes ORDER BY date_created DESC",
    );
    return result.rows.map((row) => ({
      objType: "shape",
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

export async function updateShapeInDB(shape: Types.ShapeData) {
  const validated = ObjectSchema.parse(shape);
  try {
    const query = `
      UPDATE shapes 
      SET title = $1, notes = $2, lat = $3, lng = $4, color = $5, geojson = $6
      WHERE id = $7
    `;
    const values = [
      validated.title,
      validated.notes,
      validated.lat,
      validated.lng,
      validated.color,
      validated.geoJson,
      validated.id,
    ];
    await pool.query(query, values);
    console.log("Shape successfully updated");
  } catch (error) {
    console.error("Database Error updating shape:", error);
    throw new Error("Failed to update shape.");
  }
}

export async function removeShapeFromDB(id: string) {
  return deleteItemFromTable("shapes", id);
}
// #endregion

// #region | user functions
// export async function updateMapZoom(id: string) {
//   return deleteItemFromTable("shapes", id);
// }

// export async function updateMapLat(id: string) {
//   return deleteItemFromTable("shapes", id);
// }

// export async function updateMapLong(id: string) { // possibly can be done in one function
//   return deleteItemFromTable("shapes", id);
// }

// export async function updateMapHeight(id: string) {
//   return deleteItemFromTable("shapes", id);
// }

// export async function updateMapWidth(id: string) {
//   return deleteItemFromTable("shapes", id);
// }

// export async function updateUserEmail(id: string) {
//   return deleteItemFromTable("shapes", id);
// }

// export async function updateUserPassword(id: string) {
//   return deleteItemFromTable("shapes", id);
// }

// #endregion
