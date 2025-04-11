import React, { FC } from "react";

const Joystick: FC = () => (
  <div className="grid grid-cols-3 grid-rows-3 gap-1 w-32 h-32">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className={`flex items-center justify-center ${
          i === 4 ? "bg-gray-600" : "bg-gray-700"
        } rounded`}
      />
    ))}
  </div>
);

export default Joystick;
