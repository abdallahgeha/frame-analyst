import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import type { DrawType } from "~/types/shapes.types";

export const TypeContext = createContext<
  [DrawType, Dispatch<SetStateAction<DrawType>>]
>(["view", () => {}]);

export const TypeProvider = ({
  children,
}: {
  children: React.ReactElement;
}): ReactElement => {
  const [type, setType] = useState<DrawType>("view");

  return (
    <TypeContext.Provider value={[type, setType]}>
      {children}
    </TypeContext.Provider>
  );
};
