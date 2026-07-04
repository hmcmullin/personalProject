"use client";
import Map from "@/components/map/Map";
import { useMapData } from "@/hooks/mapActions";

export default function MyPage() {
  // calls mapActions hook to get all the state and handlers
  const {
    isSatellite,
    setIsSatellite,
    isDeleteMode,
    setIsDeleteMode,
    isUpdateMode,
    setIsUpdateMode,
    markers,
    shapes,
    lines,
    isDrawingMode,
    setIsDrawingMode,
    currentShapePoints,
    setCurrentShapePoints,
    handleCreateLine,
    handleAssetClick,
    handleCreateShape,
    handleMapClick,
  } = useMapData();

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
              onClick={handleCreateLine}
              disabled={currentShapePoints.length < 2}
              style={{
                padding: "8px 16px",
                background: currentShapePoints.length < 2 ? "#ccc" : "#008CBA",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor:
                  currentShapePoints.length < 2 ? "not-allowed" : "pointer",
              }}
            >
              Save Line ({currentShapePoints.length} points)
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

      {/* allows users to enter delete mode */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setIsDeleteMode(!isDeleteMode);
            if (!isDeleteMode) setIsUpdateMode(false);
          }}
          style={{
            backgroundColor: isDeleteMode ? "#dc2626" : "#3b82f6",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isDeleteMode ? "Cancel Delete" : "Delete Item Tool"}
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setIsUpdateMode(!isUpdateMode);
            if (!isUpdateMode) setIsDeleteMode(false);
          }}
          style={{
            backgroundColor: isUpdateMode ? "#dc2626" : "#3b82f6",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isUpdateMode ? "Cancel Update" : "Update Item Tool"}
        </button>
      </div>

      <div
        className="flex justify-center"
        style={{ height: "800px", width: "98%", margin: "0 auto" }}
      >
        <Map
          isSatellite={isSatellite}
          markers={markers}
          lines={lines}
          shapes={shapes}
          onMapClick={handleMapClick}
          isDrawingMode={isDrawingMode}
          currentShapePoints={currentShapePoints}
          onAssetClick={handleAssetClick}
        />
      </div>
    </div>
  );
}
