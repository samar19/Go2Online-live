import { useRouter } from "next/router";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
export default function Videocalls(props) {
  const { user, Moralis } = useMoralis();
  const router = useRouter();

  function startCall(e) {
    e.preventDefault();

    if (user.get("room") == null || "(undefined)") {
      createRoom();
    } else {
      sendNotifications();
      // send invites to particpant addresses.
    }
  }

  async function sendNotifications() {
    const room = user.get("room");
    Moralis.Cloud.run("getUser", { address: user.get("ethAddress") }).then(
      (results) => {
        results.forEach((result) => {
          const Message = new Moralis.Object.extend("Notifications");
          const message = new Message();
          message.set("from", user.get("ethAddress"));
          message.set("to", result.id);
          message.set("meetingName", "Live Meeting");
          message.set("meetingDate", new Date());
          message.set(
            "meetingFile",
            "https://ipfs.moralis.io:2053/ipfs/QmNdhrdFfbYzQjRWjiS3mdrw3E2sVvj6q94tPBhsrPvmR3"
          );
          message.set("meetingTitle", "Live Meeting");
          message.set("meetingDescription", "Live Meeting");
          message.set("tokenId", "0");
          message.set("accepted", true);
          message.set(
            "team",
            user.get("team") ? user.get("team") : user.get("ethAddress")
          );
          console.log(user.get("room"));
          message.set("room", JSON.parse(user.get("room")));
          message.save().then(async (meeting) => {
            const address = ethers.utils.getAddress(meeting.get("to"));
            const conversation =
              await props.xmtpClient.conversations.newConversation(address);
            // Send a message
            try {
              await conversation.send(JSON.stringify(meeting));
            } catch (error) {
              console.log(error);
            }
          });
        });
        router.push("/videochat");
      }
    );
  }

  const [room, setRoom] = useState(user.get("room"));
  const createRoom = async (e) => {
    const result = await Moralis.Cloud.run("createMeeting", {
      endDate: "2099-02-18T14:23:00.000Z",
    });
    setRoom(JSON.stringify(result.data));
    if (result.status == 201) {
      const Teams = new Moralis.Object.extend("Teams");
      const teams = new Teams();
      user.set("room", room);
      user.save();
      teams.set("room", room);
      await teams.save();
      sendNotifications();
    }
  };

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden w-full">
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Videocalls
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Set up a group call with your friends or organisation.
            </p>
            <br></br>
            <hr></hr>
            <p className="mt-1 text-xs text-gray-500">
              Pro features include: unlimited calls, unlimited storing of past
              calls on ipfs with timestamps for reviewing specific parts of
              meetings, poaps for team members and direct messaging features via
              xmtp.
            </p>
            <br></br>
          </div>
        </div>

        {/* NAME */}

        <div className="grid grid-cols-3 gap-6">
          {/* Participants */}
          <div className="col-span-3 sm:col-span-2">
            <label
              htmlFor="company-website"
              className="block text-sm font-medium text-gray-700"
            >
              Your Team
            </label>
            <label
              htmlFor="company-website"
              className="block text-sm mb-8  text-gray-700"
            >
              {user.get("daoAddress")} ({user.get("teamName")})
            </label>
            <label
              htmlFor="company-website"
              className="block text-sm font-medium text-gray-700"
            >
              Participants
            </label>
            <div className="mt-1 rounded-md shadow-sm flex">
              <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                Address
              </span>
              <input
                type="text"
                name="member"
                id="member"
                className={` focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
            <div className="mt-1 rounded-md shadow-sm flex">
              <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                Address
              </span>
              <input
                type="text"
                name="member1"
                id="member1"
                className={` focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
            <div className="mt-1 rounded-md shadow-sm flex">
              <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                Address
              </span>
              <input
                type="text"
                name="member2"
                id="member2"
                className={` focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
            <div className="mt-1 rounded-md shadow-sm flex">
              <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                Address
              </span>
              <input
                type="text"
                name="member3"
                id="member3"
                className={` focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
            <button
              type="button"
              className={`mt-4  bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          onClick={startCall}
          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Call
        </button>
      </div>
    </div>
  );
}
