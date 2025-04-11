"use client";
import { SocketContext } from "@/context";
import { SocketContextProps } from "@/types/contextTypes";
import React, { FC, useContext } from "react";

const VideoFeed: FC = () => {
  const { myVideo, stream, call } = useContext(
    SocketContext
  ) as SocketContextProps;
  return (
    <div className="relative bg-zinc-800 rounded-lg overflow-hidden">
      <video playsInline muted ref={myVideo} autoPlay />
      <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-50 p-1 rounded">
        ...
      </div>
    </div>
  );
};

export default VideoFeed;
