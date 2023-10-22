import { useState } from "react";
import { Stage, Layer } from "react-konva";
import GridLayer from "./gridlayer";
import throttle from "~/utils/throttle";
import { KonvaMouse } from "~/types/konvaEvents.types";
import { LineType } from "~/types/shapes.types";
import { GRID_ON, GRID_SIZE, THROTTLE_DELAY } from "~/constants";
import CappedLine from "./cappedLine/cappedLine";

const initLines: LineType[] = [
  { id: "a", points: [100, 100, 200, 200], active: false },
  { id: "b", points: [50, 50, 150, 150], active: false },
  { id: "c", points: [33, 55, 70, 90], active: false },
  { id: "d", points: [54, 90, 100, 30], active: false },
];

const DrawingCanvas = () => {
  const [lines, setLines] = useState<LineType[]>(initLines);
  const [isLineStart, setIsLineStart] = useState(false);
  const [activeLine, setActiveLine] = useState<LineType>({
    id: "default",
    points: [100, 100, 200, 200],
    active: true,
  });

  const handleClick = (e: KonvaMouse) => {
    const stage = e.target.getStage()
    const clickLocation = stage!.getRelativePointerPosition();

    if (!isLineStart) {
      setIsLineStart(!isLineStart);
      setActiveLine({
        id: "active" + lines.length,
        points: [
          clickLocation!.x,
          clickLocation!.y,
          clickLocation!.x,
          clickLocation!.y,
        ],
        active: true,
      });
    }
    if (isLineStart) {
      setIsLineStart(!isLineStart);
      setLines((lines) => [...lines, activeLine]);
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

  return (
    <Stage
      width={800}
      height={600}
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
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
