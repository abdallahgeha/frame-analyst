import { useContext } from "react";
import { Layer, Line } from "react-konva";
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
  const [{ scale, x, y }] = useContext(ScaleContext);
  if (!windowSize.width || !windowSize.height) return null;
  const CANVAS_WIDTH = (windowSize.width - 240) / scale;
  const CANVAS_HEIGHT = (windowSize.height - 60) / scale;
  const scaledGridSize = gridSize / scale;

  if (!isGridOn) return null;

  const numPositiveVerticalLines = CANVAS_WIDTH - x;
  const numNegativeVerticalLines = x;
  const numPositiveHorizontalLines = CANVAS_HEIGHT - y;
  const numNegativeHorizontalLines = y;

  // Create an array to store the grid line components
  const verticalLines = [];
  const horizontalLines = [];

  for (let i = 1; i < numPositiveVerticalLines; i++) {
    verticalLines.push(
      <Line
        key={`vertical_p_${i}`}
        points={[
          i * scaledGridSize,
          -y / scale,
          i * scaledGridSize,
          (CANVAS_HEIGHT + y) / scale,
        ]}
        stroke={"darkgray"}
        strokeWidth={0.5}
        opacity={0.5}
      />,
    );
  }

  for (let i = 1; i < numNegativeVerticalLines; i++) {
    verticalLines.push(
      <Line
        key={`vertical_n_${i}`}
        points={[
          0 - i * scaledGridSize,
          -y / scale,
          0 - i * scaledGridSize,
          (CANVAS_HEIGHT + y) / scale,
        ]}
        stroke={"darkgray"}
        strokeWidth={0.5}
        opacity={0.5}
      />,
    );
  }

  for (let i = 1; i < numPositiveHorizontalLines; i++) {
    horizontalLines.push(
      <Line
        key={`horizontal_p_${i}`}
        points={[
          -x / scale,
          +i * scaledGridSize,
          (CANVAS_WIDTH - x) / scale,
          +i * scaledGridSize,
        ]}
        stroke={"darkgray"}
        strokeWidth={0.5}
        opacity={0.5}
      />,
    );
  }

  for (let i = 1; i < numNegativeHorizontalLines; i++) {
    horizontalLines.push(
      <Line
        key={`horizontal_n_${i}`}
        points={[
          -x / scale,
          -i * scaledGridSize,
          (CANVAS_WIDTH - x) / scale,
          -i * scaledGridSize,
        ]}
        stroke={"darkgray"}
        strokeWidth={0.5}
        opacity={0.5}
      />,
    );
  }

  return (
    <Layer>
      {verticalLines}
      {horizontalLines}
      <Line points={[0, 0, 0, -60 / scale]} stroke="red" strokeWidth={3} />
      <Line
        points={[
          0,
          (CANVAS_HEIGHT + 2 * y) / scale,
          0,
          -(CANVAS_HEIGHT + 2 * y) / scale,
        ]}
        stroke="red"
        strokeWidth={1}
      />
      <Line points={[0, 0, 60 / scale, 0]} stroke="green" strokeWidth={3} />
      <Line
        points={[
          (2 * x + CANVAS_WIDTH) / scale,
          0,
          -((2 * x + CANVAS_WIDTH) / scale),
          0,
        ]}
        stroke="green"
        strokeWidth={1}
      />
    </Layer>
  );
};

export default GridLayer;
