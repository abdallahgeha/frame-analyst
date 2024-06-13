import { useContext, useEffect, useRef } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import { TypeContext } from "~/contexts/typeContext";
import type {
  KeyActions,
  LineType,
  RectType,
  pinWithId,
} from "~/types/shapes.types";
import { EventActions } from "./useHistState";

export const useAnalysisPage = () => {
  const pageRef = useRef<KeyActions>();
  const {
    state: objects,
    call,
    activeIds,
    undo,
    redo,
  } = useContext(ObjectsContext);
  const [type, setType] = useContext(TypeContext);

  const unselect = () => {
    const unselectedObjects = objects.map((obj) => {
      return { ...obj, active: false };
    });

    call({
      action: EventActions.SET_INACTIVE,
      payload: unselectedObjects.map((obj) => obj.id),
    });
  };

  const deleteSelected = () => {
    const undeletedObjects = objects.filter((obj) => obj.active === false);

    call({
      action: EventActions.DELETE,
      payload: activeIds,
    });
  };

  const clear = () => {
    call({
      action: EventActions.CLEAR,
      payload: null,
    });
  };

  pageRef.current = (event: KeyboardEvent) => {
    if (event.key === "l") {
      setType("line");
    } else if (event.key === "c") {
      setType("polyline");
    } else if (event.key === "Escape") {
      unselect();
      setType("view");
    } else if (event.key === "Enter") {
      const previousType = type;
      setType("view");
      setType(previousType);
    } else if (event.key === "d") {
      deleteSelected();
    } else if (event.key === "p") {
      setType("pin");
    } else if (event.key === "r") {
      setType("rect");
    } else if (event.key === "x") {
      clear();
    } else if (
      event.key === "z" &&
      event.shiftKey &&
      (event.ctrlKey || event.metaKey)
    ) {
      redo();
    } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
      undo();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    pageRef.current!(event);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const lines = objects.filter((obj) => obj.itemType === "line") as LineType[];
  const pins = objects.filter((obj) => obj.itemType === "pin") as pinWithId[];
  const rects = objects.filter((obj) => obj.itemType === "rect") as RectType[];

  return {
    lines,
    pins,
    rects,
    deleteSelected,
    clear,
  };
};
