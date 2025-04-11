import React, { FC } from "react";
import Joystick from "./Joystick";

const ControlsPanel: FC = () => (
  <div className="bg-gray-800 p-4">
    <Joystick />
  </div>
);

export default ControlsPanel;
