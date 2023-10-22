export default function snapToGrid(
  x: number,
  y: number,
  snapX: number,
  snapY: number,
  GRID_SIZE: number,
  GRID_SNAP_THRESHOLD: number,
) {
  snapX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  snapY = Math.round(y / GRID_SIZE) * GRID_SIZE;

  const deltaX = x - snapX;
  const deltaY = y - snapY;
  if (
    Math.abs(deltaX) > GRID_SNAP_THRESHOLD &&
    Math.abs(deltaY) > GRID_SNAP_THRESHOLD
  ) {
    snapX = x;
    snapY = y;
  }

  return { gripSnapX: snapX, gridSnapY: snapY };
}
