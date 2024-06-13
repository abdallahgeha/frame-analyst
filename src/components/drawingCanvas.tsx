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
import type { KonvaMouse } from "~/types/konvaEvents.types";
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

const DrawingCanvas = ({
  setCurrentPosition,
}: {
  setCurrentPosition: Dispatch<SetStateAction<coordinate | undefined>>;
}) => {
  const snap = useSnap();
  const windowSize = useWindowSize();
  const [settings] = useContext(SettingsContext);
  const [type] = useContext(TypeContext);
  const { state: objects } = useContext(ObjectsContext);
  const [activePointStart, setActivePointStart] = useState<coordinate | null>(
    null,
  );
  const [activePointEnd, setActivePointEnd] = useState<coordinate | null>(null);
  const { createLine, createPin, createRect, selectObjects } =
    useCreateObjects();

  const { toCoordinate } = new CoordinateFns(settings.gridSize);

  const handleClick = (e: KonvaMouse) => {
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
      const { snapX, snapY } = snap(position);
      setCurrentPosition(toCoordinate({ x: snapX, y: snapY }));

      if (activePointStart) {
        setActivePointEnd({ x: snapX, y: snapY });
      }
    }
  };

  const handleMouseOverThrottled = throttle(handleMouseOver, THROTTLE_DELAY);

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
    >
      <GridLayer gridSize={settings.gridSize} isGridOn={settings.showGrid} />
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
