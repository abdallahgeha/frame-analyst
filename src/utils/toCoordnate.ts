import { xOffset, yOffset } from "~/constants";
import type { coordinate } from "~/types/shapes.types";

export default class CoordinateFns {
  constructor(private gridSize: number = 10) {}

  public toCoordinate = (coordinate: coordinate): coordinate => {
    return {
      x: Number((coordinate.x - xOffset * this.gridSize).toFixed(2)),
      y: Number((yOffset * this.gridSize - coordinate.y).toFixed(2)),
    };
  };

  public toCoordinateX = (xCoordinate: number) => {
    return Number((xCoordinate - xOffset * this.gridSize).toFixed(2));
  };

  public toCoordinateY = (yCoordinate: number) => {
    return Number((yOffset * this.gridSize - yCoordinate).toFixed(2));
  };

  public toGridCoordinate = (coordinate: coordinate): coordinate => {
    return {
      x: coordinate.x + xOffset * this.gridSize,
      y: yOffset * this.gridSize - coordinate.y,
    };
  };

  public toGridCoordinateX = (xCoordinate: number) => {
    return xCoordinate + xOffset * this.gridSize;
  };

  public toGridCoordinateY = (yCoordinate: number) => {
    return yOffset * this.gridSize - yCoordinate;
  };
}
