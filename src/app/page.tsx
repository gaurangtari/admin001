import type { NextPage } from "next";
import Head from "next/head";
import TopBar from "../components/TopBar";
import VideoFeed from "../components/VideoFeed";
import StatsPanel from "../components/StatsPanel";
import ControlsPanel from "../components/ControlPanel";

const Home: NextPage = () => (
  <>
    <Head>
      <title>ROV Dashboard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="flex flex-col h-screen bg-zinc-900 text-white px-4">
      <TopBar />
      <div className="flex justify-between flex-1">
        <div className=" px-2 space-y-4">
          <VideoFeed />
        </div>
        <StatsPanel />
      </div>
    </div>
  </>
);

export default Home;
