import { useContext } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import Entry from "./entry";

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

export default History;
