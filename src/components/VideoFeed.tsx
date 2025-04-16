"use client";
import { SocketContext } from "@/context";
import { SocketContextProps } from "@/types/contextTypes";
import React, { FC, useContext } from "react";
import SystemStatus from "./SystemStatus";
import MiniMap from "./MiniMap";

interface VehicleStateProps {
  speed: number;
  altitude: number;
  depth: number;
  orientation: number;
  latitude: number;
  longitude: number;
}

const VideoFeed: FC<VehicleStateProps> = ({
  speed,
  altitude,
  depth,
  orientation,
  latitude,
  longitude,
}) => {
  const { myVideo } = useContext(SocketContext) as SocketContextProps;
  return (
    <div className="relative bg-zinc-800 rounded-lg overflow-hidden">
      <video playsInline muted ref={myVideo} autoPlay />
      <div className="absolute bottom-2 right-2  bg-opacity-50 p-1 rounded">
        <SystemStatus
          speed={speed}
          altitude={altitude}
          depth={depth}
          orientation={orientation}
        />
      </div>
      <div className="absolute bottom-2 left-2">
        <MiniMap latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
};

export default VideoFeed;
