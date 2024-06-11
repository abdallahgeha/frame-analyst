import { useState } from "react";
import { ObjectsType } from "~/types/shapes.types";

export enum EventActions {
  CREATE = "CREATE",
  DELETE = "DELETE",
  EDIT = "EDIT",
  CLEAR = "CLEAR",
  SET_ACTIVE = "SET_ACTIVE",
  SET_INACTIVE = "SET_INACTIVE",
}

export type EventType = {
  action: EventActions;
  payload: ObjectsType | string[] | null;
};

const useHistState = (maxHistory: number) => {
  const [baseState, setBaseState] = useState<ObjectsType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [undoneEvents, setUndoneEvents] = useState<EventType[]>([]);

  const call = (event: EventType) => {
    setEvents((prevEvents) => {
      const newEvents = [...prevEvents, event];
      if (newEvents.length > maxHistory) {
        const oldestAction = newEvents.shift();
        if (oldestAction) {
          setBaseState(buildState([oldestAction], baseState));
        }
      }
      return newEvents;
    });
  };

  const undo = () => {
    setEvents((prevEvents) => {
      if (prevEvents.length === 0) return prevEvents;
      const newEvents = prevEvents.slice(0, -1);
      setUndoneEvents((prevUndone) => {
        const lastEvent = prevEvents[prevEvents.length - 1]!;
        const newUndone = [...prevUndone, lastEvent];
        return newUndone;
      });
      return newEvents;
    });
  };

  const redo = () => {
    setUndoneEvents((prevUndone) => {
      if (prevUndone.length === 0) return prevUndone;
      const newUndone = prevUndone.slice(0, -1);
      setEvents((prevEvents) => {
        const lastEvent = prevUndone[prevUndone.length - 1]!;
        const newEvents = [...prevEvents, lastEvent];
        return newEvents;
      });
      return newUndone;
    });
  };

  const buildState = (
    eventsToBuild: EventType[],
    initialState: ObjectsType[] = [],
  ): ObjectsType[] => {
    console.log(eventsToBuild);
    return eventsToBuild.reduce((acc: ObjectsType[], event: EventType) => {
      switch (event.action) {
        case EventActions.CREATE:
          return [...acc, event.payload as ObjectsType];
        case EventActions.EDIT:
          return acc.map((obj) =>
            obj.id === (event.payload as ObjectsType).id
              ? (event.payload as ObjectsType)
              : obj,
          );
        case EventActions.CLEAR:
          return [];
        case EventActions.SET_ACTIVE:
          const activeIds = new Set(event.payload as string[]);
          return acc.map((obj) => ({
            ...obj,
            active: activeIds.has(obj.id),
          }));
        case EventActions.SET_INACTIVE:
          return acc.map((obj) => ({
            ...obj,
            active: false,
          }));
        case EventActions.DELETE:
          return acc.filter((obj) => !obj.active);
        default:
          return acc;
      }
    }, initialState);
  };

  const state = buildState(events, baseState);

  return {
    call,
    undo,
    redo,
    state,
  };
};

export default useHistState;
