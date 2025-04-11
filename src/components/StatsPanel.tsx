import React, { FC } from "react";
import ResolutionSelector from "./ResolutionSelector";
import SystemStatus from "./SystemStatus";

const StatsPanel: FC = () => {
  const batteryLevel = 100; // percentage

  return (
    <div className=" rounded-lg w-100 bg-neutral-700 p-4 mx-2 space-y-4">
      <div className="space-y-2 ">
        <div className="font-semibold">User</div>
        <div className="text-sm text-gray-400">Battery</div>
        <div className="w-full bg-gray-700 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${batteryLevel}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span>280V/480V</span>
          <span>27°C</span>
        </div>
      </div>
      <SystemStatus speed={1} altitude={10} depth={5} orientation={0} />
    </div>
  );
};

export default StatsPanel;
