import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NoSSRComponent = dynamic(() => import("../components/drawingCanvas"), {
  ssr: false,
});

export default function TestsPage() {
  const [type, setType] = useState("line");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "l") {
        setType("line");
      } else if (event.key === "c") {
        setType("continuous line");
      } else if (event.key === "Escape") {
        setType("view");
      } else if (event.key === "Enter") {
        const previousType = type;
        setType("view");
        setType(previousType);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-slate-50 p-20">
      <div className={`h-[700}px] w-[1200px] bg-slate-800`}>
        <NoSSRComponent type={type} />
      </div>
    </div>
  );
}
