import { Dispatch, SetStateAction } from "react";
import { Circle, Line } from "react-konva";
import {
  CAP_SNAP,
  CAP_SNAP_THRESHOLD,
  GRID_SIZE,
  GRID_SNAP,
  GRID_SNAP_THRESHOLD,
  PIN_SNAP,
  PIN_SNAP_THRESHOLD,
} from "~/constants";
import { KonvaDrag, KonvaMouse } from "~/types/konvaEvents.types";
import { LineType, pinWithId } from "~/types/shapes.types";
import snapToCap from "~/utils/snapToCap";
import snapToGrid from "~/utils/snapToGrid";
import snapToPin from "~/utils/snapToPin";

const CappedLine = ({
  line,
  lines,
  pins,
  setLines,
}: {
  line: LineType;
  lines: LineType[];
  pins: pinWithId[];
  setLines: Dispatch<SetStateAction<LineType[]>>;
}) => {
  const handleDragMove = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    let snapX = x;
    let snapY = y;

    if (GRID_SNAP) {
      const { gripSnapX, gridSnapY } = snapToGrid(
        x,
        y,
        snapX,
        snapY,
        GRID_SIZE,
        GRID_SNAP_THRESHOLD,
      );
      snapX = GRID_SNAP ? gripSnapX : snapX;
      snapY = GRID_SNAP ? gridSnapY : snapY;
    }

    if (CAP_SNAP) {
      const { capSnapX, capSnapY } = snapToCap(
        lines,
        line,
        snapX,
        snapY,
        CAP_SNAP_THRESHOLD,
      );
      snapX = CAP_SNAP ? capSnapX : snapX;
      snapY = CAP_SNAP ? capSnapY : snapY;
    }

    if (PIN_SNAP) {
      const { pinSnapX, pinSnapY } = snapToPin(
        pins,
        snapX,
        snapY,
        PIN_SNAP_THRESHOLD,
      );
      snapX = PIN_SNAP ? pinSnapX : snapX;
      snapY = PIN_SNAP ? pinSnapY : snapY;
    }

    draggingCircle.position({ x: snapX, y: snapY });

    if (e.target.name() === "capStart") {
      line.points[0] = snapX;
      line.points[1] = snapY;
    } else if (e.target.name() === "capEnd") {
      line.points[2] = snapX;
      line.points[3] = snapY;
    }

    setLines((prevLines) =>
      prevLines.map((prevLine) =>
        prevLine.id === line.id
          ? { ...prevLine, points: line.points }
          : prevLine,
      ),
    );
  };

  const handleMouseEnter = (e: KonvaMouse) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "crosshair";
  };

  const handleMouseLeave = (e: KonvaMouse) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "default";
  };

  return (
    <>
      <Line
        points={line.points}
        stroke={line.active ? "lightblue" : "lightgray"}
        strokeWidth={2}
      />
      <Circle
        x={line.points[0]}
        y={line.points[1]}
        radius={4}
        fill={line.active ? "lightblue" : "white"}
        draggable
        name="capStart"
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
      <Circle
        x={line.points[2]}
        y={line.points[3]}
        radius={4}
        fill={line.active ? "lightblue" : "white"}
        draggable
        name="capEnd"
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
    </>
  );
};

export default CappedLine;
