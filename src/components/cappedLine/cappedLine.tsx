import { useContext, useState } from "react";
import { Circle, Line } from "react-konva";
import { set } from "zod";
import { ObjectsContext } from "~/contexts/objectsContexts";
import { EventActions } from "~/hooks/useHistState";
import useSnap from "~/hooks/useSnap";
import type { KonvaDrag, KonvaMouse } from "~/types/konvaEvents.types";
import type { LineType, coordinate } from "~/types/shapes.types";

const CappedLine = ({ line }: { line: LineType }) => {
  const [tempPoint, setTempPoint] = useState<coordinate | null>(null);
  const [tempLine, setTempLine] = useState<LineType | null>(null);
  const { call } = useContext(ObjectsContext);
  const snap = useSnap();

  const handleDragMove = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    const { snapX, snapY } = snap({ x, y });
    setTempPoint({ x: snapX, y: snapY });

    draggingCircle.position({ x: snapX, y: snapY });

    if (e.target.name() === "capStart") {
      setTempLine({
        id: "",
        points: [
          snapX,
          snapY,
          line.points[2] ?? snapX,
          line.points[3] ?? snapY,
        ],
        active: false,
        itemType: "line",
      });
    } else if (e.target.name() === "capEnd") {
      setTempLine({
        id: "",
        points: [
          line.points[0] ?? snapX,
          line.points[1] ?? snapY,
          snapX,
          snapY,
        ],
        active: false,
        itemType: "line",
      });
    }
  };

  const handleMouseEnter = (e: KonvaMouse) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "crosshair";
  };

  const handleMouseLeave = (e: KonvaMouse) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "default";
  };

  const handleDradEnd = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    const { snapX, snapY } = snap({ x, y });

    if (e.target.name() === "capStart") {
      line.points[0] = snapX;
      line.points[1] = snapY;
    } else if (e.target.name() === "capEnd") {
      line.points[2] = snapX;
      line.points[3] = snapY;
    }

    call({
      action: EventActions.EDIT,
      payload: { ...line, points: line.points },
    });

    setTempPoint(null);
    setTempLine(null);
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
        onDragEnd={handleDradEnd}
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
        onDragEnd={handleDradEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hitStrokeWidth={10}
      />

      {tempPoint && (
        <Circle
          x={tempPoint.x}
          y={tempPoint.y}
          radius={6}
          fill={"red"}
          name="tempPoint"
        />
      )}
      {tempLine && (
        <Line points={tempLine.points} stroke={"red"} strokeWidth={2} opacity={0.5} />
      )}
    </>
  );
};

export default CappedLine;
