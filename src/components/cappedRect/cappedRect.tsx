import { useContext, type Dispatch, type SetStateAction } from "react";
import { Circle, Rect } from "react-konva";
import { ObjectsContext } from "~/contexts/objectsContexts";
import useSnap from "~/hooks/useSnap";
import type { KonvaDrag, KonvaMouse } from "~/types/konvaEvents.types";
import type { ObjectsType, RectType } from "~/types/shapes.types";

const CappedRect = ({ rect }: { rect: RectType }) => {
  const [_, setObjects] = useContext(ObjectsContext);
  const snap = useSnap();

  const handleDragMove = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    const { snapX, snapY } = snap({ x, y });

    draggingCircle.position({ x: snapX, y: snapY });

    if (e.target.name() === "capStart") {
      rect.points[0] = snapX;
      rect.points[1] = snapY;
    } else if (e.target.name() === "capEnd") {
      rect.points[2] = snapX;
      rect.points[3] = snapY;
    }

    setObjects((prevObjects) =>
      prevObjects.map((prevObject) =>
        prevObject.id === rect.id
          ? { ...rect, points: rect.points }
          : prevObject,
      ),
    );

    // setRects((prevLines) =>
    //   prevLines.map((prevLine) =>
    //     prevLine.id === rect.id
    //       ? { ...prevLine, points: rect.points }
    //       : prevLine,
    //   ),
    // );
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
