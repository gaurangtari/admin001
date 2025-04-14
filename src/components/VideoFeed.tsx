"use client";
import { SocketContext } from "@/context";
import { SocketContextProps } from "@/types/contextTypes";
import React, { FC, useContext } from "react";
import SystemStatus from "./SystemStatus";
import MiniMap from "./MiniMap";

const VideoFeed: FC = () => {
  const { myVideo, stream, call } = useContext(
    SocketContext
  ) as SocketContextProps;
  return (
    <div className="relative bg-zinc-800 rounded-lg overflow-hidden">
      <video playsInline muted ref={myVideo} autoPlay />
      <div className="absolute bottom-2 right-2  bg-opacity-50 p-1 rounded">
        <SystemStatus speed={1} altitude={10} depth={5} orientation={0} />
      </div>
      <div className="absolute bottom-2 left-2">
        <MiniMap latitude={15.456726} longitude={73.803051} />
      </div>
    </div>
  );
};

export default VideoFeed;
