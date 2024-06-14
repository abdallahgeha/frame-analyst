import { useContext } from "react";
import { Group, Rect, Text } from "react-konva";
import { ScaleContext } from "~/contexts/scaleContext";
import { SettingsContext } from "~/contexts/settingsContext";
import type { coordinate } from "~/types/shapes.types";
import CoordinateFns from "~/utils/toCoordnate";

const ActiveCoordinates = ({
  activePointEnd,
  type,
}: {
  activePointEnd: coordinate | null;
  type: string;
}) => {
  const [settings] = useContext(SettingsContext);
  const [scale] = useContext(ScaleContext);

  const { toCoordinate } = new CoordinateFns(
    settings.gridSize,
    scale.x,
    scale.y,
    scale.scale,
  );

  if (!activePointEnd) return null;
  if (type === "view") return null;

  return (
    <Group x={activePointEnd.x + 20} y={activePointEnd.y - 20}>
      <Rect
        width={80}
        height={30}
        fill="green"
        cornerRadius={[10, 0, 0, 10]}
        opacity={0.5}
      />
      <Rect
        x={80}
        width={80}
        height={30}
        fill="red"
        cornerRadius={[0, 10, 10, 0]}
        opacity={0.5}
      />
      <Text
        text={toCoordinate(activePointEnd).x.toFixed(2)}
        fontSize={16}
        fill="white"
        align="center"
        verticalAlign="middle"
        width={80}
        padding={10}
      />
      <Text
        x={80}
        text={toCoordinate(activePointEnd).y.toFixed(2)}
        fontSize={16}
        fill="#FFFFFF"
        align="center"
        verticalAlign="middle"
        width={80}
        padding={10}
      />
    </Group>
  );
};

export default ActiveCoordinates;
