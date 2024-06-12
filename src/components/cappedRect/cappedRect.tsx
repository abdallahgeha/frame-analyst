import { useContext, useState } from "react";
import { Circle, Rect } from "react-konva";
import { ObjectsContext } from "~/contexts/objectsContexts";
import { EventActions } from "~/hooks/useHistState";
import useSnap from "~/hooks/useSnap";
import type { KonvaDrag, KonvaMouse } from "~/types/konvaEvents.types";
import type { RectType, coordinate } from "~/types/shapes.types";

const CappedRect = ({ rect }: { rect: RectType }) => {
  const [tempPoint, setTempPoint] = useState<coordinate | null>(null);
  const [tempRect, setTempRect] = useState<RectType | null>(null);
  const { call } = useContext(ObjectsContext);
  const snap = useSnap();

  const handleDragMove = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    const { snapX, snapY } = snap({ x, y });

    draggingCircle.position({ x: snapX, y: snapY });

    if (e.target.name() === "capStart") {
      setTempRect({
        id: "tempRect",
        points: [snapX, snapY, rect.points[2], rect.points[3]],
        active: false,
        itemType: "rect",
      });
    } else if (e.target.name() === "capEnd") {
      setTempRect({
        id: "tempRect",
        points: [rect.points[0], rect.points[1], snapX, snapY],
        active: false,
        itemType: "rect",
      });
    } else if (e.target.name() === "capOtherStart") {
      setTempRect({
        id: "tempRect",
        points: [snapX, rect.points[1], rect.points[2], snapY],
        active: false,
        itemType: "rect",
      });
    } else if (e.target.name() === "capOtherEnd") {
      setTempRect({
        id: "tempRect",
        points: [rect.points[0], snapY, snapX, rect.points[3]],
        active: false,
        itemType: "rect",
      });
    } else if (e.target.name() === "rectEdge") {
      const diffX = snapX - rect.points[0];
      const diffY = snapY - rect.points[1];
      setTempRect({
        id: "tempRect",
        points: [snapX, snapY, rect.points[2] + diffX, rect.points[3] + diffY],
        active: false,
        itemType: "rect",
      });
    }
  };

  const handleDragEnd = (e: KonvaDrag) => {
    const draggingCircle = e.target;
    const x = draggingCircle.x();
    const y = draggingCircle.y();

    const { snapX, snapY } = snap({ x, y });

    const draggedRect: RectType = { ...rect, points: [...rect.points] };

    if (e.target.name() === "capStart") {
      draggedRect.points[0] = snapX;
      draggedRect.points[1] = snapY;
    } else if (e.target.name() === "capEnd") {
      draggedRect.points[2] = snapX;
      draggedRect.points[3] = snapY;
    } else if (e.target.name() === "capOtherStart") {
      draggedRect.points[0] = snapX;
      draggedRect.points[3] = snapY;
    } else if (e.target.name() === "capOtherEnd") {
      draggedRect.points[2] = snapX;
      draggedRect.points[1] = snapY;
    } else if (e.target.name() === "rectEdge") {
      const diffX = snapX - rect.points[0];
      const diffY = snapY - rect.points[1];
      draggedRect.points[0] = snapX;
      draggedRect.points[1] = snapY;
      draggedRect.points[2] = rect.points[2] + diffX;
      draggedRect.points[3] = rect.points[3] + diffY;
    }

    call({
      action: EventActions.EDIT,
      payload: draggedRect,
    });

    setTempPoint(null);
    setTempRect(null);
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
        opacity={0.2}
      />
      <Rect
        x={rect.points[0]}
        y={rect.points[1]}
        width={rect.points[2] - rect.points[0]}
        height={rect.points[3] - rect.points[1]}
        draggable
        name="rectEdge"
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
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
        onDragEnd={handleDragEnd}
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
        onDragEnd={handleDragEnd}
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
        onDragEnd={handleDragEnd}
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
        onDragEnd={handleDragEnd}
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
      {tempRect && (
        <Rect
          x={tempRect.points[0]}
          y={tempRect.points[1]}
          width={tempRect.points[2] - tempRect.points[0]}
          height={tempRect.points[3] - tempRect.points[1]}
          name="tempRect"
          stroke={"red"}
          opacity={0.5}
        />
      )}
    </>
  );
};

export default CappedRect;
