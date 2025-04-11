import React, { FC } from "react";

const options: string[] = ["1920x1080", "1280x720", "854x480", "640x360"];

const ResolutionSelector: FC = () => (
  <div className="space-y-2">
    <div className="font-semibold">Resolution</div>
    {options.map((opt) => (
      <button
        key={opt}
        className="w-full text-left px-2 py-1 bg-gray-700 rounded"
      >
        {opt}
      </button>
    ))}
  </div>
);

export default ResolutionSelector;
