export default function snapToGrid(
  x: number,
  y: number,
  snapX: number,
  snapY: number,
  gridSize: number,
  GRID_SNAP_THRESHOLD: number,
) {
  snapX = Math.round(x / gridSize) * gridSize;
  snapY = Math.round(y / gridSize) * gridSize;

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
