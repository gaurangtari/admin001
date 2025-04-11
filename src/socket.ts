// socket.ts (or wherever you define the global socket)
import { io, Socket } from "socket.io-client";

// Disable auto connection
export const socket: Socket = io("localhost:8080", { autoConnect: false });
