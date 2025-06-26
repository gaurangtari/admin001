"use client";
import { SocketContext } from "@/context";
import { SocketContextProps } from "@/types/contextTypes";
import React, { FC, useContext } from "react";
import SystemStatus from "./SystemStatus";
import dynamic from "next/dynamic";
const MiniMap = dynamic(() => import("./MiniMap"), { ssr: false });

interface VideoFeedProps {
  speed: number;
  altitude: number;
  depth: number;
  orientation: number;
  latitude: number;
  longitude: number;
}

const VideoFeed: FC<VideoFeedProps> = ({
  speed,
  altitude,
  depth,
  orientation,
  latitude,
  longitude,
}) => {
  const { myVideo } = useContext(SocketContext) as SocketContextProps;

  return (
    <div className="relative h-full w-full bg-zinc-800 rounded-lg overflow-hidden">
      <video
        playsInline
        muted
        ref={myVideo}
        autoPlay
        className="h-full w-full"
      />

      {/* overlay status */}
      <div className="absolute bottom-2 right-2">
        <SystemStatus
          speed={speed}
          altitude={altitude}
          depth={depth}
          orientation={orientation}
        />
      </div>

      {/* overlay minimap */}
      <div className="absolute bottom-2 left-2">
        <MiniMap latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
};

export default VideoFeed;
