import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import type { ObjectsType } from "~/types/shapes.types";

export const ObjectsContext = createContext<
  [ObjectsType[], Dispatch<SetStateAction<ObjectsType[]>>]
>([[], () => {}]);

export const ObjectsProvider = ({
  children,
}: {
  children: React.ReactElement;
}): ReactElement => {
  const [objects, setObjects] = useState<ObjectsType[]>([]);

  return (
    <ObjectsContext.Provider value={[objects, setObjects]}>
      {children}
    </ObjectsContext.Provider>
  );
};
