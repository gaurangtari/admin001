import React, { FC } from "react";
import { FaTachometerAlt, FaArrowUp, FaWater, FaCompass } from "react-icons/fa";

interface SystemStatusProps {
  speed: number; // in m/s or km/h
  altitude: number; // in meters
  depth: number; // in meters
  orientation: number; // in degrees (0-360)
}

const SystemStatus: FC<SystemStatusProps> = ({
  speed,
  altitude,
  depth,
  orientation,
}) => {
  const statusItems = [
    {
      icon: <FaTachometerAlt />,
      label: "Speed",
      value: `${speed} m/s`,
    },
    { icon: <FaArrowUp />, label: "Altitude", value: `${altitude}m` },
    { icon: <FaWater />, label: "Depth", value: `${depth}m` },
    { icon: <FaCompass />, label: "Orientation", value: `${orientation}°` },
  ];

  return (
    <div className="space-y-2 ">
      <div className="grid gap-2 ">
        {statusItems.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center bg-zinc-800/75 bg-opacity-50 p-2 h-20 w-30 rounded-xl"
          >
            <div className="text-white mr-2">{icon}</div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-200">{label}</span>
              {value !== "undefined" ? (
                <span className="font-medium text-xl"> {value}</span>
              ) : (
                <span className="font-medium">...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
