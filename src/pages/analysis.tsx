import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { set } from "zod";
import ControlBar from "~/components/control/controlBar";
import {
  LineType,
  RectType,
  coordinate,
  pinWithId,
} from "~/types/shapes.types";

const NoSSRComponent = dynamic(() => import("../components/drawingCanvas"), {
  ssr: false,
});

type KeyActions = (event: KeyboardEvent) => void;
export default function TestsPage() {
  const pageRef = useRef<KeyActions>();
  const [type, setType] = useState("line");
  const [lines, setLines] = useState<LineType[]>([]);
  const [pins, setPins] = useState<pinWithId[]>([]);
  const [rects, setRects] = useState<RectType[]>([]);
  const [currentPosition, setCurrentPosition] = useState<coordinate | null>(
    null,
  );
  const unselect = () => {
    const unselectedLines = lines.map((line) => {
      return { ...line, active: false };
    });
    const unselectedPins = pins.map((pin) => {
      return { ...pin, active: false };
    });
    const unselectedRects = rects.map((rect) => {
      return { ...rect, active: false };
    });

    setLines(unselectedLines);
    setPins(unselectedPins);
    setRects(unselectedRects);
  };

  const deleteLines = () => {
    const undeletedLines = lines.filter((line) => !line.active);
    const undeletedPins = pins.filter((pin) => !pin.active);
    const undeletedRects = rects.filter((rect) => !rect.active);
    setLines(undeletedLines);
    setPins(undeletedPins);
    setRects(undeletedRects);
  };

  const clear = () => {
    setLines([]);
    setPins([]);
    setRects([]);
  };

  pageRef.current = (event: KeyboardEvent) => {
    if (event.key === "l") {
      setType("line");
    } else if (event.key === "c") {
      setType("continuous line");
    } else if (event.key === "Escape") {
      unselect();
      setType("view");
    } else if (event.key === "Enter") {
      const previousType = type;
      setType("view");
      setType(previousType);
    } else if (event.key === "d") {
      deleteLines();
    } else if (event.key === "p") {
      setType("pin");
    } else if (event.key === "r") {
      setType("rect");
    } else if (event.key === "x") {
      clear();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    pageRef.current!(event);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-gray-700">
      <ControlBar
        currentPosition={currentPosition}
        setType={setType}
        deleteLines={deleteLines}
        activeType={type}
        clear={clear}
      />
      <div
        className="bg-slate-800"
        style={{ width: `calc(100vw)`, height: `calc(100vh - 60px)` }}
      >
        <NoSSRComponent
          type={type}
          lines={lines}
          pins={pins}
          rects={rects}
          setRects={setRects}
          setLines={setLines}
          setPins={setPins}
          setCurrentPosition={setCurrentPosition}
        />
      </div>
      <div className="flex bg-gray-700 px-4 text-white">
        <p className="text-sm w-24">Lines: {lines.length}</p>
        <p className="text-sm w-24">Pins: {pins.length}</p>
        <p className="text-sm w-24">Rectangles: {rects.length}</p>
      </div>
    </div>
  );
}
