import type { DrawType, LineType, coordinate } from "~/types/shapes.types";
import CappedLine from "../cappedLine/cappedLine";

const DrawLine = ({
  type,
  activePointStart,
  activePointEnd,
}: {
  type: DrawType;
  activePointStart: coordinate | null;
  activePointEnd: coordinate | null;
}) => {
  if (type !== "line" && type !== "polyline") return null;
  if (!activePointStart) return null;

  const getActiveLine = (): LineType => {
    if (activePointStart && activePointEnd) {
      const newPoints = [
        activePointStart.x,
        activePointStart.y,
        activePointEnd.x,
        activePointEnd.y,
      ];
      return {
        id: crypto.randomUUID(),
        points: newPoints,
        active: true,
        itemType: "line",
      };
    }

    return {
      id: crypto.randomUUID(),
      points: [],
      active: true,
      itemType: "line",
    };
  };

  return <CappedLine line={getActiveLine()} />;
};

export default DrawLine;
