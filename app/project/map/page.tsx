"use client";

import { useState, useEffect } from "react";
import Map from "@/components/map/Map";
import {
  saveMarkerToDatabase,
  retrieveMarkersFromDB,
  saveShapeToDatabase,
  retrieveShapesFromDB,
  ShapeData,
} from "@/app/lib/actions";

// marker information structure
type MarkerData = {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  title: string;
  activity: string;
  dateCreated: string;
};

export default function MyPage() {
  // manage state for features/functions
  const [isSatellite, setIsSatellite] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentShapePoints, setCurrentShapePoints] = useState<
    [number, number][]
  >([]);

  // loads saved information onto map
  useEffect(() => {
    async function loadData() {
      try {
        const savedMarkers = await retrieveMarkersFromDB();
        setMarkers(savedMarkers || []);

        const savedShapes = await retrieveShapesFromDB();
        setShapes(savedShapes || []);
      } catch (error) {
        console.error("Failed to load map data:", error);
      }
    }
    loadData();
  }, []);

  // if conditions met, stores points and related data to create a shape
  const handleCreateShape = async () => {
    if (currentShapePoints.length < 3) return;

    const shapeTitle = prompt("Enter a name for this region/state:");
    if (!shapeTitle) return;

    const shapeColor = prompt("Enter color (e.g. 'red', '#ff0000'):") || "blue";
    const notes = prompt("Enter any notes or comments for this region:") || "";

    // convert to GeoJSON's format (reverse order)
    const geoJsonCoordinates = currentShapePoints.map(([lat, lng]) => [
      lng,
      lat,
    ]);

    // connects the starting and ending points of the shape
    const firstPoint = [currentShapePoints[0][1], currentShapePoints[0][0]];
    geoJsonCoordinates.push(firstPoint);

    const customGeoJson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [geoJsonCoordinates],
      },
    };

    // shape information structure
    const newShape: ShapeData = {
      id: crypto.randomUUID(),
      userId: "Temporary User",
      title: shapeTitle,
      notes: notes,
      lat: currentShapePoints[0][0],
      lng: currentShapePoints[0][1],
      dateCreated: new Date(),
      color: shapeColor,
      geoJson: JSON.stringify(customGeoJson),
    };

    // update ui and push shape to db
    setShapes((prev) => [...prev, newShape]);
    setIsDrawingMode(false);
    setCurrentShapePoints([]);

    try {
      await saveShapeToDatabase(newShape);
    } catch (error) {
      console.error("Failed to save custom shape to DB:", error);
    }
  };

  // gathers coordinates on map click
  const handleMapClick = async (lat: number, lng: number) => {
    // creates array of coordinates for shapes
    if (isDrawingMode) {
      setCurrentShapePoints((prev) => [...prev, [lat, lng]]);
      return;
    }

    const markerTitle = prompt("Enter location title:");
    const markerActivity = prompt("Enter activity:");

    // marker info structure
    const newMarker: MarkerData = {
      id: crypto.randomUUID(),
      userId: "Temporary User",
      lat: lat,
      lng: lng,
      title: markerTitle || "Untitled",
      activity: markerActivity || "General",
      dateCreated: new Date().toISOString(),
    };

    // update ui and push marker to db
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    try {
      await saveMarkerToDatabase(newMarker);
    } catch (error) {
      console.error("Failed to save marker:", error);
    }
  };

  // contains page contents
  return (
    <div>
      <h1 className="flex justify-center m-5">Welcome to your map!</h1>

      {/* tileLayer boolean */}
      <label className="flex justify-center mb-4 cursor-pointer">
        <input
          type="checkbox"
          className="mr-2"
          checked={isSatellite}
          onChange={(e) => setIsSatellite(e.target.checked)}
        />
        Satellite Mode
      </label>

      {/* allows users to enter drawing mode */}
      <div className="flex justify-center gap-4 mb-4">
        {!isDrawingMode ? (
          <button
            onClick={() => setIsDrawingMode(true)}
            style={{
              padding: "8px 16px",
              background: "#4CAF50",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Begin Drawing Region
          </button>
        ) : (
          <>
            {/* changes controls while user is in drawing mode */}
            <button
              onClick={handleCreateShape}
              disabled={currentShapePoints.length < 3}
              style={{
                padding: "8px 16px",
                background: currentShapePoints.length < 3 ? "#ccc" : "#008CBA",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor:
                  currentShapePoints.length < 3 ? "not-allowed" : "pointer",
              }}
            >
              Save Shape ({currentShapePoints.length} points)
            </button>
            <button
              onClick={() => {
                setIsDrawingMode(false);
                setCurrentShapePoints([]);
              }}
              style={{
                padding: "8px 16px",
                background: "#f44336",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div
        className="flex justify-center"
        style={{ height: "800px", width: "98%", margin: "0 auto" }}
      >
        <Map
          isSatellite={isSatellite}
          markers={markers}
          shapes={shapes}
          onMapClick={handleMapClick}
          isDrawingMode={isDrawingMode}
          currentShapePoints={currentShapePoints}
        />
      </div>
    </div>
  );
}
