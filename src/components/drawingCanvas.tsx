import { useEffect, useState } from "react";
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
} from "~/constants";
import CappedLine from "./cappedLine/cappedLine";

const DrawingCanvas = ({ type }: { type: string }) => {
  const [lines, setLines] = useState<LineType[]>([]);
  const [isLineStart, setIsLineStart] = useState(false);
  const [activeLine, setActiveLine] = useState<LineType>({
    id: "default",
    points: [100, 100, 200, 200],
    active: true,
  });
  const [activePointStart, setActivePointStart] = useState<coordinate>({x: 0, y: 0})

  const handleClick = (e: KonvaMouse) => {
    const stage = e.target.getStage();
    const clickLocation = stage!.getRelativePointerPosition()!;

    if (type === "line") {
      if (!isLineStart) {
        setIsLineStart(true);
        setActivePointStart(clickLocation)
        setActiveLine({
          id: "active" + lines.length,
          points: [
            clickLocation.x,
            clickLocation.y,
            clickLocation.x,
            clickLocation.y,
          ],
          active: true,
        });
      }
      if (isLineStart) {
        setIsLineStart(false);
        const inactiveLine = { ...activeLine, active: false };
        setLines((lines) => [...lines, inactiveLine]);
      }
    } else if (type === "continuous line") {
      if (!isLineStart) {
        setIsLineStart(true);
        setActiveLine({
          id: "active" + lines.length,
          points: [
            clickLocation.x,
            clickLocation.y,
            clickLocation.x,
            clickLocation.y,
          ],
          active: true,
        });
      } else {
        const previousLine = { ...activeLine, active: false };
        const newLines = [...lines, previousLine];
        setLines(newLines);

        setActiveLine({
          id: "active" + newLines.length,
          points: [
            clickLocation!.x,
            clickLocation!.y,
            clickLocation!.x,
            clickLocation!.y,
          ],
          active: true,
        });
      }
    }
  };

  const handleMouseOver = (e: KonvaMouse) => {
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    if (!!position && !!stage) {
      setActiveLine((activeLine) => {
        const newPoints = [...activeLine.points];
        if (!!location && position.x > 10) {
          newPoints[2] = position.x;
        }
        if (!!location && position.y > 10) {
          newPoints[3] = position.y;
        }
        return { ...activeLine, points: newPoints };
      });
    }
  };

  const handleMouseOverThrottled = throttle(handleMouseOver, THROTTLE_DELAY);

  useEffect(() => {
    if (type) setIsLineStart(false);
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
        {isLineStart && (
          <CappedLine
            key={"active" + lines.length}
            line={activeLine}
            setLines={setLines}
            lines={lines}
          />
        )}
        {/* {type === "view" && (
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
          />
        )} */}
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
