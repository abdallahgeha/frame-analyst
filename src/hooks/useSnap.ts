import { useContext } from "react";
import {
  CAP_SNAP_THRESHOLD,
  GRID_SNAP_THRESHOLD,
  PIN_SNAP_THRESHOLD,
} from "~/constants";
import { ObjectsContext } from "~/contexts/objectsContexts";
import { SettingsContext } from "~/contexts/settingsContext";
import type { LineType, coordinate, pinWithId } from "~/types/shapes.types";
import snapToCap from "~/utils/snapToCap";
import snapToGrid from "~/utils/snapToGrid";
import snapToPin from "~/utils/snapToPin";

const useSnap = () => {
  const [objects] = useContext(ObjectsContext);
  const [settings] = useContext(SettingsContext);

  const snap = (position: coordinate) => {
    const pins = objects.filter((obj) => obj.itemType === "pin") as pinWithId[];
    const lines = objects.filter(
      (obj) => obj.itemType === "line",
    ) as LineType[];

    let snapX = position.x;
    let snapY = position.y;

    if (settings.snapToGrid) {
      const { gripSnapX, gridSnapY } = snapToGrid(
        position.x,
        position.y,
        snapX,
        snapY,
        settings.gridSize,
        GRID_SNAP_THRESHOLD,
      );
      snapX = gripSnapX;
      snapY = gridSnapY;
    }

    if (settings.snapToCap) {
      const { capSnapX, capSnapY } = snapToCap(
        lines,
        { id: "", points: [], active: false, itemType: "line" },
        snapX,
        snapY,
        CAP_SNAP_THRESHOLD,
      );
      snapX = capSnapX;
      snapY = capSnapY;
    }

    if (settings.snapToPin) {
      const { pinSnapX, pinSnapY } = snapToPin(
        pins,
        snapX,
        snapY,
        PIN_SNAP_THRESHOLD,
      );
      snapX = pinSnapX;
      snapY = pinSnapY;
    }

    return { snapX, snapY };
  };

  return snap;
};

export default useSnap;
