import { LineType, coordinate } from "~/types/shapes.types";
import { Drawable } from "./Drawable";
import CappedLine from "~/components/cappedLine/cappedLine";
import { Dispatch, SetStateAction } from "react";

export class CappedLineClass {
  constructor(
    private id: string,
    private startPoint: coordinate,
    private endPoint: coordinate,
    private isActive: boolean,
  ) {}
  getShape(
    setLines: Dispatch<SetStateAction<CappedLineClass[]>>,
    lines: CappedLineClass[],
  ) {
    return (
      //   <CappedLine key={this.id} line={this} setLines={setLines} lines={lines} />
      <></>
    );
  }
}
