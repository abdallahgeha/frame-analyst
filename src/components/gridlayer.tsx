import { Layer, Line } from "react-konva";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "~/constants";

const GridLayer = ({
  gridSize,
  isGridOn,
}: {
  gridSize: number;
  isGridOn: boolean;
}) => {
  if (!isGridOn) return null;

  // Calculate the number of grid squares required based on the canvas size
  const numVerticalLines = Math.ceil(CANVAS_WIDTH / gridSize);
  const numHorizontalLines = Math.ceil(CANVAS_HEIGHT / gridSize);

  // Create an array to store the grid line components
  const verticalLines = [];
  const horizontalLines = [];

  // Create vertical grid lines
  for (let i = 1; i < numVerticalLines; i++) {
    verticalLines.push(
      <Line
        key={`vertical_${i}`}
        points={[i * gridSize, 0, i * gridSize, CANVAS_HEIGHT]}
        stroke={i == 6 ? "red" : "darkgray"}
        strokeWidth={i == 6 ? 1 : 0.5}
        opacity={i == 6 ? 0.8 : 0.5}
      />,
    );
  }

  // Create horizontal grid lines
  for (let i = 1; i < numHorizontalLines; i++) {
    horizontalLines.push(
      <Line
        key={`horizontal_${i}`}
        points={[0, i * gridSize, CANVAS_WIDTH, i * gridSize]}
        stroke={i == numHorizontalLines - 6 ? "green" : "darkgray"}
        strokeWidth={i == numHorizontalLines - 6 ? 1 : 0.5}
        opacity={i == numHorizontalLines - 6 ? 0.8 : 0.5}
      />,
    );
  }

  return (
    <Layer>
      {verticalLines}
      {horizontalLines}
      <Line
        points={[
          6 * gridSize,
          CANVAS_HEIGHT - 6 * gridSize,
          6 * gridSize,
          CANVAS_HEIGHT - 9 * gridSize,
        ]}
        stroke="red"
        strokeWidth={3}
      />
      <Line
        points={[
          6 * gridSize,
          CANVAS_HEIGHT - 6 * gridSize,
          6 * gridSize + 3 * gridSize,
          CANVAS_HEIGHT - 6 * gridSize,
        ]}
        stroke="green"
        strokeWidth={3}
      />
    </Layer>
  );
};

export default GridLayer;
