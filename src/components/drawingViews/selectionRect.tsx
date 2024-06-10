import { Rect } from "react-konva";
import type { coordinate } from "~/types/shapes.types";

const SelectionRect = ({
  type,
  activePointStart,
  activePointEnd,
}: {
  type: string;
  activePointStart: coordinate | null;
  activePointEnd: coordinate | null;
}) => {
  if (type !== "view") return null;
  if (!activePointStart || !activePointEnd) return null;

  return (
    <Rect
      x={activePointStart.x}
      y={activePointStart.y}
      width={activePointEnd.x - activePointStart.x}
      height={activePointEnd.y - activePointStart.y}
      fill="lightgreen"
      strokeWidth={3}
      opacity={0.5}
    />
  );
};

export default SelectionRect;
