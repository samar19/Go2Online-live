import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import {
  MeetingContractAddress,
  MeetingContractABI,
} from "../Contracts/MeetingContract";
import { USDCAddress, USDCABI } from "../Contracts/USDCContract";
import Notification from "../Notification";
import { CheckCircleIcon } from "@heroicons/react/outline";

export default function Pro() {
  const { Moralis, user, isAuthenticated, web3, isWeb3Enabled, enableWeb3 } =
    useMoralis();
  const [isPro, setIsPro] = useState(false);

  const [subscribed, setSubscribed] = useState();
  const [gotSubscribed, setGotSubscribed] = useState();

  useEffect(() => {
    async function getSubscribed() {
      if (!isWeb3Enabled) enableWeb3();
      if (isAuthenticated && user && web3) {
        const meetingContract = new ethers.Contract(
          MeetingContractAddress,
          MeetingContractABI,
          web3.getSigner()
        );
        let transaction = await meetingContract.subscribed();
        setGotSubscribed(true);
        setSubscribed(transaction);
      }
    }
    getSubscribed();
  }, [isAuthenticated, web3, user]);

  const [teamName, setTeamName] = useState("");

  function mintProSubscription(e) {
    e.preventDefault();
    // setIsPro(true);
    approveUSDC();
  }

  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);

  const [show, setShow] = useState(false);

  const close = async () => {
    setShow(false);
  };

  const approveUSDC = async () => {
    try {
      const USDCContract = new ethers.Contract(
        USDCAddress,
        USDCABI,
        web3.getSigner()
      );
      let transaction = await USDCContract.approve(
        MeetingContractAddress,
        ethers.constants.MaxUint256
      );

      await transaction.wait();
      console.log(transaction);
      setDialogType(1); //Success
      setNotificationTitle("Approve USDC Successful");
      setNotificationDescription("Approval Successful.");
      setShow(true);

      // Call Function to subscribe
      Subscribe();
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Approve USDC Failed");
      setNotificationDescription(error.message);

      setShow(true);
    }
  };

  const senderAddress =
    user.get("ethAddress").slice(0, 4).concat("...") +
    user.get("ethAddress").slice(38, 44);

  const Subscribe = async () => {
    try {
      const MeetingContract = new ethers.Contract(
        MeetingContractAddress,
        MeetingContractABI,
        web3.getSigner()
      );
      let transaction = await MeetingContract.subscribe();

      await transaction.wait();
      console.log(transaction);
      setDialogType(1); //Success
      setNotificationTitle("Subscription");
      setNotificationDescription("Subscription Successful.");
      setShow(true);
      setSubscribed(true);

      const Poaps = Moralis.Object.extend("Poaps");
      const poaps = new Poaps();
      poaps.set("name", "Pro Subscription");
      poaps.set("sender", senderAddress);
      poaps.set("isSubscribed", true);
      poaps.set("type", "Pro");
      poaps.set("img", "insert img file");
      poaps.save();
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Subscription Failed");
      setNotificationDescription(error.message);

      setShow(true);
    }
  };

  // NOT NEEDED FOR NOW -----
  function saveInfo(e) {
    e.preventDefault();

    // team info
    const daoAddress = document.getElementById("daoAddress").value;
    const name = document.getElementById("username").value;
    const member = document.getElementById("member").value;
    const member1 = document.getElementById("member1").value;
    const member2 = document.getElementById("member2").value;
    const member3 = document.getElementById("member3").value;

    // Save to Moralis Database

    const Team = Moralis.Object.extend("Teams");
    const team = new Team();

    // set & save team in database
    user.set("teamName", name);
    user.set("daoAddress", daoAddress);
    user.save();
    team.set("daoAddress", daoAddress);
    team.set("name", name);
    team.set("member", member);
    team.set("member1", member1);
    team.set("member2", member2);
    team.set("member3", member3);
    team.save().then(() => {
      alert("saved!");
    });
  }
  // useEffect(() => {
  //   const Team = Moralis.Object.extend("Teams");
  //   const query = new Moralis.Query(Team);
  //   query.find().then((results) => {
  //     let r = [];
  //     results.forEach((result) => {
  //       r.push({
  //         member: result.get("member"),
  //         member1: result.get("member1"),
  //         member2: result.get("member2"),
  //         member3: result.get("member3"),
  //         name: result.get("name"),
  //       });
  //     });
  //     setTeamName(r.name);
  //     console.log(r);
  //   });
  // }, []);
  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {!gotSubscribed && !subscribed ? (
                <div>Pro Membership</div>
              ) : (
                <div className="items-center flex flex-row space-x-2">
                  <p>Pro</p>
                  <CheckCircleIcon className="h-4 text-green-700" />
                </div>
              )}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {!isPro
                ? "Set up a pro subscription for a DAO or team. Total cost per year: 50 USDC"
                : "Edit your Team"}
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

        <div className="grid grid-cols-3 gap-6">
          {/* NAME */}
          <div className="col-span-3 sm:col-span-2">
            <label
              htmlFor="company-website"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1 rounded-md shadow-sm flex">
              <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                handle
              </span>
              <input
                type="text"
                name="username"
                id="username"
                disabled={!subscribed}
                value={user.get("teamName")}
                className={`${
                  !subscribed && "cursor-not-allowed"
                } focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
          </div>
          {/* DAO TOKEN ADDRESS */}
          <div className="col-span-3 sm:col-span-2">
            <label
              htmlFor="company-website"
              className="block text-sm font-medium text-gray-700"
            >
              DAO Token Address
            </label>
            <div className="mt-1 rounded-md shadow-sm flex">
              <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                Address
              </span>
              <input
                type="text"
                name="daoAddress"
                id="daoAddress"
                disabled={!subscribed}
                value={user.get("daoAddress")}
                className={`${
                  !subscribed && "cursor-not-allowed"
                } focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
          </div>

          {/* Members */}
          <div className="col-span-3 sm:col-span-2">
            <label
              htmlFor="company-website"
              className="block mb-6 text-sm font-medium text-gray-700"
            >
              Or
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
                disabled={!subscribed}
                className={`${
                  !subscribed && "cursor-not-allowed"
                } focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
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
                disabled={!subscribed}
                className={`${
                  !isPro && "cursor-not-allowed"
                } focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
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
                disabled={!subscribed}
                className={`${
                  !isPro && "cursor-not-allowed"
                } focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
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
                disabled={!subscribed}
                className={`${
                  !subscribed && "cursor-not-allowed"
                } focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300`}
              />
            </div>
            <button
              type="button"
              className={`mt-4 ${
                !subscribed && "cursor-not-allowed"
              } bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Add Member
            </button>
          </div>
        </div>
      </div>

      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        {!gotSubscribed && !subscribed ? (
          <button
            onClick={mintProSubscription}
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Buy Pro
          </button>
        ) : (
          <button
            onClick={saveInfo}
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
