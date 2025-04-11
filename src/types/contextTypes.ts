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
  vehicleState: Record<string, any>;
}
