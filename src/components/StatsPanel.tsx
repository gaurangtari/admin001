import React, { FC } from "react";

const StatsPanel: FC = () => {
  const batteryLevel = 100; // percentage

  return (
    <div className=" rounded-lg w-75 h-30 bg-zinc-800 p-4 mx-2 space-y-4">
      <div className="space-y-2 ">
        <div className="font-semibold">User</div>
        <div className="text-xl font-bold text-grey-100">Name_Placeholder</div>
      </div>
    </div>
  );
};

export default StatsPanel;
