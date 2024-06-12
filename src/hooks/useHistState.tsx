import { useCallback, useEffect, useState } from "react";
import { ObjectsType } from "~/types/shapes.types";

export enum EventActions {
  CREATE = "CREATE",
  DELETE = "DELETE",
  EDIT = "EDIT",
  CLEAR = "CLEAR",
  SET_ACTIVE = "SET_ACTIVE",
  SET_INACTIVE = "SET_INACTIVE",
}

export type CreateEditEventType = {
  id: string;
  action: EventActions.CREATE | EventActions.EDIT;
  payload: ObjectsType;
};

export type DeleteClearEventType = {
  id: string;
  action: EventActions.DELETE | EventActions.CLEAR;
  payload: null;
};

export type SetActiveInactiveEventType = {
  id: string;
  action: EventActions.SET_ACTIVE | EventActions.SET_INACTIVE;
  payload: string[];
};

export type EventType =
  | CreateEditEventType
  | DeleteClearEventType
  | SetActiveInactiveEventType;

const useHistState = (maxHistory: number) => {
  const [objects, setObjects] = useState<ObjectsType[]>([]);
  const [baseState, setBaseState] = useState<ObjectsType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [undoneEvents, setUndoneEvents] = useState<EventType[]>([]);

  const activate = (ids: string[]) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => ({
        ...obj,
        active: ids.includes(obj.id),
      })),
    );
  };

  const inactivate = () => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => ({
        ...obj,
        active: false,
      })),
    );
  };

  const call = (event: Omit<EventType, "id">) => {
    if (event.action === EventActions.SET_ACTIVE) {
      activate(event.payload as string[]);
      return;
    }
    if (event.action === EventActions.SET_INACTIVE) {
      inactivate();
      return;
    }

    setEvents((prevEvents) => {
      const newEvents = [
        ...prevEvents,
        { ...event, id: crypto.randomUUID() } as EventType,
      ];
      if (newEvents.length > maxHistory) {
        const oldestAction = newEvents.shift() as EventType;
        if (oldestAction) {
          setBaseState(buildState([oldestAction]));
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

  const buildState = useCallback(
    (eventsToBuild: EventType[]): ObjectsType[] => {
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
          case EventActions.DELETE:
            const activeObjects = objects
              .filter((obj) => obj.active)
              .map((obj) => obj.id);
            return acc.filter((obj) => !activeObjects.includes(obj.id));
          default:
            return acc;
        }
      }, baseState);
    },
    [baseState, events],
  );

  useEffect(() => {
    setObjects(buildState(events));
  }, [events, buildState]);

  const state = objects;

  return {
    events,
    setEvents,
    call,
    undo,
    redo,
    state,
    canUndo: events.length > 0,
    canRedo: undoneEvents.length > 0,
  };
};

export default useHistState;
