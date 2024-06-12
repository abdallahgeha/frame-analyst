import type { pinWithId } from "~/types/shapes.types";

export default function snapToPin(
  pins: pinWithId[],
  snapX: number,
  snapY: number,
  PIN_SNAP_THRESHOLD: number,
) {
  pins.forEach((pin) => {
    const distanceToPin = Math.sqrt(
      (pin.points[0] - snapX) ** 2 + (pin.points[1] - snapY) ** 2,
    );

    if (distanceToPin < PIN_SNAP_THRESHOLD) {
      snapX = pin.points[0];
      snapY = pin.points[1];
    }
  });

  return { pinSnapX: snapX, pinSnapY: snapY };
}
