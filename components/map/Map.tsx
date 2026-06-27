"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MarkerData = {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  title: string;
  activity: string;
  dateCreated: string;
};

type MapProps = {
  isSatellite: boolean;
  markers: MarkerData[];
  onMapClick: (lat: number, lng: number) => void;
};

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Map({ isSatellite, markers, onMapClick }: MapProps) {
  return (
    <MapContainer
      center={[40.759658, -98.915037]}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "800px" }}
    >
      {isSatellite ? (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />
      ) : (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      )}

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          title={marker.title}
        />
      ))}

      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}
