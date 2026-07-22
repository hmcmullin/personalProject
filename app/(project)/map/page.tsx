"use client";
import Map from "@/components/map/Map";
import { useMapData } from "@/hooks/mapActions";
import { useHotkey } from "@/hooks/hotKeys";

export default function MyPage() {
  // #region |  calls mapActions hook to get all the state and handlers
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
  // #endregion

  // #region | hotkeys

  useHotkey({ key: "w" }, () => {
    setIsSatellite((prev) => !prev);
  });

  useHotkey({ key: "a" }, () => {
    setIsDrawingMode((prev) => {
      if (!prev) {
        setIsDeleteMode(false);
        setIsUpdateMode(false);
      } else {
        setCurrentShapePoints([]);
      }
      return !prev;
    });
  });

  useHotkey({ key: "s" }, () => {
    setIsDeleteMode((prev) => {
      if (!prev) {
        setIsDrawingMode(false);
        setIsUpdateMode(false);
        setCurrentShapePoints([]);
      }
      return !prev;
    });
  });

  useHotkey({ key: "d" }, () => {
    setIsUpdateMode((prev) => {
      if (!prev) {
        setIsDrawingMode(false);
        setIsDeleteMode(false);
        setCurrentShapePoints([]);
      }
      return !prev;
    });
  });

  useHotkey({ key: "q" }, () => {
    if (isDrawingMode && currentShapePoints.length >= 3) {
      handleCreateShape();
    }
  });

  useHotkey({ key: "e" }, () => {
    if (isDrawingMode && currentShapePoints.length >= 2) {
      handleCreateLine();
    }
  });

  // #endregion

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-green-950 font-sans text-white min-h-screen">
      <h1 className="flex justify-center m-2 pt-20 font-bold text-4xl">
        Welcome to Your Map!
      </h1>

      <nav className="flex justify-center m-2 w-full">
        <a
          href="/account"
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
          <p className="font-bold border-b border-gray-700 pb-1 text-green-500 uppercase tracking-wide text-xs text-center">
            Map Controls
          </p>

          {/* tileLayer boolean */}
          <label className="flex items-center justify-between cursor-pointer select-none py-1 gap-4">
            <span className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 w-4 h-4 accent-green-500"
                checked={isSatellite}
                onChange={(e) => setIsSatellite(e.target.checked)}
              />
              Satellite Mode
            </span>
            <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-xs border border-gray-700 shadow-sm font-bold">
              W
            </kbd>
          </label>

          {/* allows users to enter drawing mode */}
          <label className="flex items-center justify-between cursor-pointer select-none py-1 gap-4">
            <span className="flex items-center">
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
            </span>
            <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-xs border border-gray-700 shadow-sm font-bold">
              A
            </kbd>
          </label>

          {/* allows users to enter delete mode */}
          <label className="flex items-center justify-between cursor-pointer select-none py-1 gap-4">
            <span className="flex items-center">
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
            </span>
            <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-xs border border-gray-700 shadow-sm font-bold">
              S
            </kbd>
          </label>

          {/* allows users to enter update mode */}
          <label className="flex items-center justify-between cursor-pointer select-none py-1 gap-4">
            <span className="flex items-center">
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
            </span>
            <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-xs border border-gray-700 shadow-sm font-bold">
              D
            </kbd>
          </label>

          {isDrawingMode && (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
              <span className="text-xs text-gray-400 text-center">
                Points collected: {currentShapePoints.length}
              </span>
              {/* changes controls while user is in drawing mode */}
              <button
                onClick={handleCreateShape}
                disabled={currentShapePoints.length < 3}
                className={`flex justify-between items-center text-xs py-1.5 px-3 rounded text-white font-semibold ${
                  currentShapePoints.length < 3
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-amber-700/80 hover:bg-amber-600 text-amber-50"
                }`}
              >
                <span>Save Shape</span>
                <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-xs border border-gray-700 shadow-sm font-bold">
                  Q
                </kbd>
              </button>
              <button
                onClick={handleCreateLine}
                disabled={currentShapePoints.length < 2}
                className={`flex justify-between items-center text-xs py-1.5 px-3 rounded text-white font-semibold ${
                  currentShapePoints.length < 2
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-amber-700/80 hover:bg-amber-600 text-amber-50"
                }`}
              >
                <span>Save Line</span>
                <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-xs border border-gray-700 shadow-sm font-bold">
                  E
                </kbd>
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

// TODO
// create a small popup form for taking in data, and provide a better ui for popups
// style and add function to settings inputs

// perhaps could put a paginated list of shapes, lines, markers
// where they could be sorted, and clicked to focus on them
// allow users to manipulate map function height, width, zoom, center point
// also design a better method for cancelling draw mode/hotkeys
// also perhaps allow a user to type coordinates instead of clicking on the map
// and maybe change the size of a dot depending on the zoom level

/*

-- 1. Core Authentication Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) DEFAULT 'User',
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    recovery_code VARCHAR(255) NOT NULL,
    session_token VARCHAR(255),
    session_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. App Settings Table (Linked via Foreign Key)
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    map_height INT DEFAULT 800,
    map_width INT DEFAULT 800,
    map_zoom INT DEFAULT 13,
    map_center_lat DOUBLE PRECISION DEFAULT 40.759658,
    map_center_lng DOUBLE PRECISION DEFAULT -98.915037
);

-- Lookups for fast queries
CREATE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
*/
