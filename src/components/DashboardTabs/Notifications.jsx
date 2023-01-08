import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import NotificationList from "../NotificationList";

export default function Videocalls() {
  const {
    user,
    isAuthenticated,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
  } = useMoralis();
  const [notifications, setNotifications] = useState([]);

  // SCHEDULE TIMES
  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    const Schedule = Moralis.Object.extend("Schedules");

    const query = new Moralis.Query(Schedule);
    query.equalTo("to", user.get("ethAddress"));
    query.find().then((result) => {
      setNotifications(result);
    });
  }, [user]);

  const [xyz, setXYZ] = useState([]);

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    const Notifications = Moralis.Object.extend("Notifications");
    const query = new Moralis.Query(Notifications);
    query.equalTo("to", user.get("ethAddress").toLowerCase());
    query.addDescending("meetingDate");
    query.find().then((result) => {
      setXYZ(result);
    });
  }, [user]);

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden w-full">
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Announcements and invitations powered by XMTP
            </p>
            <br></br>
            <hr></hr>
            <p className="mt-1 text-xs text-gray-500">
              Notifications are powered by the extensible message transport
              protocol, XMTP.
            </p>
            <br></br>
          </div>
        </div>
        {xyz.map((data, index) => {
          return <NotificationList data={data} key={index} />;
        })}
      </div>
    </div>
  );
}
