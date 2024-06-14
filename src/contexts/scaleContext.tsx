import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import type { ScaleType } from "~/types/shapes.types";

export const ScaleContext = createContext<
  [ScaleType, Dispatch<SetStateAction<ScaleType>>]
>([
  {
    scale: 1,
    x: 0,
    y: 0,
  },
  () => {},
]);

export const ScaleProvider = ({
  children,
}: {
  children: React.ReactElement;
}): ReactElement => {
  const [scale, setScale] = useState({
    scale: 1,
    x: 120,
    y: 680,
  });

  return (
    <ScaleContext.Provider value={[scale, setScale]}>
      {children}
    </ScaleContext.Provider>
  );
};
