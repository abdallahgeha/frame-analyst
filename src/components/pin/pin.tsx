import { Dispatch, SetStateAction } from "react";
import { Circle } from "react-konva";
import { KonvaMouse } from "~/types/konvaEvents.types";
import { LineType, pinWithId } from "~/types/shapes.types";

const Pin = ({ pin }: { pin: pinWithId }) => {
  const handleMouseEnter = (e: KonvaMouse) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "pointer";
  };

  const handleMouseLeave = (e: KonvaMouse) => {
    const container = e.target.getStage()!.container();
    container.style.cursor = "default";
  };

  return (
    <Circle
      id={pin.id}
      x={pin.x}
      y={pin.y}
      radius={6}
      fill={"red"}
      name="pin"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      hitStrokeWidth={10}
    />
  );
};

export default Pin;
