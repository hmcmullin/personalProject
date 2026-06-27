"use client";

import { useState, useEffect } from "react";
import Map from "@/components/map/Map";
import { saveMarkerToDatabase, retrieveMarkersFromDB } from "@/app/lib/actions";

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
  const [isSatellite, setIsSatellite] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    async function loadMarkers() {
      const savedMarkers = await retrieveMarkersFromDB();
      setMarkers(savedMarkers);
    }
    loadMarkers();
  }, []);

  const handleMapClick = async (lat: number, lng: number) => {
    const newMarker: MarkerData = {
      id: crypto.randomUUID(),
      userId: "Temporary User",
      lat: lat,
      lng: lng,
      title: "New Marker",
      activity: "General",
      dateCreated: new Date().toISOString(),
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    try {
      await saveMarkerToDatabase(newMarker);
    } catch (error) {
      console.error("Failed to save marker to Docker:", error);
    }
  };

  return (
    <div>
      <h1 className="flex justify-center m-5">Welcome to your map!</h1>

      <label className="flex justify-center">
        <input
          type="checkbox"
          checked={isSatellite}
          onChange={(e) => setIsSatellite(e.target.checked)}
          // onMouseEnter={label.show}
        />
        Satellite
      </label>

      <div
        className="flex justify-center"
        style={{ height: "800px", width: "98%", margin: "0 auto" }}
      >
        <Map
          isSatellite={isSatellite}
          markers={markers}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
}
