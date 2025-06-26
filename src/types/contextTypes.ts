import exp from "constants";
import { SignalData } from "simple-peer";

export interface CallState {
  isReceivingCall?: boolean;
  from?: string;
  name?: string;
  signal?: SignalData;
}
export interface ConnectionStatus {
  connectedUser: string;
  status: boolean;
}

export interface SocketContextProps {
  call: CallState;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
  declineCall: (from?: string) => void;
  vehicleState: Record<string, any>;
}

export interface BlueROVState {
  altitude: number;
  orientation: number;
  speed: number;
  depth: number;
  latitude: number;
  longitude: number;
}

export interface DVLState {
  range: number;
  range_covariance: number;
  velocity: number;
  velocity_covariance: number;
  header?: {
    seq: number;
    stamp: { secs: number; nsecs: number };
    frame_id: string;
  };

  position?: {
    x: number;
    y: number;
    z: number;
  };
}
