import { ChevronRightIcon, MailIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  MeetingContractAddress,
  MeetingContractABI,
} from "../components/Contracts/MeetingContract";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import Notification from "./Notification";
import { userAgent } from "next/server";
import ViewMeeting from "./ViewMeeting";

export default function NotificationList(props) {
  const router = useRouter();

  const { web3 } = useMoralis();

  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);

  const [show, setShow] = useState(false);
  const [join, setJoin] = useState(props.data.get("accepted"));

  const close = async () => {
    setShow(false);
  };

  async function handleClick() {
    if (!join) {
      try {
        const MeetingContract = new ethers.Contract(
          MeetingContractAddress,
          MeetingContractABI,
          web3.getSigner()
        );
        const tokenId = props.data.get("tokenId");
        let transaction = await MeetingContract.mintNFT(tokenId);
        const receipt = await transaction.wait();
        setDialogType(1); //Success
        setNotificationTitle("Successful");
        setNotificationDescription("Successfully Minted.");
        setShow(true);

        props.data.set("accepted", true);
        props.data.save();

        setJoin(true);
      } catch (error) {
        setDialogType(2); // Failed
        setNotificationTitle("Failed");
        setNotificationDescription(error.message);
        setShow(true);
      }
    } else {
      router.push(`/viewmeeting/${props.data.id}`);
    }
  }

  async function viewArchive() {
    router.push(`/recordings/${props.data.get("ScheduleId")}`);
  }

  const messageSender =
    props.data.get("from").slice(0, 4).concat("...") +
    props.data.get("from").slice(38, 44);

  const date = props.data.get("meetingDate").toString();

  const [showButton, setShowButton] = useState();

  useEffect(() => {
    if (props.data.get("accepted") == true) {
      if (props.data.get("ScheduleId") != undefined || null) {
        setShowButton(true);
      } else {
        false;
      }
    }
  }, []);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
      <ul role="list" className="divide-y divide-gray-200">
        <li onClick={handleClick}>
          <a className="block hover:bg-gray-50">
            <div className="flex items-center px-4 py-4 sm:px-6">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={props.data.get("meetingFile")}
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {props.data.get("team") || messageSender}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      <MailIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="truncate">{messageSender}</span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div>
                      <p className="text-sm text-gray-900">
                        {props.data.get("meetingName")}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        {date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-4 items-center justify-center">
                <button
                  onClick={viewArchive}
                  className="text-sm font-medium hover:text-gray-400 text-gray-900"
                >
                  {showButton ? "Archive" : ""}
                </button>
                <button
                  onClick={handleClick}
                  className="text-sm font-medium text-gray-900"
                >
                  {join ? "Join" : "Accept"}
                </button>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
