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
    <div className="flex flex-col flex-1 items-center justify-center bg-green-950 font-sans text-white min-h-screen">
      <h1 className="flex justify-center m-2 font-bold text-4xl">
        Welcome to Your Map!
      </h1>

      <nav className="flex justify-center m-2 w-full">
        <a
          href="/project/account"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 m-3 rounded"
        >
          Account
        </a>
      </nav>

      <div
        className="relative flex justify-center"
        style={{ height: "800px", width: "98%", margin: "0 auto" }}
      >
        <div
          className="absolute top-2 right-2 bg-gray-900/75 p-4 rounded-lg shadow-xl border border-gray-700 flex flex-col gap-4 text-sm"
          style={{ zIndex: 1000 }}
        >
          <p className="font-bold border-b border-gray-700 pb-1 text-green-500 uppercase tracking-wide text-xs">
            Map Controls
          </p>

          {/* tileLayer boolean */}
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-green-500"
              checked={isSatellite}
              onChange={(e) => setIsSatellite(e.target.checked)}
            />
            Satellite Mode
          </label>

          {/* allows users to enter drawing mode */}
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-green-500"
              checked={isDrawingMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsDrawingMode(checked);
                if (checked) {
                  setIsDeleteMode(false);
                  setIsUpdateMode(false);
                } else {
                  setCurrentShapePoints([]);
                }
              }}
            />
            Drawing Mode
          </label>

          {/* allows users to enter delete mode */}
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-green-500"
              checked={isDeleteMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsDeleteMode(checked);
                if (checked) {
                  setIsDrawingMode(false);
                  setIsUpdateMode(false);
                  setCurrentShapePoints([]);
                }
              }}
            />
            Delete Mode
          </label>

          {/* allows users to enter update mode */}
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-green-500"
              checked={isUpdateMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsUpdateMode(checked);
                if (checked) {
                  setIsDrawingMode(false);
                  setIsDeleteMode(false);
                  setCurrentShapePoints([]);
                }
              }}
            />
            Update Mode
          </label>

          {isDrawingMode && (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
              <span className="text-xs text-gray-400">
                Points collected: {currentShapePoints.length}
              </span>
              {/* changes controls while user is in drawing mode */}
              <button
                onClick={handleCreateShape}
                disabled={currentShapePoints.length < 3}
                className={`text-xs py-1.5 px-3 rounded text-white font-semibold ${
                  currentShapePoints.length < 3
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                Save Shape
              </button>
              <button
                onClick={handleCreateLine}
                disabled={currentShapePoints.length < 2}
                className={`text-xs py-1.5 px-3 rounded text-white font-semibold ${
                  currentShapePoints.length < 2
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                Save Line
              </button>
            </div>
          )}
        </div>

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

// perhaps could put a paginated list of shapes, lines, markers
// where they could be sorted, and clicked to focus on them
