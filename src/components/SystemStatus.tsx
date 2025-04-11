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
    { icon: <FaTachometerAlt />, label: "Speed", value: `${speed}` },
    { icon: <FaArrowUp />, label: "Altitude", value: `${altitude}` },
    { icon: <FaWater />, label: "Depth", value: `${depth}` },
    { icon: <FaCompass />, label: "Orientation", value: `${orientation}°` },
  ];

  return (
    <div className="space-y-2">
      <div className="font-semibold">System Status</div>
      <div className="grid grid-cols-2 gap-2">
        {statusItems.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center bg-zinc-700 p-2 rounded-lg"
          >
            <div className="text-white mr-2">{icon}</div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-300">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
