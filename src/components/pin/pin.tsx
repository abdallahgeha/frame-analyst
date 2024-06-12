import { Circle } from "react-konva";
import type { KonvaMouse } from "~/types/konvaEvents.types";
import type { pinWithId } from "~/types/shapes.types";

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
      x={pin.points[0]}
      y={pin.points[1]}
      radius={6}
      fill="red"
      name="pin"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      hitStrokeWidth={10}
      stroke={pin.active ? "white" : ""}
      strokeWidth={1}
    />
  );
};

export default Pin;
