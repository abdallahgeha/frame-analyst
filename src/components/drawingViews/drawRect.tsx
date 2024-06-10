import { Rect } from "react-konva";
import type { DrawType, coordinate } from "~/types/shapes.types";

const DrawRect = ({
  type,
  activePointStart,
  activePointEnd,
}: {
  type: DrawType;
  activePointStart: coordinate | null;
  activePointEnd: coordinate | null;
}) => {
  if (type !== "rect") return null;
  if (!activePointStart || !activePointEnd) return null;

  return (
    <Rect
      x={activePointStart.x}
      y={activePointStart.y}
      width={activePointEnd.x - activePointStart.x}
      height={activePointEnd.y - activePointStart.y}
      fill="gray"
      stroke="white"
      opacity={0.3}
      strokeWidth={2}
    />
  );
};

export default DrawRect;
