import { useMoralis } from "react-moralis";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addLocale(en);

export default function Notif() {
  const { Moralis, user } = useMoralis();
  const [alerts, setAlerts] = useState([]);
  const subscribeToNotifications = useRef();
  const router = useRouter();
  const timeAgo = new TimeAgo("en-US");
  const [updateNotifications, setUpdateNotifications] = useState(new Date());

  //Live Query for Notifications
  useEffect(() => {
    async function getNotifications() {
      const Notification = Moralis.Object.extend("Notification");
      const query = new Moralis.Query(Notification);
      query.equalTo("to", user);
      query.descending("createdAt");
      subscribeToNotifications.current = await query.subscribe();
      subscribeToNotifications.current.on("create", (object) => {
        setUpdateNotifications(new Date());
      });
    }
    if (user) getNotifications();

    return function cleanup() {
      if (subscribeToNotifications.current)
        subscribeToNotifications.current.unsubscribe();
    };
  }, [user]);

  //Query initial Notifications
  //   useEffect(() => {
  // if (user) {
  //   const Notification = Moralis.Object.extend('Notification')
  //   const query = new Moralis.Query(Notification)
  //   query.equalTo('to', user)
  //   query.descending('createdAt')
  //   query.find().then((results) => {

  //   })
  // }
  //     if (user) {
  //       Moralis.Cloud.run("getNotifications", { id: user.id }).then((results) => {
  //         console.log(results);
  //         setAlerts(results);
  //       });
  //     }
  //   }, [user, updateNotifications]);

  const viewNotification = async (n) => {
    if (n.get("actionId") != "" && n.get("action") == "chat request") {
      router.push(`/videochat/${n.get("actionid")}`);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto py-2">
        <div className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-xl h-96 text-white">
          <ul role="list" className="mx-4 divide-y divide-gray-200">
            {alerts.map((activityItem) => (
              <li
                key={activityItem.id}
                className="cursor-pointer py-4"
                onClick={() => viewNotification(activityItem)}
              >
                <div className="flex space-x-3">
                  <img
                    className="h-6 w-6 rounded-full"
                    src={activityItem.get("from").get("profileImg")}
                    alt=""
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        {`${activityItem
                          .get("from")
                          .get("firstName")} ${activityItem
                          .get("from")
                          .get("lastName")}`}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      {activityItem.get("message")}
                    </p>
                    <p className="text-sm text-gray-300">
                      {timeAgo.format(activityItem.get("createdAt"))}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
