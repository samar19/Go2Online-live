import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import BackButton from "./BackButton";
import HeaderVid from "./HeaderVid";

export default function Videochat() {
  const { user, Moralis } = useMoralis();
  const router = useRouter();

  const [room, setRoom] = useState([]);

  const { id } = router.query;

  useEffect(() => {
    const Schedules = new Moralis.Object.extend("Schedules");
    const query = new Moralis.Query(Schedules);
    query.equalTo("objectId", id);
    query.first().then((result) => {
      setRoom(result.get("room").data.hostRoomUrl);
      console.log(room);
    });
    // alert("id");
  }, []);

  // useEffect(() => {
  //   if (user.get("room")) {
  //     setRoom(JSON.parse(user.get("room")));
  //   }
  // }, [user]);

  return (
    <div className="flex flex-col w-full">
      <HeaderVid />
      <BackButton />

      <div className="w-full items-center justify-center">
        <iframe
          className="h-screen w-full"
          src={room}
          allow="camera; microphone; fullscreen; speaker; display-capture"
        ></iframe>
      </div>
    </div>
  );
}
