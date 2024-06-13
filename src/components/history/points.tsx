import { useContext } from "react";
import { ObjectsContext } from "~/contexts/objectsContexts";
import { SettingsContext } from "~/contexts/settingsContext";
import { CreateEditEventType, EventType } from "~/hooks/useHistState";
import { ObjectsType } from "~/types/shapes.types";
import CoordinateFns from "~/utils/toCoordnate";

const PointForm = ({ entry }: { entry: EventType }) => {
  const [settings] = useContext(SettingsContext);
  const { setEvents } = useContext(ObjectsContext);

  if (!entry.payload) return null;
  if (Array.isArray(entry.payload)) return null;

  const { toCoordinateX, toCoordinateY, toGridCoordinateX, toGridCoordinateY } =
    new CoordinateFns(settings.gridSize);

  const handeChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const localEntry = entry as CreateEditEventType;
    const newPoints = [...localEntry.payload.points];
    newPoints[index] =
      index % 2 === 0
        ? toGridCoordinateX(parseFloat(e.target.value))
        : toGridCoordinateY(parseFloat(e.target.value));
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

  return (
    <div className="grid grid-cols-9 gap-2 pb-2">
      <div className="col-span-1 text-xs"></div>
      <div className="col-span-4 text-center text-xs">X</div>
      <div className="col-span-4 text-center text-xs">Y</div>

      <div className="col-span-1">1</div>
      <input
        type="number"
        name="x_1"
        className="col-span-4 border text-center"
        value={toCoordinateX(entry.payload.points[0]).toFixed(2)}
        onChange={(e) => handeChangeEvent(e, 0)}
      />
      <input
        type="number"
        name="y_1"
        className="col-span-4 border text-center"
        value={toCoordinateY(entry.payload.points[1]).toFixed(2)}
        onChange={(e) => handeChangeEvent(e, 1)}
      />

      {entry.payload.points[2] && entry.payload.points[3] && (
        <>
          <div>2</div>
          <input
            type="number"
            name="x_2"
            className="col-span-4 border text-center"
            value={toCoordinateX(entry.payload.points[2]).toFixed(2)}
            onChange={(e) => handeChangeEvent(e, 2)}
          />
          <input
            type="number"
            name="y_2"
            className="col-span-4 border text-center"
            value={toCoordinateX(entry.payload.points[3]).toFixed(2)}
            onChange={(e) => handeChangeEvent(e, 3)}
          />
        </>
      )}
    </div>
  );
};

export default PointForm;
