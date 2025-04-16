"use client";
import type { NextPage } from "next";
import Head from "next/head";
import TopBar from "../components/TopBar";
import VideoFeed from "../components/VideoFeed";
import LogoPanel from "@/components/LogoPanel";
import CallNotification from "@/components/CallNotification";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context";
import ConnectedUser from "../components/ConnectedUser";
import { ref, set, onValue, off } from "firebase/database";
import { ConnectionStatus } from "@/types/contextTypes";
import { rtdb } from "@/firebase";

const Home: NextPage = () => {
  const { call, stream, answerCall, rovState } = useContext(SocketContext);
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
              speed={rovState?.body_velocity?.x.toFixed(2)}
              depth={rovState?.position?.depth.toFixed(2)}
              orientation={rovState?.orientation?.z.toFixed(2)}
              altitude={1}
              latitude={15.456726}
              longitude={73.803051}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <ConnectedUser connectedUserName={connectionStatus.connectedUser} />
            <LogoPanel />
            {call.isReceivingCall && (
              <CallNotification
                callerName={call.name}
                onAccept={answerCall}
                onDecline={() => console.log("call declined")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
