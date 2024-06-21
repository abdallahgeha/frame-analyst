import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Stage, Layer } from "react-konva";
import GridLayer from "./gridlayer";
import throttle from "~/utils/throttle";
import type {
  KonvaDrag,
  KonvaMouse,
  KovaWheel,
} from "~/types/konvaEvents.types";
import type {
  LineType,
  RectType,
  coordinate,
  pinWithId,
} from "~/types/shapes.types";
import { THROTTLE_DELAY } from "~/constants";
import CappedLine from "./cappedLine/cappedLine";
import CoordinateFns from "~/utils/toCoordnate";
import Pin from "./pin/pin";
import CappedRect from "./cappedRect/cappedRect";
import ActiveCoordinates from "./activeCoordinates/activeCoordinates";
import SelectionRect from "./drawingViews/selectionRect";
import DrawRect from "./drawingViews/drawRect";
import DrawLine from "./drawingViews/drawLine";
import { TypeContext } from "~/contexts/typeContext";
import { ObjectsContext } from "~/contexts/objectsContexts";
import useSnap from "~/hooks/useSnap";
import { SettingsContext } from "~/contexts/settingsContext";
import useCreateObjects from "~/hooks/useCreateObjects";
import { useWindowSize } from "~/hooks/useWindowSize";
import { ScaleContext } from "~/contexts/scaleContext";

const DrawingCanvas = ({
  setCurrentPosition,
}: {
  setCurrentPosition: Dispatch<SetStateAction<coordinate | undefined>>;
}) => {
  const snap = useSnap();
  const windowSize = useWindowSize();
  const [settings] = useContext(SettingsContext);
  const [type] = useContext(TypeContext);
  const [scale, setScale] = useContext(ScaleContext);
  const { state: objects } = useContext(ObjectsContext);
  const [isDrag, setIsDrag] = useState(false);
  const [activePointStart, setActivePointStart] = useState<coordinate | null>(
    null,
  );
  const [activePointEnd, setActivePointEnd] = useState<coordinate | null>(null);
  const { createLine, createPin, createRect, selectObjects } =
    useCreateObjects();

  const { toCoordinate } = new CoordinateFns(
    settings.gridSize,
    scale.x,
    scale.y,
    scale.scale,
  );

  const handleClick = (e: KonvaMouse) => {
    if (e.evt.button !== 0 || isDrag) return;
    const stage = e.target.getStage();
    let clickLocation = stage!.getRelativePointerPosition()!;

    const { snapX, snapY } = snap(clickLocation);
    clickLocation = { x: snapX, y: snapY };

    if (!activePointStart) {
      if (type == "pin") {
        createPin(clickLocation);
        return;
      }
      setActivePointStart(clickLocation);
    } else {
      if (type === "line") {
        createLine(activePointStart, activePointEnd);
        setActivePointStart(null);
        setActivePointEnd(null);
      }
      if (type === "polyline") {
        createLine(activePointStart, activePointEnd);
        setActivePointStart(clickLocation);
        setActivePointEnd(clickLocation);
      }

      if (type === "rect") {
        createRect(activePointStart, activePointEnd);
        setActivePointStart(null);
        setActivePointEnd(null);
      }

      if (type === "view") {
        if (activePointStart && activePointEnd) {
          selectObjects(activePointStart, activePointEnd);
        }

        setActivePointStart(null);
        setActivePointEnd(null);
      }
    }
  };

  const handleMouseOver = (e: KonvaMouse) => {
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    const container = e.target.getStage()!.container();
    container.style.cursor = "crosshair";

    if (!!position && !!stage) {
      let scaledPosition: coordinate = {
        x: position.x / scale.scale - scale.x / scale.scale,
        y: position.y / scale.scale - scale.y / scale.scale,
      };
      const { snapX, snapY } = snap(scaledPosition);
      setCurrentPosition(toCoordinate({ x: snapX, y: snapY }));

      if (activePointStart) {
        setActivePointEnd({ x: snapX, y: snapY });
      }
    }
  };

  const handleMouseOverThrottled = throttle(handleMouseOver, THROTTLE_DELAY);

  const handleWheel = (e: KovaWheel) => {
    // if (e.evt.button === 0) return;
    e.evt.preventDefault();
    const scaleBy = 1.06;

    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX();

    let newScale = oldScale;
    let newX = stage.x();
    let newY = stage.y();

    const mousePointTo = {
      x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale,
    };

    if (e.evt.ctrlKey || e.evt.metaKey) {
      newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newX =
        (stage.getPointerPosition()!.x / newScale - mousePointTo.x) * newScale;
      newY =
        (stage.getPointerPosition()!.y / newScale - mousePointTo.y) * newScale;
    } else {
      newX = stage.x() - e.evt.deltaX;
      newY = stage.y() - e.evt.deltaY;
    }

    setScale({
      scale: newScale,
      x: newX,
      y: newY,
    });
  };

  const handleThrottledWheel = throttle(handleWheel, 100);

  // const handleDragStart = (e: KonvaMouse) => {
  //   if (e.evt.button === 0) return;
  //   setIsDrag(true);
  //   const container = e.target.getStage()!.container();
  //   container.style.cursor = "grabbing";
  // };

  // const handleDrag = (e: KonvaDrag) => {
  //   const stage = e.target.getStage()!;
  //   const oldScale = stage.scaleX();

  //   const newX = stage.x() + e.evt.movementX / oldScale;
  //   const newY = stage.y() + e.evt.movementY / oldScale;

  //   setScale({
  //     scale: scale.scale,
  //     x: newX,
  //     y: newY,
  //   });
  // };

  // const handleDragThrottled = throttle(handleDrag, 500);

  // const handleDragEnd = (e: KonvaMouse) => {
  //   if (e.evt.button === 0) return;
  //   setIsDrag(false);
  //   const container = e.target.getStage()!.container();
  //   container.style.cursor = "default";
  // };

  useEffect(() => {
    if (type) {
      selectObjects({ x: 0, y: 0 }, { x: 0, y: 0 });
      setActivePointStart(null);
      setActivePointEnd(null);
    }
  }, [type]);

  const newLines = objects.filter(
    (obj) => obj.itemType === "line",
  ) as LineType[];
  const newPins = objects.filter(
    (obj) => obj.itemType === "pin",
  ) as pinWithId[];
  const newRects = objects.filter(
    (obj) => obj.itemType === "rect",
  ) as RectType[];

  if (!windowSize.width || !windowSize.height) return null;
  return (
    <Stage
      width={windowSize.width - 240}
      height={windowSize.height - 60}
      onClick={handleClick}
      onPointerMove={handleMouseOverThrottled}
      onWheel={handleThrottledWheel}
      // onDragStart={handleDragStart}
      // onDragEnd={handleDragEnd}
      // onDragMove={handleDragThrottled}
      scaleX={scale.scale}
      scaleY={scale.scale}
      // draggable={isDrag}
      x={scale.x}
      y={scale.y}
    >
      <GridLayer
        gridSize={settings.gridSize * scale.scale}
        isGridOn={settings.showGrid}
      />
      <Layer>
        {newLines.map((line) => (
          <CappedLine key={line.id} line={line} />
        ))}
        {newRects.map((rect) => (
          <CappedRect key={rect.id} rect={rect} />
        ))}
        {newPins.map((pin) => (
          <Pin pin={pin} key={pin.id} />
        ))}

        <DrawLine
          type={type}
          activePointStart={activePointStart}
          activePointEnd={activePointEnd}
        />
        <DrawRect
          type={type}
          activePointStart={activePointStart}
          activePointEnd={activePointEnd}
        />
        <SelectionRect
          type={type}
          activePointStart={activePointStart}
          activePointEnd={activePointEnd}
        />
        <ActiveCoordinates activePointEnd={activePointEnd} type={type} />
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
