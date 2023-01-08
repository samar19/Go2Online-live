import type { NextPage } from "next";
import Head from "next/head";
import Login from "../../src/components/Login";
import CreatePoap from "../../src/components/CreatePoap";
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
      <Header />
      <div className=" w-full flex flex-col items-center justify-center sm:w-9/12">
        <CreatePoap />
      </div>
    </div>
  );
};

export default Home;
