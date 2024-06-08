import { Dispatch, SetStateAction } from "react";
import { Circle, Line, Rect } from "react-konva";
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
import { LineType, RectType, pinWithId } from "~/types/shapes.types";
import snapToCap from "~/utils/snapToCap";
import snapToGrid from "~/utils/snapToGrid";
import snapToPin from "~/utils/snapToPin";

const CappedRect = ({
  rect,
  lines,
  pins,
  setRects,
}: {
  rect: RectType;
  lines: LineType[];
  pins: pinWithId[];
  setRects: Dispatch<SetStateAction<RectType[]>>;
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
        rect,
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
      rect.points[0] = snapX;
      rect.points[1] = snapY;
    } else if (e.target.name() === "capEnd") {
      rect.points[2] = snapX;
      rect.points[3] = snapY;
    }

    setRects((prevLines) =>
      prevLines.map((prevLine) =>
        prevLine.id === rect.id
          ? { ...prevLine, points: rect.points }
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
      <Rect
        x={rect.points[0]}
        y={rect.points[1]}
        width={rect.points[2] - rect.points[0]}
        height={rect.points[3] - rect.points[1]}
        fill={rect.active ? "lightblue" : "lightgray"}
        draggable
        opacity={0.2}
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
      <Rect
        x={rect.points[0]}
        y={rect.points[1]}
        width={rect.points[2] - rect.points[0]}
        height={rect.points[3] - rect.points[1]}
        draggable
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        stroke={"white"}
        hitStrokeWidth={10}
      />
      <Circle
        x={rect.points[0]}
        y={rect.points[1]}
        radius={4}
        fill={rect.active ? "lightblue" : "white"}
        draggable
        name="capStart"
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
      <Circle
        x={rect.points[2]}
        y={rect.points[3]}
        radius={4}
        fill={rect.active ? "lightblue" : "white"}
        draggable
        name="capEnd"
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
      <Circle
        x={rect.points[0]}
        y={rect.points[3]}
        radius={4}
        fill={rect.active ? "lightblue" : "white"}
        draggable
        name="capOtherStart"
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
      <Circle
        x={rect.points[2]}
        y={rect.points[1]}
        radius={4}
        fill={rect.active ? "lightblue" : "white"}
        draggable
        name="capOtherEnd"
        onDragMove={handleDragMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
    </>
  );
};

export default CappedRect;
