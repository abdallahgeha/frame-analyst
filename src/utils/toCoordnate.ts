import { GRID_SIZE, xOffset, yOffset } from "~/constants";
import { coordinate } from "~/types/shapes.types";

export default function toCoordinate(coordinate: coordinate): {
  x: string;
  y: string;
} {
  return {
    x: (coordinate.x - xOffset * GRID_SIZE).toFixed(2),
    y: (yOffset * GRID_SIZE - coordinate.y).toFixed(2),
  };
}
