import dynamic from "next/dynamic";
import { useState } from "react";
import ControlBar from "~/components/control/controlBar";
import History from "~/components/history/history";
import { useAnalysisPage } from "~/hooks/useAnalysisPage.hook";
import type { coordinate } from "~/types/shapes.types";

const NoSSRComponent = dynamic(() => import("../components/drawingCanvas"), {
  ssr: false,
});

export default function TestsPage() {
  const { lines, pins, rects } = useAnalysisPage();
  const [currentPosition, setCurrentPosition] = useState<coordinate>();

  return (
    <div className="h-screen w-full bg-gray-700">
      <ControlBar currentPosition={currentPosition} />
      <div className="flex">
        <div
          className="bg-slate-800"
          style={{ width: `calc(100vw)`, height: `calc(100vh - 64px)` }}
        >
          <NoSSRComponent setCurrentPosition={setCurrentPosition} />
        </div>
        <History />
      </div>
      <div className="flex bg-gray-700 px-4 text-white">
        <p className="w-24 text-sm">
          Lines: {lines.length} ({lines.filter((line) => line.active).length})
        </p>
        <p className="w-24 text-sm">
          Pins: {pins.length} ({pins.filter((pin) => pin.active).length})
        </p>
        <p className="w-24 text-sm">
          Rectangles: {rects.length} (
          {rects.filter((rect) => rect.active).length})
        </p>
      </div>
    </div>
  );
}
