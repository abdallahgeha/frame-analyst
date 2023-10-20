import { Layer, Line } from "react-konva";

const GridLayer = ({
  gridSize,
  isGridOn,
}: {
  gridSize: number;
  isGridOn: boolean;
}) => {
  if (!isGridOn) return null;

  // Calculate the number of grid squares required based on the canvas size
  const numVerticalLines = Math.ceil(800 / gridSize); // Adjust 800 to match your canvas width
  const numHorizontalLines = Math.ceil(600 / gridSize); // Adjust 800 to match your canvas height

  // Create an array to store the grid line components
  const verticalLines = [];
  const horizontalLines = [];

  // Create vertical grid lines
  for (let i = 1; i < numVerticalLines; i++) {
    verticalLines.push(
      <Line
        key={`vertical_${i}`}
        points={[i * gridSize, 0, i * gridSize, 600]} // Adjust 800 to match your canvas height
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
        points={[0, i * gridSize, 800, i * gridSize]} // Adjust 800 to match your canvas width
        stroke="gray"
        strokeWidth={1}
      />,
    );
  }

  return (
    <Layer>
      {verticalLines}
      {horizontalLines}
    </Layer>
  );
};

export default GridLayer;
