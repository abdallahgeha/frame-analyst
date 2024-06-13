import { useContext } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import { DeleteSetActiveInactiveEventType } from "~/hooks/useHistState";

const DeleteEntry = ({
  entry,
}: {
  entry: DeleteSetActiveInactiveEventType;
}) => {
  const { setEvents } = useContext(ObjectsContext);

  const handleDelete = () => {
    setEvents((events) => events.filter((event) => event.id !== entry.id));
  };

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
};

export default DeleteEntry;
