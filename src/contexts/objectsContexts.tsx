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
  call: (event: Omit<EventType, "id">) => void;
  undo: () => void;
  redo: () => void;
  state: ObjectsType[];
  events: EventType[];
  activeIds: string[];
  setEvents: Dispatch<SetStateAction<EventType[]>>;
  canRedo: boolean;
  canUndo: boolean;
}>({
  call: () => {},
  undo: () => {},
  redo: () => {},
  state: [],
  events: [],
  activeIds: [],
  setEvents: () => {},
  canRedo: false,
  canUndo: false,
});

export const ObjectsProvider = ({
  children,
}: {
  children: React.ReactElement;
}): ReactElement => {
  const {
    call,
    redo,
    undo,
    state,
    events,
    setEvents,
    canRedo,
    canUndo,
    activeIds,
  } = useHistState(20);

  return (
    <ObjectsContext.Provider
      value={{
        call,
        redo,
        undo,
        state,
        events,
        setEvents,
        canRedo,
        canUndo,
        activeIds,
      }}
    >
      {children}
    </ObjectsContext.Provider>
  );
};
