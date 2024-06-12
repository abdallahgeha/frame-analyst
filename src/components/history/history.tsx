import { useContext } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import {
  CreateEditEventType,
  EventActions,
  EventType,
} from "~/hooks/useHistState";
import { cn } from "~/utils/cn";

const History = () => {
  const { events } = useContext(ObjectsContext);

  return (
    <div className="h-stage thin-scrollbar w-60 flex-auto flex-shrink-0 overflow-auto bg-gray-400 p-2">
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
    const isLastEntryFromSameObject = events.findIndex((event) => {
      if (event.action === "CREATE" || event.action === "EDIT") {
        return event.payload.id === entry.payload.id;
      } else return false;
    });

    return (
      <div
        className={cn(
          "mb-2 flex h-10 cursor-pointer items-center justify-around rounded-md bg-gray-400 px-2 hover:bg-gray-400",
          activeObjectsids.includes(entry.payload.id) && "bg-red-100",
          isLastEntryFromSameObject && "bg-white hover:bg-gray-100",
        )}
        onMouseEnter={handleActiveHover}
        onMouseLeave={handleActiveLeave}
      >
        <div className="flex h-full flex-auto items-center justify-around">
          <div className="flex-auto">
            {entry.action === "CREATE" ? "Create" : "Edit"}{" "}
            {entry.payload.itemType}
          </div>
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            x
          </button>
        </div>
      </div>
    );
  }

  return <div className="bg-gray-700"></div>;
};

export default History;
