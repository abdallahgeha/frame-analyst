// import { this.x, this.y } from "~/constants";
import type { coordinate } from "~/types/shapes.types";

export default class CoordinateFns {
  constructor(
    private gridSize: number = 10,
    private x: number = 0,
    private y: number = 0,
    private scale: number = 1,
  ) {}

  public toCoordinate = (coordinate: coordinate): coordinate => {
    return {
      x: Number(coordinate.x.toFixed(2)),
      y: Number((-coordinate.y).toFixed(2)),
    };
  };

  public toCoordinateX = (xCoordinate: number) => {
    return Number(xCoordinate.toFixed(2));
  };

  public toCoordinateY = (yCoordinate: number) => {
    return -Number(yCoordinate.toFixed(2));
  };

  public toGridCoordinate = (coordinate: coordinate): coordinate => {
    return {
      x: coordinate.x,
      y: coordinate.y,
    };
  };

  public toGridCoordinateX = (xCoordinate: number) => {
    return xCoordinate;
  };

  public toGridCoordinateY = (yCoordinate: number) => {
    return -yCoordinate;
  };
}
