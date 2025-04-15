// components/Compass.tsx
import React, { FC } from "react";

interface CompassProps {
  /** Heading in degrees (0–359) */
  orientation: number;
  /** Size in pixels (width & height) */
  size?: number;
}

const Compass: FC<CompassProps> = ({ orientation, size = 80 }) => {
  // Cardinal labels
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirIndex = Math.round(orientation / 45) % 8;
  const dirLabel = directions[dirIndex];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="block">
        {/* Rotating ring: circle + tick marks */}
        <g transform={`rotate(${orientation},50,50)`}>
          {/* Outer circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="#ffffff"
            strokeWidth="3"
            fill="none"
          />

          {/* Tick marks every 10°, major every 90° */}
          {[...Array(36)].map((_, i) => {
            const angle = i * 10;
            const isMajor = i % 9 === 0;
            const len = isMajor ? 9 : 5;
            return (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2={10 + len}
                stroke={isMajor ? "#70a6ec" : "#9ca3af"}
                strokeWidth={isMajor ? 3 : 1}
                transform={`rotate(${angle},50,50)`}
              />
            );
          })}
        </g>
      </svg>

      {/* Centered text: degrees + cardinal */}
      <div className="pt-2 absolute inset-0 flex flex-col items-center justify-center space-y-0 pointer-events-none">
        <span className="text-[#70a6ec] text-lg font-bold leading-none">
          {Math.round(orientation)}°
        </span>
        <span className="text-gray-200 text-sm leading-none">{dirLabel}</span>
      </div>
    </div>
  );
};

export default Compass;
