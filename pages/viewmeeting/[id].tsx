import type { NextPage } from "next";
import Head from "next/head";
import Login from "../../src/components/Login";
import ViewMeeting from "../../src/components/ViewMeeting";
import Header from "../../src/components/Header";
import { useMoralis } from "react-moralis";

const Home: NextPage = () => {
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated) return <Login />;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Go2Online Videocall</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ViewMeeting />
    </div>
  );
};

export default Home;
