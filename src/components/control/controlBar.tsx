import { cn } from "~/utils/cn";

const controlButtons = [
  { title: "View", type: "view" },
  { title: "Line", type: "line" },
  { title: "Continuous Line", type: "continuous line" },
  { title: "Pin", type: "pin" },
  { title: "Rectangle", type: "rect" },
  { title: "Delete", type: "delete" },
  { title: "Clear", type: "clear" },
];

const ControlBar = ({
  activeType,
  setType,
  deleteLines,
}: {
  activeType: string;
  setType: (type: string) => void;
  deleteLines: () => void;
}) => {
  return (
    <nav className="flex bg-gray-700 px-4 py-1">
      {controlButtons.map((button) => (
        <ControlButton
          key={button.title}
          title={button.title}
          type={button.type}
          active={activeType === button.type}
          setType={setType}
          deleteLines={deleteLines}
        />
      ))}
    </nav>
  );
};

const ControlButton = ({
  title,
  type,
  active,
  setType,
  deleteLines,
}: {
  title: string;
  type: string;
  active: boolean;
  setType: (type: string) => void;
  deleteLines: () => void;
}) => {
  const handleClick = () => {
    if (type === "delete") {
      deleteLines();
      return;
    } else {
      setType(type);
    }
  };
  return (
    <button
      className={cn(
        "mr-1 flex h-14 w-24 items-center justify-center rounded-md bg-gray-500 text-white hover:bg-gray-200 hover:text-gray-900",
        active && "bg-gray-200 text-gray-900",
      )}
      title={title}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default ControlBar;
