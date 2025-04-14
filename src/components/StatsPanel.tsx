import React, { FC } from "react";

const StatsPanel: FC = () => {
  const batteryLevel = 100; // percentage

  return (
    <div className=" rounded-lg w-100 bg-zinc-800 p-4 mx-2 space-y-4">
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
    </div>
  );
};

export default StatsPanel;
