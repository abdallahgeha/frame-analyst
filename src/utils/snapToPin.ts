import { pinWithId } from "~/types/shapes.types";

export default function snapToPin(
  pins: pinWithId[],
  snapX: number,
  snapY: number,
  PIN_SNAP_THRESHOLD: number,
) {
  pins.forEach((pin) => {
    const distanceToPin = Math.sqrt(
      (pin.x - snapX) ** 2 + (pin.y - snapY) ** 2,
    );

    if (distanceToPin < PIN_SNAP_THRESHOLD) {
      snapX = pin.x;
      snapY = pin.y;
    }
  });

  return { pinSnapX: snapX, pinSnapY: snapY };
}
