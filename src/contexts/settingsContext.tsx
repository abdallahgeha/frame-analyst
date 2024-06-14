import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import type { SettingsType } from "~/types/shapes.types";

export const SettingsContext = createContext<
  [SettingsType, Dispatch<SetStateAction<SettingsType>>]
>([
  {
    gridSize: 50,
    showGrid: true,
    showCoordinates: true,
    snapToGrid: true,
    snapToCap: true,
    snapToPin: true,
  },
  () => {},
]);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactElement;
}): ReactElement => {
  const [settings, setSettings] = useState<SettingsType>({
    gridSize: 20,
    showGrid: true,
    showCoordinates: true,
    snapToGrid: true,
    snapToCap: true,
    snapToPin: true,
  });

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {children}
    </SettingsContext.Provider>
  );
};
