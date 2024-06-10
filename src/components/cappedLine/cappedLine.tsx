import { useContext, type Dispatch, type SetStateAction } from "react";
import { Circle, Line } from "react-konva";
import { ObjectsContext } from "~/contexts/objectsContexts";
import useSnap from "~/hooks/useSnap";
import type { KonvaDrag, KonvaMouse } from "~/types/konvaEvents.types";
import type { LineType, ObjectsType } from "~/types/shapes.types";

const CappedLine = ({ line }: { line: LineType }) => {
  const [_, setObjects] = useContext(ObjectsContext);
  const snap = useSnap();
  const handleDragMove = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    const { snapX, snapY } = snap({ x, y });

    draggingCircle.position({ x: snapX, y: snapY });

    if (e.target.name() === "capStart") {
      line.points[0] = snapX;
      line.points[1] = snapY;
    } else if (e.target.name() === "capEnd") {
      line.points[2] = snapX;
      line.points[3] = snapY;
    }
    setObjects((prevObjects) =>
      prevObjects.map((prevObject) =>
        prevObject.id === line.id && prevObject.itemType === "line"
          ? { ...prevObject, points: line.points }
          : prevObject,
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
