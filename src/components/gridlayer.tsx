import { useContext } from "react";
import { Layer, Line } from "react-konva";
import { xOffset, yOffset } from "~/constants";
import { ScaleContext } from "~/contexts/scaleContext";
import { useWindowSize } from "~/hooks/useWindowSize";

const GridLayer = ({
  gridSize,
  isGridOn,
}: {
  gridSize: number;
  isGridOn: boolean;
}) => {
  const windowSize = useWindowSize();
  // const [{ scale }] = useContext(ScaleContext);
  if (!windowSize.width || !windowSize.height) return null;
  const CANVAS_WIDTH = windowSize.width - 240;
  const CANVAS_HEIGHT = windowSize.height - 60;

  if (!isGridOn) return null;

  // Calculate the number of grid squares required based on the canvas size
  const numVerticalLines = Math.ceil(CANVAS_WIDTH / gridSize);
  const numHorizontalLines = Math.ceil(CANVAS_HEIGHT / gridSize);

  console.log("numVerticalLines", numVerticalLines);

  // Create an array to store the grid line components
  const verticalLines = [];
  const horizontalLines = [];

  // Create vertical grid lines
  for (let i = 1; i < numVerticalLines; i++) {
    verticalLines.push(
      <Line
        key={`vertical_${i}`}
        points={[i * gridSize, 0, i * gridSize, CANVAS_HEIGHT]}
        stroke={i == xOffset ? "red" : "darkgray"}
        strokeWidth={i == xOffset ? 1 : 0.5}
        opacity={i == xOffset ? 0.8 : 0.5}
      />,
    );
  }

  // Create horizontal grid lines
  for (let i = 1; i < numHorizontalLines; i++) {
    horizontalLines.push(
      <Line
        key={`horizontal_${i}`}
        points={[0, i * gridSize, CANVAS_WIDTH, i * gridSize]}
        stroke={i == yOffset ? "green" : "darkgray"}
        strokeWidth={i == yOffset ? 1 : 0.5}
        opacity={i == yOffset ? 0.8 : 0.5}
      />,
    );
  }

  return (
    <Layer>
      {verticalLines}
      {horizontalLines}
      <Line
        points={[
          xOffset * gridSize,
          yOffset * gridSize,
          xOffset * gridSize,
          (yOffset - 3) * gridSize,
        ]}
        stroke="red"
        strokeWidth={3}
      />
      <Line
        points={[
          xOffset * gridSize,
          yOffset * gridSize,
          (xOffset + 3) * gridSize,
          yOffset * gridSize,
        ]}
        stroke="green"
        strokeWidth={3}
      />
    </Layer>
  );
};

export default GridLayer;
