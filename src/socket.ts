import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  process.env.NEXT_PUBLIC_SIGNALLING_SERVER_URL,
  {
    autoConnect: false,
  }
);
