"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoJSON } from "react-leaflet";
import { ShapeData } from "@/app/lib/actions";

// fix leaflet css issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// stores data for markers
type MarkerData = {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  title: string;
  activity: string;
  dateCreated: string;
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

// defines data and handlers to show map state
type MapProps = {
  isSatellite: boolean;
  markers: MarkerData[];
  lines: LineData[];
  shapes: ShapeData[];
  onMapClick: (lat: number, lng: number) => void;
  isDrawingMode: boolean;
  currentShapePoints: [number, number][];
};

// function that on user clicking, stores coordinates where clicked
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

// function that creates map and handles alterations
export default function Map({
  isSatellite,
  markers,
  lines,
  shapes,
  onMapClick,
  isDrawingMode,
  currentShapePoints,
}: MapProps) {
  return (
    <MapContainer
      center={[40.759658, -98.915037]}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "800px" }}
    >
      {/* isSatellite {true tileLayer=satellite} else {tileLayer=basic} */}
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

      {/* create shapes from db */}
      {shapes.map((shape) => (
        <GeoJSON
          key={shape.id}
          data={JSON.parse(shape.geoJson)}
          style={{
            color: shape.color,
            fillColor: shape.color,
            fillOpacity: 0.3,
          }}
        >
          <Popup>
            <div>
              <h3 style={{ margin: 0, fontWeight: "bold" }}>{shape.title}</h3>
              {shape.notes && (
                <p style={{ margin: "5px 0 0" }}>{shape.notes}</p>
              )}
            </div>
          </Popup>
        </GeoJSON>
      ))}

      {/* create markers from db */}
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <div>
              <h3>{marker.title}</h3>
              <p>Activity: {marker.activity}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* create Lines from db */}
      {lines.map((line) => (
        <GeoJSON
          key={line.id}
          data={JSON.parse(line.geoJson)}
          style={{
            color: line.color,
          }}
        >
          <Popup>
            <div>
              <h3 style={{ margin: 0, fontWeight: "bold" }}>{line.title}</h3>
              {line.notes && <p style={{ margin: "5px 0 0" }}>{line.notes}</p>}
            </div>
          </Popup>
        </GeoJSON>
      ))}

      {/* if creating a shape, show dots and lines to outline */}
      {isDrawingMode && currentShapePoints.length > 0 && (
        <>
          <Polyline
            positions={currentShapePoints}
            pathOptions={{ color: "red", weight: 5, dashArray: "5, 5" }}
          />

          {currentShapePoints.map((point, index) => (
            <Circle
              key={index}
              center={point}
              radius={100}
              pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
            />
          ))}
        </>
      )}

      {/* call function above for gathering coordinates */}
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}
