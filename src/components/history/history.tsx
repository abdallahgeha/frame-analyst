import { useContext } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import {
  CreateEditEventType,
  EventActions,
  EventType,
} from "~/hooks/useHistState";
import { ObjectsType } from "~/types/shapes.types";
import { cn } from "~/utils/cn";

const History = () => {
  const { events } = useContext(ObjectsContext);

  return (
    <div className="h-stage thin-scrollbar w-60 flex-auto flex-shrink-0 overflow-auto bg-gray-400 p-2">
      {events.length === 0 && (
        <div className="flex h-52 items-center justify-center">
          <p className="text-xs">No History</p>
        </div>
      )}
      {events.map((event, index) => (
        <Entry key={event.id} entry={event} index={index} />
      ))}
    </div>
  );
};

const Entry = ({ entry, index }: { entry: EventType; index: number }) => {
  const {
    call,
    setEvents,
    state: objects,
    events,
  } = useContext(ObjectsContext);
  const activeObjectsids = objects
    .filter((obj) => obj.active)
    .map((obj) => obj.id);

  const handleDelete = () => {
    setEvents((events) => events.filter((event) => event.id !== entry.id));
  };

  const handleActiveHover = () => {
    const localEntry = entry as CreateEditEventType;
    call({ action: EventActions.SET_INACTIVE, payload: null });
    call({ action: EventActions.SET_ACTIVE, payload: [localEntry.payload.id] });
  };

  const handleActiveLeave = () => {
    call({ action: EventActions.SET_INACTIVE, payload: null });
  };

  const handeChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const localEntry = entry as CreateEditEventType;
    const newPoints = [...localEntry.payload.points];
    newPoints[index] = parseFloat(e.target.value);
    const newEntry: CreateEditEventType = {
      ...localEntry,
      payload: {
        ...localEntry.payload,
        points: newPoints,
      } as ObjectsType,
    };

    setEvents((events) =>
      events.map((event) => (event.id === entry.id ? newEntry : event)),
    );
  };

  if (Array.isArray(entry.payload)) return null;

  if (entry.action === "CLEAR")
    return (
      <div className="mb-2 flex h-10 items-center justify-around rounded-md bg-gray-300 px-2">
        <div className="flex-auto">Clear</div>
        <button
          className="flex h-4 w-4 items-center justify-center bg-red-400 text-white"
          onClick={handleDelete}
        >
          x
        </button>
      </div>
    );
  if (entry.action === "DELETE")
    return (
      <div className="mb-2 flex h-10 items-center justify-around rounded-md bg-gray-300 px-2">
        <div className="flex-auto">Delete</div>
        <button
          className="flex h-4 w-4 items-center justify-center bg-red-400 text-white"
          onClick={handleDelete}
        >
          x
        </button>
      </div>
    );

  if (entry.action === "CREATE" || entry.action === "EDIT") {
    const isLastEntryFromSameObject =
      events.findLastIndex((event) => {
        if (event.action === "CREATE" || event.action === "EDIT") {
          return event.payload.id === entry.payload.id;
        } else return false;
      }) === index;

    return (
      <div
        className={cn(
          "mb-2 w-56 cursor-pointer rounded-md bg-gray-400 border border-gray-300 px-2 hover:bg-gray-400",
          isLastEntryFromSameObject && "bg-white hover:bg-gray-100",
          activeObjectsids.includes(entry.payload.id) && "bg-red-100/50",
        )}
        onMouseEnter={handleActiveHover}
        onMouseLeave={handleActiveLeave}
      >
        <div className="flex h-10 flex-auto items-center justify-around">
          <div className="flex-auto">
            {entry.action === "CREATE" ? "Create" : "Edit"}{" "}
            {entry.payload.itemType}
          </div>

          {isLastEntryFromSameObject && (
            <button
              className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              x
            </button>
          )}
        </div>
        {isLastEntryFromSameObject && (
          <>
            <div className="flex h-10 items-center justify-between gap-2">
              <p className="flex-[4_0_32px]]">Start</p>
              <label className="flex-[1_0_0%] text-center">x</label>
              <input
                type="number"
                className="w-0 flex-[3_0_0%] border text-center text-xs"
                value={entry.payload.points[0].toFixed(2)}
                onChange={(e) => handeChangeEvent(e, 0)}
              />
              <label className="flex-[1_0_0%]">y</label>
              <input
                type="number"
                className="w-0 flex-[3_0_0%] border text-center text-xs"
                value={entry.payload.points[1].toFixed(2)}
                onChange={(e) => handeChangeEvent(e, 1)}
              />
            </div>
            {entry.payload.points[2] && entry.payload.points[3] && (
              <div className="flex h-10 items-center justify-between gap-2">
                <p className="flex-[4_0_32px]]">End</p>
                <label className="flex-[1_0_0%] text-center">x</label>
                <input
                  type="number"
                  className="w-0 flex-[3_0_0%] border text-center text-xs"
                  value={entry.payload.points[2].toFixed(2)}
                  onChange={(e) => handeChangeEvent(e, 2)}
                />
                <label className="flex-[1_0_0%]">y</label>
                <input
                  type="number"
                  className="w-0 flex-[3_0_0%] border text-center text-xs "
                  value={entry.payload.points[3].toFixed(2)}
                  onChange={(e) => handeChangeEvent(e, 3)}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return <div className="bg-gray-700"></div>;
};

export default History;
