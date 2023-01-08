import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function ViewMeeting() {
  const { Moralis } = useMoralis();
  const router = useRouter();

  const [room, setRoom] = useState([]);

  const { id } = router.query;

  useEffect(() => {
    const Notifications = new Moralis.Object.extend("Notifications");
    const query = new Moralis.Query(Notifications);
    query.equalTo("objectId", id);
    query.first().then((result) => {
      setRoom(result.get("room").data.roomUrl);
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
    <div className="w-full items-center justify-center">
      <iframe
        className="h-screen w-full"
        src={room}
        allow="camera; microphone; fullscreen; speaker; display-capture"
      ></iframe>
    </div>
  );
}
