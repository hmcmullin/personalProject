// #region | imports
import { useState, useEffect } from "react";
import * as db from "@/app/lib/actions";
import * as Types from "@/app/lib/data";
import { getSessionUser } from "@/auth";
// #endregion

export function useMapData() {
  // #region | state variables
  const [userId, setUserId] = useState<string>("Temporary User");
  const [isSatellite, setIsSatellite] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [markers, setMarkers] = useState<Types.MarkerData[]>([]);
  const [shapes, setShapes] = useState<Types.ShapeData[]>([]);
  const [lines, setLines] = useState<Types.LineData[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentShapePoints, setCurrentShapePoints] = useState<
    [number, number][]
  >([]);
  // #endregion

  // #region | useEffect to load map data from database on component mount
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const user = await getSessionUser();
        if (!user?.id) return;

        const currentId = String(user.id);
        setUserId(currentId);

        const [fetchedMarkers, fetchedShapes, fetchedLines] = await Promise.all(
          [
            db.retrieveMarkersFromDB(currentId),
            db.retrieveShapesFromDB(currentId),
            db.retrieveLinesFromDB(currentId),
          ],
        );

        if (fetchedMarkers) setMarkers(fetchedMarkers);
        if (fetchedShapes) setShapes(fetchedShapes);
        if (fetchedLines) setLines(fetchedLines);
      } catch (error) {
        console.error("Failed to load map objects from database:", error);
      }
    };

    loadMapData();
  }, []);
  // #endregion

  // #region |  function that handles asset click events
  const handleAssetClick = async (
    itemId: string,
    type: "marker" | "shape" | "line",
  ) => {
    if (isDeleteMode) {
      await handleDeleteItem(itemId, type);
    } else if (isUpdateMode) {
      const allItems = [...markers, ...shapes, ...lines];
      const targetItem = allItems.find((item) => item.id === itemId);

      if (targetItem) {
        const updatedTitle = prompt("Enter a new title:", targetItem.title);
        if (updatedTitle === null) return;

        let updatedColor = targetItem.color;
        const colorInput = prompt(
          "Enter a new color (e.g. 'red', '#ff0000'):",
          targetItem.color || "",
        );
        if (colorInput !== null) {
          updatedColor = colorInput || targetItem.color;
        }

        let updatedActivity = "";
        if (targetItem.objType === "marker") {
          const activityInput = prompt(
            "Enter a new activity:",
            (targetItem as Types.MarkerData).activity,
          );
          if (activityInput !== null) {
            updatedActivity =
              activityInput || (targetItem as Types.MarkerData).activity;
          }
        }

        let updatedNotes = "";
        if (targetItem.objType === "line" || targetItem.objType === "shape") {
          const notesInput = prompt(
            "Enter new notes:",
            (targetItem as Types.LineData | Types.ShapeData).notes || "",
          );
          if (notesInput !== null) {
            updatedNotes =
              notesInput ||
              (targetItem as Types.LineData | Types.ShapeData).notes ||
              "";
          }
        }

        const updatedItem = {
          ...targetItem,
          title: updatedTitle || targetItem.title,
          color: updatedColor,
          ...(targetItem.objType === "marker" && { activity: updatedActivity }),
          ...((targetItem.objType === "line" ||
            targetItem.objType === "shape") && { notes: updatedNotes }),
        };

        await handleUpdateItem(updatedItem as any);
      }
    }
  };
  // #endregion

  // #region | function that handles line creation
  const handleCreateLine = async () => {
    if (currentShapePoints.length < 2) return;

    const lineTitle: string | null = prompt("Enter a name for this line:");
    if (lineTitle === null) {
      alert("You have entered an invalid name or canceled!");
      return;
    }
    if (!lineTitle) return;

    const lineColor: string | null =
      prompt("Enter color (e.g. 'red', '#ff0000'):") || "blue";

    const notes: string | null =
      prompt("Enter any notes or comments for this line:") || "";

    // convert to GeoJSON's format (reverse order)
    const geoJsonCoordinates = currentShapePoints.map(([lat, lng]) => [
      lng,
      lat,
    ]);

    const customGeoJson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: geoJsonCoordinates,
      },
    };

    // line information structure
    const newLine: Types.LineData = {
      id: crypto.randomUUID(),
      userId: userId,
      objType: "line",
      title: lineTitle,
      notes: notes,
      lat: currentShapePoints[0][0],
      lng: currentShapePoints[0][1],
      dateCreated: new Date(),
      color: lineColor,
      geoJson: JSON.stringify(customGeoJson),
    };

    // update ui and push line to db

    // current list of lines => copies list => adds new line to list
    setLines((prev) => [...prev, newLine]);
    setIsDrawingMode(false);
    setCurrentShapePoints([]);

    try {
      await db.saveLineToDatabase(newLine);
    } catch (error) {
      console.error("Failed to save custom line to DB:", error);
    }
  };

  // #endregion

  // #region | function that handles update
  const handleUpdateItem = async (
    item: Types.MarkerData | Types.ShapeData | Types.LineData,
  ) => {
    if (!isUpdateMode) return;

    try {
      if (item.objType === "marker") {
        await db.updateMarkerInDB(item);
        // current list of markers => for loops through markers =>
        // if id matches updated item, else keep the same
        setMarkers((prev) => prev.map((m) => (m.id === item.id ? item : m)));
      } else if (item.objType === "shape") {
        await db.updateShapeInDB(item);
        setShapes((prev) => prev.map((s) => (s.id === item.id ? item : s)));
      } else if (item.objType === "line") {
        await db.updateLineInDB(item);
        setLines((prev) => prev.map((l) => (l.id === item.id ? item : l)));
      }
      alert(`The ${item.objType} has been successfully updated.`);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };
  // #endregion

  // #region | function that handles deletion
  const handleDeleteItem = async (
    itemId: string,
    type: "marker" | "shape" | "line",
  ) => {
    if (!isDeleteMode) return;

    try {
      if (type === "marker") {
        await db.removeMarkerFromDB(itemId, userId);
        // current list of markers => for loops through markers =>
        // if id matches deletes item, else ignores
        setMarkers((prev) => prev.filter((item) => item.id !== itemId));
      } else if (type === "shape") {
        await db.removeShapeFromDB(itemId, userId);
        setShapes((prev) => prev.filter((item) => item.id !== itemId));
      } else if (type === "line") {
        await db.removeLineFromDB(itemId, userId);
        setLines((prev) => prev.filter((item) => item.id !== itemId));
      }
      alert(`The ${type} has been successfully deleted.`);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };
  // #endregion

  // #region | function that handles shape creation
  const handleCreateShape = async () => {
    if (currentShapePoints.length < 3) return;

    const shapeTitle: string | null = prompt(
      "Enter a name for this region/state:",
    );
    if (shapeTitle === null) {
      alert("You have entered an invalid name or canceled!");
      return;
    }
    if (!shapeTitle) return;

    const shapeColor: string | null =
      prompt("Enter color (e.g. 'red', '#ff0000'):") || "blue";

    const notes: string | null =
      prompt("Enter any notes or comments for this region:") || "";

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
    const newShape: Types.ShapeData = {
      id: crypto.randomUUID(),
      userId: userId,
      objType: "shape",
      title: shapeTitle,
      notes: notes,
      lat: currentShapePoints[0][0],
      lng: currentShapePoints[0][1],
      dateCreated: new Date(),
      color: shapeColor,
      geoJson: JSON.stringify(customGeoJson),
    };

    // update ui and push shape to db

    // current list of shapes => copies list => adds new shape to list
    setShapes((prev) => [...prev, newShape]);
    setIsDrawingMode(false);
    setCurrentShapePoints([]);

    try {
      await db.saveShapeToDatabase(newShape);
    } catch (error) {
      console.error("Failed to save custom shape to DB:", error);
    }
  };
  // #endregion

  // #region |  gathers coordinates on map click
  const handleMapClick = async (lat: number, lng: number) => {
    // creates array of coordinates for shapes
    if (isDeleteMode) {
      return;
    }

    if (isDrawingMode) {
      // current list of points => copies list => adds new point(coordinates) to list
      setCurrentShapePoints((prev) => [...prev, [lat, lng]]);
      return;
    }

    const markerTitle: string | null = prompt("Enter location title:");
    if (markerTitle === null) {
      alert("You have entered an invalid name or canceled!");
      return;
    }

    const markerActivity: string | null = prompt("Enter activity:");
    if (markerActivity === null) {
      alert("You have entered an invalid activity or canceled!");
      return;
    }

    const markerColor: string | null =
      prompt("Enter marker color (e.g., 'red', '#ff0000'):") || "blue";

    // marker info structure
    const newMarker: Types.MarkerData = {
      id: crypto.randomUUID(),
      userId: userId,
      objType: "marker",
      lat: lat,
      lng: lng,
      title: markerTitle || "Untitled",
      activity: markerActivity || "General",
      color: markerColor,
      dateCreated: new Date().toISOString(),
    };

    // update ui and push marker to db
    // current list of markers => copies list => adds new marker to list
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    try {
      await db.saveMarkerToDatabase(newMarker);
    } catch (error) {
      console.error("Failed to save marker:", error);
    }
  };

  // #endregion

  // #region | return variables and functions to be used in the component
  return {
    isSatellite,
    setIsSatellite,
    isDeleteMode,
    setIsDeleteMode,
    isUpdateMode,
    setIsUpdateMode,
    markers,
    setMarkers,
    shapes,
    setShapes,
    lines,
    setLines,
    isDrawingMode,
    setIsDrawingMode,
    currentShapePoints,
    setCurrentShapePoints,
    handleCreateLine,
    handleUpdateItem,
    handleDeleteItem,
    handleCreateShape,
    handleMapClick,
    handleAssetClick,
  };
  // #endregion
}
