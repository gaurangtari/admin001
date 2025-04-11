"use client";
import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import Peer, { SignalData, Instance } from "simple-peer";
import { ref, set } from "firebase/database";
import { rtdb } from "./firebase";
import {
  CallState,
  ConnectionStatus,
  SocketContextProps,
} from "./types/contextTypes";
import { socket } from "./socket";

const SocketContext = createContext<SocketContextProps>(
  {} as SocketContextProps
);

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [name, setName] = useState("");
  const [call, setCall] = useState<CallState>({});
  const [me, setMe] = useState("");
  const [vehicleState, setVehicleState] = useState<Record<string, any>>({});
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connectedUser: "",
    status: false,
  });

  const adminIdRef = ref(rtdb, "admin-id");
  const adminHeartbeatRef = ref(rtdb, "heartbeat/admin");
  const connectionStatusRef = ref(rtdb, "connection-status");

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Instance>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    // Register the "me" event listener before connecting
    socket.on("me", (id: string) => {
      console.log("my admin id is:", id);
      set(adminIdRef, id);
      setMe(id);
    });

    // Register other listeners if needed
    socket.on("callUser", ({ from, name: callerName, signal }: CallState) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    // Now connect the socket
    socket.connect();
  }, []);

  // Other useEffect hooks and functions remain unchanged...
  useEffect(() => {
    set(connectionStatusRef, connectionStatus);
  }, [connectionStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      const heartbeat = Date.now();
      set(adminHeartbeatRef, { heartbeat });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  // Answer call functionality
  const answerCall = () => {
    setCallAccepted(true);
    setCall({ isReceivingCall: false });

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data: SignalData) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("connect", () => {
      setConnectionStatus({ connectedUser: call.name || "", status: true });
    });

    peer.on("close", () => {
      console.log("connection closed");
    });

    peer.on("error", (err: Error) => {
      console.error("ERROR:", err);
      setConnectionStatus({ connectedUser: "", status: false });
    });

    if (call.signal) peer.signal(call.signal);
    connectionRef.current = peer;
  };

  socket.on("hungup", () => {
    connectionRef.current?.destroy();
  });

  const callUser = (id: string) => {
    if (!stream) return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data: SignalData) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal: SignalData) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        vehicleState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
