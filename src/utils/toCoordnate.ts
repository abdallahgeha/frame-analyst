import { GRID_SIZE, xOffset, yOffset } from "~/constants";
import { coordinate } from "~/types/shapes.types";

export default function toCoordinate(coordinate: coordinate): coordinate {
  return {
    x: Number((coordinate.x - xOffset * GRID_SIZE).toFixed(2)),
    y: Number((yOffset * GRID_SIZE - coordinate.y).toFixed(2)),
  };
}
