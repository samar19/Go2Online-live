import { useState } from "react";
import PoapItem from "./PoapItem";

export default function PoapCP() {
  const [poaps, setPoaps] = useState([]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto py-2">
        <PoapItem />
      </div>
    </div>
  );
}
