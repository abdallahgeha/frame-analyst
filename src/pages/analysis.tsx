import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("../components/drawingCanvas"), {
  ssr: false,
});

export default function TestsPage() {
  return (
    <div className="h-screen w-full bg-slate-50 p-36">
      <div className="mx-auto h-[600px] w-[800px] bg-slate-800">
        <NoSSRComponent />
      </div>
    </div>
  );
}
