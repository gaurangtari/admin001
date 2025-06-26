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
  BlueROVState,
  CallState,
  ConnectionStatus,
  SocketContextProps,
  DVLState,
} from "./types/contextTypes";
import { socket } from "./socket";
import ROSLIB from "roslib";

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

  const [rovState, setRovState] = useState<BlueROVState | null>(null);

  // Get media stream and connect to the socket
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id: string) => {
      console.log("my admin id is:", id);
      set(adminIdRef, id);
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, signal }: CallState) => {
      if (signal.sdp.includes("m=video")) {
        setCall({ isReceivingCall: false, from, name: callerName, signal });
      } else {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
        console.log("call", call);
      }
    });

    socket.connect();
  }, []);

  // Auto answer when the full offer comes
  useEffect(() => {
    if (call.signal?.sdp.includes("m=video")) {
      answerCall();
    }
  }, [call]);

  //Send connction status to firebase
  useEffect(() => {
    set(connectionStatusRef, connectionStatus);
  }, [connectionStatus]);

  //Send heartbeat to firebase
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

  //Connect to ROS topics
  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: "ws://172.27.101.71:9090",
    });

    ros.on("connection", () => console.log("Connected to ROS"));
    ros.on("error", (error: any) =>
      console.error("ROS Connection Error:", error)
    );
    ros.on("close", () => console.log("Disconnected from ROS"));

    const stateTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/bluerov_heavy0/nav/filter/state",
      messageType: "auv_msgs/NavigationStatus",
    });

    const dvlTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/bluerov_heavy0/dvl",
      messageType: "uuv_sensor_ros_plugins_msgs/DVL",
    });

    stateTopic.subscribe((message) => {
      // console.log(message);
      setRovState({
        altitude: message.altitude,
        orientation: message.orientation.z,
        speed: message.body_velocity.x,
        depth: message.position.depth,
        latitude: message.global_position.latitude,
        longitude: message.global_position.longitude,
      });
    });

    return () => {
      stateTopic.unsubscribe();
      ros.close();
    };
  }, []);

  //***************************************************** ANSWER CALL *********************************************************************** */

  const declineCall = (from: string) => {
    setCallAccepted(false);
    setCall({ isReceivingCall: false });
    socket.emit("callDeline", true, from);
  };

  const answerCall = () => {
    setCallAccepted(true);
    setCall({ isReceivingCall: false });

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    console.log("call details inside answercall function", call);

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
        rovState,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        declineCall,
        vehicleState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
