import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { LineType } from "~/types/shapes.types";

const NoSSRComponent = dynamic(() => import("../components/drawingCanvas"), {
  ssr: false,
});

type KeyActions = (event: KeyboardEvent) => void;
export default function TestsPage() {
  const pageRef = useRef<KeyActions>();
  const [type, setType] = useState("line");
  const [lines, setLines] = useState<LineType[]>([]);

  const unselect = () => {
    const unselected = lines.map((line) => {
      return { ...line, active: false };
    });

    setLines(unselected);
  };

  const deleteLines = () => {
    const undeletedLines = lines.filter(line => !line.active)
    setLines(undeletedLines);
  }

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
      deleteLines()
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
    <div className="h-screen w-full bg-slate-50">
    <div className="bg-slate-800" style={{ width: `calc(100vw - 40px)`, height: `calc(100vh - 60px)` }}>
        <NoSSRComponent type={type} setLines={setLines} lines={lines} />
      </div>
    </div>
  );
}
