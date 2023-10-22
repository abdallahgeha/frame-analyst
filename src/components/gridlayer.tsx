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
        stroke="gray"
        strokeWidth={1}
        opacity={0.5}
      />,
    );
  }

  // Create horizontal grid lines
  for (let i = 1; i < numHorizontalLines; i++) {
    horizontalLines.push(
      <Line
        key={`horizontal_${i}`}
        points={[0, i * gridSize, CANVAS_WIDTH, i * gridSize]} 
        stroke="gray"
        strokeWidth={1}
      />,
    );
  }

  return (
    <Layer>
      {verticalLines}
      {horizontalLines}
      <Line
        points={[
          2 * gridSize,
          600 - 2 * gridSize,
          2 * gridSize,
          600 - 5 * gridSize,
        ]}
        stroke="red"
        strokeWidth={3}
      />
      <Line
        points={[
          2 * gridSize,
          600 - 2 * gridSize,
          2 * gridSize + 3 * gridSize,
          600 - 2 * gridSize,
        ]}
        stroke="green"
        strokeWidth={3}
      />
    </Layer>
  );
};

export default GridLayer;
