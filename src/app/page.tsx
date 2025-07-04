"use client";
import type { NextPage } from "next";
import Head from "next/head";
import TopBar from "../components/TopBar";
import VideoFeed from "../components/VideoFeed";
import LogoPanel from "@/components/LogoPanel";
import CallNotification from "@/components/CallNotification";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "@/context";
import ConnectedUser from "../components/ConnectedUser";
import { ref, set, onValue, off } from "firebase/database";
import { ConnectionStatus } from "@/types/contextTypes";
import { rtdb } from "@/firebase";

const Home: NextPage = () => {
  const { call, answerCall, rovState, declineCall } = useContext(SocketContext);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connectedUser: "",
    status: false,
  });
  const connectionStatusRef = ref(rtdb, "connection-status");

  useEffect(() => {
    const onValueChange = onValue(connectionStatusRef, (snapshot) => {
      const data = snapshot.val();
      setConnectionStatus(data);
    });
    return () => off(connectionStatusRef);
  }, []);

  const handleCallDecline = () => {
    declineCall(call.from);
  };

  const alertAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!alertAudioRef.current) {
      const audio = new Audio("/call_tune.mp3");
      audio.volume = 1;
      audio.loop = true;
      alertAudioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    const unlock = () => {
      const a = alertAudioRef.current!;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
        })
        .catch(() => {});
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, []);

  useEffect(() => {
    const audio = alertAudioRef.current!;
    if (call.isReceivingCall) {
      audio.play().catch((err) => console.warn("Play blocked:", err));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [call.isReceivingCall]);

  return (
    <>
      <Head>
        <title>ROV Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col h-screen bg-zinc-900 text-white px-4">
        <TopBar />
        <div className="flex justify-between flex-1">
          <div className=" px-2 space-y-4">
            <VideoFeed
              speed={rovState?.speed.toFixed(2)}
              depth={rovState?.depth.toFixed(2)}
              orientation={rovState?.orientation?.toFixed(2)}
              altitude={rovState?.altitude.toFixed(2)}
              latitude={rovState?.latitude}
              longitude={rovState?.longitude}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <ConnectedUser connectedUserName={connectionStatus.connectedUser} />
            <LogoPanel />
            {call.isReceivingCall && (
              <CallNotification
                callerName={call.name}
                onAccept={answerCall}
                onDecline={handleCallDecline}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
