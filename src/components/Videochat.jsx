import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import BackButton from "./BackButton";
import HeaderVid from "./HeaderVid";

export default function Videochat() {
  const { user } = useMoralis();

  const [room, setRoom] = useState();

  useEffect(() => {
    if (user.get("room")) {
      setRoom(JSON.parse(user.get("room")));
    }
  }, [user]);

  return (
    <div className="flex flex-col w-full">
      <HeaderVid />
      <BackButton />
      {/* <div className="fixed top-24 inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
        <button className="bg-indigo-600 items-center flex flex-row border border-transparent rounded-md shadow-sm py-2 px-4 justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <ArrowCircleLeftIcon className="h-4 mr-2" />
          Back
        </button>
      </div> */}

      <div className="w-full items-center justify-center">
        {/* {JSON.stringify(room)} */}
        <iframe
          className="h-screen w-full"
          src={room?.hostRoomUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
        ></iframe>
      </div>
    </div>
  );
}
