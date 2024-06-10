import { xOffset, yOffset } from "~/constants";
import type { coordinate } from "~/types/shapes.types";

export default function toCoordinate(
  coordinate: coordinate,
  gridSize: number,
): coordinate {
  return {
    x: Number((coordinate.x - xOffset * gridSize).toFixed(2)),
    y: Number((yOffset * gridSize - coordinate.y).toFixed(2)),
  };
}
