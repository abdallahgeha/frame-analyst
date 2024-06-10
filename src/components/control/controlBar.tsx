import { coordinate } from "~/types/shapes.types";
import { cn } from "~/utils/cn";

const controlButtons = [
  { title: "View", type: "view" },
  { title: "Line", type: "line" },
  { title: "Polyline", type: "continuous line" },
  { title: "Pin", type: "pin" },
  { title: "Rectangle", type: "rect" },
  { title: "Delete", type: "delete" },
  { title: "Clear", type: "clear" },
];

const ControlBar = ({
  activeType,
  currentPosition,
  setType,
  deleteLines,
  clear,
}: {
  activeType: string;
  currentPosition: coordinate | null;
  setType: (type: string) => void;
  deleteLines: () => void;
  clear: () => void;
}) => {
  return (
    <nav className="flex max-w-7xl items-center bg-gray-700 py-1 ml-32 mr-auto">
      <div className="flex">
        {controlButtons.map((button) => (
          <ControlButton
            key={button.title}
            title={button.title}
            type={button.type}
            active={activeType === button.type}
            setType={setType}
            deleteLines={deleteLines}
            clear={clear}
          />
        ))}
      </div>
      {currentPosition && (
        <CoordinateDisplay currentPosition={currentPosition} />
      )}
    </nav>
  );
};

const ControlButton = ({
  title,
  type,
  active,
  setType,
  deleteLines,
  clear,
}: {
  title: string;
  type: string;
  active: boolean;
  setType: (type: string) => void;
  deleteLines: () => void;
  clear: () => void;
}) => {
  const handleClick = () => {
    if (type === "delete") {
      deleteLines();
      return;
    } else if (type === "clear") {
      clear();
    } else {
      setType(type);
    }
  };

  return (
    <button
      className={cn(
        "flex-0 mr-1 flex h-8 w-24 items-center justify-center rounded-md bg-gray-500 text-white hover:bg-gray-200 hover:text-gray-900",
        active && "bg-gray-200 text-gray-900",
      )}
      title={title}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

const CoordinateDisplay = ({
  currentPosition,
}: {
  currentPosition: coordinate;
}) => {
  return (
    <div className="ml-auto flex basis-44 items-center justify-center rounded-md bg-gray-200/70 text-gray-900">
      <p className="flex h-full w-6 items-center justify-center rounded-l-md border border-gray-700/30 align-middle">
        x
      </p>
      <p className="flex h-full w-16 items-center justify-center border border-l-0 border-r-8 border-gray-700/30 align-middle">
        {currentPosition.x.toFixed(2)}
      </p>
      <p className="flex h-full w-6 items-center justify-center border border-r-0 border-gray-700/30 align-middle">
        y
      </p>
      <p className="flex h-full w-16 items-center justify-center rounded-r-md border border-gray-700/30 align-middle">
        {currentPosition.y.toFixed(2)}
      </p>
    </div>
  );
};

export default ControlBar;
