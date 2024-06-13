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

export type ClearEventType = {
  id: string;
  action: EventActions.CLEAR;
  payload: null;
};

export type DeleteSetActiveInactiveEventType = {
  id: string;
  action:
    | EventActions.SET_ACTIVE
    | EventActions.SET_INACTIVE
    | EventActions.DELETE;
  payload: string[];
};

export type EventType =
  | CreateEditEventType
  | ClearEventType
  | DeleteSetActiveInactiveEventType;

const useHistState = (maxHistory: number) => {
  const [baseState, setBaseState] = useState<ObjectsType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [undoneEvents, setUndoneEvents] = useState<EventType[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const call = (event: Omit<EventType, "id">) => {
    if (event.action === EventActions.SET_ACTIVE) {
      return setActiveIds(event.payload as string[]);
    }
    if (event.action === EventActions.SET_INACTIVE) {
      return setActiveIds([]);
    }

    setEvents((prevEvents) => {
      const newEvent = { ...event, id: crypto.randomUUID() };
      const newEvents = [...prevEvents, newEvent as EventType];

      if (newEvents.length > maxHistory) {
        const oldestAction = newEvents.shift() as EventType;
        if (oldestAction) {
          setBaseState(buildState([oldestAction]));
        }
      }
      return newEvents;
    });

    if (undoneEvents.length > 0) setUndoneEvents([]);
  };

  const undo = () => {
    if (events.length === 0) return;
    const lastEvent = events[events.length - 1];
    setUndoneEvents([...undoneEvents, lastEvent as EventType]);
    setEvents(events.slice(0, -1));
  };

  const redo = () => {
    if (undoneEvents.length === 0) return;
    const lastEvent = undoneEvents[undoneEvents.length - 1];
    setEvents([...events, lastEvent as EventType]);
    setUndoneEvents(undoneEvents.slice(0, -1));
  };

  const buildState = useCallback(
    (eventsToBuild: EventType[]): ObjectsType[] => {
      return eventsToBuild
        .reduce((acc: ObjectsType[], event: EventType) => {
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
              return acc.filter((obj) => !event.payload.includes(obj.id));
            default:
              return acc;
          }
        }, baseState)
        .map((obj) => ({
          ...obj,
          active: activeIds.includes(obj.id),
        }));
    },
    [baseState, events, activeIds],
  );

  const state = buildState(events);

  return {
    events,
    setEvents,
    call,
    undo,
    redo,
    state,
    activeIds,
    canUndo: events.length > 0,
    canRedo: undoneEvents.length > 0,
  };
};

export default useHistState;
