import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import GridLayer from "./gridlayer";
import throttle from "~/utils/throttle";
import { KonvaMouse } from "~/types/konvaEvents.types";
import { LineType, coordinate } from "~/types/shapes.types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRID_ON,
  GRID_SIZE,
  THROTTLE_DELAY,
  CAP_SNAP,
  CAP_SNAP_THRESHOLD,
  GRID_SNAP,
  GRID_SNAP_THRESHOLD,
} from "~/constants";
import CappedLine from "./cappedLine/cappedLine";
import snapToGrid from "~/utils/snapToGrid";
import snapToCap from "~/utils/snapToCap";

const snap = (position: coordinate, lines: LineType[]) => {
  let snapX = position.x;
  let snapY = position.y;

  if (GRID_SNAP) {
    const { gripSnapX, gridSnapY } = snapToGrid(
      position.x,
      position.y,
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
      { id: "", points: [], active: false },
      snapX,
      snapY,
      CAP_SNAP_THRESHOLD,
    );
    snapX = CAP_SNAP ? capSnapX : snapX;
    snapY = CAP_SNAP ? capSnapY : snapY;
  }

  return { snapX, snapY };
};
const DrawingCanvas = ({
  type,
  setLines,
  lines,
}: {
  type: string;
  setLines: Dispatch<SetStateAction<LineType[]>>;
  lines: LineType[];
}) => {
  const [activePointStart, setActivePointStart] = useState<coordinate | null>(
    null,
  );
  const [activePointEnd, setActivePointEnd] = useState<coordinate | null>(null);

  const selectLines = (start: coordinate, end: coordinate) => {
    const selected = lines.map((line) => {
      const [x1, y1, x2, y2] = line.points;
      const xMin = Math.min(start.x, end.x);
      const xMax = Math.max(start.x, end.x);
      const yMin = Math.min(start.y, end.y);
      const yMax = Math.max(start.y, end.y);

      if (
        (x1! >= xMin && x1! <= xMax && y1! >= yMin && y1! <= yMax) ||
        (x2! >= xMin && x2! <= xMax && y2! >= yMin && y2! <= yMax)
      ) {
        return { ...line, active: true };
      } else {
        return { ...line, active: false };
      }
    });

    setLines(selected);
  };

  const handleClick = (e: KonvaMouse) => {
    const stage = e.target.getStage();
    let clickLocation = stage!.getRelativePointerPosition()!;

    const { snapX, snapY } = snap(clickLocation, lines);
    clickLocation = { x: snapX, y: snapY };
    
    if (!activePointStart) {
      setActivePointStart(clickLocation);
    } else {
      if (type === "line") {
        const inactiveLine = {
          id: `${lines.length}`,
          points: [
            activePointStart!.x,
            activePointStart!.y,
            activePointEnd!.x,
            activePointEnd!.y,
          ],
          active: false,
        };
        setLines((lines) => [...lines, inactiveLine]);
        setActivePointStart(null);
        setActivePointEnd(null);
      }
      if (type === "continuous line") {
        const inactiveLine = {
          id: `${lines.length}`,
          points: [
            activePointStart!.x,
            activePointStart!.y,
            activePointEnd!.x,
            activePointEnd!.y,
          ],
          active: false,
        };
        setLines((lines) => [...lines, inactiveLine]);
        setActivePointStart(clickLocation);
        setActivePointEnd(clickLocation);
      }

      if (type === "view") {
        if (activePointStart && activePointEnd) {
          selectLines(activePointStart, activePointEnd);
        }

        setActivePointStart(null);
        setActivePointEnd(null);
      }
    }
  };

  const handleMouseOver = (e: KonvaMouse) => {
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    if (!!position && !!stage && activePointStart) {
      const { snapX, snapY } = snap(position, lines);
      setActivePointEnd({ x: snapX, y: snapY });
    }
  };

  const getActiveLine = () => {
    if (activePointStart && activePointEnd) {
      const newPoints = [
        activePointStart.x,
        activePointStart.y,
        activePointEnd.x,
        activePointEnd.y,
      ];
      return { id: "active" + lines.length, points: newPoints, active: true };
    }

    return { id: "active" + lines.length, points: [], active: true };
  };

  const handleMouseOverThrottled = throttle(handleMouseOver, THROTTLE_DELAY);

  useEffect(() => {
    if (type) {
      selectLines({ x: 0, y: 0 }, { x: 0, y: 0 });
      setActivePointStart(null);
      setActivePointEnd(null);
    }
  }, [type]);

  return (
    <Stage
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleClick}
      onPointerMove={handleMouseOverThrottled}
    >
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
        {!!activePointStart &&
          (type === "line" || type === "continuous line") && (
            <CappedLine
              key={"active" + lines.length}
              line={getActiveLine()}
              setLines={setLines}
              lines={lines}
            />
          )}
        {type === "view" && activePointStart && activePointEnd && (
          <Rect
            x={activePointStart.x}
            y={activePointStart.y}
            width={activePointEnd.x - activePointStart.x}
            height={activePointEnd.y - activePointStart.y}
            fill="lightgreen"
            strokeWidth={3}
            opacity={0.5}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
