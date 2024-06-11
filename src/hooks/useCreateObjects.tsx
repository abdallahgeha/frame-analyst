import { useContext } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import type {
  LineType,
  RectType,
  coordinate,
  pinWithId,
} from "~/types/shapes.types";
import { EventActions } from "./useHistState";

const useCreateObjects = () => {
  const { state: objects, call } = useContext(ObjectsContext);

  const selectObjects = (start: coordinate, end: coordinate) => {
    const selected = objects.map((obj) => {
      if ("points" in obj) {
        const [x1, y1, x2, y2] = obj.points;
        const xMin = Math.min(start.x, end.x);
        const xMax = Math.max(start.x, end.x);
        const yMin = Math.min(start.y, end.y);
        const yMax = Math.max(start.y, end.y);

        if (
          (x1 >= xMin && x1 <= xMax && y1 >= yMin && y1 <= yMax) ||
          (x2 >= xMin && x2 <= xMax && y2 >= yMin && y2 <= yMax) ||
          (x1 >= xMin && x1 <= xMax && y2 >= yMin && y2 <= yMax) ||
          (x2 >= xMin && x2 <= xMax && y1 >= yMin && y1 <= yMax)
        ) {
          return { ...obj, active: true };
        } else {
          return { ...obj, active: false };
        }
      } else {
        const x = obj.x;
        const y = obj.y;
        const xMin = Math.min(start.x, end.x);
        const xMax = Math.max(start.x, end.x);
        const yMin = Math.min(start.y, end.y);
        const yMax = Math.max(start.y, end.y);

        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          return { ...obj, active: true };
        } else {
          return { ...obj, active: false };
        }
      }
    });

    const activeObjects = selected.filter((obj) => obj.active);
    if (activeObjects.length !== 0) {
      call({
        action: EventActions.SET_ACTIVE,
        payload: activeObjects.map((obj) => obj.id),
      });
    }
  };

  const createLine = (start: coordinate, end: coordinate | null) => {
    const newLine: LineType = {
      id: crypto.randomUUID(),
      points: [start.x, start.y, end?.x ?? start.x, end?.y ?? start.y],
      active: false,
      itemType: "line",
    };

    call({ action: EventActions.CREATE, payload: newLine });
  };

  const createPin = (clickLocation: coordinate) => {
    const newPin: pinWithId = {
      ...clickLocation,
      id: crypto.randomUUID(),
      active: false,
      itemType: "pin",
    };

    call({ action: EventActions.CREATE, payload: newPin });
  };

  const createRect = (start: coordinate, end: coordinate | null) => {
    const points: [number, number, number, number] = [
      start.x,
      start.y,
      end?.x ?? start.x,
      end?.y ?? start.y,
    ];
    const newRect: RectType = {
      id: crypto.randomUUID(),
      points,
      active: false,
      itemType: "rect",
    };

    call({ action: EventActions.CREATE, payload: newRect });
  };

  return { createLine, createPin, createRect, selectObjects };
};

export default useCreateObjects;
