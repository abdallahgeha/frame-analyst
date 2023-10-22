import { LineType } from "~/types/shapes.types";

export default function snapToCap(
  lines: LineType[],
  line: LineType,
  snapX: number,
  snapY: number,
  CAP_SNAP_THRESHOLD: number,
) {
  const otherCircles = lines
    .filter((l) => l.id !== line.id)
    .map((l) => {
      return {
        capStartX: l.points[0]!,
        capStartY: l.points[1]!,
        capEndX: l.points[2]!,
        capEndY: l.points[3]!,
      };
    });

  otherCircles.forEach((cap) => {
    const distanceToCapStart = Math.sqrt(
      (cap.capStartX - snapX) ** 2 + (cap.capStartY - snapY) ** 2,
    );
    const distanceToCapEnd = Math.sqrt(
      (cap.capEndX - snapX) ** 2 + (cap.capEndY - snapY) ** 2,
    );

    if (distanceToCapStart < CAP_SNAP_THRESHOLD) {
      snapX = cap.capStartX;
      snapY = cap.capStartY;
    } else if (distanceToCapEnd < CAP_SNAP_THRESHOLD) {
      snapX = cap.capEndX;
      snapY = cap.capEndY;
    }
  });

  return { capSnapX: snapX, capSnapY: snapY };
}
