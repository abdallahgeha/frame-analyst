import Konva from "konva";
import { Dispatch, SetStateAction, useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import GridLayer from "./gridlayer";

const CAP_SNAP = true;
const GRID_SNAP = true;
const GRID_ON = true;

const CAP_SNAP_THRESHOLD = 14;
const GRID_SNAP_THRESHOLD = 5;
const GRID_SIZE = 20;

const initLines = [
  { id: "a", points: [100, 100, 200, 200], active: false },
  { id: "b", points: [50, 50, 150, 150], active: false },
  { id: "c", points: [33, 55, 70, 90], active: false },
  { id: "d", points: [54, 90, 100, 30], active: false },
];

const DrawingCanvas = () => {
  const [lines, setLines] = useState(initLines);

  return (
    <Stage width={800} height={600}>
      <GridLayer gridSize={GRID_SIZE} isGridOn={GRID_ON} />
      <Layer>
        {lines.map((line) => (
          <CappedLine
            key={line.id}
            line={line}
            setLines={setLines}
            lines={lines}
          />
        ))}
      </Layer>
    </Stage>
  );
};

const CappedLine = ({
  line,
  lines,
  setLines,
}: {
  line: { id: string; points: number[]; active: boolean };
  lines: { id: string; points: number[]; active: boolean }[];
  setLines: Dispatch<
    SetStateAction<{ id: string; points: number[]; active: boolean }[]>
  >;
}) => {
  const handleDragStart = () => {
    // Perform actions when dragging starts
  };
  const handleDragEnd = () => {
    // Perform actions when dragging ends
  };
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    let snapX = x;
    let snapY = y;

    if (GRID_SNAP) {
      // Grid snapping
      snapX = Math.round(x / GRID_SIZE) * GRID_SIZE;
      snapY = Math.round(y / GRID_SIZE) * GRID_SIZE;

      const deltaX = x - snapX;
      const deltaY = y - snapY;
      if (
        Math.abs(deltaX) > GRID_SNAP_THRESHOLD &&
        Math.abs(deltaY) > GRID_SNAP_THRESHOLD
      ) {
        snapX = x; // No snapping if the deviation is less than the threshold
        snapY = y; // No snapping if the deviation is less than the threshold
      }
    }

    if (CAP_SNAP) {
      // Snap to other caps
      const otherCircles = lines
        .filter((l) => l.id !== line.id)
        .map((l) => {
          return {
            capStartX: l.points[0]!,
            capStartY: l.points[1]!,
            capEndX: l.points[2]!,
            capEndY: l.points[3]!,
          };
        });

      otherCircles.forEach((cap) => {
        const distanceToCapStart = Math.sqrt(
          (cap.capStartX - snapX) ** 2 + (cap.capStartY - snapY) ** 2,
        );
        const distanceToCapEnd = Math.sqrt(
          (cap.capEndX - snapX) ** 2 + (cap.capEndY - snapY) ** 2,
        );

        if (distanceToCapStart < CAP_SNAP_THRESHOLD) {
          snapX = cap.capStartX;
          snapY = cap.capStartY;
        } else if (distanceToCapEnd < CAP_SNAP_THRESHOLD) {
          snapX = cap.capEndX;
          snapY = cap.capEndY;
        }
      });
    }

    // Update the Circle's position based on snapping
    draggingCircle.position({ x: snapX, y: snapY });

    // Fill rest of logic here

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

  const handleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "pointer";
  };

  const handleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "default";
  };

  return (
    <>
      <Line points={line.points} stroke="black" strokeWidth={2} />
      <Circle
        x={line.points[0]}
        y={line.points[1]}
        radius={4}
        fill="white"
        draggable
        name="capStart"
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
      <Circle
        x={line.points[2]}
        y={line.points[3]}
        radius={4}
        fill="white"
        draggable
        name="capEnd"
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />
    </>
  );
};

export default DrawingCanvas;
