import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import useHistState, { type EventType } from "~/hooks/useHistState";
import type { ObjectsType } from "~/types/shapes.types";

export const ObjectsContext = createContext<{
  call: (event: EventType) => void;
  undo: () => void;
  redo: () => void;
  state: ObjectsType[];
}>({
  call: () => {},
  undo: () => {},
  redo: () => {},
  state: [],
});

export const ObjectsProvider = ({
  children,
}: {
  children: React.ReactElement;
}): ReactElement => {
  //   const [objects, setObjects] = useState<ObjectsType[]>([]);
  const { call, redo, undo, state } = useHistState(10);

  return (
    <ObjectsContext.Provider value={{ call, redo, undo, state }}>
      {children}
    </ObjectsContext.Provider>
  );
};
